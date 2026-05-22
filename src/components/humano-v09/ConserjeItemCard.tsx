"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import type { ConserjeItem, ConserjeItemType } from "@/lib/humano/types"
import {
  CalendarCheck2,
  BedDouble,
  Building2,
  CalendarClock,
  Clock3,
  ConciergeBell,
  DollarSign,
  MapPin,
  Sparkles,
  X,
  ZoomIn,
} from "lucide-react"

type CardLang = "es" | "en"

interface ConserjeItemCardProps {
  item: ConserjeItem
  onAction?: (action: string, item: ConserjeItem) => void
  lang?: CardLang
}

const TYPE_META: Record<CardLang, Record<ConserjeItemType, { label: string; Icon: typeof BedDouble }>> = {
  es: {
    Habitaciones: { label: "Habitaciones", Icon: BedDouble },
    Servicios: { label: "Servicios", Icon: ConciergeBell },
    Instalaciones: { label: "Instalaciones", Icon: Building2 },
    Recomendaciones_Locales: { label: "Recomendaciones locales", Icon: MapPin },
  },
  en: {
    Habitaciones: { label: "Rooms", Icon: BedDouble },
    Servicios: { label: "Services", Icon: ConciergeBell },
    Instalaciones: { label: "Facilities", Icon: Building2 },
    Recomendaciones_Locales: { label: "Local recommendations", Icon: MapPin },
  },
}

const CARD_I18N: Record<CardLang, {
  idealFor: string
  schedule: string
  checkInOut: string
  from: string
  to: string
  viewLocation: string
  viewPhoto: string
  bookNow: string
  coordinateService: string
  exploreSpaces: string
  reviewAvailability: string
  seeOtherRooms: string
}> = {
  es: {
    idealFor: "Ideal para:",
    schedule: "Horario:",
    checkInOut: "Check-in/out:",
    from: "Desde:",
    to: "a",
    viewLocation: "Ver ubicación en mapa",
    viewPhoto: "Ver foto completa",
    bookNow: "Reservar ahora",
    coordinateService: "Coordinar servicio",
    exploreSpaces: "Conocer más ambientes",
    reviewAvailability: "Revisar disponibilidad",
    seeOtherRooms: "Ver otras habitaciones",
  },
  en: {
    idealFor: "Ideal for:",
    schedule: "Hours:",
    checkInOut: "Check-in/out:",
    from: "From:",
    to: "to",
    viewLocation: "View on map",
    viewPhoto: "View full photo",
    bookNow: "Book now",
    coordinateService: "Coordinate service",
    exploreSpaces: "Explore other spaces",
    reviewAvailability: "Check availability",
    seeOtherRooms: "See other rooms",
  },
}

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim()

const ensureSentence = (value: string) => {
  const normalized = normalizeText(value)
  if (!normalized) return ""
  if (/[.!?…]$/.test(normalized)) return normalized
  return `${normalized}.`
}

type FactualBlock =
  | { type: "header"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }

const parseFactualDescription = (value: string): FactualBlock[] => {
  if (!value) return []
  const lines = value.split(/\r?\n+/).map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return []

  const blocks: FactualBlock[] = []
  let currentList: string[] | null = null

  for (const line of lines) {
    const numberedMatch = line.match(/^\d+\.\s*(.+)$/)
    if (numberedMatch) {
      if (!currentList) {
        currentList = []
        blocks.push({ type: "list", items: currentList })
      }
      currentList.push(numberedMatch[1])
      continue
    }
    currentList = null
    if (/:$/.test(line)) {
      blocks.push({ type: "header", text: line })
    } else {
      blocks.push({ type: "paragraph", text: line })
    }
  }

  return blocks
}

const TAG_I18N: Record<CardLang, Record<string, string>> = {
  es: {
    con_costo: "Con costo",
    sin_costo: "Sin costo",
    tercerizado: "Tercerizado",
    disponibilidad_variable: "Disponibilidad variable",
    condiciones_especiales: "Condiciones especiales",
    coordinacion_previa: "Coordinación previa",
    incluido: "Incluido",
  },
  en: {
    con_costo: "Extra fee",
    sin_costo: "No fee",
    tercerizado: "Third-party",
    disponibilidad_variable: "Limited availability",
    condiciones_especiales: "Special conditions",
    coordinacion_previa: "Advance request",
    incluido: "Included",
  },
}

const formatTag = (value: string, lang: CardLang = "es") => {
  const normalized = normalizeText(value).toLowerCase()
  if (!normalized) return ""
  const key = normalized.replace(/\s+/g, "_")
  if (TAG_I18N[lang][key]) return TAG_I18N[lang][key]
  const spaced = normalized.replace(/[_-]+/g, " ")
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

const resolveImage = (item: ConserjeItem) => {
  const candidate = item.imagenes_url?.find((url) => {
    const trimmed = normalizeText(url)
    return trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")
  })
  return candidate ? normalizeText(candidate) : null
}

const normalizeExternalUrl = (url: string) => {
  const trimmed = normalizeText(url)
  if (!trimmed) return ""
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("mailto:")) {
    return trimmed
  }
  return `https://${trimmed}`
}

const normalizeRoomActionLabel = (value: string, lang: CardLang = "es") => {
  const t = CARD_I18N[lang]
  const normalized = normalizeText(value).toLowerCase()
  if (normalized.includes("reserv") || normalized.includes("book") || normalized.includes("availability") || normalized.includes("check availability")) {
    return t.reviewAvailability
  }
  if (normalized.includes("ver otras") || normalized.includes("otras habitaciones") || normalized.includes("see other rooms") || normalized.includes("other rooms")) {
    return t.seeOtherRooms
  }
  return value
}

const normalizeActionLabel = (value: string, item: ConserjeItem, lang: CardLang = "es") => {
  const t = CARD_I18N[lang]
  const normalized = normalizeText(value).toLowerCase()
  if (item.tipo === "Habitaciones" && (normalized.includes("reserv") || normalized.includes("book") || normalized.includes("availability"))) {
    return t.reviewAvailability
  }
  if (item.tipo === "Servicios" && (normalized.includes("coordinar") || normalized.includes("reserv") || normalized.includes("coordinate"))) {
    return t.coordinateService
  }
  if (item.tipo === "Instalaciones" && (normalized.includes("reserv") || normalized.includes("conocer") || normalized.includes("ambientes") || normalized.includes("explore") || normalized.includes("spaces") || normalized.includes("other spaces"))) {
    return t.exploreSpaces
  }
  if (normalized.includes("ubicacion") || normalized.includes("ubicación") || normalized.includes("mapa") || normalized.includes("map") || normalized.includes("view on")) {
    return t.viewLocation
  }
  return value
}

const buildGenericCtas = (item: ConserjeItem, lang: CardLang = "es") => {
  const t = CARD_I18N[lang]
  const rawCtas = (item.ctas || []).map((cta) => normalizeActionLabel(cta, item, lang))
  const byType = rawCtas.filter((cta) => {
    const normalized = normalizeText(cta).toLowerCase()
    if (!normalized) return false
    if (item.tipo === "Servicios") {
      if (normalized.includes("reservar habitacion") || normalized.includes("book room")) return false
      return (
        normalized.includes("coordinar") ||
        normalized.includes("solicitar") ||
        normalized.includes("correo") ||
        normalized.includes("informacion") ||
        normalized.includes("información") ||
        normalized.includes("coordinate") ||
        normalized.includes("request") ||
        normalized.includes("email") ||
        normalized.includes("information")
      )
    }
    if (item.tipo === "Instalaciones") {
      if (normalized.includes("reservar habitacion") || normalized.includes("book room")) return false
      return (
        normalized.includes("conocer") ||
        normalized.includes("ambientes") ||
        normalized.includes("instalaciones") ||
        normalized.includes("ver") ||
        normalized.includes("explore") ||
        normalized.includes("spaces") ||
        normalized.includes("facilities") ||
        normalized.includes("view")
      )
    }
    if (item.tipo === "Recomendaciones_Locales") {
      return (
        normalized.includes("ubicacion") ||
        normalized.includes("ubicación") ||
        normalized.includes("mapa") ||
        normalized.includes("llegar") ||
        normalized.includes("map") ||
        normalized.includes("view on") ||
        normalized.includes("location")
      )
    }
    return true
  })

  const deduped = Array.from(new Set(byType))
  const fallback =
    item.tipo === "Servicios"
      ? [t.coordinateService]
      : item.tipo === "Instalaciones"
        ? [t.exploreSpaces]
        : item.tipo === "Recomendaciones_Locales"
          ? [t.viewLocation]
          : []

  const merged = deduped.length > 0 ? deduped : fallback
  const score = (cta: string) => {
    const normalized = normalizeText(cta).toLowerCase()
    if (item.tipo === "Servicios") {
      if (normalized.includes("coordinar")) return 0
      if (normalized.includes("solicitar")) return 1
      if (normalized.includes("informacion") || normalized.includes("información")) return 2
      return 3
    }
    if (item.tipo === "Instalaciones") {
      if (normalized.includes("conocer")) return 0
      if (normalized.includes("instalaciones")) return 1
      return 2
    }
    if (item.tipo === "Recomendaciones_Locales") {
      if (normalized.includes("ubicacion") || normalized.includes("ubicación") || normalized.includes("mapa")) return 0
      if (normalized.includes("llegar")) return 1
      return 2
    }
    return 0
  }

  return merged.sort((a, b) => score(a) - score(b)).slice(0, 2)
}

const actionIconFor = (label: string, item: ConserjeItem) => {
  const normalized = normalizeText(label).toLowerCase()
  if (normalized.includes("reserv") || normalized.includes("disponibilidad")) return CalendarCheck2
  if (normalized.includes("ubicacion") || normalized.includes("ubicación") || normalized.includes("mapa")) return MapPin
  if (normalized.includes("conocer") || normalized.includes("ambientes")) return Building2
  if (item.tipo === "Servicios" || normalized.includes("coordinar") || normalized.includes("solicitar")) return ConciergeBell
  return CalendarClock
}

export function ConserjeItemCard({ item, onAction, lang = "es" }: ConserjeItemCardProps) {
  const [isImageOpen, setIsImageOpen] = useState(false)
  const { Icon, label } = TYPE_META[lang][item.tipo]
  const cardT = CARD_I18N[lang]
  const isRoom = item.tipo === "Habitaciones"
  const imageUrl = resolveImage(item)
  const factualBlocks = parseFactualDescription(item.desc_factual || "")
  const hasFactual = factualBlocks.length > 0
  const experiential = ensureSentence(item.desc_experiencial || "")
  const hasMapLink = item.tipo === "Recomendaciones_Locales" && normalizeText(item.link_ubicacion_mapa || "") !== ""
  const hasReservationLink = item.tipo === "Habitaciones" && normalizeText(item.redirigir || "") !== ""

  const serviceChips = [...(item.condiciones_servicio || []), ...(item.restricciones_requisitos || [])]
    .map((v) => formatTag(v, lang))
    .filter(Boolean)
  const uniqueServiceChips = Array.from(new Set(serviceChips))
  const visibleServiceChips = uniqueServiceChips.slice(0, 3)
  const extraServiceChips = uniqueServiceChips.length - visibleServiceChips.length
  const roomCtas = item.ctas || []
  const genericCtas = buildGenericCtas(item, lang)
  const reserveLabel =
    normalizeRoomActionLabel(
      roomCtas.find((cta) => {
        const n = normalizeText(cta).toLowerCase()
        return n.includes("reserv") || n.includes("book")
      }) || cardT.reviewAvailability,
      lang
    )
  const alternateRoomsLabel =
    normalizeRoomActionLabel(
      roomCtas.find((cta) => {
        const normalized = normalizeText(cta).toLowerCase()
        return normalized.includes("otras habitaciones") || normalized.includes("ver otras") || normalized.includes("other rooms") || normalized.includes("see other rooms")
      }) || cardT.seeOtherRooms,
      lang
    )

  useEffect(() => {
    if (!isImageOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsImageOpen(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isImageOpen])

  useEffect(() => {
    if (!isImageOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isImageOpen])

  return (
    <>
      <article className="conserje-item-card">
        <div className="conserje-item-media relative">
          {imageUrl ? (
            <button
              type="button"
              onClick={() => setIsImageOpen(true)}
              className="group relative h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              aria-label={`Ver imagen completa de ${item.nombre_publico}`}
            >
              {isRoom && (
                <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-black/35 px-2.5 py-1 text-[14px] font-semibold text-white backdrop-blur-sm">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
              )}
              <span className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white transition group-hover:bg-black/75">
                <ZoomIn className="h-4 w-4" />
              </span>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-black/55 to-transparent px-4 py-2 text-left text-xs font-medium text-white/90 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {cardT.viewPhoto}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={item.nombre_publico}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/70">
              <Icon className="h-8 w-8" />
            </div>
          )}
        </div>

        <div className="conserje-item-content">
          {(!isRoom || !imageUrl) && (
            <div className="flex items-center justify-between gap-2">
              <span className="conserje-item-badge">
                <Icon className="h-4 w-4" />
                {label}
              </span>
            </div>
          )}

          <h3 className="text-[30px] font-semibold leading-[1.1] text-foreground">{item.nombre_publico}</h3>

          {hasFactual && (
            <div className="space-y-2 text-[16px] leading-[1.58] text-foreground/90">
              {factualBlocks.map((block, idx) => {
                if (block.type === "header") {
                  return (
                    <p key={idx} className="font-semibold text-foreground">
                      {block.text}
                    </p>
                  )
                }
                if (block.type === "list") {
                  return (
                    <ol key={idx} className="list-decimal pl-5 space-y-1">
                      {block.items.map((listItem, i) => (
                        <li key={i}>{listItem}</li>
                      ))}
                    </ol>
                  )
                }
                return <p key={idx}>{block.text}</p>
              })}
            </div>
          )}
          {experiential && (
            <p className="conserje-item-experiential flex items-start gap-2 text-[16px] leading-relaxed">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong className="font-semibold">{cardT.idealFor}</strong> {experiential}
              </span>
            </p>
          )}

          {item.tipo === "Habitaciones" && (
            <div className="conserje-item-detail-panel">
              {(item.check_in || item.check_out) && (
                <div className="conserje-item-meta flex items-start gap-2 text-[14px]">
                  <span className="conserje-item-meta-icon">
                    <CalendarClock className="h-4 w-4" />
                  </span>
                  <p>
                    <strong className="font-semibold text-foreground">{cardT.checkInOut}</strong>{" "}
                    <span className="text-foreground/90">{item.check_in || "-"} / {item.check_out || "-"}</span>
                  </p>
                </div>
              )}
              {normalizeText(item.precio_desde || "") !== "" && (
                <div className="conserje-item-meta flex items-start gap-2 text-[14px]">
                  <span className="conserje-item-meta-icon">
                    <DollarSign className="h-4 w-4" />
                  </span>
                  <p>
                    <strong className="font-semibold text-foreground">{cardT.from}</strong>{" "}
                    <span className="text-foreground/90">{ensureSentence(item.precio_desde)}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {isRoom && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {hasReservationLink &&
                (onAction ? (
                  <button
                    type="button"
                    onClick={() => onAction(reserveLabel, item)}
                    className="conserje-item-cta"
                  >
                    <span className="conserje-item-cta-icon conserje-item-cta-icon-primary">
                      <CalendarCheck2 className="h-4 w-4" />
                    </span>
                    <span>{reserveLabel}</span>
                  </button>
                ) : (
                  <a
                    href={normalizeExternalUrl(item.redirigir)}
                    target="_blank"
                    rel="noreferrer"
                    className="conserje-item-cta"
                  >
                    <span className="conserje-item-cta-icon conserje-item-cta-icon-primary">
                      <CalendarCheck2 className="h-4 w-4" />
                    </span>
                    <span>{reserveLabel}</span>
                  </a>
                ))}
              {onAction && (
                <button
                  type="button"
                  onClick={() => onAction(alternateRoomsLabel, item)}
                  className="conserje-item-cta-secondary"
                >
                  <span className="conserje-item-cta-icon conserje-item-cta-icon-secondary">
                    <BedDouble className="h-4 w-4" />
                  </span>
                  <span>{alternateRoomsLabel}</span>
                </button>
              )}
            </div>
          )}

          {!isRoom && genericCtas.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {genericCtas.map((cta, index) => {
                const ActionIcon = actionIconFor(cta, item)
                const isPrimary = index === 0
                return onAction ? (
                  <button
                    key={cta}
                    type="button"
                    onClick={() => onAction(cta, item)}
                    className={isPrimary ? "conserje-item-cta" : "conserje-item-cta-secondary"}
                  >
                    <span
                      className={`conserje-item-cta-icon ${isPrimary ? "conserje-item-cta-icon-primary" : "conserje-item-cta-icon-secondary"}`}
                    >
                      <ActionIcon className="h-4 w-4" />
                    </span>
                    <span>{cta}</span>
                  </button>
                ) : null
              })}
            </div>
          )}

          {item.tipo === "Instalaciones" && (item.horario_apertura || item.horario_cierre) && (
            <p className="conserje-item-meta flex items-start gap-2 text-[14px]">
              <span className="conserje-item-meta-icon">
                <Clock3 className="h-4 w-4" />
              </span>
              <span>
                <strong className="font-semibold text-foreground">{cardT.schedule}</strong>{" "}
                <span className="text-foreground/90">{item.horario_apertura || "-"} {cardT.to} {item.horario_cierre || "-"}</span>
              </span>
            </p>
          )}

          {item.tipo === "Servicios" && uniqueServiceChips.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {visibleServiceChips.map((chip) => (
                <span key={chip} className="conserje-item-chip">
                  {chip}
                </span>
              ))}
              {extraServiceChips > 0 && <span className="conserje-item-chip">+{extraServiceChips}</span>}
            </div>
          )}

          {hasMapLink && genericCtas.length === 0 && (
            <div className="pt-1">
              {onAction ? (
                <button
                  type="button"
                  onClick={() => onAction("Ver ubicación", item)}
                  className="conserje-item-link"
                >
                  {cardT.viewLocation}
                </button>
              ) : (
                <a
                  href={normalizeExternalUrl(item.link_ubicacion_mapa)}
                  target="_blank"
                  rel="noreferrer"
                  className="conserje-item-link"
                >
                  {cardT.viewLocation}
                </a>
              )}
            </div>
          )}
        </div>
      </article>

      {isImageOpen &&
        imageUrl &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[220] bg-black/72 backdrop-blur-[3px]"
            onClick={() => setIsImageOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Imagen ampliada de ${item.nombre_publico}`}
              className="mx-auto flex min-h-full w-full items-center justify-center p-4 md:p-8"
            >
              <div
                className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-white/20 bg-[var(--color-overlay)] shadow-[var(--shadow-brand-lg)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-white/10 bg-black/25 px-4 py-3">
                  <p className="truncate pr-3 text-sm font-medium text-white/90">{item.nombre_publico}</p>
                  <button
                    type="button"
                    onClick={() => setIsImageOpen(false)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/70"
                    aria-label="Cerrar imagen ampliada"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center justify-center bg-[var(--color-overlay)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={item.nombre_publico}
                    className="max-h-[82vh] w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
