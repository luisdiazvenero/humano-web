import humanoDataRaw from "@/data/humano.json"
import type { ConserjeData, ConserjeItem } from "@/lib/humano/types"

const humanoData = humanoDataRaw as ConserjeData

export type HumanoFacility = {
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
      | "time"
      | "breakfast"
      | "food"
      | "work"
      | "wellness"
      | "meeting"
      | "feature"
  }>
  imagen: string | null
  imagenes: string[]
}

export type HumanoFacilityCard = {
  id: string
  nombre: string
  categoria: string
  meta: Array<{
    label: string
    kind: "time" | "feature"
  }>
  descripcion: string
  imagen: string | null
}

const installationOrder = [
  "INST_LOBBY",
  "INST_DESAYUNO",
  "INST_RESTAURANTE_ENT",
  "INST_RESTAURANTE_CDL",
  "INST_COWORKING",
  "INST_GIMNASIO",
  "INST_PISCINA",
  "INST_SALAS_REUNIONES",
  "INST_BAR",
] as const

const featuredFacilityIds = ["INST_LOBBY", "INST_RESTAURANTE_ENT", "INST_PISCINA"] as const

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

function getScheduleLabel(item: ConserjeItem): string | null {
  if (item.horario_apertura === "24h" && item.horario_cierre === "24h") {
    return "24h"
  }

  if (item.horario_apertura && item.horario_cierre) {
    return `${item.horario_apertura} - ${item.horario_cierre}`
  }

  return null
}

const facilityMetaConfig: Record<
  string,
  {
    meta: (item: ConserjeItem) => HumanoFacility["meta"]
  }
> = {
  INST_LOBBY: {
    meta: (item) =>
      [
        getScheduleLabel(item)
          ? { label: getScheduleLabel(item)!, kind: "time" as const }
          : null,
        { label: "Recepción", kind: "feature" as const },
        { label: "Áreas de espera", kind: "feature" as const },
      ].filter(Boolean) as HumanoFacility["meta"],
  },
  INST_DESAYUNO: {
    meta: (item) =>
      [
        getScheduleLabel(item)
          ? { label: getScheduleLabel(item)!, kind: "time" as const }
          : null,
        { label: "Desayuno", kind: "breakfast" as const },
        { label: "En hotel", kind: "feature" as const },
      ].filter(Boolean) as HumanoFacility["meta"],
  },
  INST_RESTAURANTE_ENT: {
    meta: (item) =>
      [
        getScheduleLabel(item)
          ? { label: getScheduleLabel(item)!, kind: "time" as const }
          : null,
        { label: "Rooftop", kind: "food" as const },
        { label: "Parrillas", kind: "food" as const },
      ].filter(Boolean) as HumanoFacility["meta"],
  },
  INST_RESTAURANTE_CDL: {
    meta: (item) =>
      [
        getScheduleLabel(item)
          ? { label: getScheduleLabel(item)!, kind: "time" as const }
          : null,
        { label: "Primer piso", kind: "food" as const },
        { label: "Cocina peruana", kind: "food" as const },
      ].filter(Boolean) as HumanoFacility["meta"],
  },
  INST_COWORKING: {
    meta: (item) =>
      [
        getScheduleLabel(item)
          ? { label: getScheduleLabel(item)!, kind: "time" as const }
          : null,
        { label: "Trabajo flexible", kind: "work" as const },
        { label: "Conectividad", kind: "work" as const },
      ].filter(Boolean) as HumanoFacility["meta"],
  },
  INST_GIMNASIO: {
    meta: (item) =>
      [
        getScheduleLabel(item)
          ? { label: getScheduleLabel(item)!, kind: "time" as const }
          : null,
        { label: "Máquinas", kind: "wellness" as const },
        { label: "Rutina", kind: "wellness" as const },
      ].filter(Boolean) as HumanoFacility["meta"],
  },
  INST_PISCINA: {
    meta: (item) =>
      [
        getScheduleLabel(item)
          ? { label: getScheduleLabel(item)!, kind: "time" as const }
          : null,
        { label: "Piso 17", kind: "wellness" as const },
        { label: "Temperada", kind: "wellness" as const },
      ].filter(Boolean) as HumanoFacility["meta"],
  },
  INST_SALAS_REUNIONES: {
    meta: (item) =>
      [
        getScheduleLabel(item)
          ? { label: getScheduleLabel(item)!, kind: "time" as const }
          : null,
        { label: "Reuniones", kind: "meeting" as const },
        { label: "Equipadas", kind: "meeting" as const },
      ].filter(Boolean) as HumanoFacility["meta"],
  },
  INST_BAR: {
    meta: () => [
      { label: "Primer piso", kind: "food" as const },
      { label: "Encuentros", kind: "feature" as const },
      { label: "Cervezas", kind: "food" as const },
    ],
  },
}

function toHumanoFacility(item: ConserjeItem): HumanoFacility {
  const imagenes = item.imagenes_url?.filter(Boolean) ?? []
  const descripcionExperiencial = item.desc_experiencial || item.desc_factual

  return {
    id: item.id,
    slug: slugify(item.nombre_publico),
    nombre: item.nombre_publico,
    categoria: item.categoria || "Instalación",
    descripcionExperiencial,
    descripcionFactual: item.desc_factual,
    descripcionCorta: shortenDescription(descripcionExperiencial),
    intenciones: item.intenciones,
    perfilIdeal: item.perfil_ideal,
    meta: (facilityMetaConfig[item.id]?.meta(item) ?? []).slice(0, 3),
    imagen: imagenes[0] ?? null,
    imagenes,
  }
}

export function getHumanoFacilities(): HumanoFacility[] {
  const orderMap = new Map<string, number>(installationOrder.map((id, index) => [id, index]))

  return humanoData.items
    .filter((item) => item.tipo === "Instalaciones" && orderMap.has(item.id))
    .sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0))
    .map(toHumanoFacility)
}

export function getHumanoFacilityBySlug(slug: string): HumanoFacility | null {
  return getHumanoFacilities().find((facility) => facility.slug === slug) ?? null
}

export function getHumanoFeaturedFacilities(): HumanoFacilityCard[] {
  const facilitiesById = new Map(getHumanoFacilities().map((facility) => [facility.id, facility]))

  return featuredFacilityIds.reduce<HumanoFacilityCard[]>((items, id) => {
    const facility = facilitiesById.get(id)
    if (!facility) return items

    items.push({
      id: facility.id,
      nombre: facility.nombre,
      categoria: facility.categoria,
      meta: facility.meta
        .map<HumanoFacilityCard["meta"][number]>((entry) => ({
          label: entry.label,
          kind: entry.kind === "time" ? "time" : "feature",
        }))
        .slice(0, 2),
      descripcion:
        id === "INST_RESTAURANTE_ENT"
          ? facility.descripcionFactual
          : facility.descripcionExperiencial,
      imagen: facility.imagen,
    })

    return items
  }, [])
}
