import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { TrackLink } from "@/components/humano-web/TrackLink"
import { Inter } from "next/font/google"
import {
  ArrowLeft,
  ArrowUpRight,
  FileText,
  Mail,
  Phone,
} from "lucide-react"
import { notFound } from "next/navigation"

import { WebFooterSocialLinks } from "@/components/humano-web/WebFooterSocialLinks"
import { RoomDetailGallery } from "@/components/humano-web/RoomDetailGallery"
import { WebStickyHeader } from "@/components/humano-web/WebStickyHeader"
import { getMetaIcon } from "@/components/humano-web/MetaIcon"
import { Reveal } from "@/components/motion/Reveal"
import {
  getHumanoFacilities,
  getHumanoFacilityBySlug,
  type HumanoFacility,
} from "@/lib/humano/facilities"
import { webMediaBadgeClass, webPrimaryButtonClass } from "@/components/humano-web/webStyles"
import { WEB_I18N, type WebLang } from "@/lib/web/i18n"
import { buildPageMetadata } from "@/lib/web/seo"

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)


type RestaurantConfig = {
  bullets?: string[]
  schedule?: Array<{ day: string; hours: string }>
  reservationLabel: string
  phone: string
  whatsapp: string
  email: string
  menuPdf: string
  reserveCta: string
  menuCta: string
  emailLabel: string
  phoneLabel: string
  scheduleLabel?: string
}

const RESTAURANT_DETAILS: Record<string, Record<WebLang, RestaurantConfig>> = {
  INST_RESTAURANTE_CDL: {
    es: {
      bullets: [
        "Desayuno buffet, todos los días, de 06:30 hrs – 10:30 hrs.",
        "Almuerzo y cena a la carta.",
        "Tragos y piqueos en nuestro Lobby Bar.",
      ],
      reservationLabel: "Reservas",
      phone: "+51 934 306 844",
      phoneLabel: "Teléfono",
      whatsapp: "https://wa.link/4ty7ii",
      email: "reservas.ayb@humanohoteles.com",
      emailLabel: "Correo",
      menuPdf: "/pdfs/carta-cafe-de-lima-es.pdf",
      reserveCta: "Reservar",
      menuCta: "Ver carta",
    },
    en: {
      bullets: [
        "Buffet breakfast, daily, 6:30 AM – 10:30 AM.",
        "À la carte lunch and dinner.",
        "Drinks and small plates at our Lobby Bar.",
      ],
      reservationLabel: "Reservations",
      phone: "+51 934 306 844",
      phoneLabel: "Phone",
      whatsapp: "https://wa.link/flgsgc",
      email: "reservas.ayb@humanohoteles.com",
      emailLabel: "Email",
      menuPdf: "/pdfs/carta-cafe-de-lima-en.pdf",
      reserveCta: "Reservation",
      menuCta: "View menu",
    },
  },
  INST_RESTAURANTE_ENT: {
    es: {
      schedule: [
        { day: "Lunes", hours: "Cerrado" },
        { day: "Martes a viernes", hours: "18:00 – 23:00 hrs" },
        { day: "Sábado", hours: "12:00 – 23:00 hrs" },
        { day: "Domingo", hours: "12:00 – 17:00 hrs" },
      ],
      scheduleLabel: "Horarios",
      reservationLabel: "Reservas",
      phone: "+51 934 306 844",
      phoneLabel: "Teléfono",
      whatsapp: "https://wa.link/6a2hwm",
      email: "reservas.ayb@humanohoteles.com",
      emailLabel: "Correo",
      menuPdf: "/pdfs/carta-entranable-es.pdf",
      reserveCta: "Reservar",
      menuCta: "Ver carta",
    },
    en: {
      schedule: [
        { day: "Monday", hours: "Closed" },
        { day: "Tuesday to Friday", hours: "6:00 PM – 11:00 PM" },
        { day: "Saturday", hours: "12:00 PM – 11:00 PM" },
        { day: "Sunday", hours: "12:00 PM – 5:00 PM" },
      ],
      scheduleLabel: "Hours",
      reservationLabel: "Reservations",
      phone: "+51 934 306 844",
      phoneLabel: "Phone",
      whatsapp: "https://wa.link/3k3ntj",
      email: "reservas.ayb@humanohoteles.com",
      emailLabel: "Email",
      menuPdf: "/pdfs/carta-entranable-en.pdf",
      reserveCta: "Reservation",
      menuCta: "View menu",
    },
  },
}

type MeetingConfig = {
  capacityLabel: string
  unit: string
  capacities: Array<{ room: string; people: number }>
  contactLabel: string
  email: string
  phone: string
  cta: string
  mailSubject: string
}

const MEETING_DETAILS: Record<WebLang, MeetingConfig> = {
  es: {
    capacityLabel: "Aforo máximo",
    unit: "personas",
    capacities: [
      { room: "Salón Balta", people: 50 },
      { room: "Directorio Paniagua", people: 12 },
      { room: "Directorio Granada", people: 8 },
    ],
    contactLabel: "Eventos",
    email: "eventos@humanohoteles.com",
    phone: "+51 934 300 993",
    cta: "Cotizar evento",
    mailSubject: "Consulta de eventos",
  },
  en: {
    capacityLabel: "Maximum capacity",
    unit: "people",
    capacities: [
      { room: "Salón Balta", people: 50 },
      { room: "Directorio Paniagua", people: 12 },
      { room: "Directorio Granada", people: 8 },
    ],
    contactLabel: "Events",
    email: "eventos@humanohoteles.com",
    phone: "+51 934 300 993",
    cta: "Request a quote",
    mailSubject: "Events inquiry",
  },
}

const FACILITY_MENU: Record<string, Record<WebLang, { label: string; pdf: string }>> = {
  INST_COWORKING: {
    es: { label: "Ver carta", pdf: "/pdfs/carta-coworking.pdf" },
    en: { label: "View menu", pdf: "/pdfs/carta-coworking.pdf" },
  },
  INST_BAR: {
    es: { label: "Ver carta", pdf: "/pdfs/carta-lobby-bar.pdf" },
    en: { label: "View menu", pdf: "/pdfs/carta-lobby-bar.pdf" },
  },
}

function FacilitySuggestionCard({
  facility,
  lang,
}: {
  facility: HumanoFacility
  lang: WebLang
}) {
  const previewMeta = facility.meta.slice(0, 3)
  const detailHref =
    lang === "en" ? `/en/hotel/${facility.slug}` : `/hotel/${facility.slug}`
  const seeLabel = lang === "en" ? "See" : "Ver"
  const ariaLabel =
    lang === "en"
      ? `View detail for ${facility.nombre}`
      : `Ver detalle de ${facility.nombre}`

  return (
    <Link
      href={detailHref}
      aria-label={ariaLabel}
      className="group block text-left"
    >
      <div className="flex items-center gap-3 rounded-[22px] bg-white/[0.03] p-3 transition-colors duration-200 group-hover:bg-white/[0.05]">
        <div className="relative h-[92px] w-[104px] shrink-0 overflow-hidden rounded-[16px] bg-white/5 sm:h-[96px] sm:w-[112px]">
          {facility.imagen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={facility.imagen}
              alt={facility.nombre}
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
            {facility.categoria}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-[19px] leading-[1.06] text-white/88 transition-colors duration-200 group-hover:text-white">
              {facility.nombre}
            </h3>

            <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/42 transition-colors duration-200 group-hover:text-white/62">
              {seeLabel}
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </span>
          </div>

          {previewMeta.length ? (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium text-white/52">
              {previewMeta.map((entry) => {
                const Icon = getMetaIcon(entry.kind)

                return (
                  <span
                    key={`${facility.id}-${entry.label}`}
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

export function FacilityDetailPageContent({
  slug,
  lang = "es",
}: {
  slug: string
  lang?: WebLang
}) {
  const t = WEB_I18N[lang]
  const facilityData = getHumanoFacilityBySlug(slug, lang)

  if (!facilityData) {
    notFound()
  }

  const homeHref = lang === "en" ? "/en" : "/"
  const hotelHref = lang === "en" ? "/en/hotel" : "/hotel"
  const backLabel = lang === "en" ? "Back to Hotel" : "Volver a Hotel"
  const ctaLabel = lang === "en" ? "Discover facility" : "Conocer instalación"
  const essentialsLabel = lang === "en" ? "The essentials" : "Lo esencial"
  const moreFacilitiesLabel =
    lang === "en" ? "More facilities" : "Más instalaciones"
  const moreFacilitiesIntro =
    lang === "en"
      ? "Other spaces at the hotel to accompany different moments of your stay."
      : "Otros espacios del hotel para acompañar distintos momentos de tu estadía."

  const moreFacilities = getHumanoFacilities(lang)
    .filter((item) => item.id !== facilityData.id)
    .slice(0, 4)

  const restaurantConfig = RESTAURANT_DETAILS[facilityData.id]?.[lang] ?? null
  const meetingConfig =
    facilityData.id === "INST_SALAS_REUNIONES" ? MEETING_DETAILS[lang] : null
  const menuConfig = FACILITY_MENU[facilityData.id]?.[lang] ?? null

  return (
    <div className={`${bodyFont.className} min-h-screen bg-[var(--color-azul-rgb)] text-[var(--color-azul-rgb)]`}>
      <WebStickyHeader
        brandHref={homeHref}
        activeHref={hotelHref}
        showReserve={false}
        lang={lang}
      />

      <main>
        <section className="relative overflow-hidden bg-[var(--color-azul-rgb)] pt-28 sm:pt-32">
          <div className="absolute inset-0">
            {facilityData.imagen ? (
              <Image
                src={facilityData.imagen}
                alt={facilityData.nombre}
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
                      href={hotelHref}
                      className="inline-flex items-center gap-2 text-sm font-medium text-white/68 transition hover:text-white/86"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>{backLabel}</span>
                    </Link>

                    <h1 className="text-4xl font-serif leading-tight text-white">
                      {facilityData.nombre}
                    </h1>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] font-medium text-white/76">
                    {facilityData.meta.slice(0, 3).map((entry) => {
                      const Icon = getMetaIcon(entry.kind)

                      return (
                        <span
                          key={`${facilityData.id}-${entry.label}`}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Icon className="h-4 w-4 text-white/52" strokeWidth={1.8} />
                          <span>{entry.label}</span>
                        </span>
                      )
                    })}
                  </div>

                  <p className="mt-5 max-w-[760px] text-[16px] leading-[1.65] text-white/84">
                    {facilityData.descripcionExperiencial}
                  </p>

                  {restaurantConfig?.bullets ? (
                    <ul className="mt-5 max-w-[680px] space-y-2 text-[15px] leading-[1.55] text-white/82">
                      {restaurantConfig.bullets.map((line) => (
                        <li key={line} className="flex gap-3">
                          <span aria-hidden="true" className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {restaurantConfig?.schedule ? (
                    <div className="mt-6 max-w-[480px]">
                      {restaurantConfig.scheduleLabel ? (
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/56">
                          {restaurantConfig.scheduleLabel}
                        </p>
                      ) : null}
                      <ul className="mt-2 divide-y divide-white/10 text-[14px] leading-[1.5] text-white/82">
                        {restaurantConfig.schedule.map((entry) => (
                          <li key={entry.day} className="flex items-center justify-between gap-4 py-2">
                            <span className="font-medium text-white/88">{entry.day}</span>
                            <span className="text-white/74">{entry.hours}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {meetingConfig ? (
                    <div className="mt-6 max-w-[480px]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/56">
                        {meetingConfig.capacityLabel}
                      </p>
                      <ul className="mt-2 divide-y divide-white/10 text-[14px] leading-[1.5] text-white/82">
                        {meetingConfig.capacities.map((entry) => (
                          <li key={entry.room} className="flex items-center justify-between gap-4 py-2">
                            <span className="font-medium text-white/88">{entry.room}</span>
                            <span className="text-white/74">
                              {entry.people} {meetingConfig.unit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {restaurantConfig ? (
                      <>
                        <TrackLink
                          href={restaurantConfig.whatsapp}
                          eventName="web_restaurant_whatsapp_click"
                          eventParams={{ facility_slug: facilityData.slug, facility_name: facilityData.nombre }}
                          className={`${webPrimaryButtonClass} bg-white text-[var(--color-azul-rgb)] hover:bg-[var(--color-crema-soft)]`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WhatsAppIcon className="h-5 w-5" />
                          {restaurantConfig.reserveCta}
                        </TrackLink>
                        <TrackLink
                          href={restaurantConfig.menuPdf}
                          eventName="web_restaurant_menu_click"
                          eventParams={{ facility_slug: facilityData.slug, facility_name: facilityData.nombre }}
                          className={`${webPrimaryButtonClass} border border-white/30 bg-transparent text-white hover:bg-white/10`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="h-5 w-5" strokeWidth={1.8} />
                          {restaurantConfig.menuCta}
                        </TrackLink>
                      </>
                    ) : meetingConfig ? (
                      <TrackLink
                        href={`mailto:${meetingConfig.email}?subject=${encodeURIComponent(meetingConfig.mailSubject)}`}
                        eventName="web_facility_cta_click"
                        eventParams={{ facility_slug: facilityData.slug, facility_name: facilityData.nombre }}
                        className={`${webPrimaryButtonClass} bg-white text-[var(--color-azul-rgb)] hover:bg-[var(--color-crema-soft)]`}
                      >
                        <Mail className="h-5 w-5" strokeWidth={1.8} />
                        {meetingConfig.cta}
                      </TrackLink>
                    ) : menuConfig ? (
                      <TrackLink
                        href={menuConfig.pdf}
                        eventName="web_facility_menu_click"
                        eventParams={{ facility_slug: facilityData.slug, facility_name: facilityData.nombre }}
                        className={`${webPrimaryButtonClass} bg-white text-[var(--color-azul-rgb)] hover:bg-[var(--color-crema-soft)]`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-5 w-5" strokeWidth={1.8} />
                        {menuConfig.label}
                      </TrackLink>
                    ) : (
                      <TrackLink
                        href={`/conserje?item=${facilityData.id}`}
                        eventName="web_facility_cta_click"
                        eventParams={{ facility_slug: facilityData.slug, facility_name: facilityData.nombre }}
                        className={`${webPrimaryButtonClass} bg-white text-[var(--color-azul-rgb)] hover:bg-[var(--color-crema-soft)]`}
                      >
                        {ctaLabel}
                        <ArrowUpRight className="h-5 w-5" />
                      </TrackLink>
                    )}
                  </div>
                </div>

                {restaurantConfig ? (
                  <div className="mt-8 max-w-[420px] border-t border-white/12 pt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/56">
                      {restaurantConfig.reservationLabel}
                    </p>
                    <div className="mt-3 flex flex-col gap-2 text-[14px] leading-[1.5] text-white/82">
                      <a
                        href={`tel:${restaurantConfig.phone.replace(/\s+/g, "")}`}
                        className="inline-flex items-center gap-2 text-white/86 transition hover:text-white"
                      >
                        <Phone className="h-4 w-4 text-white/56" strokeWidth={1.8} />
                        <span>{restaurantConfig.phone}</span>
                      </a>
                      <a
                        href={`mailto:${restaurantConfig.email}`}
                        className="inline-flex items-center gap-2 text-white/86 transition hover:text-white"
                      >
                        <Mail className="h-4 w-4 text-white/56" strokeWidth={1.8} />
                        <span>{restaurantConfig.email}</span>
                      </a>
                    </div>
                  </div>
                ) : meetingConfig ? (
                  <div className="mt-8 max-w-[420px] border-t border-white/12 pt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/56">
                      {meetingConfig.contactLabel}
                    </p>
                    <div className="mt-3 flex flex-col gap-2 text-[14px] leading-[1.5] text-white/82">
                      <a
                        href={`tel:${meetingConfig.phone.replace(/\s+/g, "")}`}
                        className="inline-flex items-center gap-2 text-white/86 transition hover:text-white"
                      >
                        <Phone className="h-4 w-4 text-white/56" strokeWidth={1.8} />
                        <span>{meetingConfig.phone}</span>
                      </a>
                      <a
                        href={`mailto:${meetingConfig.email}`}
                        className="inline-flex items-center gap-2 text-white/86 transition hover:text-white"
                      >
                        <Mail className="h-4 w-4 text-white/56" strokeWidth={1.8} />
                        <span>{meetingConfig.email}</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 max-w-[38ch] border-t border-white/12 pt-8 text-right lg:ml-auto lg:self-end">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/54">
                      {essentialsLabel}
                    </p>
                    <p className="mt-3 text-[13px] leading-[1.8] text-white/56">
                      {facilityData.descripcionFactual}
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:pt-4">
                <RoomDetailGallery
                  roomName={facilityData.nombre}
                  images={facilityData.imagenes}
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
                  {moreFacilitiesLabel}
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-white/42">
                  {moreFacilitiesIntro}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {moreFacilities.map((item) => (
                  <FacilitySuggestionCard key={item.id} facility={item} lang={lang} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer id="contacto" className="w-full bg-[var(--color-azul-rgb)] text-white">
          <Reveal amount={0.15}>
            <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-6 px-4 py-8 text-sm text-white/90 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
            <WebFooterSocialLinks />

              <div className="flex flex-col items-center gap-4 text-center">
                <p>{t.footerCopyright}</p>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.12em] text-white/70">
                  <Link href="/libro-de-reclamaciones" className="transition-colors hover:text-[var(--color-amarillo)]">
                    {t.footerComplaints}
                  </Link>
                  <span
                    aria-hidden="true"
                    className="hidden h-1 w-1 rounded-full bg-white/30 sm:block"
                  />
                  <Link href="/terminos-y-condiciones" className="transition-colors hover:text-[var(--color-amarillo)]">
                    {t.footerTerms}
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

export function generateStaticParams() {
  return getHumanoFacilities().map((facility) => ({ facility: facility.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ facility: string }>
}): Promise<Metadata> {
  const { facility } = await params
  const facilityData = getHumanoFacilityBySlug(facility, "es")

  if (!facilityData) {
    return buildPageMetadata("es", {
      title: "Instalaciones del Hotel en Miraflores Lima | Hotel Humano",
      description: WEB_I18N.es.hotelMetaDescription,
      canonical: `/hotel/${facility}`,
      alternates: { es: `/hotel/${facility}`, en: `/en/hotel/${facility}` },
    })
  }

  return buildPageMetadata("es", {
    title: `${facilityData.nombre} | Hotel Humano Miraflores`,
    description: facilityData.descripcionExperiencial,
    canonical: `/hotel/${facilityData.slug}`,
    alternates: { es: `/hotel/${facilityData.slug}`, en: `/en/hotel/${facilityData.slug}` },
    ogImage: facilityData.imagen ?? undefined,
  })
}

export default async function HumanoFacilityDetailPage({
  params,
}: {
  params: Promise<{ facility: string }>
}) {
  const { facility } = await params
  return <FacilityDetailPageContent slug={facility} lang="es" />
}
