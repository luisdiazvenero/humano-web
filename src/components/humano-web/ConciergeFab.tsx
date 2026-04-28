"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      {/* Large star - left */}
      <path d="M9 1 L11.8 7.2 L18 10 L11.8 12.8 L9 19 L6.2 12.8 L0 10 L6.2 7.2 Z" />
      {/* Small star - top right */}
      <path d="M19 1 L20.3 3.7 L23 5 L20.3 6.3 L19 9 L17.7 6.3 L15 5 L17.7 3.7 Z" />
      {/* Small star - bottom right */}
      <path d="M19 13 L20.1 15.4 L22.5 16.5 L20.1 17.6 L19 20 L17.9 17.6 L15.5 16.5 L17.9 15.4 Z" />
    </svg>
  )
}

export function ConciergeFab() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <Link
      href="/conserje"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ir al conserje"
      style={visible ? { animation: "fab-float 3s ease-in-out infinite" } : undefined}
      className={[
        "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-azul-rgb)] text-white transition-all duration-500 hover:[animation-play-state:paused] hover:scale-105 sm:bottom-8 sm:right-8",
        visible ? "opacity-100 scale-100" : "opacity-0 translate-y-4 scale-90 pointer-events-none",
      ].join(" ")}
    >
      <SparklesIcon className="h-7 w-7" />
    </Link>
  )
}
