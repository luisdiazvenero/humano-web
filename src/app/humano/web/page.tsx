import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Inter, Playfair_Display_SC } from "next/font/google"
import {
  ArrowUpRight,
  Coffee,
  Facebook,
  Footprints,
  Instagram,
  ShoppingBag,
  SunMedium,
  Waves,
} from "lucide-react"

import { WebRoomsCarousel } from "@/components/humano-web/WebRoomsCarousel"
import { WebStickyHeader } from "@/components/humano-web/WebStickyHeader"
import { Reveal } from "@/components/motion/Reveal"
import { StaggerGroup } from "@/components/motion/StaggerGroup"
import { getHumanoRooms } from "@/lib/humano/rooms"
import type { RoomCarouselItem } from "@/components/humano-v09/RoomMenuCarousel"

const headingFont = Playfair_Display_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
})

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "Humano Website · Miraflores",
  description:
    "Website de Humano: hospitalidad consciente, habitaciones y experiencias en Miraflores.",
}

export default function HumanoWebPage() {
  const roomCarouselItems: RoomCarouselItem[] = getHumanoRooms().map((room) => ({
    id: room.slug,
    label: room.nombre,
    description: room.descripcion,
    imageSrc: room.imagen,
  }))

  return (
    <div className={`${bodyFont.className} bg-white text-[var(--color-azul-rgb)]`}>
      <WebStickyHeader />

      <main>
        <section id="inicio" className="relative min-h-screen">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            poster="/video-bg.jpg"
          >
            <source src="/hero-home.mp4" type="video/mp4" />
          </video>
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
              <p className={`${headingFont.className} text-4xl leading-tight`}>
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
                <span className="inline-flex rounded-full border border-[var(--color-azul-rgb)] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                  EXPERIENCIA HUMANO
                </span>
              </div>
              <p className="max-w-[980px] text-[32px] leading-[1.45] text-[var(--color-azul-rgb)]">
                <span className="font-medium">Hospitalidad consciente en Lima.</span> En Humano creemos que la hospitalidad va más allá del servicio. Es crear espacios donde las personas puedan reconectar consigo mismas y con los demás, en el corazón de Miraflores.
              </p>
            </div>
          </Reveal>

          <div className="mt-20 grid gap-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-24">
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

          <div className="mt-10 grid gap-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-24">
            <div />
            <div className="max-w-3xl">
              <Reveal delay={0.05}>
                <p className="text-base leading-relaxed text-[var(--color-azul-soft)]">
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
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="mb-5 inline-flex rounded-full border border-[var(--color-azul-rgb)] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                    EXPERIENCIA HUMANO
                  </span>
                  <p className="max-w-[980px] text-[32px] leading-[1.45] text-[var(--color-azul-rgb)]">
                    <span className="font-medium">Nuestra Habitaciones.</span>{" "}
                    Cada habitación está diseñada para diferentes necesidades.
                    Desde el viajero solo hasta familias completas, encuentra el
                    espacio perfecto para tu estadía.
                  </p>
                </div>
                <Link
                  href="#habitaciones-carousel"
                  className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[var(--color-amarillo)] px-6 py-3 text-base font-semibold text-[var(--color-azul-rgb)] shadow-sm transition hover:brightness-95"
                >
                  Ver todas
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
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
          <div className="mx-auto w-full max-w-[1280px] px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <span className="inline-flex rounded-full border border-white/70 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
                EXPERIENCIA HUMANO
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-6 max-w-[980px] text-[32px] leading-[1.45] text-white">
                <span className="font-medium">Nuestras Instalaciones.</span>{" "}
                Espacios pensados para acompañar cada momento de tu estadía: un
                lobby acogedor, restaurante de autor y piscina para desconectar
                en el corazón de Miraflores.
              </p>
            </Reveal>

            <StaggerGroup className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3">
              <Reveal fromParent className="text-left">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src="/chatbot/imagenes/inst/lobby/lobby_1.webp"
                    alt="Lobby Humano"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <p className="mt-3 text-base font-medium text-white/95">Lobby</p>
              </Reveal>
              <Reveal fromParent className="text-left">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src="/chatbot/imagenes/inst/restaurante_cdl/cdl_1.webp"
                    alt="Restaurante Humano"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <p className="mt-3 text-base font-medium text-white/95">Restaurante</p>
              </Reveal>
              <Reveal fromParent className="text-left">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src="/chatbot/imagenes/inst/piscina/piscina_1.webp"
                    alt="Piscina Humano"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <p className="mt-3 text-base font-medium text-white/95">Piscina</p>
              </Reveal>
            </StaggerGroup>
          </div>
        </section>

        <footer id="contacto" className="w-full bg-[var(--color-azul-rgb)] text-white">
          <Reveal amount={0.15}>
            <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-6 px-4 py-8 text-sm text-white/90 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <Link
                  href="https://www.instagram.com/humanolima/?hl=es"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Humano Lima"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:text-[var(--color-amarillo)]"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.facebook.com/humanolima/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Humano Lima"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:text-[var(--color-amarillo)]"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              </div>

              <div className="text-center">
                2026 Hotel Humano · Miraflores. Desarrollado por Armando Hoteles
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
