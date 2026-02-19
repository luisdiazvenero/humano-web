"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeftRight, CalendarDays, Menu } from "lucide-react"
import { useEffect, useState } from "react"

import { FullLogo } from "@/components/humano-v09/FullLogo"
import { cn } from "@/lib/utils"

const navItems = ["Hotel", "Habitaciones", "Servicios", "Experiencia"]

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
            isScrolled ? "items-center" : "items-start",
            isScrolled &&
              "rounded-2xl border border-black/5 bg-white/92 px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md sm:px-6"
          )}
        >
          <Link
            href="#inicio"
            className={cn(
              "justify-self-start transition-colors",
              isScrolled ? "text-[var(--color-azul-rgb)]" : "text-white"
            )}
          >
            <FullLogo
              className={cn(
                "w-auto transition-all duration-300",
                isScrolled
                  ? "h-14 !text-[var(--color-azul-rgb)] sm:h-16"
                  : "h-20 !text-white sm:h-24"
              )}
            />
          </Link>

          <div
            className={cn(
              "hidden items-center justify-self-center gap-2 md:flex",
              isScrolled ? "mt-0" : "mt-2"
            )}
          >
            {navItems.map((item) => (
              <span
                key={item}
                className={cn(
                  "inline-flex h-9 items-center rounded-full px-3 text-sm font-medium leading-none transition-colors",
                  isScrolled
                    ? "bg-transparent text-[var(--color-azul-rgb)]"
                    : "bg-white/15 text-white backdrop-blur"
                )}
              >
                {item}
              </span>
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
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition-colors hover:text-[var(--color-amarillo)]"
              aria-label="Reservar en Marriott"
            >
              <span className="hidden text-sm font-semibold sm:inline">Reserva</span>
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-colors",
                  isScrolled ? "bg-[var(--color-crema)]" : "bg-white/15"
                )}
              >
                <CalendarDays className="h-4 w-4" />
              </span>
            </Link>
            <Link
              href="/humano/conserje"
              className={cn(
                "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full backdrop-blur transition-colors hover:text-[var(--color-amarillo)]",
                isScrolled ? "bg-[var(--color-crema)]" : "bg-white/15"
              )}
              aria-label="Ir al conserje"
            >
              <ArrowLeftRight className="h-4 w-4" />
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
