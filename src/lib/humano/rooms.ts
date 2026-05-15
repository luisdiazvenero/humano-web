import humanoDataRaw from "@/data/humano.json"
import humanoDataRawEn from "@/data/humano-en.json"
import type { ConserjeData, ConserjeItem } from "@/lib/humano/types"

export type HumanoLang = "es" | "en"

const HUMANO_DATA: Record<HumanoLang, ConserjeData> = {
  es: humanoDataRaw as ConserjeData,
  en: humanoDataRawEn as ConserjeData,
}

const CATEGORIA_I18N: Record<HumanoLang, Record<string, string>> = {
  es: {
    Habitación: "Habitación",
    Servicio: "Servicio",
    Instalación: "Instalación",
    "Recomendación externa": "Recomendación externa",
  },
  en: {
    Habitación: "Room",
    Servicio: "Service",
    Instalación: "Facility",
    "Recomendación externa": "Local pick",
  },
}

const ROOM_META_I18N: Record<HumanoLang, {
  kingSofa: string
  twoDoubles: string
  kingBed: string
  terrace: string
  kitchenette: string
}> = {
  es: {
    kingSofa: "King + sofá cama",
    twoDoubles: "2 camas dobles",
    kingBed: "Cama King",
    terrace: "Terraza",
    kitchenette: "Kitchenet",
  },
  en: {
    kingSofa: "King + sofa bed",
    twoDoubles: "2 double beds",
    kingBed: "King bed",
    terrace: "Terrace",
    kitchenette: "Kitchenette",
  },
}

export type HumanoRoom = {
  id: string
  slug: string
  nombre: string
  descripcion: string
  descripcionExperiencial: string
  descripcionFactual: string
  descripcionCorta: string
  categoria: string
  intenciones: string[]
  perfilIdeal: string[]
  precioDesde: string
  reservaUrl: string
  meta: Array<{
    label: string
    kind: "size" | "bed" | "feature" | "wifi" | "tv"
  }>
  imagen: string | null
  imagenes: string[]
  videoHorizontal: string | null
  videoVertical: string | null
}

function extractRoomBedLabel(description: string, lang: HumanoLang): string | null {
  const m = ROOM_META_I18N[lang]
  if (/1 cama King y sofa cama|1 cama King y sofá cama|king-size bed and a two-person sofa bed|king bed and a two-person sofa bed/i.test(description)) {
    return m.kingSofa
  }
  if (/2 camas dobles|two double beds/i.test(description)) {
    return m.twoDoubles
  }
  if (/1 cama King|cama King|king-size bed|king bed/i.test(description)) {
    return m.kingBed
  }
  return null
}

function extractRoomPriorityFeatures(
  roomName: string,
  factualDescription: string,
  lang: HumanoLang
): Array<{ label: string; kind: "feature" }> {
  const m = ROOM_META_I18N[lang]
  const normalizedRoomName = roomName.toLowerCase()
  const features: Array<{ label: string; kind: "feature" }> = []

  if (normalizedRoomName === "family deluxe" && /terraza|terrace/i.test(factualDescription)) {
    features.push({ label: m.terrace, kind: "feature" })
  }

  if (normalizedRoomName === "signature suite") {
    if (/kitchenett|kitchenette/i.test(factualDescription)) {
      features.push({ label: m.kitchenette, kind: "feature" })
    }
    features.push({ label: m.terrace, kind: "feature" })
  }

  return features
}

function extractRoomMeta(
  roomName: string,
  factualDescription: string,
  lang: HumanoLang
): HumanoRoom["meta"] {
  const sizeMatch = factualDescription.match(/(\d+)\s*m(?:²|2)/i)
  const size = sizeMatch ? `${sizeMatch[1]} m²` : null
  const bed = extractRoomBedLabel(factualDescription, lang)
  const priorityFeatures = extractRoomPriorityFeatures(roomName, factualDescription, lang)
  const hasWifi = /wi[\s-]?fi/i.test(factualDescription)
  const hasSmartTv = /smart tv/i.test(factualDescription)

  return [
    size ? { label: size, kind: "size" as const } : null,
    bed ? { label: bed, kind: "bed" as const } : null,
    ...priorityFeatures,
    hasWifi ? { label: "Wi-Fi", kind: "wifi" as const } : null,
    hasSmartTv ? { label: "Smart TV", kind: "tv" as const } : null,
  ].filter(
    (
      value
    ): value is {
      label: string
      kind: "size" | "bed" | "feature" | "wifi" | "tv"
    } => Boolean(value)
  )
}

function shortenRoomDescription(description: string): string {
  const normalized = description.replace(/^Ideal\s+/i, "")
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const SLUG_OVERRIDES: Record<HumanoLang, Record<string, string>> = {
  es: {},
  en: {
    "superior-king": "superior-king",
    "superior-double": "superior-double",
    "deluxe-king": "deluxe-king",
    "accesible-room": "accessible-room",
    "family-room": "family-room",
    "family-deluxe": "family-deluxe",
    "junior-suite": "junior-suite",
    "signature-suite": "signature-suite",
  },
}

export function roomSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function toHumanoRoom(item: ConserjeItem, lang: HumanoLang): HumanoRoom {
  const descripcionExperiencial = item.desc_experiencial || item.desc_factual
  const imagenes = item.imagenes_url?.filter(Boolean) ?? []
  const categoria = CATEGORIA_I18N[lang][item.categoria] ?? item.categoria
  const baseSlug = roomSlug(item.nombre_publico)
  const slug = SLUG_OVERRIDES[lang][baseSlug] ?? baseSlug

  return {
    id: item.id,
    slug,
    nombre: item.nombre_publico,
    descripcion: descripcionExperiencial,
    descripcionExperiencial,
    descripcionFactual: item.desc_factual,
    descripcionCorta: shortenRoomDescription(descripcionExperiencial),
    categoria,
    intenciones: item.intenciones,
    perfilIdeal: item.perfil_ideal,
    precioDesde: item.precio_desde,
    reservaUrl: item.redirigir,
    meta: extractRoomMeta(item.nombre_publico, item.desc_factual, lang),
    imagen: imagenes[0] ?? null,
    imagenes,
    videoHorizontal: item.video_horizontal ?? null,
    videoVertical: item.video_vertical ?? null,
  }
}

export function getHumanoRooms(lang: HumanoLang = "es"): HumanoRoom[] {
  return HUMANO_DATA[lang].items
    .filter((item) => item.tipo === "Habitaciones")
    .map((item) => toHumanoRoom(item, lang))
}

export function getHumanoRoomById(id: string, lang: HumanoLang = "es"): HumanoRoom | null {
  const item = HUMANO_DATA[lang].items.find(
    (entry) => entry.id === id && entry.tipo === "Habitaciones"
  )
  return item ? toHumanoRoom(item, lang) : null
}

export function getHumanoRoomBySlug(slug: string, lang: HumanoLang = "es"): HumanoRoom | null {
  return getHumanoRooms(lang).find((room) => room.slug === slug) ?? null
}
