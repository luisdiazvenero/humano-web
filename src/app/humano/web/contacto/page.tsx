import type { Metadata } from "next"
import Link from "next/link"
import { Inter } from "next/font/google"
import { ScrollText, Mail, MapPin, Phone } from "lucide-react"

import { WebContactForm } from "@/components/humano-web/WebContactForm"
import {
  FacebookSolidIcon,
  InstagramBalancedIcon,
} from "@/components/humano-web/WebFooterSocialLinks"
import { WebStickyHeader } from "@/components/humano-web/WebStickyHeader"

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

export const metadata: Metadata = {
  title: "Contacto · Humano Website",
  description:
    "Ponte en contacto con Humano Hotel en Miraflores para resolver dudas, coordinar tu estadía o solicitar información.",
}

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/humanolima/?hl=es",
    icon: InstagramBalancedIcon,
    iconClassName: "h-[24px] w-[24px]",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/humanolima/",
    icon: FacebookSolidIcon,
    iconClassName: "h-7 w-7",
  },
]

export default function HumanoContactoPage() {
  return (
    <div className={`${bodyFont.className} min-h-screen bg-[var(--color-azul-rgb)] text-white`}>
      <WebStickyHeader
        brandHref="/humano/web#inicio"
        navItems={pageNavItems}
        activeHref="/humano/web/contacto"
        showReserve={false}
      />

      <main>
        <section className="relative overflow-hidden bg-[var(--color-azul-rgb)] pt-28 sm:pt-32">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,48,53,0.98)_0%,rgba(0,48,53,0.94)_36%,rgba(0,48,53,0.72)_100%)]" />
            <div className="absolute left-[-8%] top-[14%] h-64 w-64 rounded-full bg-[var(--color-amarillo)]/10 blur-3xl" />
            <div className="absolute bottom-[-10%] right-[4%] h-72 w-72 rounded-full bg-white/6 blur-3xl" />
          </div>

          <div className="relative mx-auto w-full max-w-[1680px] px-6 pb-16 sm:px-10 sm:pb-20 xl:px-14">
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,710px)_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[minmax(0,740px)_minmax(0,1.08fr)] xl:gap-20">
              <div className="flex max-w-[740px] flex-col pt-14 sm:pt-16 lg:pt-24">
                <div>
                  <div className="grid gap-4 lg:grid-cols-[210px_minmax(0,1fr)] lg:items-start lg:gap-8">
                    <h1 className="text-4xl font-serif leading-none text-white">
                      Contacto
                    </h1>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/12 pt-7">
                  <div className="grid gap-10 lg:grid-cols-[minmax(0,250px)_minmax(0,1fr)] lg:gap-12">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/54">
                        Datos de contacto
                      </p>

                      <div className="mt-4 space-y-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] text-white/72">
                            <MapPin className="h-4.5 w-4.5" />
                          </span>
                          <div>
                            <p className="text-sm font-medium text-white/92">
                              Malecón Balta 710
                            </p>
                            <p className="text-sm leading-relaxed text-white/58">
                              Miraflores, Lima 15074
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] text-white/72">
                            <Mail className="h-4.5 w-4.5" />
                          </span>
                          <div>
                            <a
                              href="mailto:hola@humanohoteles.com"
                              className="text-sm font-medium text-white/92 transition hover:text-white"
                            >
                              hola@humanohoteles.com
                            </a>
                            <p className="text-sm leading-relaxed text-white/58">
                              Respuesta en un plazo breve
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] text-white/72">
                            <Phone className="h-4.5 w-4.5" />
                          </span>
                          <div>
                            <a
                              href="tel:+5119041400"
                              className="text-sm font-medium text-white/92 transition hover:text-white"
                            >
                              Front Desk: 01-904-14-00
                            </a>
                            <p className="text-sm leading-relaxed text-white/58">
                              Atención diaria
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-7 border-t border-white/10 pt-5">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] text-white/72">
                            <ScrollText className="h-4.5 w-4.5" />
                          </span>

                          <div className="flex min-w-0 flex-col gap-2 pt-1">
                            <Link
                              href="/humano/web/libro-de-reclamaciones"
                              className="text-sm font-medium text-white/92 transition hover:text-white"
                            >
                              Libro de Reclamaciones
                            </Link>
                            <Link
                              href="/humano/web/terminos-y-condiciones"
                              className="text-sm font-medium text-white/58 transition hover:text-white/82"
                            >
                              Términos y Condiciones
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-white/10 pt-5">
                        {socialLinks.map(({ label, href, icon: Icon, iconClassName }) => (
                          <Link
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-7 w-7 items-center justify-center text-white/82 transition hover:text-white"
                            aria-label={label}
                          >
                            <Icon className={iconClassName} />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="max-w-[440px] lg:max-w-none">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/54">
                        Formulario de contacto
                      </p>

                      <div className="mt-4">
                        <WebContactForm />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:pt-6">
                <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.03] shadow-[0_20px_54px_rgba(0,0,0,0.18)]">
                  <div className="pointer-events-none absolute right-5 top-5 z-10 rounded-full bg-[rgba(0,48,53,0.72)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/78 backdrop-blur-sm">
                    Mapa
                  </div>

                  <div className="relative aspect-[4/3] min-h-[560px] w-full lg:min-h-[600px]">
                    <iframe
                      title="Mapa de ubicación de Humano Hotel"
                      className="absolute inset-0 h-full w-full"
                      src="https://www.google.com/maps?q=Malec%C3%B3n%20Balta%20710%20Miraflores%20Lima&z=16&output=embed"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(0,48,53,0.94)] via-[rgba(0,48,53,0.5)] to-transparent px-6 pb-6 pt-16 text-right sm:px-8">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/58">
                      Ubicación
                    </p>
                    <p className="mt-2 text-[16px] font-medium text-white">
                      Malecón Balta 710, Miraflores
                    </p>
                    <p className="mt-1 ml-auto max-w-[30ch] text-sm leading-relaxed text-white/68">
                      A pasos del malecón, con conexión rápida a gastronomía,
                      tiendas y recorridos del distrito.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
