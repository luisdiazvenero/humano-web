import humanoDataRaw from "@/data/humano.json"
import type { ConserjeData } from "@/lib/humano/types"

const humanoData = humanoDataRaw as ConserjeData

export type HumanoRoom = {
  id: string
  slug: string
  nombre: string
  descripcion: string
  imagen: string | null
}

export function roomSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getHumanoRooms(): HumanoRoom[] {
  return humanoData.items
    .filter((item) => item.tipo === "Habitaciones")
    .map((item) => ({
      id: item.id,
      slug: roomSlug(item.nombre_publico),
      nombre: item.nombre_publico,
      descripcion: item.desc_experiencial || item.desc_factual,
      imagen: item.imagenes_url?.[0] ?? null,
    }))
}

export function getHumanoRoomBySlug(slug: string): HumanoRoom | null {
  return getHumanoRooms().find((room) => room.slug === slug) ?? null
}
