"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

type RoomDetailGalleryProps = {
  roomName: string
  images: string[]
  videoHorizontal?: string | null
  videoVertical?: string | null
  showHumanoPlaceholder?: boolean
}

type LightboxItem =
  | { kind: "image"; src: string; index: number }
  | { kind: "video"; src: string }

export function RoomDetailGallery({
  roomName,
  images,
  videoHorizontal,
  videoVertical,
  showHumanoPlaceholder = false,
}: RoomDetailGalleryProps) {
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const lightboxVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const hasVideo = Boolean(videoHorizontal || videoVertical)
  // Side thumbnails: show up to 3 if video is present, else 2
  const sideImages = hasVideo ? images.slice(0, 3) : images.slice(1, 3)
  const gridRows = hasVideo ? "lg:grid-rows-3" : "lg:grid-rows-2"

  useEffect(() => {
    if (!lightbox) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightbox(null); return }
      if (lightbox.kind !== "image") return
      if (e.key === "ArrowLeft") {
        setLightbox({ kind: "image", src: images[(lightbox.index - 1 + images.length) % images.length], index: (lightbox.index - 1 + images.length) % images.length })
      }
      if (e.key === "ArrowRight") {
        setLightbox({ kind: "image", src: images[(lightbox.index + 1) % images.length], index: (lightbox.index + 1) % images.length })
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [lightbox, images])

  // Pause lightbox video on close
  useEffect(() => {
    if (!lightbox && lightboxVideoRef.current) {
      lightboxVideoRef.current.pause()
    }
  }, [lightbox])

  if (images.length === 0 && !hasVideo) {
    return (
      <div className="overflow-hidden rounded-[30px] border border-white/14 bg-white/8 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <div className="relative aspect-[4/5] w-full bg-white/8 sm:aspect-[16/10] lg:min-h-[620px]">
          {showHumanoPlaceholder ? (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,93,0.18),transparent_58%),linear-gradient(135deg,rgba(0,48,53,0.98),rgba(0,48,53,0.84))]">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image src="/logo-humano.svg" alt="Humano" width={90} height={102} className="h-24 w-auto opacity-95" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.65fr)_minmax(220px,0.86fr)] ${gridRows}`}>

        {/* Main: video on desktop, first image on mobile */}
        {hasVideo ? (
          <div className="relative overflow-hidden rounded-[30px] border border-white/14 bg-white/8 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:col-span-2 lg:col-span-1 lg:row-span-3">
            <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:h-full lg:min-h-[620px] lg:aspect-auto">
              {/* Horizontal video — desktop */}
              {videoHorizontal ? (
                <video
                  ref={videoRef}
                  src={videoHorizontal}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="hidden h-full w-full object-cover lg:block"
                />
              ) : null}
              {/* Vertical video — mobile */}
              {videoVertical ? (
                <video
                  src={videoVertical}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="block h-full w-full object-cover lg:hidden"
                />
              ) : videoHorizontal ? (
                <video
                  src={videoHorizontal}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="block h-full w-full object-cover lg:hidden"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
              {/* Play button */}
              <button
                type="button"
                onClick={() => {
                  setLightbox({ kind: "video", src: (isMobile ? videoVertical : videoHorizontal) || videoHorizontal || videoVertical || "" })
                  trackEvent("web_room_video_play", { room_name: roomName })
                }}
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                aria-label="Ver video en pantalla completa"
              >
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur transition hover:bg-white/30">
                  <span className="ml-1 inline-block h-0 w-0 border-b-[9px] border-l-[14px] border-t-[9px] border-b-transparent border-l-white border-t-transparent" />
                </span>
              </button>
            </div>
          </div>
        ) : (
          // No video: show primary image as before
          <button
            type="button"
            onClick={() => setLightbox({ kind: "image", src: images[0], index: 0 })}
            className="group relative overflow-hidden rounded-[30px] border border-white/14 bg-white/8 shadow-[0_24px_60px_rgba(0,0,0,0.22)] cursor-pointer sm:col-span-2 lg:col-span-1 lg:row-span-2"
            aria-label={`Abrir galería de ${roomName}`}
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:h-full lg:min-h-[620px] lg:aspect-auto">
              <Image
                src={images[0]}
                alt={roomName}
                fill
                priority
                quality={90}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
            </div>
          </button>
        )}

        {/* Side thumbnails */}
        {sideImages.map((image, index) => (
          <button
            key={`${roomName}-side-${index}`}
            type="button"
            onClick={() => {
              const imageIndex = hasVideo ? index : index + 1
              setLightbox({ kind: "image", src: image, index: imageIndex })
            }}
            className="group relative overflow-hidden rounded-[26px] border border-white/14 bg-white/8 shadow-[0_18px_42px_rgba(0,0,0,0.18)] cursor-pointer"
            aria-label={`Ver imagen ${index + 1} de ${roomName}`}
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:h-full lg:min-h-[200px] lg:aspect-auto">
              <Image
                src={image}
                alt={`${roomName} imagen ${index + 1}`}
                fill
                quality={90}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 35vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-transparent" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null ? (
        <div
          className="fixed inset-0 z-[80] bg-[rgba(0,0,0,0.88)] backdrop-blur-md"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.kind === "video" ? `Video de ${roomName}` : `Galería de ${roomName}`}
        >
          <div className="flex min-h-screen items-center justify-center px-4 py-4 sm:px-6 sm:py-6">
            <div
              className="relative flex max-h-[calc(100svh-2rem)] w-full max-w-[1320px] flex-col sm:max-h-[calc(100svh-3rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative min-h-0 flex-1">
                {lightbox.kind === "video" ? (
                  <div className="mx-auto flex w-full max-w-[min(calc(100vw-3rem),960px)] flex-col gap-3">
                    <div className="flex w-full items-center justify-between gap-4">
                      <p className="font-serif text-xl text-white/90">{roomName}</p>
                      <button
                        type="button"
                        onClick={() => setLightbox(null)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white transition hover:bg-white/16 cursor-pointer"
                        aria-label="Cerrar"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="overflow-hidden rounded-[26px] border border-white/10 shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
                      <video
                        ref={lightboxVideoRef}
                        src={lightbox.src}
                        controls
                        autoPlay
                        playsInline
                        className="block w-full max-h-[min(72svh,calc(100svh-13rem))]"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex items-center justify-between gap-4 px-1">
                      <p className="text-sm font-medium text-white/72">
                        {lightbox.index + 1} / {images.length}
                      </p>
                      <button
                        type="button"
                        onClick={() => setLightbox(null)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white transition hover:bg-white/16 cursor-pointer"
                        aria-label="Cerrar"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    {images.length > 1 ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setLightbox({ kind: "image", src: images[(lightbox.index - 1 + images.length) % images.length], index: (lightbox.index - 1 + images.length) % images.length })}
                          className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/28 text-white transition hover:bg-black/42 cursor-pointer sm:h-12 sm:w-12"
                          aria-label="Imagen anterior"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setLightbox({ kind: "image", src: images[(lightbox.index + 1) % images.length], index: (lightbox.index + 1) % images.length })}
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
                          src={lightbox.src}
                          alt={`${roomName} imagen ${lightbox.index + 1}`}
                          fill
                          unoptimized
                          className="object-contain"
                          sizes="100vw"
                        />
                      </div>
                    </div>
                    {images.length > 1 ? (
                      <div className="mt-3 flex shrink-0 flex-wrap justify-center gap-2.5 sm:gap-3">
                        {images.map((image, idx) => (
                          <button
                            key={`${roomName}-thumb-${idx}`}
                            type="button"
                            onClick={() => setLightbox({ kind: "image", src: image, index: idx })}
                            className={`relative overflow-hidden rounded-2xl border transition cursor-pointer ${
                              idx === lightbox.index
                                ? "border-white/72 opacity-100"
                                : "border-white/12 opacity-65 hover:opacity-100"
                            }`}
                            aria-label={`Ir a imagen ${idx + 1}`}
                          >
                            <div className="relative h-14 w-14 sm:h-16 sm:w-20">
                              <Image
                                src={image}
                                alt={`${roomName} miniatura ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
