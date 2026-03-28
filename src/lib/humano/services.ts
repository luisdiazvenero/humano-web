import humanoDataRaw from "@/data/humano.json"
import type { ConserjeData, ConserjeItem } from "@/lib/humano/types"

const humanoData = humanoDataRaw as ConserjeData

export type HumanoService = {
  id: string
  slug: string
  nombre: string
  categoria: string
  descripcionExperiencial: string
  descripcionFactual: string
  descripcionCorta: string
  intenciones: string[]
  perfilIdeal: string[]
  meta: Array<{
    label: string
    kind:
      | "transport"
      | "pet"
      | "food"
      | "laundry"
      | "parking"
      | "wifi"
      | "cleaning"
      | "concierge"
      | "price"
      | "feature"
  }>
  imagen: string | null
  imagenes: string[]
  redirigir: string
  ctas: string[]
  frasesSugeridas: string[]
  condicionesServicio: string[]
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function shortenDescription(description: string): string {
  const normalized = description.replace(/^Ideal\s+/i, "")
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const serviceAudienceOverrides: Record<
  string,
  { intenciones?: string[]; perfiles?: string[] }
> = {
  "Transfer aeropuerto": {
    intenciones: ["Trabajo", "Descanso", "Aventura"],
    perfiles: ["solo", "pareja", "grupo", "familia"],
  },
  "Dog friendly": {
    intenciones: ["Descanso", "Aventura"],
    perfiles: ["solo", "pareja", "familia"],
  },
  "Room service": {
    intenciones: ["Trabajo", "Descanso"],
    perfiles: ["solo", "pareja", "familia"],
  },
  Lavandería: {
    intenciones: ["Trabajo", "Descanso"],
    perfiles: ["solo", "pareja", "grupo", "familia"],
  },
  Estacionamiento: {
    intenciones: ["Trabajo", "Descanso", "Aventura"],
    perfiles: ["solo", "pareja", "grupo", "familia"],
  },
  "Wi‑Fi": {
    intenciones: ["Trabajo", "Descanso", "Aventura"],
    perfiles: ["solo", "pareja", "grupo", "familia"],
  },
  "Limpieza de habitación": {
    intenciones: ["Trabajo", "Descanso"],
    perfiles: ["solo", "pareja", "grupo", "familia"],
  },
  "Asistencia y concierge": {
    intenciones: ["Trabajo", "Descanso", "Aventura"],
    perfiles: ["solo", "pareja", "grupo", "familia"],
  },
}

function extractServiceMeta(item: ConserjeItem): HumanoService["meta"] {
  const factual = item.desc_factual
  const name = item.nombre_publico

  if (name === "Transfer aeropuerto") {
    return [
      { label: "Traslado privado", kind: "transport" },
      { label: "Aeropuerto", kind: "feature" },
      { label: "US$37", kind: "price" },
    ]
  }

  if (name === "Dog friendly") {
    return [
      { label: "Pet friendly", kind: "pet" },
      { label: "Hasta 15 kg", kind: "feature" },
      { label: "US$35++", kind: "price" },
    ]
  }

  if (name === "Room service") {
    return [
      { label: "A&B", kind: "food" },
      { label: "En habitación", kind: "feature" },
    ]
  }

  if (name === "Lavandería") {
    return [
      { label: "Regular", kind: "laundry" },
      { label: "Express", kind: "laundry" },
      { label: "Con costo", kind: "price" },
    ]
  }

  if (name === "Estacionamiento") {
    return [
      { label: "40 espacios", kind: "parking" },
      { label: "3 sótanos", kind: "feature" },
      { label: "Van", kind: "feature" },
    ]
  }

  if (name === "Wi‑Fi") {
    return [
      { label: "Todo el hotel", kind: "wifi" },
      { label: "Conectividad", kind: "feature" },
    ]
  }

  if (name === "Limpieza de habitación") {
    return [
      { label: "Servicio regular", kind: "cleaning" },
      { label: "En habitación", kind: "feature" },
    ]
  }

  if (name === "Asistencia y concierge") {
    return [
      { label: "Recepción", kind: "concierge" },
      { label: "Orientación", kind: "feature" },
    ]
  }

  const inferred: HumanoService["meta"] = []

  if (/wifi/i.test(factual)) inferred.push({ label: "Wi-Fi", kind: "wifi" })

  return inferred
}

function toHumanoService(item: ConserjeItem): HumanoService {
  const override = serviceAudienceOverrides[item.nombre_publico]
  const imagenes = item.imagenes_url?.filter(Boolean) ?? []

  return {
    id: item.id,
    slug: slugify(item.nombre_publico),
    nombre: item.nombre_publico,
    categoria: item.categoria,
    descripcionExperiencial: item.desc_experiencial || item.desc_factual,
    descripcionFactual: item.desc_factual,
    descripcionCorta: shortenDescription(item.desc_experiencial || item.desc_factual),
    intenciones: override?.intenciones ?? item.intenciones,
    perfilIdeal: override?.perfiles ?? item.perfil_ideal,
    meta: extractServiceMeta(item),
    imagen: imagenes[0] ?? null,
    imagenes,
    redirigir: item.redirigir,
    ctas: item.ctas ?? [],
    frasesSugeridas: item.frases_sugeridas ?? [],
    condicionesServicio: item.condiciones_servicio ?? [],
  }
}

export function getHumanoServices(): HumanoService[] {
  return humanoData.items
    .filter((item) => item.tipo === "Servicios")
    .map(toHumanoService)
}

export function getHumanoServiceBySlug(slug: string): HumanoService | null {
  return getHumanoServices().find((service) => service.slug === slug) ?? null
}
