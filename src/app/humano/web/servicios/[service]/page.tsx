import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Inter } from "next/font/google"
import {
  ArrowLeft,
  ArrowUpRight,
  CarFront,
  ConciergeBell,
  Dog,
  ParkingCircle,
  Shirt,
  Sparkles,
  UtensilsCrossed,
  Wifi,
} from "lucide-react"
import { notFound } from "next/navigation"

import { WebFooterSocialLinks } from "@/components/humano-web/WebFooterSocialLinks"
import { RoomDetailGallery } from "@/components/humano-web/RoomDetailGallery"
import { WebStickyHeader } from "@/components/humano-web/WebStickyHeader"
import { Reveal } from "@/components/motion/Reveal"
import {
  getHumanoServiceBySlug,
  getHumanoServices,
  type HumanoService,
} from "@/lib/humano/services"
import { webMediaBadgeClass, webPrimaryButtonClass } from "@/components/humano-web/webStyles"

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

const pageNavItems = [
  { label: "Hotel", href: "/humano/web#inicio" },
  { label: "Habitaciones", href: "/humano/web/habitaciones" },
  { label: "Servicios", href: "/humano/web/servicios" },
  { label: "Experiencia", href: "/humano/web/experiencia" },
  { label: "Contacto", href: "/humano/web/contacto" },
]

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
      return Sparkles
    case "feature":
    default:
      return Sparkles
  }
}

function ServiceSuggestionCard({ service }: { service: HumanoService }) {
  const previewMeta = service.meta.slice(0, 3)

  return (
    <Link
      href={`/humano/web/servicios/${service.slug}`}
      aria-label={`Ver detalle de ${service.nombre}`}
      className="group block text-left"
    >
      <div className="flex items-center gap-3 rounded-[22px] bg-white/[0.03] p-3 transition-colors duration-200 group-hover:bg-white/[0.05]">
        <div className="relative h-[92px] w-[104px] shrink-0 overflow-hidden rounded-[16px] bg-white/5 sm:h-[96px] sm:w-[112px]">
          {service.imagen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={service.imagen}
              alt={service.nombre}
              className="h-full w-full object-cover opacity-92 transition duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
              loading="lazy"
            />
          ) : (
            <div className="relative h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,200,93,0.18),transparent_58%),linear-gradient(135deg,rgba(0,48,53,0.98),rgba(0,48,53,0.84))]">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/logo-humano.svg"
                  alt="Humano"
                  width={42}
                  height={48}
                  className="h-12 w-auto opacity-95"
                />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/22 via-black/0 to-transparent" />
          <span className={`absolute left-2.5 top-2.5 scale-[0.92] ${webMediaBadgeClass}`}>
            {service.categoria}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-[19px] leading-[1.06] text-white/88 transition-colors duration-200 group-hover:text-white">
              {service.nombre}
            </h3>

            <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/42 transition-colors duration-200 group-hover:text-white/62">
              Ver
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </span>
          </div>

          {previewMeta.length ? (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium text-white/52">
              {previewMeta.map((entry) => {
                const Icon = getServiceMetaIcon(entry)

                return (
                  <span
                    key={`${service.id}-${entry.label}`}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Icon className="h-3.5 w-3.5 text-white/34" strokeWidth={1.8} />
                    <span>{entry.label}</span>
                  </span>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export function generateStaticParams() {
  return getHumanoServices().map((service) => ({ service: service.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>
}): Promise<Metadata> {
  const { service } = await params
  const serviceData = getHumanoServiceBySlug(service)

  if (!serviceData) {
    return {
      title: "Servicios del Hotel en Miraflores Lima | Hotel Humano",
    }
  }

  return {
    title: `${serviceData.nombre} | Hotel Humano Miraflores`,
    description: serviceData.descripcionExperiencial,
  }
}

export default async function HumanoServiceDetailPage({
  params,
}: {
  params: Promise<{ service: string }>
}) {
  const { service } = await params
  const serviceData = getHumanoServiceBySlug(service)

  if (!serviceData) {
    notFound()
  }

  const moreServices = getHumanoServices()
    .filter((item) => item.id !== serviceData.id)
    .slice(0, 4)

  const ctaHref = serviceData.redirigir?.includes("@")
    ? `mailto:${serviceData.redirigir}?subject=${encodeURIComponent(`Consulta sobre ${serviceData.nombre}`)}`
    : serviceData.redirigir || "/humano/conserje"

  return (
    <div className={`${bodyFont.className} min-h-screen bg-[var(--color-azul-rgb)] text-[var(--color-azul-rgb)]`}>
      <WebStickyHeader
        brandHref="/humano/web#inicio"
        navItems={pageNavItems}
        activeHref="/humano/web/servicios"
        showReserve={false}
      />

      <main>
        <section className="relative overflow-hidden bg-[var(--color-azul-rgb)] pt-28 sm:pt-32">
          <div className="absolute inset-0">
            {serviceData.imagen ? (
              <Image
                src={serviceData.imagen}
                alt={serviceData.nombre}
                fill
                priority
                className="object-cover object-center opacity-14"
                sizes="100vw"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,48,53,0.98)_0%,rgba(0,48,53,0.93)_34%,rgba(0,48,53,0.74)_100%)]" />
            <div className="absolute left-[-8%] top-[14%] h-60 w-60 rounded-full bg-[var(--color-amarillo)]/10 blur-3xl" />
            <div className="absolute bottom-[-10%] right-[8%] h-80 w-80 rounded-full bg-white/6 blur-3xl" />
          </div>

          <div className="relative mx-auto w-full max-w-[1680px] px-6 pb-20 sm:px-10 sm:pb-24 xl:px-14">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,600px)_minmax(0,1fr)]">
              <div className="flex max-w-[600px] flex-col pt-14 sm:pt-16 lg:min-h-[640px] lg:pt-24 xl:min-h-[680px]">
                <div>
                  <div className="space-y-3">
                    <Link
                      href="/humano/web/servicios"
                      className="inline-flex items-center gap-2 text-sm font-medium text-white/68 transition hover:text-white/86"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Volver</span>
                    </Link>

                    <h1 className="text-4xl font-serif leading-tight text-white">
                      {serviceData.nombre}
                    </h1>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] font-medium text-white/76">
                    {serviceData.meta.slice(0, 3).map((entry) => {
                      const Icon = getServiceMetaIcon(entry)

                      return (
                        <span
                          key={`${serviceData.id}-${entry.label}`}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Icon className="h-4 w-4 text-white/52" strokeWidth={1.8} />
                          <span>{entry.label}</span>
                        </span>
                      )
                    })}
                  </div>

                  <p className="mt-5 max-w-[760px] text-[16px] leading-[1.65] text-white/84">
                    {serviceData.descripcionExperiencial}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <Link
                      href={ctaHref}
                      className={`${webPrimaryButtonClass} bg-white text-[var(--color-azul-rgb)] hover:bg-[var(--color-crema-soft)]`}
                    >
                      Coordinar servicio
                      <ArrowUpRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>

                <div className="mt-8 max-w-[38ch] border-t border-white/12 pt-8 text-right lg:ml-auto lg:self-end">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/54">
                    Lo esencial
                  </p>
                  <p className="mt-3 text-[13px] leading-[1.8] text-white/56">
                    {serviceData.descripcionFactual}
                  </p>
                </div>
              </div>

              <div className="lg:pt-4">
                <RoomDetailGallery
                  roomName={serviceData.nombre}
                  images={serviceData.imagenes}
                  showHumanoPlaceholder
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-4 bg-[var(--color-azul)] pb-14 pt-6 text-white sm:-mt-6 sm:rounded-t-[38px] sm:pb-16 sm:pt-8">
          <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 xl:px-14">
            <div className="border-t border-white/8 pt-5">
              <div className="max-w-[560px]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/52">
                  Más servicios
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-white/42">
                  Otros apoyos y detalles del hotel para completar tu estadía con menos fricción.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {moreServices.map((item) => (
                  <ServiceSuggestionCard key={item.id} service={item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer id="contacto" className="w-full bg-[var(--color-azul-rgb)] text-white">
          <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-6 px-4 py-8 text-sm text-white/90 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
            <WebFooterSocialLinks />

            <div className="flex flex-col items-center gap-4 text-center">
              <p>
                2026 Hotel Humano · Malecón Balta 710, Miraflores.
                Desarrollado por Armando Hoteles
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.12em] text-white/70">
                <Link href="/humano/web/libro-de-reclamaciones" className="transition-colors hover:text-[var(--color-amarillo)]">
                  Libro de Reclamaciones
                </Link>
                <span
                  aria-hidden="true"
                  className="hidden h-1 w-1 rounded-full bg-white/30 sm:block"
                />
                <Link href="/humano/web/terminos-y-condiciones" className="transition-colors hover:text-[var(--color-amarillo)]">
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
        </footer>
      </main>
    </div>
  )
}
