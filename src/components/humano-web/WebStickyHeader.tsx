"use client"

import Image from "next/image"
import Link from "next/link"
import { UserSwitch } from "@phosphor-icons/react"
import { CalendarDays, Menu } from "lucide-react"
import { useEffect, useState } from "react"

import { FullLogo } from "@/components/humano-v09/FullLogo"
import { cn } from "@/lib/utils"
import { webHeaderShellRadiusClass, webPrimaryButtonClass } from "@/components/humano-web/webStyles"

const navItems = [
  { label: "Hotel", href: "#inicio" },
  { label: "Habitaciones", href: "#habitaciones" },
  { label: "Servicios", href: "#experiencias" },
  { label: "Experiencia", href: "#experiencias" },
  { label: "Contacto", href: "#contacto" },
]

export function WebStickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto w-full max-w-[1680px] px-6 sm:px-10 xl:px-14",
          isScrolled ? "pt-3" : "pt-5"
        )}
      >
        <div
          className={cn(
            "relative grid grid-cols-[1fr_auto_1fr] transition-all duration-300",
            webHeaderShellRadiusClass,
            isScrolled ? "items-center" : "items-start",
            isScrolled &&
              "border border-black/5 bg-white/92 py-3 pl-5 pr-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md sm:pl-7 sm:pr-6"
          )}
        >
          <Link
            href="#inicio"
            className={cn(
              "inline-flex min-h-11 items-center justify-self-start transition-colors",
              isScrolled ? "text-[var(--color-azul-rgb)]" : "text-white"
            )}
          >
            <span
              className={cn(
                "relative block overflow-hidden transition-all duration-300",
                isScrolled
                  ? "h-7 w-[24px] sm:h-8 sm:w-[28px]"
                  : "h-20 w-[92px] sm:h-24 sm:w-[110px]"
              )}
            >
              {isScrolled ? (
                <Image
                  src="/logo-humano.svg"
                  alt="Humano Hotel"
                  width={35}
                  height={40}
                  className="h-full w-full transition-transform duration-300"
                  priority
                />
              ) : (
                <FullLogo
                  className="h-full w-auto !text-white transition-transform duration-300"
                />
              )}
            </span>
          </Link>

          <div
            className={cn(
              "hidden items-center justify-self-center gap-2 md:flex",
              isScrolled ? "mt-0" : "mt-2"
            )}
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group relative inline-flex h-9 items-center px-2 text-sm font-medium leading-none transition-colors",
                  isScrolled
                    ? "bg-transparent text-[var(--color-azul-rgb)] hover:text-[var(--color-amarillo-strong)]"
                    : "bg-transparent text-white hover:text-white/75"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "pointer-events-none absolute inset-x-2 bottom-1 h-px origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100",
                    isScrolled ? "bg-[var(--color-amarillo-strong)]" : "bg-white/75"
                  )}
                />
              </Link>
            ))}
          </div>

          <div
            className={cn(
              "flex items-center justify-self-end gap-2 transition-colors",
              isScrolled ? "mt-0" : "mt-2",
              isScrolled ? "text-[var(--color-azul-rgb)]" : "text-white"
            )}
          >
            <span
              className="mr-5 inline-flex items-center"
            >
              <Image
                src={isScrolled ? "/tribute-portfolio-black.png" : "/tribute-portfolio-white.png"}
                alt="Tribute Portfolio"
                width={220}
                height={24}
                className="h-6 w-auto"
                sizes="220px"
              />
            </span>
            <Link
              href="https://www.marriott.com/es/hotels/limtx-humano-lima-a-tribute-portfolio-hotel/rooms/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group !min-h-11 cursor-pointer !px-5 !py-2.5 shadow-none hover:translate-y-0 hover:shadow-none",
                webPrimaryButtonClass,
                isScrolled
                  ? "bg-[#003744] text-white hover:text-[#FFC85D]"
                  : "bg-white/15 text-white backdrop-blur hover:bg-[#003744] hover:text-white"
              )}
              aria-label="Reservar en Marriott"
            >
              <span className="hidden text-sm font-semibold sm:inline">Reserva</span>
              <span className="inline-flex h-5 w-5 items-center justify-center">
                <CalendarDays className="h-4 w-4" />
              </span>
            </Link>
            <Link
              href="/humano/conserje"
              className={cn(
                "inline-flex h-10 w-10 cursor-pointer items-center justify-center transition-colors",
                isScrolled ? "text-[var(--color-azul-rgb)]" : "text-white"
              )}
              aria-label="Ir al conserje"
            >
              <UserSwitch size={24} weight="regular" />
            </Link>
            <button
              type="button"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur md:hidden",
                isScrolled ? "bg-[var(--color-crema)]" : "bg-white/15"
              )}
              aria-label="Abrir menú"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
