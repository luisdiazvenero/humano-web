"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type SliderImage = {
  src: string
  alt: string
  label?: string
}

interface ImageSliderProps {
  images: SliderImage[]
  intervalMs?: number
}

export function ImageSlider({ images, intervalMs = 4000 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, intervalMs)
    return () => window.clearInterval(interval)
  }, [images.length, intervalMs])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (images.length === 0) return null

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl group">
      <div className="relative h-full">
        {images.map((item, index) => (
          <div
            key={`${item.src}-${index}`}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}
            aria-hidden={index !== currentIndex}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            {item.label && (
              <div className="absolute inset-x-0 bottom-10 flex justify-center px-6 text-center">
                <p className="text-white text-lg sm:text-2xl font-serif tracking-wide drop-shadow-md">{item.label}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/45 text-white backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/45 text-white backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === currentIndex ? "w-6 bg-[#ffce5c]" : "w-1.5 bg-white/50 hover:bg-white/70"
                )}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
