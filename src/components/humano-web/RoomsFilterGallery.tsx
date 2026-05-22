import Link from "next/link"
import {
  ArrowUpRight,
  BedDouble,
  CookingPot,
  Expand,
  Sparkles,
  SunMedium,
  Tv,
  Wifi,
} from "lucide-react"

import { webMediaBadgeClass } from "@/components/humano-web/webStyles"
import type { HumanoRoom } from "@/lib/humano/rooms"
import type { WebLang } from "@/lib/web/i18n"

const GALLERY_I18N: Record<WebLang, {
  eyebrow: string
  title: string
  text: string
  viewDetail: string
}> = {
  es: {
    eyebrow: "Habitaciones",
    title: "Hospitalidad consciente en Lima",
    text: "Tu espacio, desde que llegas. C\u00f3modas, acogedoras y con un toque que las hace sentir tuyas desde el primer instante.",
    viewDetail: "Ver detalle de",
  },
  en: {
    eyebrow: "Rooms",
    title: "Mindful hospitality in Lima",
    text: "Your space, from the moment you arrive. Cozy, well-considered, and with just the right details to make them feel like your own.",
    viewDetail: "View detail of",
  },
}

function getRoomMetaIcon(entry: HumanoRoom["meta"][number]) {
  if (entry.kind === "feature") {
    if (entry.label === "Kitchenet" || entry.label === "Kitchenette") return CookingPot
    if (entry.label === "Terraza" || entry.label === "Terrace") return SunMedium
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

export function RoomsFilterGallery({ rooms, lang = "es" }: { rooms: HumanoRoom[]; lang?: WebLang }) {
  const g = GALLERY_I18N[lang]

  return (
    <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 xl:px-14">
      <div className="grid items-start gap-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-14">
        <aside className="lg:sticky lg:top-28">
          <div className="pt-10 sm:pt-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-azul-rgb)]/60">
              {g.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-[28px] leading-[1.15] text-[var(--color-azul-rgb)]">
              {g.title}
            </h2>
            <p className="mt-4 text-[15px] leading-[1.8] text-[var(--color-azul-rgb)]/52">
              {g.text}
            </p>
          </div>
        </aside>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {rooms.map((room) => {
            const description = room.descripcionCorta.replace(/\.$/, "")

            return (
              <Link
                key={room.id}
                href={`${lang === "en" ? "/en/rooms" : ""}/${room.slug}`}
                aria-label={`${g.viewDetail} ${room.nombre}`}
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
      </div>
    </div>
  )
}
