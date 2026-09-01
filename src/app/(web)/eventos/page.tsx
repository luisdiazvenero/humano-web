import Image from "next/image"
import Link from "next/link"
import { Inter } from "next/font/google"
import {
  ArrowDown,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Martini,
  Maximize,
  Presentation,
  Rows3,
  Ruler,
  UtensilsCrossed,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import {
  EventQuoteButton,
  EventQuoteProvider,
} from "@/components/humano-web/EventQuotePanel"
import { EventSpaceSlider } from "@/components/humano-web/EventSpaceSlider"
import { TrackLink } from "@/components/humano-web/TrackLink"
import { WebFooterSocialLinks } from "@/components/humano-web/WebFooterSocialLinks"
import { WebScrollToSectionButton } from "@/components/humano-web/WebScrollToSectionButton"
import { WebSectionEyebrow } from "@/components/humano-web/WebSectionEyebrow"
import { WebStickyHeader } from "@/components/humano-web/WebStickyHeader"
import { Reveal } from "@/components/motion/Reveal"
import { webPrimaryButtonClass } from "@/components/humano-web/webStyles"
import {
  EVENTS_CONTACT,
  getHumanoEventSpaces,
  getHumanoEventsStats,
  type EventSetupKind,
} from "@/lib/humano/events"
import { WEB_I18N, type WebLang } from "@/lib/web/i18n"
import { bonvoyUrl } from "@/lib/web/outbound"
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

const SETUP_ICONS: Record<EventSetupKind, LucideIcon> = {
  teatro: Presentation,
  aula: GraduationCap,
  conferencia: Users,
  "forma-u": Rows3,
  recepcion: Martini,
  banquete: UtensilsCrossed,
  directorio: Briefcase,
  coctel: Martini,
}

export function HumanoEventosPageContent({ lang = "es" }: { lang?: WebLang }) {
  const t = WEB_I18N[lang]
  const spaces = getHumanoEventSpaces(lang)
  const stats = getHumanoEventsStats(lang)
  const homeHref = lang === "en" ? "/en" : "/"
  const eventsHref = lang === "en" ? "/en/events" : "/eventos"
  const complaintsHref = lang === "en" ? "/en/complaints-book" : "/libro-de-reclamaciones"
  const termsHref = lang === "en" ? "/en/terms-and-conditions" : "/terminos-y-condiciones"
  const isEn = lang === "en"

  const heroStats = [
    { value: String(stats.spaces), label: t.eventsStatSpaces },
    { value: `${stats.totalArea} m²`, label: t.eventsStatArea },
    { value: `${stats.maxCapacity} pax`, label: t.eventsStatCapacity },
    { value: String(stats.setupKinds), label: t.eventsStatSetups },
  ]

  return (
    <EventQuoteProvider
      lang={lang}
      spaces={spaces.map((space) => ({ id: space.id, name: space.name }))}
    >
      <div className={`${bodyFont.className} bg-[var(--color-crema)] text-[var(--color-azul-rgb)]`}>
        <WebStickyHeader
          brandHref={homeHref}
          activeHref={eventsHref}
          lang={lang}
          className="quote-push"
        />

        <main className="quote-push">
        <section
          id="inicio"
          className="relative flex min-h-[80dvh] items-center overflow-hidden bg-[var(--color-azul-rgb)] pt-28 pb-16 sm:pt-32 sm:pb-20"
        >
          <div className="absolute inset-0">
            <Image
              src="/chatbot/imagenes/hab/signature_suite/signature_suite_1.webp"
              alt={isEn ? "Humano event spaces" : "Espacios para eventos Humano"}
              fill
              priority
              className="object-cover object-center opacity-28"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,48,53,0.94)_0%,rgba(0,48,53,0.8)_48%,rgba(0,48,53,0.5)_100%)]" />
            <div className="absolute left-[-10%] top-[18%] h-64 w-64 rounded-full bg-[var(--color-amarillo)]/12 blur-3xl" />
            <div className="absolute bottom-[-10%] right-[8%] h-72 w-72 rounded-full bg-white/8 blur-3xl" />
          </div>

          <div className="relative mx-auto w-full max-w-[1680px] px-6 sm:px-10 xl:px-14">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[minmax(0,760px)_420px] lg:items-end lg:justify-between lg:gap-12">
                <div className="max-w-[760px]">
                  <Link
                    href={`${homeHref}#hotel`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-white/68 transition hover:text-white/88"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{t.backToHotel}</span>
                  </Link>
                  <h1 className="text-4xl font-serif leading-tight text-white">
                    {t.eventsPageTitle}
                  </h1>
                  <p className="mt-4 max-w-[760px] text-[18px] leading-[1.5] text-white/85">
                    {t.eventsPageSubtitle}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <WebScrollToSectionButton
                      targetId="espacios"
                      eventName="web_events_explore_click"
                      className={`${webPrimaryButtonClass} bg-white text-[var(--color-azul-rgb)] hover:bg-[var(--color-crema-soft)]`}
                    >
                      {t.eventsExploreCta}
                      <ArrowDown className="h-5 w-5" />
                    </WebScrollToSectionButton>
                  </div>
                </div>

                <div className="max-w-[420px] justify-self-start lg:w-[420px] lg:justify-self-end lg:translate-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    {heroStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-[22px] border border-white/10 bg-[rgba(0,48,53,0.56)] px-4 py-4 text-center text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur-md"
                      >
                        <p className="font-serif text-[26px] leading-none text-white">{stat.value}</p>
                        <p className="mt-2 text-[11px] leading-snug text-white/64">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="espacios"
          className="relative z-10 -mt-8 scroll-mt-24 pb-24 pt-8 sm:-mt-10 sm:scroll-mt-28 sm:pb-28 sm:pt-10 lg:scroll-mt-32"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-[36px] bg-[var(--color-crema)] sm:h-36 sm:rounded-t-[42px]"
          />

          <div className="relative mx-auto w-full max-w-[1280px] px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8">
            <WebSectionEyebrow label={t.eventsEyebrow} />

            <div className="mt-12 flex flex-col gap-16 sm:gap-20 lg:gap-24">
              {spaces.map((space, spaceIndex) => {
                const isReversed = spaceIndex % 2 === 1

                return (
                  <Reveal key={space.id} amount={0.15}>
                    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                      <div className={isReversed ? "lg:order-2" : undefined}>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-azul-rgb)]/45">
                          {String(spaceIndex + 1).padStart(2, "0")}
                        </p>
                        <h2 className="mt-2 font-serif text-[30px] leading-tight text-[var(--color-azul-rgb)] sm:text-[34px]">
                          {space.name}
                        </h2>
                        <p className="mt-3 max-w-[560px] text-[16px] leading-[1.6] text-[var(--color-azul-rgb)]/72">
                          {space.description}
                        </p>

                        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-azul-rgb)]/6 text-[var(--color-azul-rgb)]/70">
                              <Ruler className="h-4 w-4" />
                            </span>
                            <div>
                              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-azul-rgb)]/45">
                                {t.eventsDimensionsLabel}
                              </dt>
                              <dd className="mt-1 text-sm font-medium text-[var(--color-azul-rgb)]">
                                {space.dimensions}
                              </dd>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-azul-rgb)]/6 text-[var(--color-azul-rgb)]/70">
                              <Maximize className="h-4 w-4" />
                            </span>
                            <div>
                              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-azul-rgb)]/45">
                                {t.eventsAreaLabel}
                              </dt>
                              <dd className="mt-1 text-sm font-medium text-[var(--color-azul-rgb)]">
                                {space.area}
                              </dd>
                            </div>
                          </div>
                        </dl>

                        <div className="mt-6 border-t border-[var(--color-azul-rgb)]/10 pt-5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]/45">
                            {t.eventsSetupsTitle}
                          </p>
                          <ul className="mt-3 flex flex-wrap gap-2">
                            {space.setups.map((setup) => {
                              const SetupIcon = SETUP_ICONS[setup.kind]

                              return (
                                <li
                                  key={`${space.id}-${setup.kind}`}
                                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-azul-rgb)]/12 bg-white/55 px-3.5 py-2 text-sm text-[var(--color-azul-rgb)]"
                                >
                                  <SetupIcon className="h-4 w-4 text-[var(--color-azul-rgb)]/60" />
                                  <span className="font-medium">{setup.label}</span>
                                  <span className="text-[var(--color-azul-rgb)]/55">
                                    {setup.capacity}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                          {space.note ? (
                            <p className="mt-3 text-sm leading-relaxed text-[var(--color-azul-rgb)]/60">
                              {space.note}
                            </p>
                          ) : null}
                        </div>

                        <div className="mt-6 border-t border-[var(--color-azul-rgb)]/10 pt-5">
                          <div className="flex flex-wrap items-center gap-3">
                            <EventQuoteButton
                              spaceId={space.id}
                              spaceName={space.name}
                              label={t.eventsEmailCta}
                            />
                            <TrackLink
                              href={`${EVENTS_CONTACT.whatsapp}?text=${encodeURIComponent(
                                isEn
                                  ? `Hi! I'd like information about ${space.name} at Hotel Humano.`
                                  : `¡Hola! Quisiera información sobre ${space.name} en Hotel Humano.`
                              )}`}
                              eventName="web_event_whatsapp_click"
                              eventParams={{ space: space.name }}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-azul-rgb)]/18 px-5 py-2.5 text-sm font-semibold text-[var(--color-azul-rgb)] transition-colors hover:bg-[var(--color-azul-rgb)]/6"
                            >
                              <WhatsAppIcon className="h-4 w-4" />
                              {t.eventsWhatsappCta}
                            </TrackLink>
                          </div>
                        </div>
                      </div>

                      <EventSpaceSlider
                        spaceName={space.name}
                        images={space.images}
                        lang={lang}
                        className={isReversed ? "lg:order-1" : undefined}
                      />
                    </article>
                  </Reveal>
                )
              })}
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
                  <Link
                    href={complaintsHref}
                    className="transition-colors hover:text-[var(--color-amarillo)]"
                  >
                    {t.footerComplaints}
                  </Link>
                  <span
                    aria-hidden="true"
                    className="hidden h-1 w-1 rounded-full bg-white/30 sm:block"
                  />
                  <Link
                    href={termsHref}
                    className="transition-colors hover:text-[var(--color-amarillo)]"
                  >
                    {t.footerTerms}
                  </Link>
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <Link
                  href={bonvoyUrl()}
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
    </EventQuoteProvider>
  )
}

export const metadata = buildPageMetadata("es", {
  title: WEB_I18N.es.eventsMetaTitle,
  description: WEB_I18N.es.eventsMetaDescription,
  canonical: "/eventos",
  alternates: { es: "/eventos", en: "/en/events" },
})

export default function HumanoEventosPage() {
  return <HumanoEventosPageContent lang="es" />
}
