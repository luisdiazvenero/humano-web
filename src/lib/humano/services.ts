import humanoDataRaw from "@/data/humano.json"
import humanoDataRawEn from "@/data/humano-en.json"
import type { ConserjeData, ConserjeItem } from "@/lib/humano/types"
import type { MetaKind } from "@/lib/humano/metaKinds"

export type ServiceLang = "es" | "en"
const HUMANO_DATA: Record<ServiceLang, ConserjeData> = {
  es: humanoDataRaw as ConserjeData,
  en: humanoDataRawEn as ConserjeData,
}
const SERVICE_CATEGORIA_I18N: Record<ServiceLang, string> = {
  es: "Servicio",
  en: "Service",
}

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
    kind: MetaKind
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
  "Local Expert": {
    intenciones: ["Trabajo", "Descanso", "Aventura"],
    perfiles: ["solo", "pareja", "grupo", "familia"],
  },
}

const SERVICE_META: Record<string, Record<ServiceLang, HumanoService["meta"]>> = {
  INST_DESAYUNO: {
    es: [
      { label: "Buffet", kind: "food" },
      { label: "Piso 1", kind: "floor" },
      { label: "06:30 – 10:30 hrs", kind: "time" },
    ],
    en: [
      { label: "Buffet", kind: "food" },
      { label: "First floor", kind: "floor" },
      { label: "6:30 – 10:30 AM", kind: "time" },
    ],
  },
  SERV_MASCOTAS: {
    es: [
      { label: "Pet friendly", kind: "pet" },
      { label: "Hasta 15 kg", kind: "weight" },
      { label: "US$35++", kind: "price" },
    ],
    en: [
      { label: "Pet friendly", kind: "pet" },
      { label: "Up to 15 kg", kind: "weight" },
      { label: "US$35++", kind: "price" },
    ],
  },
  SERV_ROOM_SERVICE: {
    es: [
      { label: "A&B", kind: "food" },
      { label: "En habitación", kind: "room" },
      { label: "Disponible 24 horas", kind: "time" },
    ],
    en: [
      { label: "F&B", kind: "food" },
      { label: "In-room", kind: "room" },
      { label: "Available 24 hours", kind: "time" },
    ],
  },
  SERV_TRANSFER_AEROPUERTO: {
    es: [
      { label: "Traslado privado", kind: "transport" },
      { label: "Aeropuerto", kind: "airport" },
      { label: "US$37", kind: "price" },
    ],
    en: [
      { label: "Private transfer", kind: "transport" },
      { label: "Airport", kind: "airport" },
      { label: "US$37", kind: "price" },
    ],
  },
  SERV_WIFI: {
    es: [
      { label: "Todo el hotel", kind: "wifi" },
      { label: "Conectividad", kind: "connectivity" },
    ],
    en: [
      { label: "Whole hotel", kind: "wifi" },
      { label: "Connectivity", kind: "connectivity" },
    ],
  },
  SERV_LAVANDERIA: {
    es: [
      { label: "Regular", kind: "laundry" },
      { label: "Express", kind: "wash" },
      { label: "Con costo", kind: "price" },
    ],
    en: [
      { label: "Regular", kind: "laundry" },
      { label: "Express", kind: "wash" },
      { label: "Paid", kind: "price" },
    ],
  },
  SERV_ESTACIONAMIENTO: {
    es: [
      { label: "40 espacios", kind: "parking" },
      { label: "2 sótanos", kind: "floor" },
      { label: "Van", kind: "vehicle" },
    ],
    en: [
      { label: "40 spaces", kind: "parking" },
      { label: "2 basement levels", kind: "floor" },
      { label: "Van", kind: "vehicle" },
    ],
  },
  SERV_LIMPIEZA: {
    es: [
      { label: "Servicio regular", kind: "cleaning" },
      { label: "En habitación", kind: "room" },
    ],
    en: [
      { label: "Regular service", kind: "cleaning" },
      { label: "In-room", kind: "room" },
    ],
  },
  SERV_CONCIERGE: {
    es: [
      { label: "Recepción", kind: "reception" },
      { label: "Orientación", kind: "guidance" },
    ],
    en: [
      { label: "Front desk", kind: "reception" },
      { label: "Guidance", kind: "guidance" },
    ],
  },
}

function extractServiceMeta(item: ConserjeItem, lang: ServiceLang): HumanoService["meta"] {
  return SERVICE_META[item.id]?.[lang] ?? []
}

function toHumanoService(item: ConserjeItem, lang: ServiceLang): HumanoService {
  const override = serviceAudienceOverrides[item.nombre_publico]
  const imagenes = item.imagenes_url?.filter(Boolean) ?? []

  return {
    id: item.id,
    slug: slugify(item.nombre_publico),
    nombre: item.nombre_publico,
    categoria: SERVICE_CATEGORIA_I18N[lang],
    descripcionExperiencial: item.desc_experiencial || item.desc_factual,
    descripcionFactual: item.desc_factual,
    descripcionCorta: shortenDescription(item.desc_experiencial || item.desc_factual),
    intenciones: override?.intenciones ?? item.intenciones,
    perfilIdeal: override?.perfiles ?? item.perfil_ideal,
    meta: extractServiceMeta(item, lang),
    imagen: imagenes[0] ?? null,
    imagenes,
    redirigir: item.redirigir,
    ctas: item.ctas ?? [],
    frasesSugeridas: item.frases_sugeridas ?? [],
    condicionesServicio: item.condiciones_servicio ?? [],
  }
}

// Desayuno se muestra como servicio en la web (sigue siendo Instalación para el conserje).
const serviceOrder = [
  "INST_DESAYUNO",
  "SERV_MASCOTAS",
  "SERV_ROOM_SERVICE",
  "SERV_TRANSFER_AEROPUERTO",
  "SERV_WIFI",
  "SERV_LAVANDERIA",
  "SERV_ESTACIONAMIENTO",
  "SERV_LIMPIEZA",
  "SERV_CONCIERGE",
] as const

export function getHumanoServices(lang: ServiceLang = "es"): HumanoService[] {
  const orderMap = new Map<string, number>(serviceOrder.map((id, index) => [id, index]))

  return HUMANO_DATA[lang].items
    .filter((item) => item.tipo === "Servicios" || item.id === "INST_DESAYUNO")
    .sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999))
    .map((item) => toHumanoService(item, lang))
}

export function getHumanoServiceBySlug(slug: string, lang: ServiceLang = "es"): HumanoService | null {
  return getHumanoServices(lang).find((service) => service.slug === slug) ?? null
}
