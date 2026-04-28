"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { VideoBackground } from "@/components/humano-web/VideoBackground"
import { trackEvent } from "@/lib/analytics"

export function HeroSection() {
  const [lightbox, setLightbox] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (!lightbox) {
      videoRef.current?.pause()
      return
    }
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(false) }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [lightbox])

  const videoSrc = isMobile ? "/humanohotel-mobile.mp4" : "/humanohotel-desktop.mp4"

  return (
    <>
      <section id="inicio" className="relative min-h-screen">
        <VideoBackground />
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative mx-auto h-screen w-full max-w-[1280px] px-4 text-center text-white sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => { setLightbox(true); trackEvent("web_video_play", { location: "hero" }) }}
            className="absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur transition hover:bg-white/30 cursor-pointer"
            aria-label="Reproducir video"
          >
            <span className="ml-1 inline-block h-0 w-0 border-b-[9px] border-l-[14px] border-t-[9px] border-b-transparent border-l-white border-t-transparent" />
          </button>
          <div className="absolute left-1/2 top-[calc(50%+76px)] w-full max-w-[900px] -translate-x-1/2 px-4">
            <p className="text-4xl font-serif leading-tight">
              Viaja con propósito,
              <br />
              no solo con itinerario
            </p>
            <p className="mt-4 text-[18px] leading-tight text-white/85">
              Descubre Humano
            </p>
          </div>
        </div>
      </section>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[80] bg-[rgba(0,0,0,0.92)] backdrop-blur-md"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Video Hotel Humano"
        >
          <div className="flex min-h-screen items-center justify-center px-4 py-4 sm:px-6 sm:py-6">
            <div
              className="mx-auto flex w-fit flex-col gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex w-full items-center justify-between gap-4">
                <p className="font-serif text-xl text-white/90">Hotel Humano</p>
                <button
                  type="button"
                  onClick={() => setLightbox(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white transition hover:bg-white/16 cursor-pointer"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="overflow-hidden rounded-[26px] border border-white/10 shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  controls
                  autoPlay
                  playsInline
                  className="block max-h-[min(72svh,calc(100svh-13rem))] max-w-[calc(100vw-2rem)]"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
