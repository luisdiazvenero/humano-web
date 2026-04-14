"use client"

import { useEffect, useState } from "react"

export function VideoBackground() {
  const [isMobile, setIsMobile] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    setIsMobile(mq.matches)
    setReady(true)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  if (!ready) return null

  return (
    <video
      key={isMobile ? "mobile" : "desktop"}
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 h-full w-full object-cover"
      poster={isMobile ? "/humanohotel-mobile-poster.jpg" : "/humanohotel-desktop-poster.jpg"}
    >
      <source
        src={isMobile ? "/humanohotel-mobile.mp4" : "/humanohotel-desktop.mp4"}
        type="video/mp4"
      />
    </video>
  )
}
