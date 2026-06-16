import humanoDataRaw from "@/data/humano.json"
import humanoDataRawEn from "@/data/humano-en.json"
import type { ConserjeData, ConserjeItem } from "@/lib/humano/types"
import type { MetaKind } from "@/lib/humano/metaKinds"

export type FacilityLang = "es" | "en"

const HUMANO_DATA: Record<FacilityLang, ConserjeData> = {
  es: humanoDataRaw as ConserjeData,
  en: humanoDataRawEn as ConserjeData,
}

const FACILITY_LABEL_I18N: Record<string, { es: string; en: string }> = {
  Recepción: { es: "Recepción", en: "Reception" },
  "Áreas de espera": { es: "Áreas de espera", en: "Waiting areas" },
  Desayuno: { es: "Desayuno", en: "Breakfast" },
  "En hotel": { es: "En hotel", en: "In hotel" },
  Rooftop: { es: "Rooftop", en: "Rooftop" },
  "Piso 18": { es: "Piso 18", en: "18th floor" },
  Parrillas: { es: "Parrillas", en: "Grill" },
  "Primer piso": { es: "Primer piso", en: "First floor" },
  "Cocina peruana": { es: "Cocina peruana", en: "Peruvian cuisine" },
  "Trabajo flexible": { es: "Trabajo flexible", en: "Flexible work" },
  Conectividad: { es: "Conectividad", en: "Connectivity" },
  Máquinas: { es: "Máquinas", en: "Machines" },
  Rutina: { es: "Rutina", en: "Routine" },
  "Piso 17": { es: "Piso 17", en: "17th floor" },
  Temperada: { es: "Temperada", en: "Heated" },
  Reuniones: { es: "Reuniones", en: "Meetings" },
  Equipadas: { es: "Equipadas", en: "Equipped" },
  Encuentros: { es: "Encuentros", en: "Meetups" },
  Cócteles: { es: "Cócteles", en: "Cocktails" },
}

const FACILITY_CATEGORIA_I18N: Record<FacilityLang, string> = {
  es: "Instalación",
  en: "Facility",
}

function tFacilityLabel(label: string, lang: FacilityLang): string {
  return FACILITY_LABEL_I18N[label]?.[lang] ?? label
}

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
    kind: MetaKind
  }>
  imagen: string | null
  imagenes: string[]
}

export type HumanoFacilityCard = {
  id: string
  slug: string
  nombre: string
  categoria: string
  meta: Array<{
    label: string
    kind: MetaKind
  }>
  descripcion: string
  imagen: string | null
}

const installationOrder = [
  "INST_LOBBY",
  "INST_RESTAURANTE_ENT",
  "INST_RESTAURANTE_CDL",
  "INST_COWORKING",
  "INST_GIMNASIO",
  "INST_PISCINA",
  "INST_SALAS_REUNIONES",
  "INST_BAR",
] as const

const featuredFacilityIds = ["INST_COWORKING", "INST_RESTAURANTE_ENT", "INST_PISCINA"] as const

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
        { label: "Recepción", kind: "reception" as const },
        { label: "Áreas de espera", kind: "seating" as const },
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
        { label: "Piso 18", kind: "floor" as const },
        { label: "Parrillas", kind: "grill" as const },
      ].filter(Boolean) as HumanoFacility["meta"],
  },
  INST_RESTAURANTE_CDL: {
    meta: (item) =>
      [
        getScheduleLabel(item)
          ? { label: getScheduleLabel(item)!, kind: "time" as const }
          : null,
        { label: "Primer piso", kind: "floor" as const },
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
        { label: "Conectividad", kind: "connectivity" as const },
      ].filter(Boolean) as HumanoFacility["meta"],
  },
  INST_GIMNASIO: {
    meta: (item) =>
      [
        getScheduleLabel(item)
          ? { label: getScheduleLabel(item)!, kind: "time" as const }
          : null,
        { label: "Máquinas", kind: "machines" as const },
        { label: "Rutina", kind: "routine" as const },
      ].filter(Boolean) as HumanoFacility["meta"],
  },
  INST_PISCINA: {
    meta: (item) =>
      [
        getScheduleLabel(item)
          ? { label: getScheduleLabel(item)!, kind: "time" as const }
          : null,
        { label: "Piso 17", kind: "floor" as const },
      ].filter(Boolean) as HumanoFacility["meta"],
  },
  INST_SALAS_REUNIONES: {
    meta: (item) =>
      [
        getScheduleLabel(item)
          ? { label: getScheduleLabel(item)!, kind: "time" as const }
          : null,
        { label: "Reuniones", kind: "meeting" as const },
        { label: "Equipadas", kind: "equipped" as const },
      ].filter(Boolean) as HumanoFacility["meta"],
  },
  INST_BAR: {
    meta: () => [
      { label: "Primer piso", kind: "floor" as const },
      { label: "Encuentros", kind: "meeting" as const },
      { label: "Cócteles", kind: "drinks" as const },
    ],
  },
}

function toHumanoFacility(item: ConserjeItem, lang: FacilityLang): HumanoFacility {
  const imagenes = item.imagenes_url?.filter(Boolean) ?? []
  const descripcionExperiencial = item.desc_experiencial || item.desc_factual
  const rawMeta = facilityMetaConfig[item.id]?.meta(item) ?? []
  const meta = rawMeta.slice(0, 3).map((entry) => ({ ...entry, label: tFacilityLabel(entry.label, lang) }))

  return {
    id: item.id,
    slug: slugify(item.nombre_publico),
    nombre: item.nombre_publico,
    categoria: FACILITY_CATEGORIA_I18N[lang],
    descripcionExperiencial,
    descripcionFactual: item.desc_factual,
    descripcionCorta: shortenDescription(descripcionExperiencial),
    intenciones: item.intenciones,
    perfilIdeal: item.perfil_ideal,
    meta,
    imagen: imagenes[0] ?? null,
    imagenes,
  }
}

export function getHumanoFacilities(lang: FacilityLang = "es"): HumanoFacility[] {
  const orderMap = new Map<string, number>(installationOrder.map((id, index) => [id, index]))

  return HUMANO_DATA[lang].items
    .filter((item) => item.tipo === "Instalaciones" && orderMap.has(item.id))
    .sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0))
    .map((item) => toHumanoFacility(item, lang))
}

export function getHumanoFacilityBySlug(slug: string, lang: FacilityLang = "es"): HumanoFacility | null {
  return getHumanoFacilities(lang).find((facility) => facility.slug === slug) ?? null
}

export function getHumanoFeaturedFacilities(lang: FacilityLang = "es"): HumanoFacilityCard[] {
  const facilitiesById = new Map(getHumanoFacilities(lang).map((facility) => [facility.id, facility]))

  return featuredFacilityIds.reduce<HumanoFacilityCard[]>((items, id) => {
    const facility = facilitiesById.get(id)
    if (!facility) return items

    items.push({
      id: facility.id,
      slug: facility.slug,
      nombre: facility.nombre,
      categoria: facility.categoria,
      meta: facility.meta
        .map<HumanoFacilityCard["meta"][number]>((entry) => ({
          label: entry.label,
          kind: entry.kind,
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
