import { OpenAI } from "openai"
import { NextRequest, NextResponse } from "next/server"
import conserjeDataRaw from "@/data/conserje.json"
import type { ConserjeData, ConserjeItem } from "@/lib/conserje/types"
import {
  detectIntent,
  detectProfile,
  detectTipo,
  filterItems,
  isServiciosMenuQuery,
  keywordScore,
  matchItemByName,
  normalizeText,
} from "@/lib/conserje/search"

const conserjeData = conserjeDataRaw as ConserjeData

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const EMBEDDING_MODEL = "text-embedding-3-small"
const CHAT_MODEL = "gpt-4o"
const CLASSIFY_MODEL = "gpt-4o-mini"

const embeddingCache = new Map<string, number[]>()
const itemTextCache = new Map<string, string>()

function buildItemText(item: ConserjeItem): string {
  const cached = itemTextCache.get(item.id)
  if (cached) return cached
  const text = [
    item.nombre_publico,
    item.categoria,
    item.desc_factual,
    item.desc_experiencial,
    (item.restricciones_requisitos || []).join(" "),
    (item.condiciones_servicio || []).join(" "),
  ]
    .filter(Boolean)
    .join(" ")
  itemTextCache.set(item.id, text)
  return text
}

async function rankItemsBySemantic(
  message: string,
  items: ConserjeItem[]
): Promise<{ ranked: Array<{ item: ConserjeItem; score: number }>; usedEmbeddings: boolean }> {
  const candidateTexts = items.map(buildItemText)
  let ranked: Array<{ item: ConserjeItem; score: number }> = []
  let usedEmbeddings = false

  const embeddings = await embedTexts([message, ...candidateTexts])
  if (embeddings && embeddings.length === candidateTexts.length + 1) {
    usedEmbeddings = true
    const queryEmbedding = embeddings[0]
    for (let i = 0; i < items.length; i += 1) {
      const itemEmbedding = embeddings[i + 1]
      const score = cosineSimilarity(queryEmbedding, itemEmbedding)
      ranked.push({ item: items[i], score })
    }
  } else {
    ranked = items.map((item) => ({
      item,
      score: keywordScore(message, item),
    }))
  }

  ranked.sort((a, b) => b.score - a.score)
  return { ranked, usedEmbeddings }
}

async function resolveItemByLLM(options: {
  message: string
  activeItem: ConserjeItem
  candidates: ConserjeItem[]
}): Promise<ConserjeItem | null> {
  if (!process.env.OPENAI_API_KEY) return null

  const unique = [
    options.activeItem,
    ...options.candidates.filter((c) => c.id !== options.activeItem.id),
  ].slice(0, 6)

  const formatted = unique
    .map(
      (item) =>
        `ID: ${item.id}\nNombre: ${item.nombre_publico}\nTipo: ${item.tipo}\nFactual: ${item.desc_factual}`
    )
    .join("\n\n")

  const systemPrompt = `Eres un enrutador de intención para un conserje.
Devuelve SOLO JSON válido con la clave "choice".
Valores permitidos:
- "active" si el mensaje es un seguimiento de la conversación actual.
- "none" si el mensaje no se relaciona con el contexto actual ni con las opciones.
- Un ID exacto de la lista si el mensaje se refiere a otro ítem.`

  const userPrompt = `Mensaje del huésped: "${options.message}"

Contexto actual (active):
ID: ${options.activeItem.id}
Nombre: ${options.activeItem.nombre_publico}
Tipo: ${options.activeItem.tipo}
Factual: ${options.activeItem.desc_factual}

Opciones disponibles:
${formatted}`

  try {
    const response = await openai.chat.completions.create({
      model: CLASSIFY_MODEL,
      temperature: 0,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 80,
    })
    const raw = response.choices[0]?.message?.content?.trim() || "{}"
    const parsed = JSON.parse(raw)
    const choice = parsed.choice as string | undefined
    if (!choice) return null
    if (choice === "active") return options.activeItem
    if (choice === "none") return null
    return unique.find((item) => item.id === choice) || null
  } catch (error) {
    console.warn("resolveItemByLLM failed:", error)
    return null
  }
}

async function embedTexts(texts: string[]): Promise<number[][] | null> {
  if (!process.env.OPENAI_API_KEY) return null
  const uncached = texts.filter((t) => !embeddingCache.has(t))
  if (uncached.length === 0) {
    return texts.map((t) => embeddingCache.get(t)!).filter(Boolean)
  }

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: uncached,
    })

    response.data.forEach((entry, idx) => {
      embeddingCache.set(uncached[idx], entry.embedding)
    })

    return texts.map((t) => embeddingCache.get(t)!).filter(Boolean)
  } catch (error) {
    console.error("Embedding error:", error)
    return null
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

async function inferIntentProfile(message: string): Promise<{
  intent: string | null
  profile: string | null
  tipo: string | null
}> {
  try {
    const response = await openai.chat.completions.create({
      model: CLASSIFY_MODEL,
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "Extrae intención (trabajo/descanso/aventura), perfil (solo/pareja/grupo/familia/primera_vez) y tipo (Habitaciones/Servicios/Instalaciones/Recomendaciones_Locales) si aplica. Devuelve SOLO JSON con las claves intent, profile, tipo.",
        },
        { role: "user", content: message },
      ],
    })
    const content = response.choices[0]?.message?.content?.trim() || "{}"
    const parsed = JSON.parse(content)
    return {
      intent: parsed.intent ?? null,
      profile: parsed.profile ?? null,
      tipo: parsed.tipo ?? null,
    }
  } catch (error) {
    console.warn("Intent/profile inference failed:", error)
    return { intent: null, profile: null, tipo: null }
  }
}

async function inferPetContext(message: string, sizeHint: string | null): Promise<{
  hasPet: boolean
  needsSize: boolean
  animal: string | null
}> {
  if (!process.env.OPENAI_API_KEY) {
    const fallbackHasPet = mentionsPetOrAnimal(message)
    const fallbackNeedsSize = fallbackHasPet && !sizeHint && !isSmallAnimalMention(message)
    return { hasPet: fallbackHasPet, needsSize: fallbackNeedsSize, animal: null }
  }

  const systemPrompt = `Eres un clasificador de intención para un conserje.
Devuelve SOLO JSON válido con las claves:
- has_pet (boolean)
- needs_size (boolean)
- animal (string o null)
Reglas:
- has_pet=true si el usuario pregunta por llevar/venir/viajar con un animal.
- needs_size=true si el tamaño es necesario para coordinar (perros/gatos o animal desconocido).
- needs_size=false para aves y animales pequeños en jaula.
- Si size_hint no es null, needs_size debe ser false.`

  const userPrompt = `Mensaje: "${message}"
size_hint: ${sizeHint ? `"${sizeHint}"` : "null"}`

  try {
    const response = await openai.chat.completions.create({
      model: CLASSIFY_MODEL,
      temperature: 0,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 80,
    })
    const raw = response.choices[0]?.message?.content?.trim() || "{}"
    const parsed = JSON.parse(raw)
    const hasPet = Boolean(parsed.has_pet)
    const needsSize = Boolean(parsed.needs_size) && !sizeHint
    const animal = typeof parsed.animal === "string" ? parsed.animal : null
    return { hasPet, needsSize, animal }
  } catch (error) {
    console.warn("inferPetContext failed:", error)
    const fallbackHasPet = mentionsPetOrAnimal(message)
    const fallbackNeedsSize = fallbackHasPet && !sizeHint && !isSmallAnimalMention(message)
    return { hasPet: fallbackHasPet, needsSize: fallbackNeedsSize, animal: null }
  }
}

async function formatConditionsText(
  rawConditions: string[],
  contexto?: string
): Promise<string> {
  const joined = rawConditions.join(", ").replace(/_/g, " ").replace(/\s+/g, " ").trim()
  if (!joined) return ""

  if (!process.env.OPENAI_API_KEY) return joined

  const systemPrompt = `Reescribe condiciones de servicio en español natural y breve.
No inventes datos. No agregues precios ni horarios.
Devuelve SOLO el texto final, sin comillas ni listas.`
  const userPrompt = `Condiciones: "${joined}"
Contexto: ${contexto || "Hotel Humano, conserje"}`

  try {
    const response = await openai.chat.completions.create({
      model: CLASSIFY_MODEL,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 80,
    })
    const content = response.choices[0]?.message?.content?.trim() || joined
    return content
  } catch (error) {
    console.warn("formatConditionsText failed:", error)
    return joined
  }
}

function hasListCue(message: string): boolean {
  const normalized = normalizeText(message)
  const cues = [
    "lista",
    "ver",
    "mostrar",
    "muestrame",
    "muéstrame",
    "opciones",
    "menu",
    "menú",
    "todos",
    "todas",
    "disponibles",
    "que hay",
    "qué hay",
    "cuales",
    "cuáles",
  ]
  return cues.some((cue) => normalized.includes(normalizeText(cue)))
}

async function inferListIntent(message: string, category: string): Promise<boolean> {
  if (!process.env.OPENAI_API_KEY) return hasListCue(message)

  const systemPrompt = `Decide si el huésped pide una LISTA de la categoría o una RESPUESTA específica.
Devuelve SOLO JSON válido con la clave "list" (boolean).`

  const userPrompt = `Categoría: ${category}
Mensaje: "${message}"`

  try {
    const response = await openai.chat.completions.create({
      model: CLASSIFY_MODEL,
      temperature: 0,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 50,
    })
    const raw = response.choices[0]?.message?.content?.trim() || "{}"
    const parsed = JSON.parse(raw)
    return Boolean(parsed.list)
  } catch (error) {
    console.warn("inferListIntent failed:", error)
    return hasListCue(message)
  }
}

function buildDetailReply(item: ConserjeItem): string | null {
  const firstSentence = (text: string) => {
    const idx = text.indexOf(".")
    if (idx > 0) return text.slice(0, idx + 1)
    return text
  }
  const parts: string[] = []
  if (item.desc_factual) parts.push(firstSentence(item.desc_factual))
  if (item.desc_experiencial) {
    parts.push(firstSentence(item.desc_experiencial))
  } else if (item.frases_sugeridas && item.frases_sugeridas.length > 0) {
    parts.push(firstSentence(item.frases_sugeridas[0]))
  }
  if (parts.length === 0) return null
  return parts.slice(0, 2).join(" ")
}

function getServiceFollowUp(item: ConserjeItem, message?: string): string {
  const id = item.id.toLowerCase()
  const mentionsPet = message ? mentionsPetOrAnimal(message) : false
  const smallAnimal = message ? isSmallAnimalMention(message) : false
  if (id.includes("transfer")) return "¿Fecha y hora de vuelo?"
  if (id.includes("mascotas") || id.includes("pet")) {
    if (mentionsPet && smallAnimal) return "¿Quieres que lo coordinemos?"
    return mentionsPet ? "¿Qué tamaño tiene?" : "¿Viajas con mascota? ¿Qué tamaño?"
  }
  if (id.includes("room_service")) return "¿Para qué hora lo necesitas?"
  if (id.includes("lavanderia")) return "¿Para cuándo y cuántas prendas?"
  if (id.includes("estacion")) return "¿Llegas en auto? ¿Qué día?"
  if (id.includes("wifi")) return "¿Lo necesitas para trabajo o streaming?"
  if (id.includes("limpieza")) return "¿Prefieres un horario específico?"
  if (id.includes("concierge")) return "¿En qué te puedo ayudar hoy?"
  if (id.includes("asistencia")) return "¿Qué necesitas coordinar?"
  return "¿Para qué día lo necesitas?"
}

function isHabitacionesQuery(message: string): boolean {
  const normalized = normalizeText(message)
  return normalized.includes("habitacion") || normalized.includes("habitaciones")
}

function isRecomendacionesQuery(message: string): boolean {
  const normalized = normalizeText(message)
  return (
    normalized.includes("recomendacion") ||
    normalized.includes("recomendaciones") ||
    normalized.includes("alrededor") ||
    normalized.includes("cerca") ||
    normalized.includes("lugares") ||
    normalized.includes("local")
  )
}

function isInstalacionesQuery(message: string): boolean {
  const normalized = normalizeText(message)
  return (
    normalized.includes("instalacion") ||
    normalized.includes("instalaciones") ||
    normalized.includes("gym") ||
    normalized.includes("gimnasio") ||
    normalized.includes("piscina") ||
    normalized.includes("spa") ||
    normalized.includes("lobby") ||
    normalized.includes("desayuno")
  )
}

function extractDateHint(message: string): string | null {
  const normalized = normalizeText(message)
  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "setiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ]

  const datePattern = /\b\d{1,2}[/-]\d{1,2}([/-]\d{2,4})?\b/
  const yearPattern = /\b20\d{2}\b/

  if (datePattern.test(normalized)) return message.trim()
  const tokens = normalized.split(/\s+/).filter(Boolean)
  const hasMonth = monthNames.some((m) => tokens.includes(m))
  if (hasMonth) return message.trim()
  if (yearPattern.test(normalized)) return message.trim()
  return null
}

function extractGuestsHint(message: string): string | null {
  const normalized = normalizeText(message)
  if (normalized.includes("pareja")) return "2 personas"
  if (normalized.includes("solo") || normalized.includes("sola")) return "1 persona"
  const match = normalized.match(/\b(\d{1,2})\b/)
  if (match) {
    const count = match[1]
    if (normalized.includes("persona") || normalized.includes("personas") || normalized.includes("pax")) {
      return `${count} personas`
    }
  }
  return null
}

function parseGuestCount(value: string | null | undefined): number | null {
  if (!value) return null
  const normalized = normalizeText(value)
  const match = normalized.match(/\b(\d{1,2})\b/)
  if (match) {
    const num = Number(match[1])
    if (!Number.isNaN(num)) return num
  }
  return null
}

function shouldTreatAsGuests(
  message: string,
  history: Array<{ role: string; content: string }>
): number | null {
  const normalized = normalizeText(message).trim()
  if (!/^\d{1,2}$/.test(normalized)) return null
  const lastAssistant = [...history].reverse().find((h) => h.role === "assistant")?.content || ""
  const lastNorm = normalizeText(lastAssistant)
  if (lastNorm.includes("personas") || lastNorm.includes("pax")) {
    return Number(normalized)
  }
  return null
}

function isRoomRestrictedForGroup(
  item: ConserjeItem,
  guestsCount: number | null,
  profile: string | null
): boolean {
  const normalizedRestrictions = (item.restricciones_requisitos || []).map(normalizeText)
  const isGroup = (guestsCount && guestsCount >= 3) || profile === "grupo" || profile === "familia"
  if (!isGroup) return false
  return (
    normalizedRestrictions.includes("grupos") ||
    normalizedRestrictions.includes("grupo") ||
    normalizedRestrictions.includes("familias") ||
    normalizedRestrictions.includes("familia")
  )
}

function extractPetSize(message: string): string | null {
  const normalized = normalizeText(message)
  if (normalized.includes("pequen")) return "pequeño"
  if (normalized.includes("mediano")) return "mediano"
  if (normalized.includes("grande")) return "grande"
  return null
}

function isSmallAnimalMention(message: string): boolean {
  const normalized = normalizeText(message)
  const smallAnimals = [
    "perico",
    "loro",
    "pajaro",
    "ave",
    "canario",
    "hamster",
    "conejito",
    "conejo",
    "cuy",
    "cobayo",
    "tortuga",
  ]
  if (smallAnimals.some((word) => normalized.includes(word))) return true
  if (normalized.includes("perrito") || normalized.includes("gatito") || normalized.includes("cachorro")) {
    return true
  }
  return false
}

function mentionsPetOrAnimal(message: string): boolean {
  const normalized = normalizeText(message)
  if (normalized.includes("mascota") || normalized.includes("pet")) return true

  const animalWords = [
    "perro",
    "perritos",
    "gato",
    "gatos",
    "loro",
    "perico",
    "ave",
    "pajaro",
    "conejo",
    "hamster",
    "canario",
    "tortuga",
    "cuy",
    "cobayo",
  ]
  if (animalWords.some((word) => normalized.includes(word))) return true

  const bringVerbs = [
    "llevar",
    "traer",
    "viajar con",
    "ir con",
    "venir con",
    "hospedar con",
    "alojar con",
    "entrar con",
  ]
  const allowWords = ["puedo", "puede", "permiten", "se puede", "es permitido", "aceptan"]
  const hasPossessive = /\bmi\s+\w+/.test(normalized) || /\bmis\s+\w+/.test(normalized)
  const hasBring = bringVerbs.some((verb) => normalized.includes(verb))
  const hasAllow = allowWords.some((word) => normalized.includes(word)) && normalized.includes("con")
  const hasOwnAnimal = /\btengo\s+(un|una|mi)\s+\w+/.test(normalized)

  return (hasPossessive && (hasBring || hasAllow)) || hasOwnAnimal
}

function guestsFromProfile(profile: string | null | undefined): string | null {
  if (!profile) return null
  if (profile === "pareja") return "2 personas"
  if (profile === "solo") return "1 persona"
  return null
}

function buildItemReply(
  item: ConserjeItem,
  message: string,
  state?: { dates?: string | null; guests?: string | null; profile?: string | null }
): string {
  const normalized = normalizeText(message)
  const askHorario = normalized.includes("hora") || normalized.includes("horario")
  const askPrecio =
    normalized.includes("precio") || normalized.includes("costo") || normalized.includes("tarifa")
  const askCondicion =
    normalized.includes("condicion") ||
    normalized.includes("condiciones") ||
    normalized.includes("requisito") ||
    normalized.includes("requisitos") ||
    normalized.includes("disponibilidad")

  if (askHorario) {
    if (item.horario_apertura || item.horario_cierre) {
      return `Horario: ${item.horario_apertura || "-"} a ${item.horario_cierre || "-"}.`
    }
    return "No tengo el horario exacto en este momento. ¿Quieres que lo confirme?"
  }

  if (askPrecio || askCondicion) {
    const condiciones = item.condiciones_servicio?.length
      ? item.condiciones_servicio.join(", ")
      : ""
    const restricciones = item.restricciones_requisitos?.length
      ? item.restricciones_requisitos.join(", ")
      : ""
    const combined = [condiciones, restricciones].filter(Boolean).join(". ")
    if (combined) {
      return combined.endsWith(".") ? combined : `${combined}.`
    }
    return "No tengo ese dato en este momento. ¿Quieres que lo confirme?"
  }

  const dateHint = extractDateHint(message)
  const guestsHint = extractGuestsHint(message) || guestsFromProfile(state?.profile)
  const affirmative = isAffirmative(message)
  const confirmDatesGuests = (dateValue: string, guestsValue: string) =>
    `Perfecto, ${dateValue} (${guestsValue}). ¿Es correcto?`

  const short = buildDetailReply(item)
  if (item.tipo === "Servicios") {
    if (affirmative) {
      const followUp = getServiceFollowUp(item, message)
      return short ? `${short} ${followUp}` : followUp
    }
    if (dateHint) {
      return `Perfecto, para ${dateHint}. ${getServiceFollowUp(item, message)}`
    }
    const followUp = getServiceFollowUp(item, message)
    return short ? `${short} ${followUp}` : followUp
  }
  if (item.tipo === "Habitaciones") {
    const stateDates = state?.dates || null
    const stateGuests = state?.guests || guestsFromProfile(state?.profile)
    if (affirmative) {
      if (stateDates && stateGuests) {
        return `Perfecto, ${stateDates} (${stateGuests}). Te ayudo a reservar.`
      }
      if (stateDates && !stateGuests) {
        return `Perfecto, para ${stateDates}. ¿Para cuántas personas?`
      }
      if (!stateDates && stateGuests) {
        return `Perfecto, ${stateGuests}. ¿Qué fechas tienes en mente?`
      }
      if (dateHint && guestsHint) {
        return confirmDatesGuests(dateHint, guestsHint)
      }
      return short ? `${short} ¿Te gustaría reservarla?` : "¿Te gustaría reservarla?"
    }
    if (dateHint && guestsHint) {
      return confirmDatesGuests(dateHint, guestsHint)
    }
    if (dateHint) {
      return `Perfecto, para ${dateHint}. ¿Para cuántas personas?`
    }
    if (guestsHint) {
      return `Perfecto, ${guestsHint}. ¿Qué fechas tienes en mente?`
    }
    return short || "¿Qué fechas tienes en mente?"
  }
  if (item.tipo === "Instalaciones") {
    return short ? `${short} ¿Te gustaría usarla?` : "¿Te gustaría usarla?"
  }
  if (item.tipo === "Recomendaciones_Locales") {
    return short ? `${short} ¿Quieres que te indique cómo llegar?` : "¿Quieres que te indique cómo llegar?"
  }
  return short || "¿Cómo te puedo ayudar con esto?"
}

async function buildServiceReply(
  item: ConserjeItem,
  message: string,
  state?: { dates?: string | null; guests?: string | null; profile?: string | null },
  history?: Array<{ role: string; content: string }>
): Promise<string> {
  const isPetService = item.id.toLowerCase().includes("mascotas") || item.id.toLowerCase().includes("pet")
  const short = buildDetailReply(item)
  const petSize = extractPetSize(message)
  const affirmative = isAffirmative(message)
  const lastAssistant = [...(history || [])].reverse().find((h) => h.role === "assistant")?.content || ""
  const normalizedLast = normalizeText(lastAssistant)

  if (isPetService) {
    if (affirmative) {
      const alreadyShared =
        normalizedLast.includes("condicion") ||
        normalizedLast.includes("costo") ||
        normalizedLast.includes("especial")
      if (item.condiciones_servicio && item.condiciones_servicio.length > 0) {
        const details = await formatConditionsText(item.condiciones_servicio, item.nombre_publico)
        if (alreadyShared) return "Perfecto, lo coordinamos."
        return `${details}. Puedo coordinarlo cuando quieras.`
      }
      if (item.restricciones_requisitos && item.restricciones_requisitos.length > 0) {
        const details = await formatConditionsText(item.restricciones_requisitos, item.nombre_publico)
        if (alreadyShared) return "Perfecto, lo coordinamos."
        return `${details}. Puedo coordinarlo cuando quieras.`
      }
      return alreadyShared
        ? "Perfecto, lo coordinamos."
        : "Puedo compartirte las condiciones del servicio pet friendly. Puedo coordinarlo cuando quieras."
    }
    if (petSize) {
      const detail = short ? ` ${short}` : ""
      return `Perfecto, tamaño ${petSize}.${detail} Puedo coordinarlo cuando quieras.`
    }
    const petContext = await inferPetContext(message, petSize)
    if (petContext.hasPet) {
      const intro = "Sí, contamos con pet friendly."
      const body = short ? `${intro} ${short}` : intro
      return petContext.needsSize ? `${body} ¿Qué tamaño tiene?` : `${body} Puedo coordinarlo cuando quieras.`
    }
  }

  return buildItemReply(item, message, state)
}

function buildContext(items: ConserjeItem[]): string {
  return items
    .map((item) => {
      const horario = item.horario_apertura || item.horario_cierre
        ? `Horario: ${item.horario_apertura || "-"} a ${item.horario_cierre || "-"}.`
        : ""
      return [
        `Nombre: ${item.nombre_publico}`,
        `Tipo: ${item.tipo}`,
        item.desc_factual ? `Factual: ${item.desc_factual}` : "",
        item.desc_experiencial ? `Experiencial: ${item.desc_experiencial}` : "",
        item.restricciones_requisitos?.length
          ? `Restricciones: ${item.restricciones_requisitos.join(", ")}`
          : "",
        item.condiciones_servicio?.length
          ? `Condiciones: ${item.condiciones_servicio.join(", ")}`
          : "",
        horario,
      ]
        .filter(Boolean)
        .join("\n")
    })
    .join("\n\n")
}

function isAffirmative(message: string): boolean {
  const normalized = normalizeText(message)
  return (
    normalized === "si" ||
    normalized === "sí" ||
    normalized === "ok" ||
    normalized === "dale" ||
    normalized === "claro" ||
    normalized === "perfecto"
  )
}

function isNegative(message: string): boolean {
  const normalized = normalizeText(message)
  const negatives = [
    "no",
    "no gracias",
    "no por ahora",
    "no ahora",
    "tal vez despues",
    "quizas despues",
    "quizá después",
  ]
  const tokens = normalized.split(/\s+/).filter(Boolean)
  if (tokens.length === 1 && tokens[0] === "no") return true
  return negatives.some((n) => normalized === normalizeText(n))
}

function hasActionIntent(message: string): boolean {
  const normalized = normalizeText(message)
  const triggers = [
    "reserv",
    "coordinar",
    "solicitar",
    "disponibilidad",
    "precio",
    "tarifa",
    "cotizar",
    "confirmar",
  ]
  return triggers.some((t) => normalized.includes(t))
}

function formatTipoLabel(tipo: string): string {
  const words = tipo.replace(/_/g, " ").split(" ")
  return words
    .map((word, idx) => {
      const lower = word.toLowerCase()
      if (idx === 0) return lower.charAt(0).toUpperCase() + lower.slice(1)
      return lower
    })
    .join(" ")
}

function buildCategoryMenu(excludeTipo?: string | null): Array<{ id: string; label: string }> {
  const tipos = Array.from(new Set(conserjeData.items.map((item) => item.tipo)))
  return tipos
    .filter((tipo) => (excludeTipo ? tipo !== excludeTipo : true))
    .map((tipo) => ({
      id: `CAT_${tipo}`,
      label: formatTipoLabel(tipo),
    }))
}

function buildCTAs(options: {
  message: string
  item?: ConserjeItem | null
  tipo?: string | null
  state?: { dates?: string | null; guests?: string | null; profile?: string | null }
  reply?: string | null
}): string[] {
  const { message, item, tipo, state, reply } = options
  const action = hasActionIntent(message)
  const affirmative = isAffirmative(message)
  const replyHasQuestion = reply ? reply.includes("?") || reply.includes("¿") : false
  if (replyHasQuestion) return []

  if (item?.tipo === "Servicios") {
    if (action || affirmative || state?.dates) return ["Coordinar servicio"]
    return []
  }

  if (item?.tipo === "Habitaciones") {
    if (affirmative && (state?.dates || state?.guests || state?.profile)) {
      return ["Reservar habitación"]
    }
    if (state?.dates && (state?.guests || state?.profile)) return ["Reservar habitación"]
    if (action) return ["Reservar habitación"]
    return []
  }

  if (tipo === "Habitaciones") {
    if (affirmative && (state?.dates || state?.guests || state?.profile)) {
      return ["Reservar habitación"]
    }
    if (state?.dates && (state?.guests || state?.profile)) return ["Reservar habitación"]
    if (action) return ["Reservar habitación"]
  }

  if (item?.tipo === "Recomendaciones_Locales") {
    if (action || affirmative) return ["Solicitar información"]
  }

  if (item?.tipo === "Instalaciones") {
    if (action || affirmative) return ["Solicitar información"]
  }

  return []
}

async function generateContextualReply(options: {
  message: string
  items: ConserjeItem[]
  history: Array<{ role: string; content: string }>
  state?: { dates?: string | null; guests?: string | null; profile?: string | null; intent?: string | null }
}) {
  try {
    const rulesText = conserjeData.reglas
      .map((r) => `${r.regla_clave}: ${r.descripcion_practica}`)
      .join("\n")

    const stateSummary = options.state
      ? [
          options.state.dates ? `Fechas: ${options.state.dates}` : "",
          options.state.guests ? `Personas: ${options.state.guests}` : "",
          options.state.profile ? `Perfil: ${options.state.profile}` : "",
          options.state.intent ? `Motivo: ${options.state.intent}` : "",
        ]
          .filter(Boolean)
          .join(" | ")
      : ""

    const systemPrompt = `Eres el conserje virtual del Hotel Humano en Miraflores, Lima, Perú.
REGLAS:\n${rulesText}

INSTRUCCIONES:
- Usa SOLO la información factual del CONTEXTO.
- No inventes datos que no estén en el contexto.
- Si falta un dato, dilo y ofrece confirmarlo.
- Responde en español claro y natural.
- Máximo 2 oraciones y una pregunta breve.
- No menciones fuentes internas ni archivos.`

    const context = buildContext(options.items)
    const userMessage = [
      `Consulta: ${options.message}`,
      stateSummary ? `Estado: ${stateSummary}` : "",
      `Contexto:\n${context}`,
    ]
      .filter(Boolean)
      .join("\n\n")

    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.3,
      max_tokens: 200,
      messages: [
        { role: "system", content: systemPrompt },
        ...options.history.slice(-4),
        { role: "user", content: userMessage },
      ],
    })

    return response.choices[0]?.message?.content?.trim() || ""
  } catch (error) {
    console.warn("generateContextualReply failed:", error)
    return ""
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Falta configurar OPENAI_API_KEY" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const message: string = body?.message || ""
    const history: Array<{ role: string; content: string }> = body?.history || []
    const activeItemId: string | null = body?.activeItemId || null
    const state = body?.state || null
    const mode: string | null = body?.mode || null
    const missingField: string | null = body?.missingField || null
    const contextTopic: string | null = body?.contextTopic || null
    const source: string | null = body?.source || null

    if (mode === "followup" && missingField) {
      const activeItem = activeItemId
        ? conserjeData.items.find((item) => item.id === activeItemId) || null
        : null
      const contextItems = activeItem
        ? [activeItem]
        : contextTopic
          ? conserjeData.items.filter((item) => item.tipo === contextTopic).slice(0, 3)
          : []

      const fieldHintMap: Record<string, string> = {
        dates: "fechas",
        guests: "personas",
        profile: "perfil",
        intent: "motivo del viaje",
      }
      const fieldHint = fieldHintMap[missingField] || "detalle"

      const rulesText = conserjeData.reglas
        .map((r) => `${r.regla_clave}: ${r.descripcion_practica}`)
        .join("\n")

      const systemPrompt = `Eres el conserje virtual del Hotel Humano en Miraflores, Lima, Perú.
REGLAS:\n${rulesText}

INSTRUCCIONES:
- Formula UNA sola pregunta breve para recuperar un dato faltante.
- El dato faltante es: ${fieldHint}.
- Usa el tono del conserje y el contexto si está disponible.
- No menciones fuentes internas ni archivos.`

      const context = contextItems.length ? buildContext(contextItems) : ""
      const response = await openai.chat.completions.create({
        model: CHAT_MODEL,
        temperature: 0.3,
        max_tokens: 80,
        messages: [
          { role: "system", content: systemPrompt },
          ...history.slice(-4),
          {
            role: "user",
            content: context ? `Contexto:\n${context}` : "Sin contexto adicional.",
          },
        ],
      })

      const reply = response.choices[0]?.message?.content?.trim() || ""
      return NextResponse.json({
        reply,
        suggestions: [],
        items: [],
        menu: [],
        intent: null,
        profile: null,
        tipo: activeItem?.tipo || contextTopic,
        activeItemId: activeItem?.id || null,
      })
    }

    if (!message.trim()) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 })
    }

    const normalizedMessage = normalizeText(message)
    const serviciosItems = conserjeData.items.filter((item) => item.tipo === "Servicios")
    const activeItem = activeItemId
      ? conserjeData.items.find((item) => item.id === activeItemId) || null
      : null
    const nameMatch = matchItemByName(message, conserjeData.items)
    const { ranked: semanticRanked, usedEmbeddings: usedSemanticEmbeddings } =
      await rankItemsBySemantic(message, conserjeData.items)
    const semanticBest = semanticRanked[0]?.item || null
    const semanticBestScore = semanticRanked[0]?.score ?? 0

    const dateHint = extractDateHint(message)
    const askedGuestsCount = shouldTreatAsGuests(message, history)
    const guestsHint =
      extractGuestsHint(message) || (askedGuestsCount ? `${askedGuestsCount} personas` : null)
    const petSize = extractPetSize(message)
    const questionSignals = [
      "hora",
      "cuando",
      "cuándo",
      "como",
      "cómo",
      "cuanto",
      "cuánto",
      "precio",
      "costo",
      "condicion",
      "condición",
      "requisito",
      "disponible",
      "?",
    ]
    const isQuestion = questionSignals.some((signal) => normalizedMessage.includes(normalizeText(signal)))
    const tokenCount = normalizedMessage.split(/\s+/).filter(Boolean).length
    const isPureAffirmative =
      isAffirmative(message) && tokenCount <= 2
    const isShortFollowup = tokenCount <= 3 && !isQuestion
    const lowInfoFollowup =
      Boolean(activeItem) &&
      (Boolean(dateHint) || Boolean(guestsHint) || Boolean(petSize) || isPureAffirmative || isShortFollowup)
    const freeformReasoning =
      isQuestion && !dateHint && !guestsHint && !isPureAffirmative && !hasActionIntent(message)
    const mentionsAnimal = mentionsPetOrAnimal(message)

    const semanticThreshold = usedSemanticEmbeddings ? 0.22 : 2
    const semanticCandidate =
      semanticBest && semanticBestScore >= semanticThreshold ? semanticBest : null

    const llmResolved =
      activeItem && !lowInfoFollowup
        ? await resolveItemByLLM({
            message,
            activeItem,
            candidates: semanticRanked.slice(0, 5).map((entry) => entry.item),
          })
        : null

    const matchedItem = nameMatch || llmResolved || (lowInfoFollowup ? null : semanticCandidate)
    const currentItem = matchedItem || activeItem

    if (isHabitacionesQuery(message)) {
      const stripped = normalizedMessage.replace(/\?/g, "").trim()
      let isCategoryOnly =
        source === "menu" ||
        stripped === "habitaciones" ||
        stripped === "habitacion" ||
        (!isQuestion && normalizedMessage.split(/\s+/).filter(Boolean).length <= 2)
      if (!isCategoryOnly) {
        isCategoryOnly = await inferListIntent(message, "Habitaciones")
      }
      const profileHint = detectProfile(message) || state?.profile || null
      const intentHint = detectIntent(message) || state?.intent || null
      const guestsCount =
        parseGuestCount(guestsHint) ||
        parseGuestCount(state?.guests) ||
        (profileHint === "grupo" || profileHint === "familia" ? 3 : null)
      const derivedProfile =
        guestsCount && guestsCount >= 3 ? "grupo" : guestsCount === 2 ? "pareja" : guestsCount === 1 ? "solo" : null
      const effectiveProfile = profileHint || derivedProfile
      const habitaciones = conserjeData.items.filter((item) => item.tipo === "Habitaciones")
      const filteredRooms = habitaciones.filter((item) => {
        const profileOk = effectiveProfile
          ? item.perfil_ideal.map(normalizeText).includes(normalizeText(effectiveProfile))
          : true
        const intentOk = intentHint
          ? item.intenciones.map(normalizeText).includes(normalizeText(intentHint))
          : true
        const restrictionsOk = !isRoomRestrictedForGroup(item, guestsCount, effectiveProfile)
        return profileOk && intentOk && restrictionsOk
      })

      if (filteredRooms.length === 0) {
        return NextResponse.json({
          reply:
            "No tengo habitaciones para ese perfil en este momento. ¿Prefieres algo específico (cama, tamaño o vista)?",
          suggestions: [],
          items: [],
          menu: [],
          intent: null,
          profile: profileHint || null,
          tipo: "Habitaciones",
          activeItemId: null,
        })
      }

      if (!isCategoryOnly) {
        const { ranked } = await rankItemsBySemantic(message, filteredRooms)
        const topItems = ranked.slice(0, 3).map((entry) => entry.item)
        const reply =
          (await generateContextualReply({
            message,
            items: topItems.length > 0 ? topItems : filteredRooms.slice(0, 3),
            history,
            state,
          })) || "Tengo opciones que podrían encajar. ¿Qué prefieres: cama, tamaño o vista?"
        return NextResponse.json({
          reply,
          suggestions: buildCTAs({ message, tipo: "Habitaciones", state, reply }),
          items: [],
          menu: topItems.map((item) => ({ id: item.id, label: item.nombre_publico })),
          intent: null,
          profile: profileHint || null,
          tipo: "Habitaciones",
          activeItemId: null,
        })
      }

      const names = filteredRooms.map((item) => item.nombre_publico).join(", ")
      const reply = effectiveProfile
        ? `Para ${effectiveProfile}, tengo estas opciones: ${names}. ¿Te interesa alguna en particular?`
        : `Tengo estas opciones de habitaciones: ${names}. ¿Te interesa alguna en particular?`
      return NextResponse.json({
        reply,
        suggestions: buildCTAs({ message, tipo: "Habitaciones", state, reply }),
        items: [],
        menu: filteredRooms.map((item) => ({ id: item.id, label: item.nombre_publico })),
        intent: null,
        profile: effectiveProfile || null,
        tipo: "Habitaciones",
        activeItemId: null,
      })
    }

    if (isRecomendacionesQuery(message)) {
      const stripped = normalizedMessage.replace(/\?/g, "").trim()
      let isCategoryOnly =
        source === "menu" ||
        stripped === "recomendaciones" ||
        stripped === "recomendaciones locales" ||
        (!isQuestion && normalizedMessage.split(/\s+/).filter(Boolean).length <= 2)
      if (!isCategoryOnly) {
        isCategoryOnly = await inferListIntent(message, "Recomendaciones_Locales")
      }
      const profileHint = detectProfile(message) || state?.profile || null
      const intentHint = detectIntent(message) || state?.intent || null
      const recomendaciones = conserjeData.items.filter(
        (item) => item.tipo === "Recomendaciones_Locales"
      )
      const filtered = recomendaciones.filter((item) => {
        const profileOk = profileHint
          ? item.perfil_ideal.map(normalizeText).includes(normalizeText(profileHint))
          : true
        const intentOk = intentHint
          ? item.intenciones.map(normalizeText).includes(normalizeText(intentHint))
          : true
        return profileOk && intentOk
      })

      if (filtered.length === 0) {
        return NextResponse.json({
          reply:
            "No tengo recomendaciones para ese perfil en este momento. ¿Prefieres algo específico?",
          suggestions: [],
          items: [],
          menu: [],
          intent: null,
          profile: profileHint || null,
          tipo: "Recomendaciones_Locales",
          activeItemId: null,
        })
      }

      if (!isCategoryOnly) {
        const { ranked } = await rankItemsBySemantic(message, filtered)
        const topItems = ranked.slice(0, 3).map((entry) => entry.item)
        const reply =
          (await generateContextualReply({
            message,
            items: topItems.length > 0 ? topItems : filtered.slice(0, 3),
            history,
            state,
          })) || "Tengo algunas opciones cerca. ¿Qué tipo de café prefieres?"
        return NextResponse.json({
          reply,
          suggestions: buildCTAs({ message, tipo: "Recomendaciones_Locales", state, reply }),
          items: [],
          menu: topItems.map((item) => ({ id: item.id, label: item.nombre_publico })),
          intent: null,
          profile: profileHint || null,
          tipo: "Recomendaciones_Locales",
          activeItemId: null,
        })
      }

      const names = filtered.map((item) => item.nombre_publico).join(", ")
      const reply = profileHint
        ? `Para ${profileHint}, tengo estas opciones: ${names}. ¿Cuál te interesa?`
        : `Tengo estas recomendaciones: ${names}. ¿Cuál te interesa?`
      return NextResponse.json({
        reply,
        suggestions: [],
        items: [],
        menu: filtered.map((item) => ({ id: item.id, label: item.nombre_publico })),
        intent: null,
        profile: profileHint || null,
        tipo: "Recomendaciones_Locales",
        activeItemId: null,
      })
    }

    if (isInstalacionesQuery(message)) {
      const stripped = normalizedMessage.replace(/\?/g, "").trim()
      let isCategoryOnly =
        source === "menu" ||
        stripped === "instalaciones" ||
        stripped === "instalacion" ||
        (!isQuestion && normalizedMessage.split(/\s+/).filter(Boolean).length <= 2)
      if (!isCategoryOnly) {
        isCategoryOnly = await inferListIntent(message, "Instalaciones")
      }
      const profileHint = detectProfile(message) || state?.profile || null
      const intentHint = detectIntent(message) || state?.intent || null
      const instalaciones = conserjeData.items.filter((item) => item.tipo === "Instalaciones")
      const filtered = instalaciones.filter((item) => {
        const profileOk = profileHint
          ? item.perfil_ideal.map(normalizeText).includes(normalizeText(profileHint))
          : true
        const intentOk = intentHint
          ? item.intenciones.map(normalizeText).includes(normalizeText(intentHint))
          : true
        return profileOk && intentOk
      })

      if (filtered.length === 0) {
        return NextResponse.json({
          reply:
            "No tengo instalaciones para ese perfil en este momento. ¿Prefieres algo específico?",
          suggestions: [],
          items: [],
          menu: [],
          intent: null,
          profile: profileHint || null,
          tipo: "Instalaciones",
          activeItemId: null,
        })
      }

      if (!isCategoryOnly) {
        const { ranked } = await rankItemsBySemantic(message, filtered)
        const topItems = ranked.slice(0, 3).map((entry) => entry.item)
        const reply =
          (await generateContextualReply({
            message,
            items: topItems.length > 0 ? topItems : filtered.slice(0, 3),
            history,
            state,
          })) || "Tenemos varias instalaciones. ¿Qué te interesa usar?"
        return NextResponse.json({
          reply,
          suggestions: buildCTAs({ message, tipo: "Instalaciones", state, reply }),
          items: [],
          menu: topItems.map((item) => ({ id: item.id, label: item.nombre_publico })),
          intent: null,
          profile: profileHint || null,
          tipo: "Instalaciones",
          activeItemId: null,
        })
      }

      const names = filtered.map((item) => item.nombre_publico).join(", ")
      const reply = profileHint
        ? `Para ${profileHint}, tengo estas opciones: ${names}. ¿Cuál te interesa?`
        : `Tengo estas instalaciones: ${names}. ¿Cuál te interesa?`
      return NextResponse.json({
        reply,
        suggestions: [],
        items: [],
        menu: filtered.map((item) => ({ id: item.id, label: item.nombre_publico })),
        intent: null,
        profile: profileHint || null,
        tipo: "Instalaciones",
        activeItemId: null,
      })
    }

    if (currentItem) {
      const normalizedMessage = normalizeText(message).replace(/\s+/g, " ").trim()
      const itemName = normalizeText(currentItem.nombre_publico).replace(/\s+/g, " ").trim()
      const isSelectionOnly =
        source === "menu" ||
        (!isQuestion &&
          (normalizedMessage === itemName ||
            normalizedMessage.includes(itemName) ||
            itemName.includes(normalizedMessage)))

      if (isNegative(message)) {
        return NextResponse.json({
          reply: "Entiendo. ¿Quieres revisar otras opciones?",
          suggestions: [],
          items: [],
          menu: buildCategoryMenu(currentItem.tipo),
          intent: null,
          profile: null,
          tipo: null,
          activeItemId: null,
        })
      }

      if (isSelectionOnly) {
        let reply = buildItemReply(currentItem, message, state)
        if (currentItem.tipo === "Habitaciones") {
          const detail = buildDetailReply(currentItem)
          const dates = state?.dates || null
          const guests = state?.guests || guestsHint || null
          const guestsCount =
            parseGuestCount(guests) || parseGuestCount(state?.guests) || null
          const effectiveProfile =
            (guestsCount && guestsCount >= 3 ? "grupo" : guestsCount === 2 ? "pareja" : guestsCount === 1 ? "solo" : null) ||
            state?.profile ||
            null
          if (isRoomRestrictedForGroup(currentItem, guestsCount, effectiveProfile)) {
            const alternativas = conserjeData.items.filter((item) => {
              if (item.tipo !== "Habitaciones") return false
              const profileOk = effectiveProfile
                ? item.perfil_ideal.map(normalizeText).includes(normalizeText(effectiveProfile))
                : true
              const restrictionsOk = !isRoomRestrictedForGroup(item, guestsCount, effectiveProfile)
              return profileOk && restrictionsOk
            })
            return NextResponse.json({
              reply:
                "Esta habitación no es adecuada para grupos. Te comparto opciones más cómodas para ustedes.",
              suggestions: [],
              items: [],
              menu: alternativas.map((item) => ({ id: item.id, label: item.nombre_publico })),
              intent: null,
              profile: effectiveProfile,
              tipo: "Habitaciones",
              activeItemId: null,
            })
          }
          let followUp = "¿Qué fechas tienes en mente?"
          if (dates && guests) {
            followUp = `Perfecto, ${dates} (${guests}). ¿Es correcto?`
          } else if (dates) {
            followUp = `Perfecto, para ${dates}. ¿Para cuántas personas?`
          } else if (guests) {
            followUp = `Perfecto, ${guests}. ¿Qué fechas tienes en mente?`
          }
          reply = detail ? `${detail} ${followUp}` : followUp
        }
        if (currentItem.tipo === "Servicios") {
          reply = await buildServiceReply(currentItem, message, state, history)
        }
        return NextResponse.json({
          reply,
          suggestions: buildCTAs({ message, item: currentItem, state, reply }),
          items: [],
          menu: [],
          intent: null,
          profile: null,
          tipo: currentItem.tipo,
          activeItemId: currentItem.id,
        })
      }

      if (currentItem.tipo === "Habitaciones") {
        const guestsCount =
          parseGuestCount(guestsHint) || parseGuestCount(state?.guests) || null
        const effectiveProfile =
          (guestsCount && guestsCount >= 3 ? "grupo" : guestsCount === 2 ? "pareja" : guestsCount === 1 ? "solo" : null) ||
          state?.profile ||
          null
        if (isRoomRestrictedForGroup(currentItem, guestsCount, effectiveProfile)) {
          const alternativas = conserjeData.items.filter((item) => {
            if (item.tipo !== "Habitaciones") return false
            const profileOk = effectiveProfile
              ? item.perfil_ideal.map(normalizeText).includes(normalizeText(effectiveProfile))
              : true
            const restrictionsOk = !isRoomRestrictedForGroup(item, guestsCount, effectiveProfile)
            return profileOk && restrictionsOk
          })
          return NextResponse.json({
            reply:
              "Esta habitación no es adecuada para grupos. Te comparto opciones más cómodas para ustedes.",
            suggestions: [],
            items: [],
            menu: alternativas.map((item) => ({ id: item.id, label: item.nombre_publico })),
            intent: null,
            profile: effectiveProfile,
            tipo: "Habitaciones",
            activeItemId: null,
          })
        }
      }

      const reply =
        currentItem.tipo === "Habitaciones"
          ? (freeformReasoning
              ? (await generateContextualReply({
                  message,
                  items: [currentItem],
                  history,
                  state,
                })) || buildItemReply(currentItem, message, state)
              : buildItemReply(currentItem, message, state))
          : currentItem.tipo === "Servicios"
            ? (freeformReasoning && !mentionsAnimal
                ? (await generateContextualReply({
                    message,
                    items: [currentItem],
                    history,
                    state,
                  })) || (await buildServiceReply(currentItem, message, state, history))
                : await buildServiceReply(currentItem, message, state, history))
            : (await generateContextualReply({
                message,
                items: [currentItem],
                history,
                state,
              })) || buildItemReply(currentItem, message, state)
      return NextResponse.json({
        reply,
        suggestions: buildCTAs({ message, item: currentItem, state, reply }),
        items: [],
        menu: [],
        intent: null,
        profile: null,
        tipo: currentItem.tipo,
        activeItemId: currentItem.id,
      })
    }

    if (matchedItem) {
      if (isNegative(message)) {
        return NextResponse.json({
          reply: "Entiendo. ¿Quieres revisar otras opciones?",
          suggestions: [],
          items: [],
          menu: buildCategoryMenu(matchedItem.tipo),
          intent: null,
          profile: null,
          tipo: null,
          activeItemId: null,
        })
      }
      const reply =
        matchedItem.tipo === "Habitaciones"
          ? (freeformReasoning
              ? (await generateContextualReply({
                  message,
                  items: [matchedItem],
                  history,
                  state,
                })) || buildItemReply(matchedItem, message, state)
              : buildItemReply(matchedItem, message, state))
          : matchedItem.tipo === "Servicios"
            ? (freeformReasoning && !mentionsAnimal
                ? (await generateContextualReply({
                    message,
                    items: [matchedItem],
                    history,
                    state,
                  })) || (await buildServiceReply(matchedItem, message, state, history))
                : await buildServiceReply(matchedItem, message, state, history))
            : (await generateContextualReply({
                message,
                items: [matchedItem],
                history,
                state,
              })) || buildItemReply(matchedItem, message, state)
      return NextResponse.json({
        reply,
        suggestions: buildCTAs({ message, item: matchedItem, state, reply }),
        items: [],
        menu: [],
        intent: null,
        profile: null,
        tipo: matchedItem.tipo,
        activeItemId: matchedItem.id,
      })
    }

    if (isServiciosMenuQuery(normalizedMessage)) {
      const stripped = normalizedMessage.replace(/\?/g, "").trim()
      let isCategoryOnly =
        source === "menu" ||
        stripped === "servicios" ||
        stripped === "servicio" ||
        (!isQuestion && normalizedMessage.split(/\s+/).filter(Boolean).length <= 2)
      if (!isCategoryOnly) {
        isCategoryOnly = await inferListIntent(message, "Servicios")
      }
      if (!isCategoryOnly) {
        const { ranked } = await rankItemsBySemantic(message, serviciosItems)
        const topItems = ranked.slice(0, 3).map((entry) => entry.item)
        const reply =
          (await generateContextualReply({
            message,
            items: topItems.length > 0 ? topItems : serviciosItems.slice(0, 3),
            history,
            state,
          })) || "Tenemos varios servicios disponibles. ¿Cuál te interesa?"
        return NextResponse.json({
          reply,
          suggestions: buildCTAs({ message, tipo: "Servicios", state, reply }),
          items: [],
          menu: topItems.map((item) => ({ id: item.id, label: item.nombre_publico })),
          intent: null,
          profile: null,
          tipo: "Servicios",
          activeItemId: null,
        })
      }

      const menu = serviciosItems.map((item) => ({
        id: item.id,
        label: item.nombre_publico,
      }))
      const reply = "Servicios disponibles. Puedes elegir entre:"
      return NextResponse.json({
        reply,
        suggestions: [],
        items: [],
        menu,
        intent: null,
        profile: null,
        tipo: "Servicios",
        activeItemId: null,
      })
    }

    let intent = detectIntent(message) || state?.intent || null
    let profile = detectProfile(message) || state?.profile || null
    let tipo = detectTipo(message)

    if ((!intent || !profile || !tipo) && process.env.OPENAI_API_KEY) {
      const inferred = await inferIntentProfile(message)
      intent = intent || inferred.intent
      profile = profile || inferred.profile
      tipo = (tipo || inferred.tipo) as any
    }

    const filtered = filterItems(conserjeData.items, intent, profile, tipo)
    const candidates = filtered.length > 0 ? filtered : conserjeData.items

    const queryText = message
    const candidateTexts = candidates.map(buildItemText)

    const { ranked, usedEmbeddings } = await rankItemsBySemantic(queryText, candidates)
    const topItems = ranked.slice(0, 5).map((r) => r.item)
    const bestScore = ranked[0]?.score ?? 0
    const topItem = ranked[0]?.item
    const topKeywordScore = topItem ? keywordScore(queryText, topItem) : 0

    const threshold = usedEmbeddings ? 0.2 : 1
    if (bestScore < threshold || topKeywordScore === 0) {
      return NextResponse.json({
        reply:
          "No tengo ese dato en este momento. Si quieres, puedo confirmarlo con el hotel.",
        suggestions: [],
        items: [],
        menu: buildCategoryMenu(),
        intent: intent || null,
        profile: profile || null,
        tipo: null,
        activeItemId: null,
      })
    }

    const reply = topItems.length > 0
      ? await generateContextualReply({
          message,
          items: topItems,
          history,
          state,
        })
      : "No tengo ese dato en este momento. Si quieres, puedo confirmarlo con el hotel."

    return NextResponse.json({
      reply,
      suggestions: buildCTAs({ message, tipo: tipo || null, state, reply }),
      items: [],
      menu: topItems.map((item) => ({ id: item.id, label: item.nombre_publico })),
      intent: intent || null,
      profile: profile || null,
      tipo: tipo || null,
      activeItemId: null,
    })
  } catch (error: any) {
    console.error("Conserje error:", error)
    return NextResponse.json(
      { error: "Error al procesar mensaje", details: String(error?.message || error) },
      { status: 500 }
    )
  }
}
