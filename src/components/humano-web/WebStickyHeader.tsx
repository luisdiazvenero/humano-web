"use client"

import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Menu } from "lucide-react"
import { useEffect, useState } from "react"

import { FullLogo } from "@/components/humano-v09/FullLogo"
import { cn } from "@/lib/utils"
import { webHeaderShellRadiusClass, webPrimaryButtonClass } from "@/components/humano-web/webStyles"

type WebStickyHeaderNavItem = {
  label: string
  href: string
}

const defaultNavItems: WebStickyHeaderNavItem[] = [
  { label: "Home", href: "#inicio" },
  { label: "Habitaciones", href: "/humano/habitaciones" },
  { label: "Hotel", href: "/humano/hotel" },
  { label: "Servicios", href: "/humano/servicios" },
  { label: "Contacto", href: "/humano/contacto" },
]

interface WebStickyHeaderProps {
  brandHref?: string
  navItems?: WebStickyHeaderNavItem[]
  forceScrolled?: boolean
  activeHref?: string
  showReserve?: boolean
}


export function WebStickyHeader({
  brandHref = "#inicio",
  navItems = defaultNavItems,
  forceScrolled = false,
  activeHref,
  showReserve = true,
}: WebStickyHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const headerIsScrolled = forceScrolled || isScrolled

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
          headerIsScrolled ? "pt-3" : "pt-5"
        )}
      >
        <div
          className={cn(
            "relative grid grid-cols-[1fr_auto_1fr] transition-all duration-300",
            webHeaderShellRadiusClass,
            headerIsScrolled ? "items-center" : "items-start",
            headerIsScrolled &&
              "border border-black/5 bg-white/92 py-3 pl-5 pr-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md sm:pl-7 sm:pr-6"
          )}
        >
          <Link
            href={brandHref}
            className={cn(
              "inline-flex min-h-11 items-center justify-self-start transition-colors",
              headerIsScrolled ? "text-[var(--color-azul-rgb)]" : "text-white"
            )}
          >
            <span
              className={cn(
                "relative block overflow-hidden transition-all duration-300",
                headerIsScrolled
                  ? "h-7 w-[24px] sm:h-8 sm:w-[28px]"
                  : "h-20 w-[92px] sm:h-24 sm:w-[110px]"
              )}
            >
              {headerIsScrolled ? (
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
              headerIsScrolled ? "mt-0" : "mt-2"
            )}
          >
            {navItems.map((item) => {
              const isActive = activeHref === item.href

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group relative inline-flex h-9 items-center px-2 text-sm leading-none transition-colors",
                    headerIsScrolled
                      ? isActive
                        ? "bg-transparent font-semibold text-[var(--color-azul-rgb)]"
                        : "bg-transparent font-medium text-[var(--color-azul-rgb)]/70 hover:text-[var(--color-azul-rgb)]"
                      : isActive
                        ? "bg-transparent font-semibold text-white"
                        : "bg-transparent font-medium text-white/70 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div
            className={cn(
              "flex items-center justify-self-end gap-2 transition-colors",
              headerIsScrolled ? "mt-0" : "mt-2",
              headerIsScrolled ? "text-[var(--color-azul-rgb)]" : "text-white"
            )}
          >
            <span
              className="mr-5 inline-flex items-center"
            >
              <Image
                src={headerIsScrolled ? "/tribute-portfolio-black.png" : "/tribute-portfolio-white.png"}
                alt="Tribute Portfolio"
                width={220}
                height={24}
                className="h-6 w-auto"
                sizes="220px"
              />
            </span>
            {showReserve ? (
              <Link
                href="https://www.marriott.com/es/hotels/limtx-humano-lima-a-tribute-portfolio-hotel/rooms/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group !min-h-11 cursor-pointer !px-5 !py-2.5 shadow-none hover:translate-y-0 hover:shadow-none",
                  webPrimaryButtonClass,
                  headerIsScrolled
                    ? "bg-[#003035] text-white hover:text-[#FFC85D]"
                    : "bg-white/15 text-white backdrop-blur hover:bg-[#003035] hover:text-white"
                )}
                aria-label="Reservar en Marriott"
              >
                <span className="hidden text-sm font-semibold sm:inline">Reserva</span>
                <span className="inline-flex h-5 w-5 items-center justify-center">
                  <CalendarDays className="h-4 w-4" />
                </span>
              </Link>
            ) : null}
            <button
              type="button"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur md:hidden",
                headerIsScrolled ? "bg-[var(--color-crema)]" : "bg-white/15"
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
