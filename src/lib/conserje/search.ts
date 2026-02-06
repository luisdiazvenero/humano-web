import type { ConserjeItem, ConserjeItemType } from "./types"

const INTENT_KEYWORDS: Record<string, string[]> = {
  trabajo: ["trabajo", "negocio", "negocios", "empresa", "reunion", "reunión", "oficina", "corporativo"],
  descanso: ["descanso", "relax", "relajo", "spa", "tranquilo", "vacaciones"],
  aventura: ["aventura", "explorar", "turismo", "tour", "surf", "experiencia", "experiencias"],
}

const PROFILE_KEYWORDS: Record<string, string[]> = {
  solo: ["solo", "sola", "individual"],
  pareja: ["pareja", "dos", "esposo", "esposa", "novio", "novia"],
  grupo: ["grupo", "amigos", "equipo", "colegas"],
  familia: ["familia", "niños", "ninos", "hijos", "hijas"],
  primera_vez: ["primera vez", "primer viaje"],
}

const TIPO_KEYWORDS: Array<{ tipo: ConserjeItemType; keywords: string[] }> = [
  { tipo: "Habitaciones", keywords: ["habitacion", "habitación", "suite", "cama"] },
  { tipo: "Servicios", keywords: ["servicio", "servicios", "transfer", "traslado", "pet", "mascota"] },
  { tipo: "Instalaciones", keywords: ["instalacion", "instalaciones", "lobby", "gym", "gimnasio", "desayuno", "piscina", "spa"] },
  { tipo: "Recomendaciones_Locales", keywords: ["recomendacion", "recomendaciones", "cerca", "alrededor", "lugares", "miraflores", "barrio"] },
]

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
}

function scoreByKeywords(message: string, keywords: string[]): number {
  let score = 0
  for (const keyword of keywords) {
    if (message.includes(normalizeText(keyword))) {
      score += 1
    }
  }
  return score
}

export function detectIntent(message: string): string | null {
  const normalized = normalizeText(message)
  let best: { intent: string; score: number } | null = null
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    const score = scoreByKeywords(normalized, keywords)
    if (!best || score > best.score) {
      best = { intent, score }
    }
  }
  if (!best || best.score === 0) return null
  return best.intent
}

export function detectProfile(message: string): string | null {
  const normalized = normalizeText(message)
  let best: { profile: string; score: number } | null = null
  for (const [profile, keywords] of Object.entries(PROFILE_KEYWORDS)) {
    const score = scoreByKeywords(normalized, keywords)
    if (!best || score > best.score) {
      best = { profile, score }
    }
  }
  if (!best || best.score === 0) return null
  return best.profile
}

export function detectTipo(message: string): ConserjeItemType | null {
  const normalized = normalizeText(message)
  for (const { tipo, keywords } of TIPO_KEYWORDS) {
    if (scoreByKeywords(normalized, keywords) > 0) {
      return tipo
    }
  }
  return null
}

export function filterItems(
  items: ConserjeItem[],
  intent: string | null,
  profile: string | null,
  tipo: ConserjeItemType | null
): ConserjeItem[] {
  return items.filter((item) => {
    if (intent && !item.intenciones.map(normalizeText).includes(normalizeText(intent))) {
      return false
    }
    if (profile && !item.perfil_ideal.map(normalizeText).includes(normalizeText(profile))) {
      return false
    }
    if (tipo && item.tipo !== tipo) {
      return false
    }
    return true
  })
}

export function keywordScore(query: string, item: ConserjeItem): number {
  const q = normalizeText(query)
  const terms = q.split(/\s+/).filter(Boolean)
  const haystack = normalizeText(
    [
      item.nombre_publico,
      item.categoria,
      item.desc_factual,
      item.desc_experiencial,
      ...(item.frases_sugeridas || []),
    ].join(" ")
  )
  let score = 0
  for (const term of terms) {
    if (term.length < 3) continue
    if (haystack.includes(term)) score += 1
  }
  return score
}

export function collectSuggestions(items: ConserjeItem[], limit = 3): string[] {
  const set = new Set<string>()
  for (const item of items) {
    for (const cta of item.ctas || []) {
      const trimmed = cta.trim()
      if (trimmed) set.add(trimmed)
    }
  }
  return Array.from(set).slice(0, limit)
}

export function matchItemByName(message: string, items: ConserjeItem[]): ConserjeItem | null {
  const normalizedMessage = normalizeText(message)
  const wordCount = normalizedMessage.split(/\s+/).filter(Boolean).length
  let best: { item: ConserjeItem; score: number } | null = null
  for (const item of items) {
    const name = normalizeText(item.nombre_publico)
    if (!name) continue
    if (normalizedMessage === name || normalizedMessage.includes(name)) {
      return item
    }
    if (wordCount <= 4) {
      const score = keywordScore(normalizedMessage, item)
      if (!best || score > best.score) {
        best = { item, score }
      }
    }
  }
  if (best && best.score >= 2) return best.item
  return null
}
