"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BedDouble, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type RoomCarouselItem = {
  id: string
  label: string
  description: string
  imageSrc: string | null
}

interface RoomMenuCarouselProps {
  items: RoomCarouselItem[]
  onSelect: (item: { id: string; label: string }) => void
  autoPlayMs?: number
}

const GAP_PX = 16

export function RoomMenuCarousel({ items, onSelect, autoPlayMs = 4200 }: RoomMenuCarouselProps) {
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
    setCurrentIndex((prev) => prev + 1)
  }, [hasLoop])

  const goPrev = useCallback(() => {
    if (!hasLoop) return
    setIsTransitionEnabled(true)
    setCurrentIndex((prev) => prev - 1)
  }, [hasLoop])

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
      setSlideStride(firstSlide.offsetWidth + GAP_PX)
    }

    const raf = window.requestAnimationFrame(measure)
    const observer = new ResizeObserver(measure)
    if (viewportRef.current) observer.observe(viewportRef.current)

    return () => {
      window.cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [trackItems.length])

  useEffect(() => {
    if (!hasLoop) return
    const interval = window.setInterval(() => {
      if (isPausedRef.current) return
      goNext()
    }, autoPlayMs)
    return () => window.clearInterval(interval)
  }, [hasLoop, autoPlayMs, goNext])

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
      className="w-full space-y-4"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      <div className="relative overflow-hidden">
        {hasLoop && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 sm:left-3 top-1/2 z-20 -translate-y-1/2 h-9 w-9 rounded-full bg-white/92 text-foreground border border-border/60 shadow-sm flex items-center justify-center cursor-pointer"
            aria-label="Habitación anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div ref={viewportRef} className="overflow-hidden pl-0 pr-2 sm:pr-3">
          <div
            className="flex gap-4"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translate3d(-${currentIndex * slideStride}px, 0, 0)`,
              transition: isTransitionEnabled ? "transform 500ms ease" : "none",
            }}
          >
            {trackItems.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                ref={(node) => {
                  slideRefs.current[index] = node
                }}
                type="button"
                onClick={() => onSelect({ id: item.id, label: item.label })}
                className="group w-[84vw] sm:w-[560px] max-w-[560px] min-w-[300px] shrink-0 overflow-hidden rounded-2xl border border-border/35 bg-white dark:bg-card shadow-sm text-left transition hover:shadow-md cursor-pointer"
              >
                <div className="relative aspect-[4/5] sm:aspect-[16/10] overflow-hidden">
                  {item.imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageSrc} alt={item.label} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-full w-full bg-muted/30" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  <span className="absolute left-7 top-7 inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-black/35 px-3.5 py-2 text-[11px] font-semibold text-white backdrop-blur-sm">
                    <BedDouble className="h-3.5 w-3.5" />
                    Habitaciones
                  </span>

                  <div className="absolute left-8 right-8 bottom-8">
                    <h4 className="text-white text-[30px] sm:text-[26px] font-serif leading-[1.02] drop-shadow-md">
                      {item.label}
                    </h4>
                    <p className="mt-4 text-white/88 text-sm leading-tight overflow-hidden text-ellipsis whitespace-nowrap drop-shadow-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {hasLoop && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 sm:right-3 top-1/2 z-20 -translate-y-1/2 h-9 w-9 rounded-full bg-white/92 text-foreground border border-border/60 shadow-sm flex items-center justify-center cursor-pointer"
            aria-label="Siguiente habitación"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {hasLoop && (
        <div className="flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToLogicalIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all cursor-pointer",
                index === logicalIndex ? "w-7 bg-[#ffce5c]" : "w-2 bg-foreground/25 hover:bg-foreground/40"
              )}
              aria-label={`Ir a habitación ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
