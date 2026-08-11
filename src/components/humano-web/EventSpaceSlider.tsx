"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react"

import { cn } from "@/lib/utils"
import type { WebLang } from "@/lib/web/i18n"

type EventSpaceSliderProps = {
  spaceName: string
  /** Cuando esté vacío se muestran placeholders grises */
  images?: string[]
  placeholderCount?: number
  lang?: WebLang
  className?: string
}

export function EventSpaceSlider({
  spaceName,
  images = [],
  placeholderCount = 3,
  lang = "es",
  className,
}: EventSpaceSliderProps) {
  const [index, setIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const isEn = lang === "en"

  const slides = images.length > 0 ? images : Array.from({ length: placeholderCount }, () => null)
  const total = slides.length
  const wrap = useCallback((next: number) => ((next % total) + total) % total, [total])
  const goTo = (next: number) => setIndex(wrap(next))

  const prevLabel = isEn ? "Previous image" : "Imagen anterior"
  const nextLabel = isEn ? "Next image" : "Siguiente imagen"
  const closeLabel = isEn ? "Close" : "Cerrar"

  // Teclado y bloqueo de scroll mientras el lightbox está abierto
  useEffect(() => {
    if (lightboxIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null)
        return
      }
      if (images.length < 2) return
      if (event.key === "ArrowLeft") setLightboxIndex((current) => wrap((current ?? 0) - 1))
      if (event.key === "ArrowRight") setLightboxIndex((current) => wrap((current ?? 0) + 1))
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [lightboxIndex, images.length, wrap])

  // Al cerrar el lightbox, el slider queda en la imagen que se estaba viendo
  const closeLightbox = () => {
    if (lightboxIndex !== null) setIndex(lightboxIndex)
    setLightboxIndex(null)
  }

  return (
    <>
      <div className={cn("relative", className)}>
        <div className="relative overflow-hidden rounded-[30px] border border-black/5 bg-[#d6d6d1] shadow-[0_18px_44px_rgba(0,55,68,0.10)]">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide, slideIndex) => (
              <div
                key={`${spaceName}-slide-${slideIndex}`}
                className="relative aspect-[4/3] w-full shrink-0"
                aria-hidden={slideIndex !== index}
              >
                {slide ? (
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(slideIndex)}
                    tabIndex={slideIndex === index ? 0 : -1}
                    className="group absolute inset-0 cursor-zoom-in"
                    aria-label={`${isEn ? "Enlarge image" : "Ampliar imagen"} ${slideIndex + 1} — ${spaceName}`}
                  >
                    <Image
                      src={slide}
                      alt={`${spaceName} — ${slideIndex + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </button>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#dcdcd8_0%,#cfcfc9_52%,#c4c4bd_100%)] text-[var(--color-azul-rgb)]/38">
                    <Images className="h-9 w-9" strokeWidth={1.4} />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">
                      {isEn ? "Photo" : "Foto"} {slideIndex + 1} / {total}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label={prevLabel}
                className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[var(--color-azul-rgb)]/78 text-white backdrop-blur transition hover:bg-[var(--color-azul-rgb)]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label={nextLabel}
                className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[var(--color-azul-rgb)]/78 text-white backdrop-blur transition hover:bg-[var(--color-azul-rgb)]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
                {slides.map((_, dotIndex) => (
                  <button
                    key={`${spaceName}-dot-${dotIndex}`}
                    type="button"
                    onClick={() => goTo(dotIndex)}
                    aria-label={`${isEn ? "Go to image" : "Ir a la imagen"} ${dotIndex + 1}`}
                    aria-current={dotIndex === index}
                    className={cn(
                      "h-2 cursor-pointer rounded-full transition-all",
                      dotIndex === index
                        ? "w-6 bg-[var(--color-azul-rgb)]"
                        : "w-2 bg-[var(--color-azul-rgb)]/30 hover:bg-[var(--color-azul-rgb)]/55"
                    )}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {lightboxIndex !== null && images[lightboxIndex] ? (
        <div
          className="fixed inset-0 z-[80] bg-[rgba(0,0,0,0.88)] backdrop-blur-md"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${isEn ? "Gallery" : "Galería"} — ${spaceName}`}
        >
          <div className="flex min-h-screen items-center justify-center px-4 py-6">
            <div
              className="flex w-full max-w-[800px] flex-col"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-serif text-xl leading-tight text-white/92">{spaceName}</p>
                  {images.length > 1 ? (
                    <p className="mt-1 text-sm text-white/56">
                      {lightboxIndex + 1} / {images.length}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={closeLightbox}
                  aria-label={closeLabel}
                  className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/18 bg-white/10 text-white transition hover:bg-white/16"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <Image
                  src={images[lightboxIndex]}
                  alt={`${spaceName} — ${lightboxIndex + 1}`}
                  width={800}
                  height={800}
                  sizes="800px"
                  className="h-auto max-h-[calc(100svh-11rem)] w-auto max-w-full rounded-[22px] object-contain shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
                />

                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(wrap(lightboxIndex - 1))}
                      aria-label={prevLabel}
                      className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/18 bg-black/38 text-white transition hover:bg-black/60"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(wrap(lightboxIndex + 1))}
                      aria-label={nextLabel}
                      className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/18 bg-black/38 text-white transition hover:bg-black/60"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
