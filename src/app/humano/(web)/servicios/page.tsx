import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Inter } from "next/font/google"
import {
  ArrowDown,
  ArrowLeft,
  HeartHandshake,
} from "lucide-react"

import { ServicesFilterGallery } from "@/components/humano-web/ServicesFilterGallery"
import { WebFooterSocialLinks } from "@/components/humano-web/WebFooterSocialLinks"
import { WebScrollToSectionButton } from "@/components/humano-web/WebScrollToSectionButton"
import { WebStickyHeader } from "@/components/humano-web/WebStickyHeader"
import { Reveal } from "@/components/motion/Reveal"
import { getHumanoServices } from "@/lib/humano/services"
import { webPrimaryButtonClass } from "@/components/humano-web/webStyles"

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

const pageNavItems = [
  { label: "Home", href: "/humano#inicio" },
  { label: "Habitaciones", href: "/humano/habitaciones" },
  { label: "Hotel", href: "/humano/hotel" },
  { label: "Servicios", href: "/humano/servicios" },
  { label: "Contacto", href: "/humano/contacto" },
]

export const metadata: Metadata = {
  title: "Servicios del Hotel en Miraflores Lima | Hotel Humano",
  description:
    "Descubre los servicios de Hotel Humano en Miraflores: atención cercana, experiencias locales, espacios pensados para conectar y disfrutar Lima.",
}

export default function HumanoServicesPage() {
  const services = getHumanoServices()

  return (
    <div className={`${bodyFont.className} bg-[var(--color-crema)] text-[var(--color-azul-rgb)]`}>
      <WebStickyHeader
        brandHref="/humano#inicio"
        navItems={pageNavItems}
        activeHref="#servicios"
      />

      <main>
        <section
          id="inicio"
          className="relative flex h-[80dvh] min-h-[80dvh] items-center overflow-hidden bg-[var(--color-azul-rgb)] pt-28 sm:pt-32"
        >
          <div className="absolute inset-0">
            <Image
              src="/chatbot/imagenes/serv/room_service/room_service_1.webp"
              alt="Servicios Humano"
              fill
              priority
              className="object-cover object-center opacity-22"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,48,53,0.96)_0%,rgba(0,48,53,0.82)_50%,rgba(0,48,53,0.56)_100%)]" />
            <div className="absolute left-[-10%] top-[18%] h-64 w-64 rounded-full bg-[var(--color-amarillo)]/12 blur-3xl" />
            <div className="absolute bottom-[-10%] right-[8%] h-72 w-72 rounded-full bg-white/8 blur-3xl" />
          </div>

          <div className="relative mx-auto w-full max-w-[1680px] px-6 sm:px-10 xl:px-14">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[minmax(0,760px)_300px] lg:items-end lg:justify-between lg:gap-12">
                <div className="max-w-[820px]">
                  <Link
                    href="/humano#experiencias"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white/68 transition hover:text-white/88"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver al Hotel</span>
                  </Link>
                  <h1 className="text-4xl font-serif leading-tight text-white">
                    Nuestros servicios.
                  </h1>
                  <p className="mt-4 max-w-[820px] text-[18px] leading-[1.5] text-white/85">
                    En Humano creemos que la hospitalidad va más allá del servicio.
                    Es crear espacios donde las personas puedan reconectar consigo mismas
                    y con los demás, en el corazón de Miraflores.
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <WebScrollToSectionButton
                      targetId="servicios"
                      className={`${webPrimaryButtonClass} bg-white text-[var(--color-azul-rgb)] hover:bg-[var(--color-crema-soft)]`}
                    >
                      Explorar servicios
                      <ArrowDown className="h-5 w-5" />
                    </WebScrollToSectionButton>
                  </div>
                </div>

                <div className="max-w-[420px] justify-self-start lg:w-[420px] lg:justify-self-end lg:translate-y-2">
                  <div className="rounded-[28px] border border-white/10 bg-[rgba(0,48,53,0.56)] px-5 py-4 text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur-md">
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-0 sm:items-center">
                      <div className="flex flex-col items-center sm:pr-4 sm:border-r sm:border-white/12">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-white">
                            <HeartHandshake className="h-5 w-5 text-white/86" strokeWidth={1.8} />
                            <p className="text-[19px] font-medium leading-none text-white">
                              Hospitalidad
                            </p>
                          </div>
                          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/62">
                            Siempre contigo
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center text-center sm:pl-4">
                        <p className="whitespace-nowrap text-[13px] font-semibold uppercase leading-none tracking-[0.18em] text-white/64">
                          Ideal para:
                        </p>
                        <p className="mt-2 whitespace-nowrap text-[11px] leading-none text-white/64">
                          Trabajo, Descanso, Aventura
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="servicios"
          className="relative z-10 -mt-8 scroll-mt-24 pb-24 pt-8 sm:-mt-10 sm:scroll-mt-28 sm:pb-28 sm:pt-10 lg:scroll-mt-32"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-[36px] bg-[var(--color-crema)] sm:h-36 sm:rounded-t-[42px]"
          />

          <ServicesFilterGallery services={services} />
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
                  <Link href="/humano/libro-de-reclamaciones" className="transition-colors hover:text-[var(--color-amarillo)]">
                    Libro de Reclamaciones
                  </Link>
                  <span
                    aria-hidden="true"
                    className="hidden h-1 w-1 rounded-full bg-white/30 sm:block"
                  />
                  <Link href="/humano/terminos-y-condiciones" className="transition-colors hover:text-[var(--color-amarillo)]">
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
