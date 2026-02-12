import { OpenAI } from "openai"
import { NextRequest, NextResponse } from "next/server"
import conserjeDataRaw from "@/data/conserje.json"
import type { ConserjeData, ConserjeItem, ConserjeItemType } from "@/lib/conserje/types"
import {
  detectIntent,
  detectProfile,
  detectTipo,
  filterItems,
  keywordScore,
  matchItemByName,
  normalizeText,
} from "@/lib/conserje/search"

const conserjeData = conserjeDataRaw as ConserjeData

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type ChatRole = "system" | "user" | "assistant" | "developer"
type ChatHistoryItem = { role: ChatRole; content: string }

const EMBEDDING_MODEL = "text-embedding-3-small"
const CHAT_MODEL = "gpt-4o"
const CLASSIFY_MODEL = "gpt-4o-mini"
const MARRIOTT_ROOMS_URL =
  "https://www.marriott.com/es/hotels/limtx-humano-lima-a-tribute-portfolio-hotel/rooms/"
const HUMAN_ESCALATION_EMAIL = "recepcion@humanohoteles.com"

const embeddingCache = new Map<string, number[]>()
const itemTextCache = new Map<string, string>()

const ALLOWED_ROLES = new Set<ChatRole>(["system", "user", "assistant", "developer"])

type DecisionMode =
  | "inform"
  | "clarify"
  | "redirect_reservation"
  | "escalate_human"
  | "show_menu"

type Decision = {
  mode: DecisionMode
  reason: string
  required_slots: Array<"dates" | "guests">
}

function hasReservationIntent(message: string): boolean {
  const normalized = normalizeText(message)
  const cues = [
    "reserv",
    "disponibilidad",
    "disponible",
    "disponibles",
    "fecha",
    "fechas",
    "precio",
    "tarifa",
    "check in",
    "check out",
  ]
  return cues.some((cue) => normalized.includes(cue))
}

function requiresHumanEscalation(message: string): boolean {
  const normalized = normalizeText(message)
  const escalationCues = [
    "reclamo",
    "queja",
    "denuncia",
    "tarjeta",
    "fraude",
    "cobro",
    "reembolso",
    "devolucion",
    "cancelar reserva",
    "modificar reserva",
    "factura",
    "comprobante",
    "problema legal",
  ]
  return escalationCues.some((cue) => normalized.includes(cue))
}

function applyConversationPolicy(reply: string): string {
  if (!reply) return reply
  let output = reply
  output = output.replace(/te ayudo a reservar\.?/gi, "")
  output = output.replace(/reserva ahora/gi, "puedes revisar disponibilidad")
  output = output.replace(/\s{2,}/g, " ").trim()
  return output
}

function removeReservationCopyWhenNotAsked(reply: string): string {
  if (!reply) return reply
  const sentences = reply
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
  const filtered = sentences.filter((sentence) => {
    const normalized = normalizeText(sentence)
    if (normalized.includes("marriott")) return false
    if (normalized.includes("disponibilidad") && normalized.includes("pagina web")) return false
    if (normalized.includes("disponibilidad") && normalized.includes("sitio oficial")) return false
    if (normalized.includes("puedes visitar nuestra pagina web")) return false
    return true
  })
  return filtered.join(" ").replace(/\s{2,}/g, " ").trim()
}

function inferDecision(options: {
  message: string
  reply?: string | null
  tipo?: string | null
  menu?: Array<{ id: string; label: string }>
  state?: { dates?: string | null; guests?: string | null } | null
}): Decision {
  const reply = options.reply || ""
  const hasQuestion = reply.includes("?") || reply.includes("¿")
  const hasMenu = Array.isArray(options.menu) && options.menu.length > 0
  const reservationIntent = hasReservationIntent(options.message)
  const actionIntent = hasActionIntent(options.message)
  const reservationReplySignal = normalizeText(reply).includes("marriott")
  const reservationTrigger =
    reservationIntent ||
    (reservationReplySignal &&
      (actionIntent || Boolean(options.state?.dates) || Boolean(options.state?.guests)))
  const requiredSlots: Array<"dates" | "guests"> = []

  if (reservationTrigger) {
    if (!options.state?.dates) requiredSlots.push("dates")
    if (!options.state?.guests) requiredSlots.push("guests")
  }

  if (normalizeText(reply).includes(HUMAN_ESCALATION_EMAIL)) {
    return {
      mode: "escalate_human",
      reason: "La consulta requiere gestión humana o confirmación operativa.",
      required_slots: [],
    }
  }

  if (reservationTrigger && requiredSlots.length === 0) {
    return {
      mode: "redirect_reservation",
      reason: "Hay intención de reserva con datos suficientes.",
      required_slots: [],
    }
  }

  if (hasMenu) {
    return {
      mode: "show_menu",
      reason: "La respuesta requiere selección entre opciones disponibles.",
      required_slots: requiredSlots,
    }
  }

  if (hasQuestion) {
    return {
      mode: "clarify",
      reason: "Falta al menos un dato para avanzar con precisión.",
      required_slots: requiredSlots,
    }
  }

  return {
    mode: "inform",
    reason: "La respuesta entrega información contextual suficiente.",
    required_slots: requiredSlots,
  }
}

function sanitizeHistory(history: Array<{ role?: string; content?: string }>): ChatHistoryItem[] {
  return history
    .filter((entry) => entry && typeof entry.role === "string" && ALLOWED_ROLES.has(entry.role as ChatRole))
    .map((entry) => ({
      role: entry.role as ChatRole,
      content: String(entry.content ?? ""),
    }))
}

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
    let parsed: any = null
    try {
      parsed = JSON.parse(raw)
    } catch {
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          parsed = JSON.parse(match[0])
        } catch {
          parsed = null
        }
      }
    }
    if (!parsed) return null
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

function isInsideHotelRequest(message: string): boolean {
  const normalized = normalizeText(message)
  const hasInsideCue =
    normalized.includes("dentro del hotel") ||
    normalized.includes("en el hotel") ||
    normalized.includes("del hotel")
  const hasDiscoveryCue =
    normalized.includes("recomienda") ||
    normalized.includes("recomendame") ||
    normalized.includes("recomiendame") ||
    normalized.includes("cuentame") ||
    normalized.includes("mostrar") ||
    normalized.includes("opciones") ||
    normalized.includes("que hay") ||
    normalized.includes("algo dentro")
  return hasInsideCue || (normalized.includes("hotel") && hasDiscoveryCue)
}

function shouldOpenInsideHotelExploration(options: {
  message: string
  activeItem: ConserjeItem | null
  lastAssistant: string
}): boolean {
  const normalized = normalizeText(options.message)
  const lastAssistantNormalized = normalizeText(options.lastAssistant || "")
  const explicitCategorySwitch =
    isHabitacionesQuery(options.message) ||
    isInstalacionesQuery(options.message) ||
    isRecomendacionesQuery(options.message) ||
    normalized.includes("servicio") ||
    normalized.includes("servicios")

  if (explicitCategorySwitch) return false
  if (isInsideHotelRequest(options.message)) return true

  const openDiscoveryCue =
    normalized.includes("recomienda") ||
    normalized.includes("recomiendame") ||
    normalized.includes("muest") ||
    normalized.includes("que mas") ||
    normalized.includes("que otra") ||
    normalized.includes("alguna opcion")

  if (options.activeItem?.tipo === "Habitaciones" && openDiscoveryCue) return true

  const bridgeOfferedHotel =
    lastAssistantNormalized.includes("servicios del hotel") ||
    lastAssistantNormalized.includes("dentro del hotel") ||
    lastAssistantNormalized.includes("espacios del hotel") ||
    lastAssistantNormalized.includes("ambiente del hotel")

  if (bridgeOfferedHotel && (isAffirmative(options.message) || openDiscoveryCue)) return true

  return false
}

function getExplicitItemMention(message: string): ConserjeItem | null {
  const normalized = normalizeText(message).replace(/\s+/g, " ").trim()
  if (!normalized) return null
  return (
    conserjeData.items.find((item) => {
      const itemName = normalizeText(item.nombre_publico).replace(/\s+/g, " ").trim()
      if (!itemName) return false
      return normalized === itemName || normalized.includes(itemName)
    }) || null
  )
}

function isRestaurantGenericRequest(message: string): boolean {
  const normalized = normalizeText(message)
  return normalized.includes("restaurante") || normalized.includes("restaurantes")
}

function selectInHotelItems(options: {
  message: string
  intent: string | null
  profile: string | null
}): ConserjeItem[] {
  const normalizedMessage = normalizeText(options.message)
  const hotelItems = conserjeData.items.filter(
    (item) => item.tipo === "Servicios" || item.tipo === "Instalaciones"
  )
  const filtered = hotelItems.filter((item) => {
    const profileOk = options.profile
      ? item.perfil_ideal.map(normalizeText).includes(normalizeText(options.profile))
      : true
    const intentOk = options.intent
      ? item.intenciones.map(normalizeText).includes(normalizeText(options.intent))
      : true
    return profileOk && intentOk
  })

  let base = filtered.length > 0 ? filtered : hotelItems
  if (isRestaurantGenericRequest(options.message)) {
    const restaurantes = base.filter((item) =>
      normalizeText(item.nombre_publico).includes("restaurante")
    )
    if (restaurantes.length > 0) return restaurantes.slice(0, 4)
  }

  const instalaciones = base.filter((item) => item.tipo === "Instalaciones")
  const servicios = base.filter((item) => item.tipo === "Servicios")
  const mixed: ConserjeItem[] = []
  for (let i = 0; i < 4; i += 1) {
    if (instalaciones[i]) mixed.push(instalaciones[i])
    if (servicios[i]) mixed.push(servicios[i])
  }
  base = mixed.length > 0 ? mixed : base
  return base.slice(0, 8)
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
  history: ChatHistoryItem[]
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

function extractTimePreference(message: string): string | null {
  const normalized = normalizeText(message)
  if (normalized.includes("manana")) return "por la mañana"
  if (normalized.includes("tarde")) return "por la tarde"
  if (normalized.includes("noche")) return "por la noche"
  const timeMatch = normalized.match(/\b([01]?\d|2[0-3])(?::[0-5]\d)?\b/)
  if (timeMatch) return `a las ${timeMatch[0]}`
  return null
}

function parseHour(value: string | null | undefined): number | null {
  if (!value) return null
  const raw = value
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim()

  const withMinutes = raw.match(/\b([0-1]?\d|2[0-3])\s*:\s*([0-5]\d)\s*(am|pm)?\b/)
  if (withMinutes) {
    let hour = Number(withMinutes[1])
    const minute = Number(withMinutes[2])
    const suffix = withMinutes[3] || null
    if (suffix === "pm" && hour < 12) hour += 12
    if (suffix === "am" && hour === 12) hour = 0
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null
    return hour + minute / 60
  }

  const withSuffix = raw.match(/\b([0-1]?\d|2[0-3])\s*(am|pm)\b/)
  if (withSuffix) {
    let hour = Number(withSuffix[1])
    const suffix = withSuffix[2]
    if (suffix === "pm" && hour < 12) hour += 12
    if (suffix === "am" && hour === 12) hour = 0
    if (Number.isNaN(hour)) return null
    return hour
  }

  const twentyFour = raw.match(/\b([0-1]?\d|2[0-3])(?::([0-5]\d))?\b/)
  if (twentyFour) {
    const hour = Number(twentyFour[1])
    const minute = twentyFour[2] ? Number(twentyFour[2]) : 0
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null
    return hour + minute / 60
  }

  return null
}

function getPreferenceSlot(preference: string): "morning" | "afternoon" | "night" | null {
  const normalized = normalizeText(preference)
  if (normalized.includes("manana")) return "morning"
  if (normalized.includes("tarde")) return "afternoon"
  if (normalized.includes("noche")) return "night"
  const hour = parseHour(preference)
  if (hour == null) return null
  if (hour < 12) return "morning"
  if (hour < 18) return "afternoon"
  return "night"
}

function getScheduleInfo(item: ConserjeItem) {
  const openHour = parseHour(item.horario_apertura)
  const closeHour = parseHour(item.horario_cierre)
  const hasHorario = Boolean(item.horario_apertura || item.horario_cierre)
  const is24h =
    hasHorario &&
    ((openHour === 0 && (closeHour === 0 || closeHour === 24)) ||
      normalizeText(item.horario_apertura || "").includes("24") ||
      normalizeText(item.horario_cierre || "").includes("24"))

  const morningOnly = hasHorario && !is24h && openHour != null && closeHour != null && closeHour <= 12.5
  const nightOnly = hasHorario && !is24h && openHour != null && openHour >= 18

  const allowsSlot = (slot: "morning" | "afternoon" | "night"): boolean => {
    if (!hasHorario || is24h || openHour == null || closeHour == null) return true
    if (slot === "morning") return openHour < 12 && closeHour > 6
    if (slot === "afternoon") return openHour < 18 && closeHour > 12
    return openHour < 24 && closeHour > 18
  }

  return { hasHorario, is24h, morningOnly, nightOnly, allowsSlot }
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
    if (item.tipo === "Habitaciones" && (item.check_in || item.check_out)) {
      const checkIn = item.check_in || "por confirmar"
      const checkOut = item.check_out || "por confirmar"
      return `Check-in: ${checkIn}. Check-out: ${checkOut}.`
    }
    if (item.horario_apertura || item.horario_cierre) {
      return `Horario: ${item.horario_apertura || "-"} a ${item.horario_cierre || "-"}.`
    }
    return "No tengo el horario exacto en este momento. ¿Quieres que lo confirme?"
  }

  if (askPrecio || askCondicion) {
    if (item.tipo === "Habitaciones" && item.precio_desde) {
      return `La tarifa referencial es desde ${item.precio_desde}. Puedes revisar disponibilidad en ${MARRIOTT_ROOMS_URL}.`
    }
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
  const guestsHint = extractGuestsHint(message)
  const affirmative = isAffirmative(message)
  const timePreference = extractTimePreference(message)
  const confirmDatesGuests = (dateValue: string, guestsValue: string) =>
    `Perfecto, ${dateValue} (${guestsValue}). ¿Es correcto?`

  const short = buildDetailReply(item)
  if (item.tipo === "Servicios") {
    if (affirmative) {
      return "Perfecto, lo dejamos encaminado desde el botón de la tarjeta."
    }
    if (dateHint) {
      return "Perfecto, queda anotado. Podemos coordinarlo desde el botón de la tarjeta."
    }
    return short
      ? `${short} Cuando te acomode, lo coordinamos desde la tarjeta.`
      : "Cuando te acomode, lo coordinamos desde la tarjeta."
  }
  if (item.tipo === "Habitaciones") {
    const stateDates = state?.dates || null
    const stateGuests = state?.guests || null
    const hasReservationSignals =
      hasReservationIntent(message) ||
      hasActionIntent(message) ||
      Boolean(dateHint) ||
      Boolean(guestsHint) ||
      Boolean(stateDates) ||
      Boolean(stateGuests)

    if (affirmative) {
      if (hasReservationSignals && stateDates && stateGuests) {
        return `Perfecto, ${stateDates} (${stateGuests}). Puedes revisar disponibilidad directamente en ${MARRIOTT_ROOMS_URL}.`
      }
      if (hasReservationSignals && stateDates && !stateGuests) {
        return `Perfecto, para ${stateDates}. ¿Para cuántas personas?`
      }
      if (hasReservationSignals && !stateDates && stateGuests) {
        return `Perfecto, ${stateGuests}. ¿Qué fechas tienes en mente?`
      }
      if (hasReservationSignals && dateHint && guestsHint) {
        return confirmDatesGuests(dateHint, guestsHint)
      }
      return short
        ? `${short} También puedo seguir con servicios del hotel o recomendaciones cercanas para completar tu estadía.`
        : "También puedo seguir con servicios del hotel o recomendaciones cercanas para completar tu estadía."
    }

    if (hasReservationSignals && !dateHint && !guestsHint && !stateDates && !stateGuests) {
      return `Puedes revisar fechas y disponibilidad directamente desde nuestro sitio oficial de Marriott: ${MARRIOTT_ROOMS_URL}`
    }

    if (hasReservationSignals && dateHint && guestsHint) {
      return confirmDatesGuests(dateHint, guestsHint)
    }
    if (hasReservationSignals && dateHint) {
      return `Perfecto, para ${dateHint}. ¿Para cuántas personas?`
    }
    if (hasReservationSignals && guestsHint) {
      return `Perfecto, ${guestsHint}. ¿Qué fechas tienes en mente?`
    }
    return short
      ? `${short} Si te interesa, seguimos con servicios del hotel o lugares cercanos para completar tu estadía.`
      : "Si te interesa, seguimos con servicios del hotel o lugares cercanos para completar tu estadía."
  }
  if (item.tipo === "Instalaciones") {
    const schedule = getScheduleInfo(item)
    const horarioText = schedule.hasHorario
      ? `Horario: ${item.horario_apertura || "-"} a ${item.horario_cierre || "-"}.`
      : null
    if (affirmative) {
      if (schedule.hasHorario && horarioText) {
        if (schedule.is24h) {
          return `Perfecto. ${horarioText} Está disponible todo el día.`
        }
        if (schedule.morningOnly) {
          return `Perfecto. ${horarioText} Funciona en la mañana.`
        }
        if (schedule.nightOnly) {
          return `Perfecto. ${horarioText} Funciona en la noche.`
        }
        return `Perfecto. ${horarioText}`
      }
      return "Perfecto. Si te interesa, seguimos con otro espacio del hotel o recomendaciones cercanas."
    }
    if (timePreference) {
      if (schedule.hasHorario && horarioText) {
        const slot = getPreferenceSlot(timePreference)
        const slotAllowed = slot ? schedule.allowsSlot(slot) : true
        if (!slotAllowed) {
          return `Perfecto, ${timePreference}. ${horarioText} Ese horario no está disponible.`
        }
        return `Perfecto, ${timePreference}. ${horarioText}`
      }
      return `Perfecto, ${timePreference}.`
    }
    if (horarioText) {
      return short ? `${short} ${horarioText}` : horarioText
    }
    return short || "Puedo compartirte más detalles de este espacio."
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
  history?: ChatHistoryItem[]
): Promise<string> {
  const isPetService = item.id.toLowerCase().includes("mascotas") || item.id.toLowerCase().includes("pet")
  const short = buildDetailReply(item)
  const petSize = extractPetSize(message)
  const affirmative = isAffirmative(message)
  const lastAssistant = [...(history || [])].reverse().find((h) => h.role === "assistant")?.content || ""
  const normalizedLast = normalizeText(lastAssistant)
  const normalizedMessage = normalizeText(message)
  const isShortFollowup = normalizedMessage.split(/\s+/).filter(Boolean).length <= 3
  const lastAssistantIsQuestion = lastAssistant.includes("?")
  const dateHint = extractDateHint(message)
  const guestsHint = extractGuestsHint(message)
  const choiceOptions = extractChoiceOptions(lastAssistant)
  const matchedChoice =
    choiceOptions.find((opt) => normalizeText(message).includes(normalizeText(opt))) || null

  if (isPetService) {
    if (affirmative) {
      const alreadyShared =
        normalizedLast.includes("condicion") ||
        normalizedLast.includes("costo") ||
        normalizedLast.includes("especial")
      if (item.condiciones_servicio && item.condiciones_servicio.length > 0) {
        const details = await formatConditionsText(item.condiciones_servicio, item.nombre_publico)
        if (alreadyShared) return "Perfecto, te comparto esas condiciones para que lo evalúes con calma."
        return `${details}. Te ayudo a coordinarlo por correo cuando lo decidas.`
      }
      if (item.restricciones_requisitos && item.restricciones_requisitos.length > 0) {
        const details = await formatConditionsText(item.restricciones_requisitos, item.nombre_publico)
        if (alreadyShared) return "Perfecto, te comparto esas condiciones para que lo evalúes con calma."
        return `${details}. Te ayudo a coordinarlo por correo cuando lo decidas.`
      }
      return alreadyShared
        ? "Perfecto, te comparto esas condiciones para que lo evalúes con calma."
        : "Puedo compartirte las condiciones del servicio pet friendly. Cuando quieras, lo coordinamos por correo."
    }
    if (petSize) {
      const detail = short ? ` ${short}` : ""
      return `Perfecto, tamaño ${petSize}.${detail} Si te parece, avanzamos con la coordinación por correo.`
    }
    const petContext = await inferPetContext(message, petSize)
    if (petContext.hasPet) {
      const intro = "Sí, contamos con pet friendly."
      const body = short ? `${intro} ${short}` : intro
      return petContext.needsSize ? `${body} ¿Qué tamaño tiene?` : `${body} Si te parece, avanzamos con la coordinación por correo.`
    }
  }

  if (normalizeText(item.id).includes("wifi") && lastAssistantIsQuestion && isShortFollowup) {
    const inferred = await inferWifiUseCase(message)
    if (inferred) {
      if (normalizedLast.includes("necesitas algo mas del wi")) {
        return `Perfecto, queda anotado para ${inferred}. También puedo ayudarte con otro detalle de tu estadía.`
      }
      return `Perfecto, para ${inferred}. La conexión cubre todo el hotel y suele funcionar bien para ese uso.`
    }
  }

  if (lastAssistantIsQuestion && isShortFollowup && !dateHint && !guestsHint && !petSize) {
    if (matchedChoice) {
      const shortName = item.nombre_publico || "servicio"
      if (normalizeText(item.id).includes("wifi")) {
        return `Perfecto, para ${matchedChoice}. La conexión cubre todo el hotel y suele funcionar bien para ese uso.`
      }
      return `Perfecto, tomo nota: ${matchedChoice}. Seguimos con ${shortName} desde la tarjeta cuando quieras.`
    }
    return buildSafeFollowup(item, message)
  }

  if (affirmative || hasActionIntent(message) || dateHint || guestsHint) {
    return "Perfecto, lo coordinamos desde el botón de la tarjeta."
  }

  return buildItemReply(item, message, state)
}

async function inferWifiUseCase(message: string): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) return null
  const normalized = normalizeText(message)
  if (normalized.includes("trabaj") || normalized.includes("zoom") || normalized.includes("reunion")) {
    return "trabajo"
  }
  if (normalized.includes("stream") || normalized.includes("netflix") || normalized.includes("pelicula")) {
    return "streaming"
  }
  try {
    const systemPrompt =
      "Clasifica el uso del Wi‑Fi. Devuelve SOLO JSON válido con {\"use\":\"trabajo\"|\"streaming\"|\"otro\"}."
    const userPrompt = `Respuesta del huésped: "${message}"`
    const response = await openai.chat.completions.create({
      model: CLASSIFY_MODEL,
      temperature: 0,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 30,
    })
    const raw = response.choices[0]?.message?.content?.trim() || "{}"
    let parsed: any = null
    try {
      parsed = JSON.parse(raw)
    } catch {
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          parsed = JSON.parse(match[0])
        } catch {
          parsed = null
        }
      }
    }
    const use = parsed?.use as string | undefined
    if (use === "trabajo" || use === "streaming") return use
    return null
  } catch {
    return null
  }
}

function buildContext(items: ConserjeItem[]): string {
  return items
    .map((item) => {
      const horario = item.horario_apertura || item.horario_cierre
        ? `Horario: ${item.horario_apertura || "-"} a ${item.horario_cierre || "-"}.`
        : ""
      const checkInOut =
        item.check_in || item.check_out
          ? `Check-in/out: ${item.check_in || "-"} / ${item.check_out || "-"}`
          : ""
      const precio = item.precio_desde ? `Precio desde: ${item.precio_desde}` : ""
      const redirigir = item.redirigir ? `Redirigir: ${item.redirigir}` : ""
      const mapa = item.link_ubicacion_mapa ? `Mapa: ${item.link_ubicacion_mapa}` : ""
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
        checkInOut,
        precio,
        redirigir,
        mapa,
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
    "disponible",
    "disponibles",
    "fecha",
    "fechas",
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

function buildCategoryListIntro(
  tipo: ConserjeItemType,
  state?: { profile?: string | null; intent?: string | null }
): string {
  const seed = `${tipo}-${state?.profile || "na"}-${state?.intent || "na"}`
  if (tipo === "Servicios") {
    return pickVariant(
      [
        "Claro, aquí tienes los servicios del hotel. Elige el que más te acomode y lo vemos juntos.",
        "Te comparto los servicios disponibles para tu estadía. Dime con cuál quieres empezar.",
        "Estas son las opciones de servicio en Humano. Escoge una y seguimos desde ahí.",
      ],
      seed
    )
  }
  if (tipo === "Instalaciones") {
    return pickVariant(
      [
        "Estas son las instalaciones del hotel. Elige la que quieras conocer primero.",
        "Te muestro los espacios disponibles en Humano. Dime cuál te interesa revisar.",
        "Aquí tienes las instalaciones. Escoge una y te cuento lo esencial.",
      ],
      seed
    )
  }
  if (tipo === "Recomendaciones_Locales") {
    return pickVariant(
      [
        "Te comparto recomendaciones cercanas en Miraflores. Elige la que más te provoque.",
        "Aquí tienes opciones para salir cerca del hotel. Dime cuál quieres revisar primero.",
        "Estas son recomendaciones alrededor de Humano. Escoge una y te guío.",
      ],
      seed
    )
  }
  return "Aquí tienes opciones disponibles."
}

function normalizeActionLabel(label: string, item?: ConserjeItem | null): string {
  const normalized = normalizeText(label)
  if (item?.tipo === "Habitaciones" && normalized.includes("reserv")) return "Revisar disponibilidad"
  if (item?.tipo === "Servicios" && (normalized.includes("coordinar") || normalized.includes("reserv"))) {
    return "Coordinar servicio"
  }
  if (item?.tipo === "Instalaciones" && normalized.includes("reserv")) return "Conocer más ambientes"
  if (normalized.includes("coordinar")) {
    return "Coordinar"
  }
  if (normalized.includes("ubicacion") || normalized.includes("mapa")) return "Ver ubicación en mapa"
  return label
}

function buildCTAs(options: {
  message: string
  item?: ConserjeItem | null
  tipo?: string | null
  state?: { dates?: string | null; guests?: string | null; profile?: string | null }
  reply?: string | null
}): string[] {
  const { message, item, tipo, state, reply } = options
  const actionableFromItem = (targetItem: ConserjeItem | null | undefined) => {
    if (!targetItem?.ctas?.length) return []
    const filtered = targetItem.ctas.filter((cta) => {
      const ctaNorm = normalizeText(cta)
      if (targetItem.tipo === "Habitaciones") return ctaNorm.includes("reserv")
      if (targetItem.tipo === "Servicios") {
        if (ctaNorm.includes("reservar habitacion")) return false
        return ctaNorm.includes("coordinar") || ctaNorm.includes("solicitar") || ctaNorm.includes("correo")
      }
      if (targetItem.tipo === "Instalaciones") {
        if (ctaNorm.includes("reservar habitacion")) return false
        return ctaNorm.includes("conocer") || ctaNorm.includes("instal") || ctaNorm.includes("ambientes")
      }
      if (targetItem.tipo === "Recomendaciones_Locales") {
        return ctaNorm.includes("ubicacion") || ctaNorm.includes("mapa") || ctaNorm.includes("llegar")
      }
      return false
    })
    const normalized = filtered.map((cta) => normalizeActionLabel(cta, targetItem))
    const deduped = Array.from(new Set(normalized))
    if (deduped.length > 0) return deduped
    if (targetItem.tipo === "Servicios") return ["Coordinar servicio"]
    if (targetItem.tipo === "Instalaciones") return ["Conocer más ambientes"]
    if (targetItem.tipo === "Recomendaciones_Locales") return ["Ver ubicación en mapa"]
    if (targetItem.tipo === "Habitaciones") return ["Revisar disponibilidad"]
    return []
  }
  const action = hasActionIntent(message)
  const affirmative = isAffirmative(message)
  const replyHasQuestion = reply ? reply.includes("?") || reply.includes("¿") : false
  if (replyHasQuestion && item?.tipo !== "Habitaciones" && tipo !== "Habitaciones") return []

  if (item?.tipo === "Servicios") {
    if (reply && normalizeText(reply).includes("boton de la tarjeta")) {
      return []
    }
    if (action || affirmative || state?.dates) {
      const fromSheet = actionableFromItem(item)
      return fromSheet.length > 0 ? fromSheet.slice(0, 2) : ["Coordinar por correo"]
    }
    return []
  }

  if (item?.tipo === "Habitaciones") {
    if (affirmative && (state?.dates || state?.guests || state?.profile)) {
      const fromSheet = actionableFromItem(item)
      return fromSheet.length > 0 ? fromSheet.slice(0, 2) : ["Revisar disponibilidad"]
    }
    if (state?.dates && (state?.guests || state?.profile)) {
      const fromSheet = actionableFromItem(item)
      return fromSheet.length > 0 ? fromSheet.slice(0, 2) : ["Revisar disponibilidad"]
    }
    if (action) {
      const fromSheet = actionableFromItem(item)
      return fromSheet.length > 0 ? fromSheet.slice(0, 2) : ["Revisar disponibilidad"]
    }
    return []
  }

  if (tipo === "Habitaciones") {
    if (affirmative && (state?.dates || state?.guests || state?.profile)) {
      return ["Revisar disponibilidad"]
    }
    if (state?.dates && (state?.guests || state?.profile)) return ["Revisar disponibilidad"]
    if (action) return ["Revisar disponibilidad"]
  }

  if (item?.tipo === "Recomendaciones_Locales") {
    const normalizedMessage = normalizeText(message)
    const wantsMap =
      normalizedMessage.includes("mapa") ||
      normalizedMessage.includes("ubicacion") ||
      normalizedMessage.includes("llegar") ||
      normalizedMessage.includes("caminand") ||
      normalizedMessage.includes("taxi") ||
      affirmative
    if (wantsMap && item.link_ubicacion_mapa) {
      const fromSheet = actionableFromItem(item).filter((cta) => {
        const ctaNorm = normalizeText(cta)
        return ctaNorm.includes("ubicacion") || ctaNorm.includes("mapa")
      })
      return fromSheet.length > 0 ? fromSheet.slice(0, 1) : ["Ver ubicación en mapa"]
    }
    if (action || affirmative) {
      const fromSheet = actionableFromItem(item)
      return fromSheet.length > 0 ? fromSheet.slice(0, 1) : []
    }
  }

  if (item?.tipo === "Instalaciones") {
    if (action || affirmative) {
      const fromSheet = actionableFromItem(item)
      return fromSheet.length > 0 ? fromSheet.slice(0, 1) : ["Conocer más ambientes"]
    }
  }

  return []
}

async function generateContextualReply(options: {
  message: string
  items: ConserjeItem[]
  history: ChatHistoryItem[]
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
- Tono: anfitrión cercano, curado y natural. No tono vendedor.
- Evita urgencia comercial o presión de compra.
- Si detectas intención de reserva/disponibilidad/precio/tarifa, redirige suavemente a:
  ${MARRIOTT_ROOMS_URL}
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

async function generateFollowupReply(options: {
  message: string
  lastAssistant: string
  item: ConserjeItem
  history: ChatHistoryItem[]
  state?: { dates?: string | null; guests?: string | null; profile?: string | null; intent?: string | null }
}) {
  if (!process.env.OPENAI_API_KEY) return ""
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
- Responde a la PREGUNTA PREVIA usando la RESPUESTA DEL HUÉSPED y el CONTEXTO.
- No cambies de tema ni sugieras otros servicios.
- No repitas la misma pregunta previa.
- Usa SOLO la información factual del CONTEXTO.
- Si hay intención de reserva/disponibilidad/precio/tarifa, redirige suavemente a ${MARRIOTT_ROOMS_URL}.
- Tono anfitrión, cercano y sin presión comercial.
- Responde en español claro y natural.
- Máximo 2 oraciones y una pregunta breve.`

    const context = buildContext([options.item])
    const userMessage = [
      `Pregunta previa: ${options.lastAssistant}`,
      `Respuesta del huésped: ${options.message}`,
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
    console.warn("generateFollowupReply failed:", error)
    return ""
  }
}

type AffirmativeFollowupMode = "show_card" | "needs_data" | "other"

async function inferAffirmativeFollowupMode(options: {
  lastAssistant: string
  userMessage: string
  item: ConserjeItem
}): Promise<AffirmativeFollowupMode> {
  const lastNormalized = normalizeText(options.lastAssistant)
  const heuristicNeedsDataCues = [
    "fecha",
    "fechas",
    "cuantas personas",
    "hora",
    "horario",
    "tamano",
    "tamaño",
    "vuelo",
    "caminando",
    "taxi",
    "mapa",
    "como llegar",
    "correo",
    "email",
  ]
  if (heuristicNeedsDataCues.some((cue) => lastNormalized.includes(normalizeText(cue)))) {
    return "needs_data"
  }
  if (!process.env.OPENAI_API_KEY) return "show_card"
  try {
    const systemPrompt = `Clasifica el siguiente turno conversacional.
Devuelve SOLO JSON válido: {"mode":"show_card"|"needs_data"|"other"}.

Reglas:
- show_card: cuando el conserje preguntó si quería saber más, ver más, conocer el espacio o continuar.
- needs_data: cuando el conserje pidió un dato operativo concreto (fecha, personas, hora, tamaño, vuelo, modo de traslado, etc.).
- other: cualquier otro caso.`

    const userPrompt = [
      `Item: ${options.item.nombre_publico} (${options.item.tipo})`,
      `Pregunta previa del conserje: "${options.lastAssistant}"`,
      `Respuesta del huésped: "${options.userMessage}"`,
    ].join("\n")

    const response = await openai.chat.completions.create({
      model: CLASSIFY_MODEL,
      temperature: 0,
      max_tokens: 40,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    })
    const raw = response.choices[0]?.message?.content?.trim() || "{}"
    let parsed: any = null
    try {
      parsed = JSON.parse(raw)
    } catch {
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          parsed = JSON.parse(match[0])
        } catch {
          parsed = null
        }
      }
    }
    const mode = parsed?.mode as AffirmativeFollowupMode | undefined
    if (mode === "show_card" || mode === "needs_data" || mode === "other") return mode
    return "show_card"
  } catch {
    return "show_card"
  }
}

function isReplyContaminated(reply: string, currentItem: ConserjeItem): boolean {
  const normalized = normalizeText(reply)
  const currentName = normalizeText(currentItem.nombre_publico)
  for (const item of conserjeData.items) {
    const name = normalizeText(item.nombre_publico)
    if (!name || name === currentName) continue
    if (normalized.includes(name)) return true
  }
  return false
}

function tokenOverlapRatio(a: string, b: string): number {
  const tokensA = normalizeText(a)
    .split(/\s+/)
    .filter((t) => t.length >= 3)
  const tokensB = new Set(
    normalizeText(b)
      .split(/\s+/)
      .filter((t) => t.length >= 3)
  )
  if (tokensA.length === 0 || tokensB.size === 0) return 0
  let overlap = 0
  for (const token of tokensA) {
    if (tokensB.has(token)) overlap += 1
  }
  return overlap / Math.max(tokensA.length, 1)
}

function isOperationalQuestionText(text: string): boolean {
  const normalized = normalizeText(text)
  const cues = [
    "fecha",
    "fechas",
    "cuantas personas",
    "para cuantas",
    "hora",
    "horario",
    "vuelo",
    "tamano",
    "tamaño",
    "precio",
    "tarifa",
    "disponibilidad",
    "caminando",
    "taxi",
    "como llegar",
    "mapa",
    "correo",
    "email",
  ]
  return cues.some((cue) => normalized.includes(normalizeText(cue)))
}

function isExplorationQuestionText(text: string): boolean {
  const normalized = normalizeText(text)
  const cues = [
    "mas informacion",
    "más informacion",
    "saber mas",
    "quieres que te muestre",
    "te muestro",
    "te cuento",
    "verlo en detalle",
    "verla en detalle",
    "sobre el espacio",
    "sobre esta opcion",
    "sobre esta opción",
  ]
  return cues.some((cue) => normalized.includes(normalizeText(cue)))
}

function isLikelyLoopReply(reply: string, lastAssistant: string): boolean {
  const normalizedReply = normalizeText(reply || "")
  const normalizedLast = normalizeText(lastAssistant || "")
  if (!normalizedReply || !normalizedLast) return false
  if (normalizedReply === normalizedLast) return true
  const overlap = tokenOverlapRatio(normalizedReply, normalizedLast)
  return overlap >= 0.9
}

const BRIDGE_STOPWORDS = new Set([
  "para",
  "con",
  "sin",
  "del",
  "desde",
  "hasta",
  "muy",
  "mas",
  "por",
  "que",
  "como",
  "una",
  "uno",
  "unas",
  "unos",
  "este",
  "esta",
  "estas",
  "estos",
  "hotel",
  "humano",
  "miraflores",
  "ideal",
  "opcion",
  "opciones",
  "servicio",
  "habitacion",
  "instalacion",
  "recomendacion",
])

function extractBridgeTokens(text: string): string[] {
  return normalizeText(text)
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !BRIDGE_STOPWORDS.has(token))
}

function isBridgeReplyEchoingCard(reply: string, item: ConserjeItem): boolean {
  const cardCorpus = [
    item.desc_factual || "",
    item.desc_experiencial || "",
    item.check_in ? `check in ${item.check_in}` : "",
    item.check_out ? `check out ${item.check_out}` : "",
    item.horario_apertura ? `horario apertura ${item.horario_apertura}` : "",
    item.horario_cierre ? `horario cierre ${item.horario_cierre}` : "",
    item.precio_desde || "",
  ]
    .filter(Boolean)
    .join(" ")

  if (!cardCorpus) return false

  const overlapReplyToCard = tokenOverlapRatio(reply, cardCorpus)
  const overlapCardToReply = tokenOverlapRatio(cardCorpus, reply)
  if (overlapReplyToCard >= 0.45 || overlapCardToReply >= 0.45) return true

  const replyTokens = new Set(extractBridgeTokens(reply))
  const cardTokens = Array.from(new Set(extractBridgeTokens(cardCorpus)))
  const keywordHits = cardTokens.filter((token) => replyTokens.has(token)).length
  return keywordHits >= 4
}

function sanitizePostCardBridgeReply(options: {
  reply: string
  item: ConserjeItem
  message: string
  state?: { dates?: string | null; guests?: string | null; profile?: string | null; intent?: string | null }
  lastAssistant: string
}): string {
  let output = applyConversationPolicy(options.reply || "").trim()
  const fallback = buildContextualBridgeReply(options.item, options.state)
  if (!output) return fallback

  const explicitOperationalRequest =
    hasReservationIntent(options.message) ||
    hasActionIntent(options.message) ||
    /\b(precio|tarifa|disponibilidad|fecha|fechas|check in|check out|hora|horario)\b/i.test(
      normalizeText(options.message)
    )

  if (!explicitOperationalRequest) {
    output = removeReservationCopyWhenNotAsked(output)
  }

  if (!output) return fallback

  const normalizedOutput = normalizeText(output)
  const bridgeNeedsFallback =
    isReplyContaminated(output, options.item) ||
    isLowValueFollowup(output, options.lastAssistant, options.item) ||
    isBridgeReplyEchoingCard(output, options.item) ||
    (!explicitOperationalRequest &&
      (normalizedOutput.includes("marriott") ||
        normalizedOutput.includes("disponibilidad") ||
        normalizedOutput.includes("precio") ||
        normalizedOutput.includes("tarifa") ||
        normalizedOutput.includes("que fechas tienes en mente") ||
        normalizedOutput.includes("para cuantas personas") ||
        normalizedOutput.includes("fecha y hora")))

  return bridgeNeedsFallback ? fallback : output
}

function hasProgressSignal(text: string): boolean {
  const normalized = normalizeText(text)
  const cues = [
    "horario",
    "check in",
    "check out",
    "marriott",
    "correo",
    "mapa",
    "caminando",
    "taxi",
    "perfecto",
    "dentro de ese rango",
    "si quieres",
    "puedes revisar",
  ]
  return cues.some((cue) => normalized.includes(cue))
}

function isLowValueFollowup(reply: string, lastAssistant: string, item: ConserjeItem): boolean {
  const normalizedReply = normalizeText(reply)
  if (!normalizedReply) return true
  if (normalizedReply === normalizeText(lastAssistant)) return true
  if (normalizedReply === normalizeText(item.desc_factual || "")) return true
  const overlapWithDetail = tokenOverlapRatio(normalizedReply, item.desc_factual || "")
  const overlapWithLastAssistant = tokenOverlapRatio(normalizedReply, lastAssistant || "")
  if ((overlapWithDetail >= 0.75 || overlapWithLastAssistant >= 0.8) && !hasProgressSignal(reply)) {
    return true
  }
  return false
}

function pickSuggestedPhrase(item: ConserjeItem, message: string): string | null {
  const normalizedMessage = normalizeText(message)
  const phrases = item.frases_sugeridas || []
  if (phrases.length === 0) return null
  for (const phrase of phrases) {
    const normalizedPhrase = normalizeText(phrase)
    const terms = normalizedMessage.split(/\s+/).filter((t) => t.length >= 4)
    if (terms.some((term) => normalizedPhrase.includes(term))) return phrase
  }
  return phrases[0] || null
}

function buildSafeFollowup(item: ConserjeItem, message: string): string {
  const detail = buildDetailReply(item)
  const phrase = pickSuggestedPhrase(item, message)
  const parts = [detail, phrase].filter(Boolean)
  const base = parts.join(" ")
  const suffix = item.nombre_publico ? ` ¿Necesitas algo más del ${item.nombre_publico}?` : " ¿Necesitas algo más?"
  return base ? `${base}${suffix}` : `Perfecto.${suffix}`
}

function buildCardBridgeFallback(item: ConserjeItem): string {
  if (item.tipo === "Habitaciones") {
    return `${item.nombre_publico} ya quedó mapeada en tu plan. Desde aquí también puedo mostrarte servicios del hotel o lugares cercanos para completar la estadía.`
  }
  if (item.tipo === "Servicios") {
    return `${item.nombre_publico} quedó listo dentro de tu plan. También puedo mostrarte espacios del hotel o rincones cercanos de Miraflores para seguir armando la experiencia.`
  }
  if (item.tipo === "Instalaciones") {
    return `${item.nombre_publico} es un buen punto de partida dentro del hotel. Si te interesa, te muestro otros espacios para que recorras Humano con calma.`
  }
  if (item.tipo === "Recomendaciones_Locales") {
    return `${item.nombre_publico} encaja bien con el plan. Cuando quieras, te comparto una ruta simple desde el hotel.`
  }
  return "Listo. Puedo continuar con el siguiente paso cuando lo prefieras."
}

function hashText(text: string): number {
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }
  return hash
}

function pickVariant(variants: string[], seed: string): string {
  if (variants.length === 0) return ""
  const index = hashText(seed) % variants.length
  return variants[index]
}

function buildContextualBridgeReply(
  item: ConserjeItem,
  state?: { dates?: string | null; guests?: string | null; profile?: string | null; intent?: string | null }
): string {
  const profile = state?.profile || null
  const intent = state?.intent || null

  if (item.tipo === "Habitaciones") {
    const contextBits: string[] = []
    if (profile === "pareja") contextBits.push("si viajan en pareja")
    if (profile === "solo") contextBits.push("si viajas solo")
    if (profile === "grupo") contextBits.push("si vienen en grupo")
    if (intent === "trabajo") contextBits.push("cuando el viaje es por trabajo")
    if (intent === "descanso") contextBits.push("cuando el viaje es por descanso")
    if (intent === "aventura") contextBits.push("cuando el viaje es por aventura")
    const contextLine =
      contextBits.length > 0
        ? `${item.nombre_publico} funciona muy bien ${contextBits.join(" y ")}.`
        : `${item.nombre_publico} se acomoda muy bien al ritmo de la estadía.`

    const variants = [
      `${contextLine} Si quieres, ahora te muestro servicios del hotel o rincones cercanos que valgan la pena.`,
      `${contextLine} Cuando les provoque, les recomiendo algo dentro del hotel o un plan corto por Miraflores.`,
      `${contextLine} Desde aquí te puedo sugerir un servicio del hotel o un lugar cercano para seguir el día.`,
    ]
    return pickVariant(variants, `${item.id}-${profile || "na"}-${intent || "na"}`)
  }

  if (item.tipo === "Servicios") {
    return pickVariant(
      [
        `Con ${item.nombre_publico} ya tienes esa parte cubierta. Si quieres, te sugiero un ambiente del hotel o un plan cercano.`,
        `${item.nombre_publico} va muy bien para la estadía. También puedo recomendarte qué ver dentro del hotel o alrededor de Miraflores.`,
        `${item.nombre_publico} ya quedó listo en tu plan. Cuando quieras, seguimos con instalaciones o recomendaciones cerca.`,
      ],
      `${item.id}-${profile || "na"}-${intent || "na"}`
    )
  }

  if (item.tipo === "Instalaciones") {
    return pickVariant(
      [
        `${item.nombre_publico} suma muy bien al recorrido dentro del hotel. Si te provoca, te muestro otro ambiente que combine con su plan.`,
        `${item.nombre_publico} ya quedó contemplado para la estadía. También puedo sugerirte otro espacio del hotel o algo cercano para salir.`,
        `${item.nombre_publico} es un buen punto de partida en Humano. Cuando quieras, seguimos con el siguiente ambiente.`,
      ],
      `${item.id}-${profile || "na"}-${intent || "na"}`
    )
  }

  if (item.tipo === "Recomendaciones_Locales") {
    return pickVariant(
      [
        `Perfecto. Te indico una forma simple de llegar desde el hotel.`,
        `Listo. Te comparto la ruta más práctica para llegar.`,
        `Hecho. Te paso una referencia clara para llegar sin vueltas.`,
      ],
      `${item.id}-${profile || "na"}-${intent || "na"}`
    )
  }

  return buildCardBridgeFallback(item)
}

async function generateCardBridgeReply(options: {
  item: ConserjeItem
  message: string
  history: ChatHistoryItem[]
  state?: { dates?: string | null; guests?: string | null; profile?: string | null; intent?: string | null }
}): Promise<string> {
  if (!process.env.OPENAI_API_KEY) return buildCardBridgeFallback(options.item)
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

    const systemPrompt = `Eres el anfitrión digital del Hotel Humano en Miraflores.
REGLAS:\n${rulesText}

INSTRUCCIONES:
- Ya se mostró una card con datos factual/experiencial; NO repitas ese contenido.
- Responde con una micro-capa humana y criterio local (1-2 líneas).
- Usa tono cercano, curado, sin arrogancia y sin vender.
- Haz máximo UNA pregunta breve.
- Evita cierres genéricos como: "¿Algo más en lo que pueda ayudarte?"
- Evita frases robotizadas como "Buena elección", "Si te sirve", "Conectamos esto", "planes".
- No preguntes por fechas ni disponibilidad salvo que el huésped lo pida explícitamente.
- Si el huésped pide reserva/precio/disponibilidad, redirige suavemente a ${MARRIOTT_ROOMS_URL}.`

    const context = buildContext([options.item])
    const userPrompt = [
      `Último mensaje del huésped: "${options.message}"`,
      stateSummary ? `Estado: ${stateSummary}` : "",
      `Contexto:\n${context}`,
    ]
      .filter(Boolean)
      .join("\n\n")

    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.4,
      max_tokens: 130,
      messages: [
        { role: "system", content: systemPrompt },
        ...options.history.slice(-4),
        { role: "user", content: userPrompt },
      ],
    })
    const reply = response.choices[0]?.message?.content?.trim() || ""
    return reply || buildCardBridgeFallback(options.item)
  } catch {
    return buildCardBridgeFallback(options.item)
  }
}

function extractChoiceOptions(text: string): string[] {
  const normalized = normalizeText(text)
  const match = /(?:\?|^)([^?]+)\?/.exec(normalized)
  const question = match ? match[1] : normalized
  const parts = question.split(" o ")
  if (parts.length < 2) return []
  const lastTwo = parts.slice(-2)
  return lastTwo.map((part) => part.trim().split(/\s+/).slice(-1)[0]).filter(Boolean)
}

function buildDirectionalFollowup(choice: string, item: ConserjeItem): string {
  const normalizedChoice = normalizeText(choice)
  const detail = buildDetailReply(item)
  if (normalizedChoice.includes("camina")) {
    return `${detail ? `${detail} ` : ""}Caminando es una buena opción y suele estar cerca. Te comparto la ubicación en mapa.`
  }
  if (normalizedChoice.includes("taxi")) {
    return `${detail ? `${detail} ` : ""}En taxi es rápido y directo. Te comparto la ubicación en mapa.`
  }
  return `${detail ? `${detail} ` : ""}Te comparto la ubicación en mapa para que llegues fácilmente.`
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
    const debug = Boolean(body?.debug)
    const trace: string[] = []
    const mark = (step: string) => {
      if (debug) trace.push(step)
    }
    const message: string = body?.message || ""
    const history: Array<{ role?: string; content?: string }> = body?.history || []
    const safeHistory = sanitizeHistory(history)
    const activeItemId: string | null = body?.activeItemId || null
    const activeItemLabel: string | null = body?.activeItemLabel || null
    const state = body?.state || null
    const mode: string | null = body?.mode || null
    const missingField: string | null = body?.missingField || null
    const contextTopic: string | null = body?.contextTopic || null
    const source: string | null = body?.source || null

    const respond = (
      payload: {
        reply?: string
        suggestions?: string[]
        items?: ConserjeItem[]
        menu?: Array<{ id: string; label: string }>
        intent?: string | null
        profile?: string | null
        tipo?: string | null
        activeItemId?: string | null
        decision?: Decision
        [key: string]: any
      },
      init?: { status?: number }
    ) => {
      const nextPayload = { ...payload }
      const rawReply = typeof nextPayload.reply === "string" ? nextPayload.reply : ""
      let finalReply = applyConversationPolicy(rawReply)
      const lastAssistantReply =
        [...safeHistory].reverse().find((entry) => entry.role === "assistant")?.content || ""
      const activePayloadItem = nextPayload.activeItemId
        ? conserjeData.items.find((item) => item.id === nextPayload.activeItemId) || null
        : null

      if (requiresHumanEscalation(message)) {
        finalReply = `Para gestionarlo correctamente, prefiero que escribas directamente a nuestro equipo: ${HUMAN_ESCALATION_EMAIL}.`
      }

      if (
        activePayloadItem &&
        isAffirmative(message) &&
        lastAssistantReply.includes("?") &&
        !isOperationalQuestionText(lastAssistantReply) &&
        (!Array.isArray(nextPayload.items) || nextPayload.items.length === 0) &&
        (!Array.isArray(nextPayload.menu) || nextPayload.menu.length === 0)
      ) {
        nextPayload.items = [activePayloadItem]
        finalReply = pickVariant(
          ["Perfecto, te la muestro aquí.", "Claro, aquí la tienes.", "Listo, te la dejo aquí."],
          `${activePayloadItem.id}-${state?.profile || "na"}-${state?.intent || "na"}`
        )
      }

      if (
        finalReply &&
        isLikelyLoopReply(finalReply, lastAssistantReply) &&
        !hasReservationIntent(message) &&
        !hasActionIntent(message)
      ) {
        if (
          activePayloadItem &&
          (!Array.isArray(nextPayload.items) || nextPayload.items.length === 0)
        ) {
          nextPayload.items = [activePayloadItem]
          finalReply = pickVariant(
            ["Vamos con esto en detalle.", "Te la muestro para avanzar.", "Aquí la tienes para seguir."],
            `${activePayloadItem.id}-${message}-${state?.profile || "na"}`
          )
        } else if (Array.isArray(nextPayload.menu) && nextPayload.menu.length > 0) {
          finalReply = "Te dejo opciones para elegir el siguiente paso."
        } else {
          finalReply = "Sigamos con algo más concreto. ¿Prefieres opciones del hotel o lugares cercanos?"
        }
      }

      const reservationMode = inferDecision({
        message,
        reply: finalReply,
        tipo: nextPayload.tipo || null,
        menu: nextPayload.menu || [],
        state: state || null,
      }).mode === "redirect_reservation"

      if (reservationMode && !normalizeText(finalReply).includes("marriott")) {
        const reservationLine = `Puedes revisar fechas y disponibilidad directamente desde nuestro sitio oficial de Marriott: ${MARRIOTT_ROOMS_URL}`
        finalReply = finalReply ? `${finalReply} ${reservationLine}` : reservationLine
      }
      if (!reservationMode) {
        finalReply = removeReservationCopyWhenNotAsked(finalReply)
      }

      if (finalReply) nextPayload.reply = finalReply.trim()
      nextPayload.decision =
        nextPayload.decision ||
        inferDecision({
          message,
          reply: nextPayload.reply || "",
          tipo: nextPayload.tipo || null,
          menu: nextPayload.menu || [],
          state: state || null,
        })
      if (debug) {
        nextPayload._debug = {
          trace,
          message,
          activeItemId: nextPayload.activeItemId || null,
        }
      }

      return NextResponse.json(nextPayload, init)
    }

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
          ...safeHistory.slice(-4),
          {
            role: "user",
            content: context ? `Contexto:\n${context}` : "Sin contexto adicional.",
          },
        ],
      })

      const reply = response.choices[0]?.message?.content?.trim() || ""
      return respond({
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
    if (requiresHumanEscalation(message)) {
      return respond({
        reply: `Para gestionarlo correctamente, prefiero que escribas directamente a nuestro equipo: ${HUMAN_ESCALATION_EMAIL}.`,
        suggestions: [],
        items: [],
        menu: [],
        intent: null,
        profile: null,
        tipo: null,
        activeItemId: null,
      })
    }
    const serviciosItems = conserjeData.items.filter((item) => item.tipo === "Servicios")
    const tipoHint = (detectTipo(message) || (contextTopic as ConserjeItemType | null)) ?? null
    const lastAssistantContent =
      [...safeHistory].reverse().find((entry) => entry.role === "assistant")?.content || ""
    const previousUserContent =
      [...safeHistory]
        .slice(0, -1)
        .reverse()
        .find((entry) => entry.role === "user")?.content || ""
    const previousUserNormalized = previousUserContent ? normalizeText(previousUserContent) : ""
    const historyItemMatch = previousUserContent
      ? matchItemByName(previousUserContent, conserjeData.items)
      : null
    const fallbackActiveItem = activeItemLabel
      ? conserjeData.items.find(
          (item) => normalizeText(item.nombre_publico) === normalizeText(activeItemLabel)
        ) || null
      : historyItemMatch
      ? historyItemMatch
      : (lastAssistantContent.includes("Nombre:")
          ? (() => {
              const match = /Nombre:\s*([^\n]+)/.exec(lastAssistantContent)
              if (!match) return null
              const name = match[1].trim()
              return conserjeData.items.find(
                (item) => normalizeText(item.nombre_publico) === normalizeText(name)
              ) || null
            })()
          : matchItemByName(lastAssistantContent, conserjeData.items))
    const resolvedActiveItem = activeItemId
      ? conserjeData.items.find((item) => item.id === activeItemId) || null
      : null
    const activeItem = resolvedActiveItem || fallbackActiveItem
    const intentForHotel = detectIntent(message) || state?.intent || null
    const profileForHotel = detectProfile(message) || state?.profile || null
    const explicitMentionForHotel = getExplicitItemMention(message)
    if (
      shouldOpenInsideHotelExploration({
        message,
        activeItem,
        lastAssistant: lastAssistantContent,
      }) &&
      !(explicitMentionForHotel && explicitMentionForHotel.tipo !== "Recomendaciones_Locales")
    ) {
      mark("inside_hotel_exploration")
      const insideItems = selectInHotelItems({
        message,
        intent: intentForHotel,
        profile: profileForHotel,
      })
      return respond({
        reply:
          "Dentro de Humano tengo varias opciones para ti. Te dejo una selección para que elijas la que más te provoque.",
        suggestions: [],
        items: [],
        menu: insideItems.map((item) => ({ id: item.id, label: item.nombre_publico })),
        intent: intentForHotel,
        profile: profileForHotel,
        tipo: null,
        activeItemId: null,
      })
    }
    const { ranked: semanticRanked, usedEmbeddings: usedSemanticEmbeddings } =
      await rankItemsBySemantic(message, conserjeData.items)
    const semanticBest = semanticRanked[0]?.item || null
    const semanticBestScore = semanticRanked[0]?.score ?? 0

    const dateHint = extractDateHint(message)
    const askedGuestsCount = shouldTreatAsGuests(message, safeHistory)
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
    ]
    const hasQuestionMark = message.includes("?")
    const isQuestion = hasQuestionMark || questionSignals.some((signal) => normalizedMessage.includes(normalizeText(signal)))
    const tokenCount = normalizedMessage.split(/\s+/).filter(Boolean).length
    const isPureAffirmative =
      isAffirmative(message) && tokenCount <= 2
    const isShortFollowup = tokenCount <= 3 && !isQuestion
    const isRepeatUserMessage =
      Boolean(previousUserNormalized) && previousUserNormalized === normalizedMessage && isShortFollowup
    const lowInfoFollowup =
      Boolean(activeItem) &&
      (Boolean(dateHint) || Boolean(guestsHint) || Boolean(petSize) || isPureAffirmative || isShortFollowup)
    const freeformReasoning =
      isQuestion && !dateHint && !guestsHint && !isPureAffirmative && !hasActionIntent(message)
    const mentionsAnimal = mentionsPetOrAnimal(message)
    const lastAssistantNormalized = normalizeText(lastAssistantContent)
    if (
      isPureAffirmative &&
      !activeItem &&
      (lastAssistantNormalized.includes("dentro de humano") ||
        lastAssistantNormalized.includes("dentro del hotel") ||
        (lastAssistantNormalized.includes("seleccion") &&
          lastAssistantNormalized.includes("elijas")))
    ) {
      const insideItems = selectInHotelItems({
        message: "dentro del hotel",
        intent: intentForHotel,
        profile: profileForHotel,
      })
      return respond({
        reply: "Perfecto. Elige una opción y te la muestro en detalle.",
        suggestions: [],
        items: [],
        menu: insideItems.map((item) => ({ id: item.id, label: item.nombre_publico })),
        intent: intentForHotel,
        profile: profileForHotel,
        tipo: null,
        activeItemId: null,
      })
    }

    const explicitNameMatch =
      conserjeData.items.find((item) => {
        const name = normalizeText(item.nombre_publico)
        if (!name) return false
        return (
          normalizedMessage.replace(/\s+/g, " ").trim() === name ||
          normalizedMessage.includes(name)
        )
      }) || null
    const nameMatch =
      activeItem && lowInfoFollowup && !explicitNameMatch
        ? null
        : matchItemByName(message, conserjeData.items)

    const wantsCategorySwitch =
      isHabitacionesQuery(message) ||
      isInstalacionesQuery(message) ||
      isRecomendacionesQuery(message) ||
      normalizedMessage.includes("servicio") ||
      normalizedMessage.includes("servicios")

    if (activeItem && isRepeatUserMessage && !wantsCategorySwitch) {
      mark("repeat_user_message_guard")
      const reply = "Ya lo tengo. Cuando quieras, continuamos con otro detalle."
      return respond({
        reply,
        suggestions: [],
        items: [],
        menu: [],
        intent: null,
        profile: null,
        tipo: activeItem.tipo,
        activeItemId: activeItem.id,
      })
    }

    if (activeItem && isShortFollowup && !explicitNameMatch && !wantsCategorySwitch) {
      mark("active_item_short_followup")
      const lastAssistantContent =
        [...safeHistory].reverse().find((entry) => entry.role === "assistant")?.content || ""
      const lastAssistantNormalized = normalizeText(lastAssistantContent)
      const lastAssistantIsQuestion = lastAssistantContent.includes("?")
      const affirmative = isAffirmative(message)
      const choiceOptions = extractChoiceOptions(lastAssistantContent)
      const matchedChoice = choiceOptions.find((opt) => normalizeText(message).includes(opt)) || null
      const isWifi = activeItem.tipo === "Servicios" && normalizeText(activeItem.id).includes("wifi")

      if (activeItem.tipo === "Recomendaciones_Locales" && affirmative) {
        if (lastAssistantNormalized.includes("como llegar") || lastAssistantNormalized.includes("cómo llegar")) {
          const reply = "Perfecto. ¿Prefieres llegar caminando o en taxi?"
          return respond({
            reply,
            suggestions: buildCTAs({ message, item: activeItem, state, reply }),
            items: [],
            menu: [],
            intent: null,
            profile: null,
            tipo: activeItem.tipo,
            activeItemId: activeItem.id,
          })
        }
      }

      if (activeItem.tipo === "Recomendaciones_Locales" && matchedChoice) {
        const reply = buildDirectionalFollowup(matchedChoice, activeItem)
        return respond({
          reply,
          suggestions: buildCTAs({ message, item: activeItem, state, reply }),
          items: [],
          menu: [],
          intent: null,
          profile: null,
          tipo: activeItem.tipo,
          activeItemId: activeItem.id,
        })
      }

      if (isWifi && lastAssistantNormalized.includes("trabajo o streaming")) {
        const wifiUse = await inferWifiUseCase(message)
        if (wifiUse) {
          const reply = `Perfecto, para ${wifiUse}. La conexión cubre todo el hotel y suele funcionar bien para ese uso.`
          return respond({
            reply,
            suggestions: buildCTAs({ message, item: activeItem, state, reply }),
            items: [],
            menu: [],
            intent: null,
            profile: null,
            tipo: activeItem.tipo,
            activeItemId: activeItem.id,
          })
        }
      }

      if (affirmative && lastAssistantIsQuestion) {
        mark("affirmative_followup_question")
        const mode = isExplorationQuestionText(lastAssistantContent)
          ? "show_card"
          : isOperationalQuestionText(lastAssistantContent)
          ? await inferAffirmativeFollowupMode({
              lastAssistant: lastAssistantContent,
              userMessage: message,
              item: activeItem,
            })
          : "show_card"
        mark(`affirmative_followup_mode:${mode}`)
        if (mode === "show_card") {
          mark("affirmative_show_card")
          const reply = pickVariant(
            [
              `Perfecto, te la muestro aquí.`,
              `Claro, te la dejo aquí para que la revises.`,
              `Listo, aquí la tienes.`,
            ],
            `${activeItem.id}-${state?.profile || "na"}-${state?.intent || "na"}`
          )
          return respond({
            reply,
            suggestions: buildCTAs({ message, item: activeItem, state, reply }),
            items: [activeItem],
            menu: [],
            intent: null,
            profile: null,
            tipo: activeItem.tipo,
            activeItemId: activeItem.id,
          })
        }
      }

      if (lastAssistantIsQuestion) {
        const llmFollowup = await generateFollowupReply({
          message,
          lastAssistant: lastAssistantContent,
          item: activeItem,
          history: safeHistory,
          state,
        })
        if (
          llmFollowup &&
          !isReplyContaminated(llmFollowup, activeItem) &&
          !isLowValueFollowup(llmFollowup, lastAssistantContent, activeItem)
        ) {
          return respond({
            reply: llmFollowup,
            suggestions: buildCTAs({ message, item: activeItem, state, reply: llmFollowup }),
            items: [],
            menu: [],
            intent: null,
            profile: null,
            tipo: activeItem.tipo,
            activeItemId: activeItem.id,
          })
        }
      }

      const reply =
        activeItem.tipo === "Servicios"
          ? await buildServiceReply(activeItem, message, state, safeHistory)
          : buildItemReply(activeItem, message, state)
      return respond({
        reply,
        suggestions: buildCTAs({ message, item: activeItem, state, reply }),
        items: [],
        menu: [],
        intent: null,
        profile: null,
        tipo: activeItem.tipo,
        activeItemId: activeItem.id,
      })
    }

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

    const activeReservationContext =
      Boolean(activeItem) &&
      activeItem?.tipo === "Habitaciones" &&
      !wantsCategorySwitch &&
      !explicitNameMatch &&
      (hasReservationIntent(message) || hasActionIntent(message))

    const matchedItem = activeReservationContext
      ? activeItem
      : nameMatch || llmResolved || (lowInfoFollowup ? null : semanticCandidate)
    const currentItem = matchedItem || activeItem

    if (isHabitacionesQuery(message) && !(source === "menu" && activeItem?.tipo === "Habitaciones")) {
      let isCategoryOnly = source === "menu"
      if (!isCategoryOnly) isCategoryOnly = await inferListIntent(message, "Habitaciones")
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
      const isGroupProfile = effectiveProfile === "grupo" || (guestsCount != null && guestsCount >= 3)
      const listRooms = isCategoryOnly && !isGroupProfile ? habitaciones : filteredRooms

      if (listRooms.length === 0) {
        return respond({
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
            history: safeHistory,
            state,
          })) || "Tengo opciones que podrían encajar. ¿Qué prefieres: cama, tamaño o vista?"
        return respond({
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

      const names = listRooms.map((item) => item.nombre_publico).join(", ")
      const showAll = listRooms.length === habitaciones.length
      const reply = showAll
        ? `Tengo estas opciones de habitaciones: ${names}. ¿Te interesa alguna en particular?`
        : effectiveProfile
          ? `Para ${effectiveProfile}, tengo estas opciones: ${names}. ¿Te interesa alguna en particular?`
          : `Tengo estas opciones de habitaciones: ${names}. ¿Te interesa alguna en particular?`
      return respond({
        reply,
        suggestions: buildCTAs({ message, tipo: "Habitaciones", state, reply }),
        items: [],
        menu: listRooms.map((item) => ({ id: item.id, label: item.nombre_publico })),
        intent: null,
        profile: effectiveProfile || null,
        tipo: "Habitaciones",
        activeItemId: null,
      })
    }

    if (isRecomendacionesQuery(message) && !(source === "menu" && activeItem?.tipo === "Recomendaciones_Locales")) {
      let isCategoryOnly = source === "menu"
      if (!isCategoryOnly) isCategoryOnly = await inferListIntent(message, "Recomendaciones_Locales")
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
        return respond({
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
            history: safeHistory,
            state,
          })) || "Tengo algunas opciones cerca. ¿Qué tipo de café prefieres?"
        return respond({
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
      const reply = `${buildCategoryListIntro("Recomendaciones_Locales", {
        profile: profileHint || null,
        intent: intentHint || null,
      })} ${profileHint ? `Para ${profileHint},` : ""} ${names}.`
      return respond({
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

    if (isInstalacionesQuery(message) && !(source === "menu" && activeItem?.tipo === "Instalaciones")) {
      let isCategoryOnly = source === "menu"
      if (!isCategoryOnly) isCategoryOnly = await inferListIntent(message, "Instalaciones")
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
        return respond({
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
            history: safeHistory,
            state,
          })) || "Tenemos varias instalaciones. ¿Qué te interesa usar?"
        return respond({
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
      const reply = `${buildCategoryListIntro("Instalaciones", {
        profile: profileHint || null,
        intent: intentHint || null,
      })} ${profileHint ? `Para ${profileHint},` : ""} ${names}.`
      return respond({
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

    if (tipoHint === "Servicios") {
      const isMenuItemSelection = source === "menu" && activeItem?.tipo === "Servicios"
      const isDirectItemMention = nameMatch?.tipo === "Servicios"
      const isGenericServicesRequest =
        source === "menu" ||
        normalizedMessage.includes("servicios") ||
        normalizedMessage.includes("servicio")
      if (isMenuItemSelection || isDirectItemMention || !isGenericServicesRequest) {
        // Skip list handling; fall through to item/semantic resolution
      } else {
        let isCategoryOnly = source === "menu" && !isMenuItemSelection
      if (!isCategoryOnly) isCategoryOnly = await inferListIntent(message, "Servicios")
      if (!isCategoryOnly) {
        const { ranked } = await rankItemsBySemantic(message, serviciosItems)
        const topItems = ranked.slice(0, 3).map((entry) => entry.item)
        const reply =
          (await generateContextualReply({
            message,
            items: topItems.length > 0 ? topItems : serviciosItems.slice(0, 3),
            history: safeHistory,
            state,
          })) || "Tenemos varios servicios disponibles. ¿Cuál te interesa?"
        return respond({
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
      const reply = buildCategoryListIntro("Servicios", {
        profile: state?.profile || null,
        intent: state?.intent || null,
      })
      return respond({
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
        return respond({
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
        const lastAssistantForSelectionRaw =
          [...safeHistory].reverse().find((entry) => entry.role === "assistant")?.content || ""
        let reply = buildContextualBridgeReply(currentItem, state)
        if (currentItem.tipo === "Habitaciones") {
          const lastAssistantForSelection = normalizeText(lastAssistantForSelectionRaw)
          const dates = state?.dates || null
          const guests = state?.guests || guestsHint || null
          const reservationFlowRequested =
            hasReservationIntent(message) ||
            hasActionIntent(message) ||
            (isAffirmative(message) && lastAssistantForSelection.includes("reserv"))
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
            return respond({
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
          if (reservationFlowRequested) {
            let followUp = "Si quieres revisar disponibilidad, te comparto el enlace oficial."
            if (dates && guests) {
              followUp = `Perfecto, ${dates} (${guests}). Puedes revisar disponibilidad en ${MARRIOTT_ROOMS_URL}.`
            } else if (dates) {
              followUp = `Perfecto, para ${dates}. ¿Para cuántas personas?`
            } else if (guests) {
              followUp = `Perfecto, ${guests}. ¿Qué fechas tienes en mente?`
            }
            reply = followUp
          }
        }
        if (currentItem.tipo === "Servicios" && hasActionIntent(message)) {
          reply = await buildServiceReply(currentItem, message, state, safeHistory)
        }
        return respond({
          reply,
          suggestions: buildCTAs({ message, item: currentItem, state, reply }),
          items: [currentItem],
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
          return respond({
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
                  history: safeHistory,
                  state,
                })) || buildItemReply(currentItem, message, state)
              : buildItemReply(currentItem, message, state))
          : currentItem.tipo === "Servicios"
            ? (freeformReasoning && !mentionsAnimal
                ? (await generateContextualReply({
                    message,
                    items: [currentItem],
                    history: safeHistory,
                    state,
                  })) || (await buildServiceReply(currentItem, message, state, safeHistory))
                : await buildServiceReply(currentItem, message, state, safeHistory))
            : (await generateContextualReply({
                message,
                items: [currentItem],
                history: safeHistory,
                state,
              })) || buildItemReply(currentItem, message, state)
      return respond({
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
      const resolvedMatchedItem = matchedItem as ConserjeItem
      if (isNegative(message)) {
        return respond({
          reply: "Entiendo. ¿Quieres revisar otras opciones?",
          suggestions: [],
          items: [],
          menu: buildCategoryMenu(resolvedMatchedItem.tipo),
          intent: null,
          profile: null,
          tipo: null,
          activeItemId: null,
        })
      }
      const normalizedMatchedMessage = normalizeText(message).replace(/\s+/g, " ").trim()
      const matchedItemName = normalizeText(resolvedMatchedItem.nombre_publico)
        .replace(/\s+/g, " ")
        .trim()
      const isMatchedSelectionOnly =
        source === "menu" ||
        (!isQuestion &&
          (normalizedMatchedMessage === matchedItemName ||
            normalizedMatchedMessage.includes(matchedItemName) ||
            matchedItemName.includes(normalizedMatchedMessage)))

      if (isMatchedSelectionOnly) {
        const reply = buildContextualBridgeReply(resolvedMatchedItem, state)
        return respond({
          reply,
          suggestions: buildCTAs({ message, item: resolvedMatchedItem, state, reply }),
          items: [resolvedMatchedItem],
          menu: [],
          intent: null,
          profile: null,
          tipo: resolvedMatchedItem.tipo,
          activeItemId: resolvedMatchedItem.id,
        })
      }
      const reply =
        resolvedMatchedItem.tipo === "Habitaciones"
          ? (freeformReasoning
              ? (await generateContextualReply({
                  message,
                  items: [resolvedMatchedItem],
                  history: safeHistory,
                  state,
                })) || buildItemReply(resolvedMatchedItem, message, state)
              : buildItemReply(resolvedMatchedItem, message, state))
          : resolvedMatchedItem.tipo === "Servicios"
            ? (freeformReasoning && !mentionsAnimal
                ? (await generateContextualReply({
                    message,
                    items: [resolvedMatchedItem],
                    history: safeHistory,
                    state,
                  })) || (await buildServiceReply(resolvedMatchedItem, message, state, safeHistory))
                : await buildServiceReply(resolvedMatchedItem, message, state, safeHistory))
            : (await generateContextualReply({
                message,
                items: [resolvedMatchedItem],
                history: safeHistory,
                state,
              })) || buildItemReply(resolvedMatchedItem, message, state)
      return respond({
        reply,
        suggestions: buildCTAs({ message, item: resolvedMatchedItem, state, reply }),
        items: [],
        menu: [],
        intent: null,
        profile: null,
        tipo: resolvedMatchedItem.tipo,
        activeItemId: resolvedMatchedItem.id,
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
      return respond({
        reply:
          `No tengo ese dato confirmado en este momento. Para validarlo con precisión, puedes escribir a ${HUMAN_ESCALATION_EMAIL}.`,
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
          history: safeHistory,
          state,
        })
      : `No tengo ese dato confirmado en este momento. Para validarlo con precisión, puedes escribir a ${HUMAN_ESCALATION_EMAIL}.`

    return respond({
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
