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
  meta: Array<{
    label: string
    kind: "size" | "bed" | "feature"
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

function extractRoomFeatureLabel(description: string): string | null {
  if (/sala de estar separada/i.test(description)) {
    return "Sala separada"
  }
  if (/area de estar|área de estar/i.test(description)) {
    return "Área de estar"
  }
  if (/ducha accesible/i.test(description)) {
    return "Ducha accesible"
  }
  if (/banera y ducha|bañera y ducha/i.test(description)) {
    return "Bañera + ducha"
  }
  if (/ventanas insonorizadas/i.test(description)) {
    return "Insonorizada"
  }
  if (/escritorio/i.test(description)) {
    return "Escritorio"
  }
  return null
}

function extractRoomMeta(description: string): HumanoRoom["meta"] {
  const sizeMatch = description.match(/(\d+)\s*m²/i)
  const size = sizeMatch ? `${sizeMatch[1]} m²` : null
  const bed = extractRoomBedLabel(description)
  const feature = extractRoomFeatureLabel(description)

  return [
    size ? { label: size, kind: "size" as const } : null,
    bed ? { label: bed, kind: "bed" as const } : null,
    feature ? { label: feature, kind: "feature" as const } : null,
  ].filter(
    (
      value
    ): value is {
      label: string
      kind: "size" | "bed" | "feature"
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
    meta: extractRoomMeta(item.desc_factual),
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
