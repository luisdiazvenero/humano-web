import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRight,
  Briefcase,
  Clock3,
  Coffee,
  Dumbbell,
  Sparkles,
  UtensilsCrossed,
  Waves,
} from "lucide-react"

import { webMediaBadgeClass } from "@/components/humano-web/webStyles"
import type { HumanoFacility } from "@/lib/humano/facilities"

function getFacilityMetaIcon(entry: HumanoFacility["meta"][number]) {
  switch (entry.kind) {
    case "time":
      return Clock3
    case "breakfast":
      return Coffee
    case "food":
      return UtensilsCrossed
    case "work":
      return Briefcase
    case "wellness":
      return Waves
    case "meeting":
      return Dumbbell
    case "feature":
    default:
      return Sparkles
  }
}

function FacilityImagePlaceholder() {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,200,93,0.18),transparent_58%),linear-gradient(135deg,rgba(0,48,53,0.98),rgba(0,48,53,0.84))]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/logo-humano.svg"
          alt="Humano"
          width={70}
          height={80}
          className="h-20 w-auto opacity-95"
        />
      </div>
    </div>
  )
}

export function ExperiencesFilterGallery({ facilities }: { facilities: HumanoFacility[] }) {
  return (
    <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 xl:px-14">
      <div className="grid items-start gap-6 lg:grid-cols-[216px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-8">
        <aside className="lg:sticky lg:top-28">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-azul-soft)]/52">
            Hotel Humano · Miraflores
          </p>
          <h2 className="mt-3 font-serif text-[22px] leading-[1.15] text-[var(--color-azul-rgb)]">
            Hospitalidad consciente en Lima.
          </h2>
          <p className="mt-4 text-[13px] leading-[1.75] text-[var(--color-azul-rgb)]/58">
            En Humano creemos que la hospitalidad va más allá del servicio. Es crear espacios donde las personas puedan reconectar consigo mismas y con los demás, en el corazón de Miraflores...
          </p>
        </aside>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {facilities.map((facility) => {
            const description = facility.descripcionCorta.replace(/\.$/, "")

            return (
              <Link
                key={facility.id}
                href={`/humano/hotel/${facility.slug}`}
                aria-label={`Ver detalle de ${facility.nombre}`}
                className="group block w-full overflow-hidden rounded-2xl border border-border/35 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(0,0,0,0.14)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10]">
                  {facility.imagen ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={facility.imagen}
                      alt={facility.nombre}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                      loading="lazy"
                    />
                  ) : (
                    <FacilityImagePlaceholder />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  {facility.id === "INST_RESTAURANTE_ENT" ? (
                    <span className="absolute left-7 top-7 inline-flex items-center rounded-md bg-[var(--color-amarillo)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-azul-rgb)]">
                      Próximamente
                    </span>
                  ) : (
                    <span className={`${webMediaBadgeClass} absolute left-7 top-7`}>
                      {facility.categoria}
                    </span>
                  )}

                  <div className="absolute bottom-8 left-8 right-24">
                    <h3 className="font-serif text-[30px] leading-[1.02] text-white drop-shadow-md sm:text-[26px]">
                      {facility.nombre}
                    </h3>

                    {facility.meta.length ? (
                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-white/86">
                        {facility.meta.slice(0, 3).map((entry) => {
                          const Icon = getFacilityMetaIcon(entry)

                          return (
                            <span
                              key={`${facility.id}-${entry.label}`}
                              className="inline-flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <Icon className="h-4 w-4 text-white/72" strokeWidth={1.8} />
                              <span>{entry.label}</span>
                            </span>
                          )
                        })}
                      </div>
                    ) : null}

                    <p className="mt-3 max-w-[36ch] line-clamp-2 text-sm leading-relaxed text-white/88 drop-shadow-sm">
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
      </div>
    </div>
  )
}
