"use client"

import Link from "next/link"
import type { ComponentType, SVGProps } from "react"
import { useEffect, useState } from "react"
import {
  ArrowUpRight,
  BedDouble,
  Briefcase,
  Compass,
  CookingPot,
  Expand,
  Palmtree,
  Sparkles,
  SunMedium,
  Tv,
  Wifi,
} from "lucide-react"
import {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/solid"

import { webMediaBadgeClass } from "@/components/humano-web/webStyles"
import type { HumanoRoom } from "@/lib/humano/rooms"
import { cn } from "@/lib/utils"

const intentQuestion = "Viaje"

const profileQuestion = "Personas"

const intentOptions = [
  { label: "Trabajo", value: "trabajo", Icon: Briefcase },
  { label: "Descanso", value: "descanso", Icon: Palmtree },
  { label: "Aventura", value: "aventura", Icon: Compass },
] as const

const profileOptions = [
  { label: "Solo", value: "solo", Icon: UserIcon },
  { label: "Pareja", value: "pareja", Icon: UsersIcon },
  { label: "Grupo", value: "grupo", Icon: UserGroupIcon },
  { label: "Familia", value: "familia", Icon: HomeIcon },
] as const

function normalizeValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function getRoomMetaIcon(entry: HumanoRoom["meta"][number]) {
  if (entry.kind === "feature") {
    if (entry.label === "Kitchenet") return CookingPot
    if (entry.label === "Terraza") return SunMedium
    return Sparkles
  }

  switch (entry.kind) {
    case "size":
      return Expand
    case "bed":
      return BedDouble
    case "wifi":
      return Wifi
    case "tv":
      return Tv
    default:
      return Sparkles
  }
}

type FilterPillProps = {
  active: boolean
  label: string
  onClick: () => void
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

function FilterPill({ active, label, onClick, icon: Icon }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-0 w-full items-center gap-2.5 rounded-[18px] border px-3 py-2 text-left transition-all duration-200",
        active
          ? "border-[var(--color-azul-rgb)] bg-[var(--color-azul-rgb)] text-white shadow-[0_10px_24px_rgba(0,55,68,0.12)]"
          : "border-[var(--color-azul-rgb)]/12 bg-white/72 text-[var(--color-azul-rgb)] hover:border-[var(--color-azul-rgb)]/22 hover:bg-white"
      )}
    >
      <span
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
          active ? "bg-white/16 text-white" : "bg-[var(--color-crema)] text-[var(--color-azul-rgb)]"
        )}
      >
        <Icon className="h-4.5 w-4.5" />
      </span>
      <span className={cn("text-[13px] leading-none", active ? "font-semibold" : "font-medium")}>
        {label}
      </span>
    </button>
  )
}

export function RoomsFilterGallery({ rooms }: { rooms: HumanoRoom[] }) {
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [countPulse, setCountPulse] = useState(false)

  const filteredRooms = rooms.filter((room) => {
    const matchesIntent =
      !selectedIntent ||
      room.intenciones.map(normalizeValue).includes(normalizeValue(selectedIntent))
    const matchesProfile =
      !selectedProfile ||
      room.perfilIdeal.map(normalizeValue).includes(normalizeValue(selectedProfile))

    return matchesIntent && matchesProfile
  })

  useEffect(() => {
    setCountPulse(true)
    const timeout = window.setTimeout(() => setCountPulse(false), 220)

    return () => window.clearTimeout(timeout)
  }, [filteredRooms.length])

  return (
    <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 xl:px-14">
      <div className="grid items-start gap-6 lg:grid-cols-[216px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-8">
        <aside className="lg:sticky lg:top-28">
          <div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "shrink-0 rounded-full bg-[var(--color-azul-rgb)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-200",
                  countPulse && "scale-110 bg-[var(--color-azul-soft)] shadow-[0_10px_22px_rgba(0,55,68,0.18)]"
                )}
              >
                {filteredRooms.length}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-azul-soft)]/68">
                  Resultados
                </p>
                <p className="mt-0.5 text-[12px] font-semibold leading-none text-[var(--color-azul-soft)]">
                  Habitaciones
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-azul-soft)]">
                {intentQuestion}
              </p>
              <div className="mt-2.5 space-y-2">
                {intentOptions.map((option) => (
                  <FilterPill
                    key={option.value}
                    active={selectedIntent === option.value}
                    label={option.label}
                    icon={option.Icon}
                    onClick={() =>
                      setSelectedIntent((current) =>
                        current === option.value ? null : option.value
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-azul-soft)]">
                {profileQuestion}
              </p>
              <div className="mt-2.5 space-y-2">
                {profileOptions.map((option) => (
                  <FilterPill
                    key={option.value}
                    active={selectedProfile === option.value}
                    label={option.label}
                    icon={option.Icon}
                    onClick={() =>
                      setSelectedProfile((current) =>
                        current === option.value ? null : option.value
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {(selectedIntent || selectedProfile) && (
              <div className="mt-4 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIntent(null)
                    setSelectedProfile(null)
                  }}
                  className="text-sm font-medium text-[var(--color-azul-rgb)]/74 transition hover:text-[var(--color-azul-rgb)]"
                >
                  Limpiar selección
                </button>
              </div>
            )}
          </div>
        </aside>

        <div>
          {filteredRooms.length === 0 ? (
            <div className="rounded-[32px] border border-[var(--color-azul-rgb)]/10 bg-white/60 px-8 py-14 text-center shadow-[0_10px_28px_rgba(0,55,68,0.05)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-azul-soft)]">
                Sin coincidencias
              </p>
              <p className="mx-auto mt-3 max-w-[34ch] text-[17px] leading-relaxed text-[var(--color-azul-rgb)]">
                Prueba otra combinación y te mostramos habitaciones más cercanas a ese plan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
              {filteredRooms.map((room) => {
                const description = room.descripcionCorta.replace(/\.$/, "")

                return (
                  <Link
                    key={room.id}
                    href={`/${room.slug}`}
                    aria-label={`Ver detalle de ${room.nombre}`}
                    className="group block w-full overflow-hidden rounded-2xl border border-border/35 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(0,0,0,0.14)]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10]">
                      {room.imagen ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={room.imagen}
                          alt={room.nombre}
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted/30" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                      <span className={`${webMediaBadgeClass} absolute left-7 top-7`}>
                        {room.categoria}
                      </span>

                      <div className="absolute bottom-8 left-8 right-24">
                        <h3 className="font-serif text-[30px] leading-[1.02] text-white drop-shadow-md sm:text-[26px]">
                          {room.nombre}
                        </h3>

                        {room.meta.length ? (
                          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-white/86">
                            {room.meta.slice(0, 4).map((entry) => {
                              const Icon = getRoomMetaIcon(entry)

                              return (
                                <span
                                  key={`${room.id}-${entry.label}`}
                                  className="inline-flex items-center gap-1.5 whitespace-nowrap"
                                >
                                  <Icon
                                    className="h-4 w-4 text-white/72"
                                    strokeWidth={1.8}
                                  />
                                  <span>{entry.label}</span>
                                </span>
                              )
                            })}
                          </div>
                        ) : null}

                        <p className="mt-3 max-w-[34ch] line-clamp-2 text-sm leading-relaxed text-white/88 drop-shadow-sm">
                          {description}.
                        </p>
                      </div>

                      <span
                        aria-hidden="true"
                        className="absolute bottom-8 right-8 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white/88 backdrop-blur-sm transition-all duration-200 group-hover:bg-white/18 group-hover:text-white"
                      >
                        <ArrowUpRight className="h-4.5 w-4.5" strokeWidth={1.9} />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
