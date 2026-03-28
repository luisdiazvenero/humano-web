"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

type RoomDetailGalleryProps = {
  roomName: string
  images: string[]
  showHumanoPlaceholder?: boolean
}

export function RoomDetailGallery({
  roomName,
  images,
  showHumanoPlaceholder = false,
}: RoomDetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    if (activeIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null)
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => {
          if (current === null) return current
          return (current - 1 + images.length) % images.length
        })
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => {
          if (current === null) return current
          return (current + 1) % images.length
        })
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [activeIndex, images.length])

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-[30px] border border-white/14 bg-white/8 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <div className="relative aspect-[4/5] w-full bg-white/8 sm:aspect-[16/10] lg:min-h-[620px]">
          {showHumanoPlaceholder ? (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,93,0.18),transparent_58%),linear-gradient(135deg,rgba(0,48,53,0.98),rgba(0,48,53,0.84))]">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/logo-humano.svg"
                  alt="Humano"
                  width={90}
                  height={102}
                  className="h-24 w-auto opacity-95"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  const primaryImage = images[0]
  const sideImages = images.slice(1, 3)

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.65fr)_minmax(220px,0.86fr)] lg:grid-rows-2">
        <button
          type="button"
          onClick={() => setActiveIndex(0)}
          className="group relative overflow-hidden rounded-[30px] border border-white/14 bg-white/8 shadow-[0_24px_60px_rgba(0,0,0,0.22)] cursor-pointer sm:col-span-2 lg:col-span-1 lg:row-span-2"
          aria-label={`Abrir galería de ${roomName}`}
        >
          <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:h-full lg:min-h-[620px] lg:aspect-auto">
            <Image
              src={primaryImage}
              alt={roomName}
              fill
              priority
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
          </div>
        </button>

        {sideImages.map((image, index) => (
          <button
            key={`${roomName}-side-${index}`}
            type="button"
            onClick={() => setActiveIndex(index + 1)}
            className="group relative overflow-hidden rounded-[26px] border border-white/14 bg-white/8 shadow-[0_18px_42px_rgba(0,0,0,0.18)] cursor-pointer"
            aria-label={`Ver imagen ${index + 2} de ${roomName}`}
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:h-full lg:min-h-[300px] lg:aspect-auto">
              <Image
                src={image}
                alt={`${roomName} imagen ${index + 2}`}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 22vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-transparent" />
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-[80] bg-[rgba(0,0,0,0.82)] backdrop-blur-md"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de ${roomName}`}
        >
          <div className="flex min-h-screen items-center justify-center px-4 py-4 sm:px-6 sm:py-6">
            <div
              className="relative flex max-h-[calc(100svh-2rem)] w-full max-w-[1320px] flex-col sm:max-h-[calc(100svh-3rem)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-4 px-1">
                <p className="text-sm font-medium text-white/72">
                  {activeIndex + 1} / {images.length}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white transition hover:bg-white/16 cursor-pointer"
                  aria-label="Cerrar galería"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative min-h-0 flex-1">
                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex((current) =>
                          current === null
                            ? 0
                            : (current - 1 + images.length) % images.length
                        )
                      }
                      className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/28 text-white transition hover:bg-black/42 cursor-pointer sm:h-12 sm:w-12"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex((current) =>
                          current === null ? 0 : (current + 1) % images.length
                        )
                      }
                      className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/28 text-white transition hover:bg-black/42 cursor-pointer sm:h-12 sm:w-12"
                      aria-label="Siguiente imagen"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                ) : null}

                <div className="h-full overflow-hidden rounded-[26px] border border-white/10 bg-black/16 shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
                  <div className="relative h-[min(68svh,calc(100svh-12rem))] min-h-[280px] w-full sm:h-[min(72svh,calc(100svh-13rem))]">
                    <Image
                      src={images[activeIndex]}
                      alt={`${roomName} imagen ${activeIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                    />
                  </div>
                </div>
              </div>

              {images.length > 1 ? (
                <div className="mt-3 flex shrink-0 flex-wrap justify-center gap-2.5 sm:gap-3">
                  {images.map((image, index) => (
                    <button
                      key={`${roomName}-thumb-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`relative overflow-hidden rounded-2xl border transition cursor-pointer ${
                        index === activeIndex
                          ? "border-white/72 opacity-100"
                          : "border-white/12 opacity-65 hover:opacity-100"
                      }`}
                      aria-label={`Ir a imagen ${index + 1}`}
                    >
                      <div className="relative h-14 w-14 sm:h-16 sm:w-20">
                        <Image
                          src={image}
                          alt={`${roomName} miniatura ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
