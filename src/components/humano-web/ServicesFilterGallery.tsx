import Link from "next/link"
import Image from "next/image"
import {
  ArrowUpRight,
  CarFront,
  ConciergeBell,
  Dog,
  Expand,
  ParkingCircle,
  Shirt,
  Sparkles,
  UtensilsCrossed,
  Wifi,
} from "lucide-react"

import { webMediaBadgeClass } from "@/components/humano-web/webStyles"
import type { HumanoService } from "@/lib/humano/services"

function getServiceMetaIcon(entry: HumanoService["meta"][number]) {
  switch (entry.kind) {
    case "transport":
      return CarFront
    case "pet":
      return Dog
    case "food":
      return UtensilsCrossed
    case "laundry":
      return Shirt
    case "parking":
      return ParkingCircle
    case "wifi":
      return Wifi
    case "cleaning":
      return Sparkles
    case "concierge":
      return ConciergeBell
    case "price":
      return Expand
    case "feature":
    default:
      return Sparkles
  }
}

function ServiceImagePlaceholder() {
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

export function ServicesFilterGallery({ services }: { services: HumanoService[] }) {
  return (
    <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 xl:px-14">
      <div className="grid items-start gap-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-14">
        <aside className="lg:sticky lg:top-28">
          <div className="pt-10 sm:pt-14">
            <h2 className="font-serif text-[28px] leading-[1.15] text-[var(--color-azul-rgb)]">
              Hospitalidad consciente en Lima.
            </h2>
            <p className="mt-4 text-[15px] leading-[1.8] text-[var(--color-azul-rgb)]/52">
              En Humano creemos que la hospitalidad va más allá del servicio. Es crear espacios donde las personas puedan reconectar consigo mismas y con los demás, en el corazón de Miraflores.
            </p>
          </div>
        </aside>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {services.map((service) => {
            const description = service.descripcionCorta.replace(/\.$/, "")

            return (
              <Link
                key={service.id}
                href={`/humano/servicios/${service.slug}`}
                aria-label={`Ver detalle de ${service.nombre}`}
                className="group block w-full overflow-hidden rounded-2xl border border-border/35 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(0,0,0,0.14)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10]">
                  {service.imagen ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={service.imagen}
                      alt={service.nombre}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                      loading="lazy"
                    />
                  ) : (
                    <ServiceImagePlaceholder />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  <span className={`${webMediaBadgeClass} absolute left-7 top-7`}>
                    {service.categoria}
                  </span>

                  <div className="absolute bottom-8 left-8 right-24">
                    <h3 className="font-serif text-[30px] leading-[1.02] text-white drop-shadow-md sm:text-[26px]">
                      {service.nombre}
                    </h3>

                    {service.meta.length ? (
                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-white/86">
                        {service.meta.slice(0, 3).map((entry) => {
                          const Icon = getServiceMetaIcon(entry)

                          return (
                            <span
                              key={`${service.id}-${entry.label}`}
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
