import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Inter, Playfair_Display_SC } from "next/font/google"
import {
  ArrowUpRight,
  Clock3,
  Coffee,
  Footprints,
  ShoppingBag,
  Sparkles,
  SunMedium,
  Waves,
} from "lucide-react"

import { WebFooterSocialLinks } from "@/components/humano-web/WebFooterSocialLinks"
import { WebRoomsCarousel } from "@/components/humano-web/WebRoomsCarousel"
import { WebSectionEyebrow } from "@/components/humano-web/WebSectionEyebrow"
import { WebStickyHeader } from "@/components/humano-web/WebStickyHeader"
import { Reveal } from "@/components/motion/Reveal"
import { StaggerGroup } from "@/components/motion/StaggerGroup"
import { getHumanoFeaturedFacilities } from "@/lib/humano/facilities"
import { getHumanoRooms } from "@/lib/humano/rooms"
import type { RoomCarouselItem } from "@/components/humano-v09/RoomMenuCarousel"
import { webMediaBadgeClass, webPrimaryButtonClass } from "@/components/humano-web/webStyles"
import { VideoBackground } from "@/components/humano-web/VideoBackground"

const headingFont = Playfair_Display_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
})

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "Hotel en Miraflores Lima | Hotel Humano Tribute Portfolio by Marriott",
  description:
    "Descubre Hotel Humano en Miraflores, Lima. Un hotel Tribute Portfolio con diseño único, experiencias locales y una conexión auténtica con la ciudad.",
}

export default function HumanoWebPage() {
  const roomCarouselItems: RoomCarouselItem[] = getHumanoRooms().map((room) => ({
    id: room.slug,
    label: room.nombre,
    description: room.descripcion,
    shortDescription: room.descripcionCorta,
    categoryLabel: room.categoria,
    meta: room.meta,
    imageSrc: room.imagen,
  }))
  const featuredFacilities = getHumanoFeaturedFacilities()

  const getFacilityMetaIcon = (kind: "time" | "feature") => {
    switch (kind) {
      case "time":
        return Clock3
      case "feature":
      default:
        return Sparkles
    }
  }

  return (
    <div className={`${bodyFont.className} bg-white text-[var(--color-azul-rgb)]`}>
      <WebStickyHeader />

      <main>
        <section id="inicio" className="relative min-h-screen">
          <VideoBackground />
          <div className="absolute inset-0 bg-black/35" />

          <div className="relative mx-auto h-screen w-full max-w-[1280px] px-4 text-center text-white sm:px-6 lg:px-8">
            <button
              type="button"
              className="absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur transition hover:bg-white/30"
              aria-label="Reproducir video"
            >
              <span className="ml-1 inline-block h-0 w-0 border-b-[9px] border-l-[14px] border-t-[9px] border-b-transparent border-l-white border-t-transparent" />
            </button>
            <div className="absolute left-1/2 top-[calc(50%+76px)] w-full max-w-[900px] -translate-x-1/2 px-4">
              <p className="text-4xl font-serif leading-tight">
                Viaja con propósito,
                <br />
                no solo con itinerario
              </p>
              <p className="mt-4 text-[18px] leading-tight text-white/85">
                Descubre Humano
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1680px] px-6 pb-32 pt-36 sm:px-10 sm:pb-36 sm:pt-40 xl:px-14">
          <Reveal>
            <div className="grid items-start gap-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-24">
              <div className="pt-2">
                <WebSectionEyebrow label="Experiencia Humano" />
              </div>
              <div className="max-w-[1040px]">
                <h2 className="max-w-[980px] text-[32px] leading-[1.22] text-[var(--color-azul-rgb)] lg:text-[40px]">
                  <span>Hospitalidad consciente en Lima.</span>
                </h2>
                <p className="mt-5 max-w-[760px] text-[18px] leading-[1.6] text-[var(--color-azul-soft)] sm:text-[20px]">
                  En Humano creemos que la hospitalidad va más allá del servicio.
                  Es crear espacios donde las personas puedan reconectar consigo
                  mismas y con los demás, en el corazón de Miraflores.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-24">
            <div />
            <StaggerGroup className="grid w-fit justify-items-start grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-10">
              <Reveal fromParent className="flex flex-col items-start text-left">
                <article>
                  <span className="inline-flex h-[86px] w-[86px] items-center justify-center rounded-full border border-[var(--color-azul-soft)]/25 text-[var(--color-azul-rgb)]">
                    <ShoppingBag className="h-8 w-8" strokeWidth={1.5} />
                  </span>
                  <p className="mt-5 text-[16px] font-medium text-[var(--color-azul-rgb)]">
                    Larcomar
                  </p>
                </article>
              </Reveal>
              <Reveal fromParent className="flex flex-col items-start text-left">
                <article>
                  <span className="inline-flex h-[86px] w-[86px] items-center justify-center rounded-full border border-[var(--color-azul-soft)]/25 text-[var(--color-azul-rgb)]">
                    <Footprints className="h-8 w-8" strokeWidth={1.5} />
                  </span>
                  <p className="mt-5 text-[16px] font-medium text-[var(--color-azul-rgb)]">
                    Running
                  </p>
                </article>
              </Reveal>
              <Reveal fromParent className="flex flex-col items-start text-left">
                <article>
                  <span className="inline-flex h-[86px] w-[86px] items-center justify-center rounded-full border border-[var(--color-azul-soft)]/25 text-[var(--color-azul-rgb)]">
                    <Coffee className="h-8 w-8" strokeWidth={1.5} />
                  </span>
                  <p className="mt-5 text-[16px] font-medium text-[var(--color-azul-rgb)]">
                    Cafes
                  </p>
                </article>
              </Reveal>
              <Reveal fromParent className="flex flex-col items-start text-left">
                <article>
                  <span className="inline-flex h-[86px] w-[86px] items-center justify-center gap-1 rounded-full border border-[var(--color-azul-soft)]/25 text-[var(--color-azul-rgb)]">
                    <SunMedium className="h-7 w-7" strokeWidth={1.5} />
                    <Waves className="h-7 w-7" strokeWidth={1.5} />
                  </span>
                  <p className="mt-5 text-[16px] font-medium text-[var(--color-azul-rgb)]">
                    Miraflores
                  </p>
                </article>
              </Reveal>
            </StaggerGroup>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-24">
            <div />
            <div className="max-w-[760px]">
              <Reveal delay={0.05}>
                <p className="text-[15px] leading-relaxed text-[var(--color-azul-soft)] sm:text-base">
                  En el corazón de Miraflores, a pasos del malecón y las mejores
                  vistas del Pacífico. Un punto estratégico donde convergen
                  cultura, gastronomía y vida urbana.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="habitaciones" className="w-full bg-[var(--color-crema)]">
          <div className="mx-auto w-full max-w-[1680px] px-6 pb-32 pt-36 sm:px-10 sm:pb-36 sm:pt-40 xl:px-14">
            <Reveal>
              <div className="mb-8">
                <WebSectionEyebrow
                  label="Experiencia Humano"
                  className="mb-6"
                />
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
                  <div className="max-w-[1040px]">
                    <h2 className="max-w-[980px] text-[32px] leading-[1.22] text-[var(--color-azul-rgb)] lg:text-[40px]">
                      <span>Nuestras habitaciones.</span>
                    </h2>
                    <p className="mt-5 max-w-[760px] text-[18px] leading-[1.6] text-[var(--color-azul-soft)] sm:text-[20px]">
                      Cada habitación está diseñada para diferentes necesidades.
                      Desde el viajero solo hasta familias completas, encuentra el
                      espacio perfecto para tu estadía.
                    </p>
                  </div>
                  <div className="flex justify-start lg:justify-end">
                    <Link
                      href="/humano/web/habitaciones"
                      className={`${webPrimaryButtonClass} bg-[#003035] text-white hover:bg-[#002d38]`}
                    >
                      Ver todas
                      <ArrowUpRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div id="habitaciones-carousel" className="mt-20">
                <WebRoomsCarousel items={roomCarouselItems} />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative h-[420px] sm:h-[560px]">
          <Image
            src="/chatbot/imagenes/inst/lobby/lobby_1.webp"
            alt="Lobby Humano"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </section>

        <section id="experiencias" className="w-full bg-[var(--color-azul-rgb)] py-28 text-white sm:py-32">
          <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 xl:px-14">
            <Reveal>
              <div className="grid items-start gap-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-24">
                <div className="pt-2">
                  <WebSectionEyebrow
                    label="Experiencia Humano"
                    tone="light"
                  />
                </div>
                <div className="max-w-[1040px]">
                  <h2 className="max-w-[980px] text-[32px] leading-[1.22] text-white lg:text-[40px]">
                    <span>Nuestras Instalaciones.</span>
                  </h2>
                  <p className="mt-5 max-w-[760px] text-[18px] leading-[1.6] text-white/78 sm:text-[20px]">
                    Espacios pensados para acompañar cada momento de tu estadía:
                    un lobby acogedor, restaurante de autor y piscina para
                    desconectar en el corazón de Miraflores.
                  </p>
                </div>
              </div>
            </Reveal>

            <StaggerGroup className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 xl:grid-cols-3">
              {featuredFacilities.map((facility) => (
                <Reveal key={facility.id} fromParent className="text-left">
                  <Link
                    href={`/humano/web/experiencia/${facility.slug}`}
                    aria-label={`Ver detalle de ${facility.nombre}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.03] shadow-[0_18px_40px_rgba(0,0,0,0.16)] transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden">
                      {facility.imagen ? (
                        <Image
                          src={facility.imagen}
                          alt={`${facility.nombre} Humano`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      ) : null}

                      <span className={`${webMediaBadgeClass} absolute left-7 top-7`}>
                        {facility.categoria}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col bg-white/[0.02] px-7 pb-6 pt-6">
                      <div>
                        <h3 className="font-serif text-[30px] leading-[1.02] text-white sm:text-[26px]">
                          {facility.nombre}
                        </h3>
                        <div className="mt-3 flex flex-nowrap items-center gap-5 overflow-hidden text-[13px] font-medium text-white/84">
                          {facility.meta.map((entry) => {
                            const Icon = getFacilityMetaIcon(entry.kind)
                            return (
                            <span
                              key={`${facility.id}-${entry.label}`}
                              className="inline-flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <Icon className="h-4 w-4 shrink-0 text-white/70" strokeWidth={1.8} />
                              <span>{entry.label}</span>
                            </span>
                            )
                          })}
                        </div>
                      </div>

                      <div className="mt-4 flex items-end justify-between gap-4">
                        <p className="max-w-[30ch] text-sm leading-relaxed text-white/82 line-clamp-2">
                          {facility.descripcion}
                        </p>
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/12 text-white/88 backdrop-blur-sm transition-all duration-200 group-hover:bg-white/18 group-hover:text-white">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </StaggerGroup>
          </div>
        </section>

        <footer id="contacto" className="w-full bg-[var(--color-azul-rgb)] text-white">
          <Reveal amount={0.15}>
            <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-6 px-4 py-8 text-sm text-white/90 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
              <WebFooterSocialLinks />

              <div className="flex flex-col items-center gap-4 text-center">
                <p>
                  2026 Hotel Humano · Malecón Balta 710, Miraflores.
                  Desarrollado por Armando Hoteles
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.12em] text-white/70">
                  <Link
                    href="/humano/web/libro-de-reclamaciones"
                    className="transition-colors hover:text-[var(--color-amarillo)]"
                  >
                    Libro de Reclamaciones
                  </Link>
                  <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
                  <Link
                    href="/humano/web/terminos-y-condiciones"
                    className="transition-colors hover:text-[var(--color-amarillo)]"
                  >
                    Términos y Condiciones
                  </Link>
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <Link
                  href="https://www.marriott.com/default.mi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Marriott Bonvoy"
                >
                  <Image
                    src="/bonvoy-wordmark.svg"
                    alt="Marriott Bonvoy"
                    width={144}
                    height={40}
                    className="h-10 w-auto"
                  />
                </Link>
              </div>
            </div>
          </Reveal>
        </footer>
      </main>
    </div>
  )
}
