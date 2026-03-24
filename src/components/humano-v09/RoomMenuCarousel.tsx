"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowUpRight,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  Maximize,
  Sparkles,
  SunMedium,
  Tv,
  Wifi,
} from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { webMediaBadgeClass } from "@/components/humano-web/webStyles"
import {
  DEFAULT_VIEWPORT,
  createRevealTransition,
  createRevealVariants,
} from "@/components/motion/variants"

export type RoomCarouselItem = {
  id: string
  label: string
  description: string
  shortDescription?: string
  categoryLabel?: string
  meta?: Array<{
    label: string
    kind: "size" | "bed" | "feature" | "wifi" | "tv"
  }>
  imageSrc: string | null
}

interface RoomMenuCarouselProps {
  items: RoomCarouselItem[]
  onSelect: (item: { id: string; label: string }) => void
  autoPlayMs?: number
  slideGapPx?: number
  dotsMarginTopPx?: number
  enableReveal?: boolean
}

const GAP_PX = 16

function getMetaIcon(entry: {
  label: string
  kind: "size" | "bed" | "feature" | "wifi" | "tv"
}) {
  if (entry.kind === "feature") {
    if (entry.label === "Kitchenet") return CookingPot
    if (entry.label === "Terraza") return SunMedium
    return Sparkles
  }

  switch (entry.kind) {
    case "size":
      return Maximize
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

function normalizeLoopIndex(index: number, itemCount: number) {
  if (itemCount <= 0) return 0
  const normalized = ((index - 1) % itemCount + itemCount) % itemCount
  return normalized + 1
}

export function RoomMenuCarousel({
  items,
  onSelect,
  autoPlayMs = 4200,
  slideGapPx = GAP_PX,
  dotsMarginTopPx = 16,
  enableReveal = false,
}: RoomMenuCarouselProps) {
  const prefersReducedMotion = useReducedMotion()
  const shouldAnimateSlides = enableReveal && !prefersReducedMotion

  const hasLoop = items.length > 1
  const trackItems = useMemo(() => {
    if (!hasLoop) return items
    return [items[items.length - 1], ...items, items[0]]
  }, [items, hasLoop])

  const [currentIndex, setCurrentIndex] = useState(hasLoop ? 1 : 0)
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true)
  const [slideStride, setSlideStride] = useState(0)

  const currentIndexRef = useRef(hasLoop ? 1 : 0)
  const isPausedRef = useRef(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Array<HTMLButtonElement | null>>([])

  const pauseAutoplay = useCallback(() => {
    isPausedRef.current = true
  }, [])

  const resumeAutoplay = useCallback(() => {
    isPausedRef.current = false
  }, [])

  const logicalIndex = hasLoop ? (currentIndex - 1 + items.length) % items.length : 0

  const goNext = useCallback(() => {
    if (!hasLoop) return
    setIsTransitionEnabled(true)
    setCurrentIndex((prev) => {
      if (prev >= items.length + 1) {
        return 2
      }
      return prev + 1
    })
  }, [hasLoop, items.length])

  const goPrev = useCallback(() => {
    if (!hasLoop) return
    setIsTransitionEnabled(true)
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return Math.max(items.length - 1, 1)
      }
      return prev - 1
    })
  }, [hasLoop, items.length])

  const goToLogicalIndex = useCallback((index: number) => {
    if (!hasLoop) return
    setIsTransitionEnabled(true)
    setCurrentIndex(index + 1)
  }, [hasLoop])

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  useEffect(() => {
    const measure = () => {
      const firstSlide = slideRefs.current[0]
      if (!firstSlide) return
      setSlideStride(firstSlide.offsetWidth + slideGapPx)
    }

    const raf = window.requestAnimationFrame(measure)
    const observer = new ResizeObserver(measure)
    if (viewportRef.current) observer.observe(viewportRef.current)

    return () => {
      window.cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [trackItems.length, slideGapPx])

  useEffect(() => {
    if (!hasLoop) return
    const interval = window.setInterval(() => {
      if (isPausedRef.current || document.visibilityState !== "visible") return
      goNext()
    }, autoPlayMs)
    return () => window.clearInterval(interval)
  }, [hasLoop, autoPlayMs, goNext])

  useEffect(() => {
    if (!hasLoop) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        pauseAutoplay()
        return
      }

      resumeAutoplay()
      setIsTransitionEnabled(false)
      setCurrentIndex((prev) => normalizeLoopIndex(prev, items.length))
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsTransitionEnabled(true))
      })
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [hasLoop, items.length, pauseAutoplay, resumeAutoplay])

  useEffect(() => {
    if (!hasLoop) return
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      if (target?.isContentEditable || tag === "input" || tag === "textarea" || tag === "select") {
        return
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        goPrev()
      }
      if (event.key === "ArrowRight") {
        event.preventDefault()
        goNext()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [hasLoop, goNext, goPrev])

  const handleTransitionEnd = () => {
    if (!hasLoop) return

    if (currentIndexRef.current === 0) {
      setIsTransitionEnabled(false)
      setCurrentIndex(items.length)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsTransitionEnabled(true))
      })
      return
    }

    if (currentIndexRef.current === items.length + 1) {
      setIsTransitionEnabled(false)
      setCurrentIndex(1)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsTransitionEnabled(true))
      })
    }
  }

  if (items.length === 0) return null

  return (
    <div
      className="group w-full space-y-4"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      <div className="relative overflow-hidden">
        {hasLoop && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur-sm opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Habitación anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div ref={viewportRef} className="overflow-hidden pr-0 sm:pr-3">
          <div
            className="flex"
            onTransitionEnd={handleTransitionEnd}
            style={{
              gap: `${slideGapPx}px`,
              transform: `translate3d(-${currentIndex * slideStride}px, 0, 0)`,
              transition: isTransitionEnabled ? "transform 500ms ease" : "none",
            }}
          >
            {trackItems.map((item, index) => (
              <motion.button
                key={`${item.id}-${index}`}
                ref={(node) => {
                  slideRefs.current[index] = node
                }}
                type="button"
                onClick={() => onSelect({ id: item.id, label: item.label })}
                className="group w-full sm:w-[560px] max-w-[560px] shrink-0 overflow-hidden rounded-2xl border border-border/35 bg-white text-left shadow-sm transition hover:shadow-md cursor-pointer dark:bg-card"
                initial={shouldAnimateSlides ? "hidden" : false}
                whileInView={shouldAnimateSlides ? "visible" : undefined}
                viewport={
                  shouldAnimateSlides
                    ? { once: DEFAULT_VIEWPORT.once, amount: 0.35 }
                    : undefined
                }
                variants={shouldAnimateSlides ? createRevealVariants() : undefined}
                transition={
                  shouldAnimateSlides
                    ? createRevealTransition(Math.min(index, 4) * 0.08)
                    : undefined
                }
              >
                <div className="relative aspect-[4/5] sm:aspect-[16/10] overflow-hidden">
                  {item.imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageSrc} alt={item.label} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-full w-full bg-muted/30" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  <span className={cn("absolute left-7 top-7", webMediaBadgeClass)}>
                    {item.categoryLabel ?? "Habitaciones"}
                  </span>

                  <div className="absolute left-8 right-24 bottom-8">
                    <h4 className="text-white text-[30px] sm:text-[26px] font-serif leading-[1.02] drop-shadow-md">
                      {item.label}
                    </h4>
                    {item.meta?.length ? (
                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-white/86">
                        {item.meta.slice(0, 4).map((entry) => {
                          const Icon = getMetaIcon(entry)
                          return (
                            <span
                              key={`${item.id}-${entry.label}`}
                              className="inline-flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <Icon className="h-4 w-4 text-white/72" strokeWidth={1.8} />
                              <span>{entry.label}</span>
                            </span>
                          )
                        })}
                      </div>
                    ) : null}
                    <p className="mt-3 max-w-[34ch] text-white/88 text-sm leading-relaxed drop-shadow-sm line-clamp-2">
                      {item.shortDescription ?? item.description}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute bottom-8 right-8 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white/88 backdrop-blur-sm transition-all duration-200 group-hover:bg-white/18 group-hover:text-white"
                  >
                    <ArrowUpRight className="h-4.5 w-4.5" strokeWidth={1.9} />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {hasLoop && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur-sm opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Siguiente habitación"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {hasLoop && (
        <div className="flex justify-center gap-2" style={{ marginTop: `${dotsMarginTopPx}px` }}>
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToLogicalIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all cursor-pointer",
                index === logicalIndex ? "w-7 bg-[var(--color-amarillo)]" : "w-2 bg-foreground/25 hover:bg-foreground/40"
              )}
              aria-label={`Ir a habitación ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
