import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { TrackLink } from "@/components/humano-web/TrackLink"
import { Inter } from "next/font/google"
import {
  ArrowLeft,
  ArrowUpRight,
  BedDouble,
  CookingPot,
  Expand,
  Sparkles,
  SunMedium,
  Tv,
  Wifi,
} from "lucide-react"
import { notFound } from "next/navigation"

import { WebFooterSocialLinks } from "@/components/humano-web/WebFooterSocialLinks"
import { RoomDetailGallery } from "@/components/humano-web/RoomDetailGallery"
import { WebStickyHeader } from "@/components/humano-web/WebStickyHeader"
import { webMediaBadgeClass, webPrimaryButtonClass } from "@/components/humano-web/webStyles"
import { getHumanoRoomBySlug, getHumanoRooms, type HumanoRoom } from "@/lib/humano/rooms"

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

const pageNavItems = [
  { label: "Home", href: "/#inicio" },
  { label: "Habitaciones", href: "/habitaciones" },
  { label: "Hotel", href: "/hotel" },
  { label: "Servicios", href: "/servicios" },
  { label: "Contacto", href: "/contacto" },
]

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

function RoomPreviewCard({
  room,
  compact = false,
}: {
  room: HumanoRoom
  compact?: boolean
}) {
  const previewMeta = compact ? room.meta.slice(0, 3) : room.meta.slice(0, 4)

  return (
    <Link
      href={`/${room.slug}`}
      aria-label={`Ver detalle de ${room.nombre}`}
      className={`group block w-full overflow-hidden text-left transition-all duration-300 hover:-translate-y-0.5 ${
        compact
          ? "rounded-[22px] bg-transparent shadow-none"
          : "rounded-2xl border border-border/35 bg-white shadow-sm hover:shadow-[0_18px_38px_rgba(0,0,0,0.14)]"
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          compact ? "aspect-[5/4]" : "aspect-[4/5] sm:aspect-[16/10]"
        }`}
      >
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

        <div
          className={`absolute inset-0 ${
            compact
              ? "bg-gradient-to-t from-black/48 via-black/10 to-transparent"
              : "bg-gradient-to-t from-black/85 via-black/35 to-transparent"
          }`}
        />

        <span className={`absolute ${compact ? "left-5 top-5" : "left-7 top-7"} ${webMediaBadgeClass}`}>
          {room.categoria}
        </span>

        <span
          aria-hidden="true"
          className={`absolute inline-flex items-center justify-center rounded-full bg-white/12 text-white/88 backdrop-blur-sm transition-all duration-200 group-hover:bg-white/18 group-hover:text-white ${
            compact ? "bottom-4 right-4 h-9 w-9" : "bottom-8 right-8 h-11 w-11"
          }`}
        >
          <ArrowUpRight
            className={compact ? "h-4 w-4" : "h-4.5 w-4.5"}
            strokeWidth={1.9}
          />
        </span>
      </div>

      {compact ? (
        <div className="px-1 pb-1 pt-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-[24px] leading-[1.04] text-white/92">
              {room.nombre}
            </h3>
            <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/44 transition group-hover:text-white/62">
              Ver
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </span>
          </div>

          {previewMeta.length ? (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] font-medium text-white/58">
              {previewMeta.map((entry) => {
                const Icon = getRoomMetaIcon(entry)

                return (
                  <span
                    key={`${room.id}-${entry.label}`}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Icon className="h-3.5 w-3.5 text-white/38" strokeWidth={1.8} />
                    <span>{entry.label}</span>
                  </span>
                )
              })}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="absolute bottom-8 left-8 right-24">
          <h3 className="font-serif text-[30px] leading-[1.02] text-white drop-shadow-md sm:text-[26px]">
            {room.nombre}
          </h3>

          {previewMeta.length ? (
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-white/84">
              {previewMeta.map((entry) => {
                const Icon = getRoomMetaIcon(entry)

                return (
                  <span
                    key={`${room.id}-${entry.label}`}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4 text-white/72" strokeWidth={1.8} />
                    <span>{entry.label}</span>
                  </span>
                )
              })}
            </div>
          ) : null}

          <p className="mt-3 max-w-[32ch] line-clamp-2 text-sm leading-relaxed text-white/84 drop-shadow-sm">
            {room.descripcionCorta.replace(/\.$/, "")}.
          </p>
        </div>
      )}
    </Link>
  )
}

function RoomSuggestionCard({ room }: { room: HumanoRoom }) {
  const previewMeta = room.meta.slice(0, 3)

  return (
    <Link
      href={`/${room.slug}`}
      aria-label={`Ver detalle de ${room.nombre}`}
      className="group block text-left"
    >
      <div className="flex items-center gap-3 rounded-[22px] bg-white/[0.03] p-3 transition-colors duration-200 group-hover:bg-white/[0.05]">
        <div className="relative h-[92px] w-[104px] shrink-0 overflow-hidden rounded-[16px] bg-white/5 sm:h-[96px] sm:w-[112px]">
          {room.imagen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={room.imagen}
              alt={room.nombre}
              className="h-full w-full object-cover opacity-92 transition duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-white/5" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/22 via-black/0 to-transparent" />

          <span className={`absolute left-2.5 top-2.5 scale-[0.92] ${webMediaBadgeClass}`}>
            {room.categoria}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-[19px] leading-[1.06] text-white/88 transition-colors duration-200 group-hover:text-white">
              {room.nombre}
            </h3>

            <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/42 transition-colors duration-200 group-hover:text-white/62">
              Ver
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </span>
          </div>

          {previewMeta.length ? (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium text-white/52">
              {previewMeta.map((entry) => {
                const Icon = getRoomMetaIcon(entry)

                return (
                  <span
                    key={`${room.id}-${entry.label}`}
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
  return getHumanoRooms().map((room) => ({ room: room.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ room: string }>
}): Promise<Metadata> {
  const { room } = await params
  const roomData = getHumanoRoomBySlug(room)

  if (!roomData) {
    return {
      title: "Habitación en Miraflores Lima | Hotel Humano",
    }
  }

  return {
    title: `Habitación ${roomData.nombre} en Miraflores Lima | Hotel Humano`,
    description: roomData.descripcionExperiencial,
  }
}

export default async function HumanoRoomPage({
  params,
}: {
  params: Promise<{ room: string }>
}) {
  const { room } = await params
  const roomData = getHumanoRoomBySlug(room)

  if (!roomData) {
    notFound()
  }

  const reserveHref =
    roomData.reservaUrl ||
    "https://www.marriott.com/es/hotels/limtx-humano-lima-a-tribute-portfolio-hotel/rooms/"

  const moreRooms = getHumanoRooms()
    .filter((item) => item.id !== roomData.id)
    .slice(0, 4)

  return (
    <div className={`${bodyFont.className} min-h-screen bg-[var(--color-azul-rgb)] text-[var(--color-azul-rgb)]`}>
      <WebStickyHeader
        brandHref="/#inicio"
        navItems={pageNavItems}
        activeHref="/habitaciones"
        showReserve={false}
      />

      <main>
        <section className="relative overflow-hidden bg-[var(--color-azul-rgb)] pt-28 sm:pt-32">
          <div className="absolute inset-0">
            {roomData.imagen ? (
              <Image
                src={roomData.imagen}
                alt={roomData.nombre}
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
                      href="/habitaciones"
                      className="inline-flex items-center gap-2 text-sm font-medium text-white/68 transition hover:text-white/86"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Volver</span>
                    </Link>

                    <h1 className="text-4xl font-serif leading-tight text-white">
                      {roomData.nombre}
                    </h1>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] font-medium text-white/76">
                    {roomData.meta.slice(0, 4).map((entry) => {
                      const Icon = getRoomMetaIcon(entry)

                      return (
                        <span
                          key={`${roomData.id}-${entry.label}`}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Icon className="h-4 w-4 text-white/52" strokeWidth={1.8} />
                          <span>{entry.label}</span>
                        </span>
                      )
                    })}
                  </div>

                  <p className="mt-5 max-w-[760px] text-[16px] leading-[1.65] text-white/84">
                    {roomData.descripcionExperiencial}
                  </p>

                  {roomData.perfilIdeal.includes("familia") ? (
                    <p className="mt-4 text-[15px] leading-relaxed text-white/52">
                      Si tus hijos tienen 12 años o más, otras habitaciones del hotel se adaptan muy bien a ese plan.
                    </p>
                  ) : null}

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <TrackLink
                      href={reserveHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      eventName="web_room_reserve_click"
                      eventParams={{ room_slug: roomData.slug, room_name: roomData.nombre }}
                      className={`${webPrimaryButtonClass} bg-white text-[var(--color-azul-rgb)] hover:bg-[var(--color-crema-soft)]`}
                    >
                      Reserva
                      <ArrowUpRight className="h-5 w-5" />
                    </TrackLink>
                  </div>
                </div>

                <div className="mt-8 max-w-[38ch] border-t border-white/12 pt-8 text-right lg:ml-auto lg:self-end">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/54">
                    Lo esencial
                  </p>
                  <p className="mt-3 text-[13px] leading-[1.8] text-white/56">
                    {roomData.descripcionFactual}
                  </p>
                </div>
              </div>

              <div className="lg:pt-4">
                <RoomDetailGallery
                  roomName={roomData.nombre}
                  images={
                    roomData.imagenes.length
                      ? roomData.imagenes
                      : roomData.imagen
                        ? [roomData.imagen]
                        : []
                  }
                  videoHorizontal={roomData.videoHorizontal}
                  videoVertical={roomData.videoVertical}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-4 bg-[var(--color-azul)] pb-14 pt-6 text-white sm:-mt-6 sm:rounded-t-[38px] sm:pb-16 sm:pt-8">
          <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 xl:px-14">
            <div className="max-w-[560px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                Más habitaciones
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-white/42">
                Otras opciones para comparar amplitud, cama y experiencia antes de reservar.
              </p>
            </div>

            <div className="mt-5 border-t border-white/8 pt-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {moreRooms.map((item) => (
                <RoomSuggestionCard key={item.id} room={item} />
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
                <Link
                  href="/libro-de-reclamaciones"
                  className="transition-colors hover:text-[var(--color-amarillo)]"
                >
                  Libro de Reclamaciones
                </Link>
                <span
                  aria-hidden="true"
                  className="hidden h-1 w-1 rounded-full bg-white/30 sm:block"
                />
                <Link
                  href="/terminos-y-condiciones"
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
        </footer>
      </main>
    </div>
  )
}
