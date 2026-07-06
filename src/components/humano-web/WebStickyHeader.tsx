"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

import { FullLogo } from "@/components/humano-v09/FullLogo"
import { cn } from "@/lib/utils"
import { webHeaderShellRadiusClass, webPrimaryButtonClass } from "@/components/humano-web/webStyles"
import { trackEvent } from "@/lib/analytics"
import { WEB_I18N, type WebLang } from "@/lib/web/i18n"
import { localizedPath } from "@/lib/web/path-localization"

type WebStickyHeaderNavItem = {
  label: string
  href: string
}

interface WebStickyHeaderProps {
  brandHref?: string
  navItems?: WebStickyHeaderNavItem[]
  forceScrolled?: boolean
  activeHref?: string
  showReserve?: boolean
  lang?: WebLang
}


export function WebStickyHeader({
  brandHref,
  navItems,
  forceScrolled = false,
  activeHref,
  showReserve = true,
  lang = "es",
}: WebStickyHeaderProps) {
  const t = WEB_I18N[lang]
  const pathname = usePathname() || "/"
  const resolvedBrandHref = brandHref ?? (lang === "en" ? "/en" : "/")
  const resolvedNavItems = navItems ?? t.nav
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerIsScrolled = forceScrolled || isScrolled
  const closeLabel = lang === "en" ? "Close menu" : "Cerrar menú"

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Cerrar el menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Bloquear scroll del body y cerrar con Escape cuando el menú está abierto
  useEffect(() => {
    if (!isMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isMenuOpen])

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
            "relative flex items-center justify-between transition-all duration-300 md:grid md:grid-cols-[1fr_auto_1fr]",
            webHeaderShellRadiusClass,
            headerIsScrolled ? "md:items-center" : "md:items-start",
            headerIsScrolled &&
              "border border-black/5 bg-white/92 py-3 pl-5 pr-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md sm:pl-7 sm:pr-6"
          )}
        >
          <div className="flex min-w-0 items-center gap-3 justify-self-start sm:gap-4">
            <Link
              href={resolvedBrandHref}
              className={cn(
                "inline-flex min-h-11 items-center transition-colors",
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
          </div>

          <div
            className={cn(
              "hidden items-center justify-self-center gap-2 md:flex",
              headerIsScrolled ? "mt-0" : "mt-2"
            )}
          >
            {resolvedNavItems.map((item) => {
              const isActive = activeHref === item.href

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => trackEvent("web_nav_click", { label: item.label, href: item.href })}
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
              className="mr-5 hidden items-center md:inline-flex"
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
                onClick={() => trackEvent("web_reserve_click", { location: "header" })}
                className={cn(
                  "group !min-h-11 cursor-pointer !px-5 !py-2.5 shadow-none hover:translate-y-0 hover:shadow-none",
                  webPrimaryButtonClass,
                  "hidden md:inline-flex",
                  headerIsScrolled
                    ? "bg-[#003035] text-white hover:text-[#FFC85D]"
                    : "bg-white/15 text-white backdrop-blur hover:bg-[#003035] hover:text-white"
                )}
                aria-label={lang === "en" ? "Book on Marriott" : "Reservar en Marriott"}
              >
                <span className="hidden text-sm font-semibold sm:inline">{t.reserve}</span>
                <span className="inline-flex h-5 w-5 items-center justify-center">
                  <CalendarDays className="h-4 w-4" />
                </span>
              </Link>
            ) : null}

            {/* ES/EN en la barra móvil — sin fondo */}
            <div
              role="group"
              aria-label="Language"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider leading-none md:hidden"
            >
              <Link
                href={localizedPath(pathname, "es")}
                className={cn(
                  "cursor-pointer px-1 py-1 transition-colors",
                  lang === "es"
                    ? headerIsScrolled
                      ? "text-[var(--color-azul-rgb)]"
                      : "text-white"
                    : headerIsScrolled
                      ? "text-[var(--color-azul-rgb)]/45 hover:text-[var(--color-azul-rgb)]"
                      : "text-white/55 hover:text-white"
                )}
                aria-pressed={lang === "es"}
              >
                ES
              </Link>
              <span className={cn(headerIsScrolled ? "text-[var(--color-azul-rgb)]/30" : "text-white/40")}>
                /
              </span>
              <Link
                href={localizedPath(pathname, "en")}
                className={cn(
                  "cursor-pointer px-1 py-1 transition-colors",
                  lang === "en"
                    ? headerIsScrolled
                      ? "text-[var(--color-azul-rgb)]"
                      : "text-white"
                    : headerIsScrolled
                      ? "text-[var(--color-azul-rgb)]/45 hover:text-[var(--color-azul-rgb)]"
                      : "text-white/55 hover:text-white"
                )}
                aria-pressed={lang === "en"}
              >
                EN
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full backdrop-blur md:hidden",
                headerIsScrolled
                  ? "bg-[var(--color-crema)] text-[var(--color-azul-rgb)]"
                  : "bg-white/15 text-white"
              )}
              aria-label={t.menuOpen}
              aria-expanded={isMenuOpen}
              aria-haspopup="dialog"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div
              role="group"
              aria-label="Language"
              className={cn(
                "ml-1 hidden items-center gap-1 text-[11px] font-semibold uppercase tracking-wider leading-none md:inline-flex",
                headerIsScrolled ? "" : ""
              )}
            >
              <Link
                href={localizedPath(pathname, "es")}
                className={cn(
                  "cursor-pointer rounded-full px-2 py-1 transition-colors",
                  lang === "es"
                    ? headerIsScrolled
                      ? "bg-[#003035] text-white"
                      : "bg-white text-[var(--color-azul-rgb)]"
                    : headerIsScrolled
                      ? "text-[var(--color-azul-rgb)]/60 hover:text-[var(--color-azul-rgb)]"
                      : "text-white/70 hover:text-white"
                )}
                aria-pressed={lang === "es"}
              >
                ES
              </Link>
              <Link
                href={localizedPath(pathname, "en")}
                className={cn(
                  "cursor-pointer rounded-full px-2 py-1 transition-colors",
                  lang === "en"
                    ? headerIsScrolled
                      ? "bg-[#003035] text-white"
                      : "bg-white text-[var(--color-azul-rgb)]"
                    : headerIsScrolled
                      ? "text-[var(--color-azul-rgb)]/60 hover:text-[var(--color-azul-rgb)]"
                      : "text-white/70 hover:text-white"
                )}
                aria-pressed={lang === "en"}
              >
                EN
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 h-full w-full bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t.menuOpen}
              className="absolute inset-x-0 top-0 flex flex-col gap-6 rounded-b-[30px] bg-white px-6 pb-8 pt-5 shadow-[0_24px_48px_rgba(0,0,0,0.24)]"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <Image
                  src="/tribute-portfolio-black.png"
                  alt="Tribute Portfolio"
                  width={220}
                  height={24}
                  className="h-6 w-auto"
                  sizes="180px"
                />
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label={closeLabel}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-crema)] text-[var(--color-azul-rgb)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col">
                {resolvedNavItems.map((item) => {
                  const isActive = activeHref === item.href

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        trackEvent("web_nav_click", { label: item.label, href: item.href })
                        setIsMenuOpen(false)
                      }}
                      className={cn(
                        "border-b border-black/5 py-4 text-lg transition-colors last:border-b-0",
                        isActive
                          ? "font-semibold text-[var(--color-azul-rgb)]"
                          : "font-medium text-[var(--color-azul-rgb)]/70"
                      )}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              {showReserve ? (
                <Link
                  href="https://www.marriott.com/es/hotels/limtx-humano-lima-a-tribute-portfolio-hotel/rooms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent("web_reserve_click", { location: "mobile_menu" })
                    setIsMenuOpen(false)
                  }}
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#003035] px-6 py-3 text-base font-semibold text-white transition-colors hover:text-[#FFC85D]"
                  aria-label={lang === "en" ? "Book on Marriott" : "Reservar en Marriott"}
                >
                  <CalendarDays className="h-5 w-5" />
                  {t.reserve}
                </Link>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
