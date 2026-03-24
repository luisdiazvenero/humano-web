import humanoDataRaw from "@/data/humano.json"
import type { ConserjeData, ConserjeItem } from "@/lib/humano/types"

const humanoData = humanoDataRaw as ConserjeData

export type HumanoRoom = {
  id: string
  slug: string
  nombre: string
  descripcion: string
  descripcionCorta: string
  categoria: string
  intenciones: string[]
  perfilIdeal: string[]
  meta: Array<{
    label: string
    kind: "size" | "bed" | "feature" | "wifi" | "tv"
  }>
  imagen: string | null
}

function extractRoomBedLabel(description: string): string | null {
  if (/1 cama King y sofa cama|1 cama King y sofá cama/i.test(description)) {
    return "King + sofá cama"
  }
  if (/2 camas dobles/i.test(description)) {
    return "2 camas dobles"
  }
  if (/1 cama King|cama King/i.test(description)) {
    return "Cama King"
  }
  return null
}

function extractRoomPriorityFeatures(
  roomName: string,
  factualDescription: string
): Array<{ label: string; kind: "feature" }> {
  const normalizedRoomName = roomName.toLowerCase()
  const features: Array<{ label: string; kind: "feature" }> = []

  if (normalizedRoomName === "family deluxe" && /terraza/i.test(factualDescription)) {
    features.push({ label: "Terraza", kind: "feature" })
  }

  if (normalizedRoomName === "signature suite") {
    if (/kitchenett|kitchenette/i.test(factualDescription)) {
      features.push({ label: "Kitchenet", kind: "feature" })
    }
    features.push({ label: "Terraza", kind: "feature" })
  }

  return features
}

function extractRoomMeta(
  roomName: string,
  factualDescription: string
): HumanoRoom["meta"] {
  const sizeMatch = factualDescription.match(/(\d+)\s*m(?:²|2)/i)
  const size = sizeMatch ? `${sizeMatch[1]} m²` : null
  const bed = extractRoomBedLabel(factualDescription)
  const priorityFeatures = extractRoomPriorityFeatures(roomName, factualDescription)
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

export function roomSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function toHumanoRoom(item: ConserjeItem): HumanoRoom {
  return {
    id: item.id,
    slug: roomSlug(item.nombre_publico),
    nombre: item.nombre_publico,
    descripcion: item.desc_experiencial || item.desc_factual,
    descripcionCorta: shortenRoomDescription(
      item.desc_experiencial || item.desc_factual
    ),
    categoria: item.categoria,
    intenciones: item.intenciones,
    perfilIdeal: item.perfil_ideal,
    meta: extractRoomMeta(item.nombre_publico, item.desc_factual),
    imagen: item.imagenes_url?.[0] ?? null,
  }
}

export function getHumanoRooms(): HumanoRoom[] {
  return humanoData.items
    .filter((item) => item.tipo === "Habitaciones")
    .map(toHumanoRoom)
}

export function getHumanoRoomById(id: string): HumanoRoom | null {
  const item = humanoData.items.find(
    (entry) => entry.id === id && entry.tipo === "Habitaciones"
  )
  return item ? toHumanoRoom(item) : null
}

export function getHumanoRoomBySlug(slug: string): HumanoRoom | null {
  return getHumanoRooms().find((room) => room.slug === slug) ?? null
}
