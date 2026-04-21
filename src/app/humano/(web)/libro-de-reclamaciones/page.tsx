import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Inter } from "next/font/google"

import { WebClaimsBookForm } from "@/components/humano-web/WebClaimsBookForm"
import { WebFooterSocialLinks } from "@/components/humano-web/WebFooterSocialLinks"
import { WebStickyHeader } from "@/components/humano-web/WebStickyHeader"

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
  title: "Libro de Reclamaciones · Humano Website",
  description:
    "Formulario del Libro de Reclamaciones de Humano Hotel.",
}

const formattedDate = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Lima",
}).format(new Date())

export default function HumanoClaimsBookPage() {
  return (
    <div className={`${bodyFont.className} min-h-screen bg-[var(--color-crema)] text-[var(--color-azul-rgb)]`}>
      <WebStickyHeader
        brandHref="/humano#inicio"
        navItems={pageNavItems}
      />

      <main>
        <section className="relative overflow-hidden bg-[var(--color-azul-rgb)] pt-28 sm:pt-32">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,48,53,0.98)_0%,rgba(0,48,53,0.92)_44%,rgba(0,48,53,0.76)_100%)]" />
            <div className="absolute left-[-8%] top-[12%] h-64 w-64 rounded-full bg-[var(--color-amarillo)]/10 blur-3xl" />
            <div className="absolute bottom-[-12%] right-[2%] h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          </div>

          <div className="relative mx-auto w-full max-w-[1180px] px-6 pb-24 sm:px-10 sm:pb-28 xl:px-14">
            <div className="mx-auto max-w-[860px] pt-16 sm:pt-20 lg:pt-24">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/54">
                Atención al cliente
              </p>
              <h1 className="mt-5 font-serif text-[36px] leading-[0.96] text-white">
                Libro de Reclamaciones
              </h1>
              <p className="mt-6 max-w-[58ch] text-[16px] leading-8 text-white/76 sm:text-[17px]">
                Registra aquí tu reclamo o queja. El formulario sigue la
                estructura compartida por el cliente y mantiene la misma
                atmósfera visual del sitio.
              </p>
            </div>
          </div>
        </section>

        <section className="relative -mt-10 sm:-mt-12">
          <div className="w-full rounded-t-[38px] bg-[var(--color-crema)] px-6 pb-16 pt-12 sm:rounded-t-[42px] sm:px-10 sm:pt-14 xl:px-14">
            <article className="mx-auto max-w-[1180px]">
              <div className="mx-auto max-w-[860px]">
                <div className="border-b border-[rgba(0,48,53,0.12)] pb-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]/54">
                    Información de la empresa
                  </p>

                  <div className="mt-5 grid gap-5 sm:grid-cols-3">
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--color-azul-rgb)]">
                        Razón social
                      </p>
                      <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-azul-rgb)]/76">
                        ARMANDO HOTELES S.A.C.
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--color-azul-rgb)]">
                        Dirección fiscal
                      </p>
                      <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-azul-rgb)]/76">
                        Av. Grau 629 oficina 306 Barranco
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--color-azul-rgb)]">
                        Fecha
                      </p>
                      <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-azul-rgb)]/76">
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <WebClaimsBookForm />
                </div>
              </div>
            </article>
          </div>
        </section>

        <footer className="w-full bg-[var(--color-azul-rgb)] text-white">
          <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-6 px-4 py-8 text-sm text-white/90 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
            <WebFooterSocialLinks />

            <div className="flex flex-col items-center gap-4 text-center">
              <p>
                2026 Hotel Humano · Malecón Balta 710, Miraflores.
                Desarrollado por Armando Hoteles
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.12em] text-white/70">
                <Link
                  href="/humano/libro-de-reclamaciones"
                  className="transition-colors hover:text-[var(--color-amarillo)]"
                >
                  Libro de Reclamaciones
                </Link>
                <span
                  aria-hidden="true"
                  className="hidden h-1 w-1 rounded-full bg-white/30 sm:block"
                />
                <Link
                  href="/humano/terminos-y-condiciones"
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
