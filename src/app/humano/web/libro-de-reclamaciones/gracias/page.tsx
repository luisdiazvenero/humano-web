import type { Metadata } from "next"
import Link from "next/link"
import { Inter } from "next/font/google"
import { ArrowUpRight, Check } from "lucide-react"

import { WebStickyHeader } from "@/components/humano-web/WebStickyHeader"
import { cn } from "@/lib/utils"
import { webPrimaryButtonClass } from "@/components/humano-web/webStyles"

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

const pageNavItems = [
  { label: "Home", href: "/humano/web#inicio" },
  { label: "Habitaciones", href: "/humano/web/habitaciones" },
  { label: "Servicios", href: "/humano/web/servicios" },
  { label: "Hotel", href: "/humano/web/hotel" },
  { label: "Contacto", href: "/humano/web/contacto" },
]

export const metadata: Metadata = {
  title: "Reclamo recibido · Humano Website",
  description:
    "Confirmación visual del Libro de Reclamaciones de Humano Hotel.",
}

export default function HumanoClaimsBookThanksPage() {
  return (
    <div className={`${bodyFont.className} min-h-screen bg-[var(--color-azul-rgb)] text-white`}>
      <WebStickyHeader
        brandHref="/humano/web#inicio"
        navItems={pageNavItems}
      />

      <main>
        <section className="relative overflow-hidden bg-[var(--color-azul-rgb)] pt-28 sm:pt-32">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,48,53,0.98)_0%,rgba(0,48,53,0.94)_36%,rgba(0,48,53,0.72)_100%)]" />
            <div className="absolute left-[-8%] top-[14%] h-64 w-64 rounded-full bg-[var(--color-amarillo)]/10 blur-3xl" />
            <div className="absolute bottom-[-10%] right-[4%] h-72 w-72 rounded-full bg-white/6 blur-3xl" />
          </div>

          <div className="relative mx-auto flex w-full max-w-[1680px] px-6 pb-16 sm:px-10 sm:pb-20 xl:px-14">
            <div className="mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-[980px] items-center justify-center py-10 sm:py-14">
              <div className="w-full max-w-[720px] rounded-[34px] border border-white/10 bg-white/[0.04] px-8 py-12 text-center shadow-[0_20px_54px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:px-12 sm:py-14">
                <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/14 bg-white/[0.06] text-[var(--color-amarillo)]">
                  <Check className="h-7 w-7" />
                </span>

                <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/54">
                  Libro de Reclamaciones
                </p>
                <h1 className="mt-4 font-serif text-[36px] leading-[0.94] text-white">
                  Solicitud recibida
                </h1>
                <p className="mx-auto mt-6 max-w-[48ch] text-[16px] leading-8 text-white/76 sm:text-[17px]">
                  Hemos recibido tu reclamo o queja. Nuestro equipo revisará la
                  información y dará seguimiento según el proceso
                  correspondiente.
                </p>

                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/humano/web"
                    className={cn(
                      webPrimaryButtonClass,
                      "min-h-12 bg-white px-5 py-2.5 text-sm text-[var(--color-azul-rgb)] hover:bg-[var(--color-crema-soft)]"
                    )}
                  >
                    Volver al hotel
                    <ArrowUpRight className="h-4.5 w-4.5" />
                  </Link>
                  <Link
                    href="/humano/web/libro-de-reclamaciones"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/82 transition hover:border-white/22 hover:bg-white/[0.05] hover:text-white"
                  >
                    Registrar otro caso
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
