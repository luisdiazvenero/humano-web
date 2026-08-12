import type { WebLang } from "@/lib/web/i18n"

export type EventSetupKind =
  | "teatro"
  | "aula"
  | "conferencia"
  | "forma-u"
  | "recepcion"
  | "banquete"
  | "directorio"
  | "coctel"

export type EventSetup = {
  kind: EventSetupKind
  label: string
  capacity: number
}

export type HumanoEventSpace = {
  id: string
  slug: string
  name: string
  description: string
  /** Medidas en texto ya formateado (L × A × H) */
  dimensions: string
  /** Área en metros cuadrados, ya formateada */
  area: string
  setups: EventSetup[]
  /** Nota opcional bajo los armados (p. ej. armados versátiles a solicitud) */
  note: string | null
  /** Si queda vacío, el slider muestra placeholders grises */
  images: string[]
}

const IMAGES: Record<string, string[]> = {
  "sala-balta": [
    "/chatbot/imagenes/eventos/sala_balta/balta_auditorio.webp",
    "/chatbot/imagenes/eventos/sala_balta/balta_banquete.webp",
    "/chatbot/imagenes/eventos/sala_balta/balta_lounge.webp",
  ],
  "directorio-paniagua": [
    "/chatbot/imagenes/eventos/directorio_paniagua/paniagua_directorio.webp",
    "/chatbot/imagenes/eventos/directorio_paniagua/paniagua_mesa_larga.webp",
    "/chatbot/imagenes/eventos/directorio_paniagua/paniagua_auditorio.webp",
  ],
  "directorio-granada": [
    "/chatbot/imagenes/eventos/directorio_granada/granada_directorio.webp",
  ],
  "terraza-piso-9": ["/chatbot/imagenes/eventos/terraza_piso_9/piso_9_yoga.webp"],
  "terraza-entranable": [
    "/chatbot/imagenes/eventos/terraza_entranable/entranable_coctel.webp",
    "/chatbot/imagenes/eventos/terraza_entranable/entranable_terraza.webp",
    "/chatbot/imagenes/eventos/terraza_entranable/entranable_cena.webp",
    "/chatbot/imagenes/eventos/terraza_entranable/entranable_noche.webp",
    "/chatbot/imagenes/eventos/terraza_entranable/entranable_catering.webp",
  ],
}

export const EVENTS_CONTACT = {
  email: "lgonzales@humanohoteles.com",
  whatsapp: "https://wa.me/51934300993",
  whatsappLabel: "+51 934 300 993",
} as const

/** Las imágenes se resuelven por id en getHumanoEventSpaces (son las mismas en ES y EN). */
const EVENT_SPACES: Record<WebLang, Array<Omit<HumanoEventSpace, "images">>> = {
  es: [
    {
      id: "sala-balta",
      slug: "sala-balta",
      name: "Sala Balta",
      description:
        "Nuestro salón principal, versátil y con equipamiento audiovisual, se adapta a conferencias, capacitaciones y celebraciones en pleno Malecón Balta.",
      dimensions: "7.0 × 7.4 × 2.7 m",
      area: "51.7 m²",
      setups: [
        { kind: "teatro", label: "Teatro", capacity: 50 },
        { kind: "aula", label: "Aula", capacity: 35 },
        { kind: "conferencia", label: "Conferencia", capacity: 50 },
        { kind: "forma-u", label: "Disposición en U", capacity: 20 },
        { kind: "recepcion", label: "Recepción", capacity: 50 },
        { kind: "banquete", label: "Banquete", capacity: 40 },
      ],
      note: null,
    },
    {
      id: "terraza-entranable",
      slug: "terraza-entranable",
      name: "Terraza Entrañable",
      description:
        "Una terraza cálida y versátil para reuniones sociales, cenas y celebraciones que piden un ambiente más cercano.",
      dimensions: "8.14 × 9.36 m",
      area: "76.19 m²",
      setups: [
        { kind: "coctel", label: "Coctel", capacity: 50 },
        { kind: "banquete", label: "Banquete", capacity: 40 },
      ],
      note: "Armados versátiles según tu solicitud.",
    },
    {
      id: "terraza-piso-9",
      slug: "terraza-piso-9",
      name: "Terraza Piso 9",
      description:
        "Terraza al aire libre en el piso 9, con vista abierta a Miraflores. Perfecta para cocteles, lanzamientos y celebraciones al atardecer.",
      dimensions: "14 × 5 m",
      area: "70 m²",
      setups: [{ kind: "coctel", label: "Coctel", capacity: 35 }],
      note: "Armados versátiles: armados especiales según tu solicitud.",
    },
    {
      id: "directorio-paniagua",
      slug: "directorio-paniagua",
      name: "Directorio Paniagua",
      description:
        "Sala de directorio pensada para reuniones ejecutivas: mesa única, privacidad total y todo lo necesario para trabajar sin interrupciones.",
      dimensions: "5.7 × 3.5 × 2.7 m",
      area: "19.9 m²",
      setups: [{ kind: "directorio", label: "Directorio", capacity: 10 }],
      note: null,
    },
    {
      id: "directorio-granada",
      slug: "directorio-granada",
      name: "Directorio Granada",
      description:
        "Un espacio reservado para encuentros de trabajo reducidos, ideal para entrevistas, comités y sesiones de estrategia.",
      dimensions: "5.1 × 3.5 × 2.4 m",
      area: "17.8 m²",
      setups: [{ kind: "directorio", label: "Directorio", capacity: 8 }],
      note: null,
    },
  ],
  en: [
    {
      id: "sala-balta",
      slug: "balta-room",
      name: "Balta Room",
      description:
        "Our main room: versatile, fully equipped with audiovisual gear, and ready for conferences, training sessions, and celebrations right on Malecón Balta.",
      dimensions: "7.0 × 7.4 × 2.7 m",
      area: "51.7 m²",
      setups: [
        { kind: "teatro", label: "Theater", capacity: 50 },
        { kind: "aula", label: "Classroom", capacity: 35 },
        { kind: "conferencia", label: "Conference", capacity: 50 },
        { kind: "forma-u", label: "U-shape", capacity: 20 },
        { kind: "recepcion", label: "Reception", capacity: 50 },
        { kind: "banquete", label: "Banquet", capacity: 40 },
      ],
      note: null,
    },
    {
      id: "terraza-entranable",
      slug: "entranable-terrace",
      name: "Entrañable Terrace",
      description:
        "A warm, versatile terrace for social gatherings, dinners, and celebrations that call for a closer atmosphere.",
      dimensions: "8.14 × 9.36 m",
      area: "76.19 m²",
      setups: [
        { kind: "coctel", label: "Cocktail", capacity: 50 },
        { kind: "banquete", label: "Banquet", capacity: 40 },
      ],
      note: "Versatile setups on request.",
    },
    {
      id: "terraza-piso-9",
      slug: "9th-floor-terrace",
      name: "9th Floor Terrace",
      description:
        "An open-air terrace on the 9th floor with wide views over Miraflores. Perfect for cocktails, launches, and sunset celebrations.",
      dimensions: "14 × 5 m",
      area: "70 m²",
      setups: [{ kind: "coctel", label: "Cocktail", capacity: 35 }],
      note: "Versatile setups: custom arrangements on request.",
    },
    {
      id: "directorio-paniagua",
      slug: "paniagua-boardroom",
      name: "Paniagua Boardroom",
      description:
        "A boardroom designed for executive meetings: a single table, complete privacy, and everything you need to work without interruptions.",
      dimensions: "5.7 × 3.5 × 2.7 m",
      area: "19.9 m²",
      setups: [{ kind: "directorio", label: "Boardroom", capacity: 10 }],
      note: null,
    },
    {
      id: "directorio-granada",
      slug: "granada-boardroom",
      name: "Granada Boardroom",
      description:
        "A private space for smaller work sessions, ideal for interviews, committees, and strategy meetings.",
      dimensions: "5.1 × 3.5 × 2.4 m",
      area: "17.8 m²",
      setups: [{ kind: "directorio", label: "Boardroom", capacity: 8 }],
      note: null,
    },
  ],
}

export function getHumanoEventSpaces(lang: WebLang = "es"): HumanoEventSpace[] {
  return EVENT_SPACES[lang].map((space) => ({
    ...space,
    images: IMAGES[space.id] ?? [],
  }))
}

export type EventsStats = {
  spaces: number
  totalArea: number
  maxCapacity: number
  setupKinds: number
}

/** Cifras del hero, derivadas de los espacios para que nunca queden desfasadas. */
export function getHumanoEventsStats(lang: WebLang = "es"): EventsStats {
  const spaces = getHumanoEventSpaces(lang)
  const totalArea = spaces.reduce((sum, space) => sum + Number.parseFloat(space.area), 0)
  const maxCapacity = spaces.reduce(
    (max, space) => Math.max(max, ...space.setups.map((setup) => setup.capacity)),
    0
  )
  const setupKinds = new Set(spaces.flatMap((space) => space.setups.map((s) => s.kind))).size

  return {
    spaces: spaces.length,
    totalArea: Math.round(totalArea),
    maxCapacity,
    setupKinds,
  }
}
