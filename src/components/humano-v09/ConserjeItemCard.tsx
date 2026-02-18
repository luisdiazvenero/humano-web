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

interface ConserjeItemCardProps {
  item: ConserjeItem
  onAction?: (action: string, item: ConserjeItem) => void
}

const TYPE_META: Record<ConserjeItemType, { label: string; Icon: typeof BedDouble }> = {
  Habitaciones: { label: "Habitaciones", Icon: BedDouble },
  Servicios: { label: "Servicios", Icon: ConciergeBell },
  Instalaciones: { label: "Instalaciones", Icon: Building2 },
  Recomendaciones_Locales: { label: "Recomendaciones locales", Icon: MapPin },
}

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim()

const ensureSentence = (value: string) => {
  const normalized = normalizeText(value)
  if (!normalized) return ""
  if (/[.!?…]$/.test(normalized)) return normalized
  return `${normalized}.`
}

const formatTag = (value: string) => {
  const normalized = normalizeText(value).replace(/[_-]+/g, " ")
  if (!normalized) return ""
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
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

const normalizeRoomActionLabel = (value: string) => {
  const normalized = normalizeText(value).toLowerCase()
  if (normalized.includes("reserv")) return "Revisar disponibilidad"
  if (normalized.includes("ver otras") || normalized.includes("otras habitaciones")) return "Ver otras habitaciones"
  return value
}

const normalizeActionLabel = (value: string, item: ConserjeItem) => {
  const normalized = normalizeText(value).toLowerCase()
  if (item.tipo === "Habitaciones" && normalized.includes("reserv")) return "Revisar disponibilidad"
  if (item.tipo === "Servicios" && (normalized.includes("coordinar") || normalized.includes("reserv"))) {
    return "Coordinar servicio"
  }
  if (item.tipo === "Instalaciones" && normalized.includes("reserv")) return "Conocer más ambientes"
  if (normalized.includes("ubicacion") || normalized.includes("ubicación") || normalized.includes("mapa")) {
    return "Ver ubicación en mapa"
  }
  return value
}

const buildGenericCtas = (item: ConserjeItem) => {
  const rawCtas = (item.ctas || []).map((cta) => normalizeActionLabel(cta, item))
  const byType = rawCtas.filter((cta) => {
    const normalized = normalizeText(cta).toLowerCase()
    if (!normalized) return false
    if (item.tipo === "Servicios") {
      if (normalized.includes("reservar habitacion")) return false
      return (
        normalized.includes("coordinar") ||
        normalized.includes("solicitar") ||
        normalized.includes("correo") ||
        normalized.includes("informacion") ||
        normalized.includes("información")
      )
    }
    if (item.tipo === "Instalaciones") {
      if (normalized.includes("reservar habitacion")) return false
      return (
        normalized.includes("conocer") ||
        normalized.includes("ambientes") ||
        normalized.includes("instalaciones") ||
        normalized.includes("ver")
      )
    }
    if (item.tipo === "Recomendaciones_Locales") {
      return (
        normalized.includes("ubicacion") ||
        normalized.includes("ubicación") ||
        normalized.includes("mapa") ||
        normalized.includes("llegar")
      )
    }
    return true
  })

  const deduped = Array.from(new Set(byType))
  const fallback =
    item.tipo === "Servicios"
      ? ["Coordinar servicio"]
      : item.tipo === "Instalaciones"
        ? ["Conocer más ambientes"]
        : item.tipo === "Recomendaciones_Locales"
          ? ["Ver ubicación en mapa"]
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

export function ConserjeItemCard({ item, onAction }: ConserjeItemCardProps) {
  const [isImageOpen, setIsImageOpen] = useState(false)
  const { Icon, label } = TYPE_META[item.tipo]
  const isRoom = item.tipo === "Habitaciones"
  const imageUrl = resolveImage(item)
  const factual = ensureSentence(item.desc_factual || "")
  const experiential = ensureSentence(item.desc_experiencial || "")
  const hasMapLink = item.tipo === "Recomendaciones_Locales" && normalizeText(item.link_ubicacion_mapa || "") !== ""
  const hasReservationLink = item.tipo === "Habitaciones" && normalizeText(item.redirigir || "") !== ""

  const serviceChips = [...(item.condiciones_servicio || []), ...(item.restricciones_requisitos || [])]
    .map(formatTag)
    .filter(Boolean)
  const uniqueServiceChips = Array.from(new Set(serviceChips))
  const visibleServiceChips = uniqueServiceChips.slice(0, 3)
  const extraServiceChips = uniqueServiceChips.length - visibleServiceChips.length
  const roomCtas = item.ctas || []
  const genericCtas = buildGenericCtas(item)
  const reserveLabel =
    normalizeRoomActionLabel(
      roomCtas.find((cta) => normalizeText(cta).toLowerCase().includes("reserv")) || "Revisar disponibilidad"
    )
  const alternateRoomsLabel =
    normalizeRoomActionLabel(
      roomCtas.find((cta) => {
      const normalized = normalizeText(cta).toLowerCase()
      return normalized.includes("otras habitaciones") || normalized.includes("ver otras")
      }) || "Ver otras habitaciones"
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
                Ver foto completa
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

          {factual && <p className="text-[16px] leading-[1.58] text-foreground/90">{factual}</p>}
          {experiential && (
            <p className="conserje-item-experiential flex items-start gap-2 text-[16px] leading-relaxed">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong className="font-semibold">Ideal para:</strong> {experiential}
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
                    <strong className="font-semibold text-foreground">Check-in/out:</strong>{" "}
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
                    <strong className="font-semibold text-foreground">Desde:</strong>{" "}
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
                <strong className="font-semibold text-foreground">Horario:</strong>{" "}
                <span className="text-foreground/90">{item.horario_apertura || "-"} a {item.horario_cierre || "-"}</span>
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
                  Ver ubicación en mapa
                </button>
              ) : (
                <a
                  href={normalizeExternalUrl(item.link_ubicacion_mapa)}
                  target="_blank"
                  rel="noreferrer"
                  className="conserje-item-link"
                >
                  Ver ubicación en mapa
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
                className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-white/20 bg-[#0f1113] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
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
                <div className="flex items-center justify-center bg-[#0f1113]">
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
