"use client"

import type { ReactNode } from "react"

import { trackEvent } from "@/lib/analytics"

type WebScrollToSectionButtonProps = {
  targetId: string
  className?: string
  children: ReactNode
  eventName?: string
  eventParams?: Record<string, unknown>
}

export function WebScrollToSectionButton({
  targetId,
  className,
  children,
  eventName,
  eventParams,
}: WebScrollToSectionButtonProps) {
  const handleClick = () => {
    if (eventName) trackEvent(eventName, eventParams)

    const target = document.getElementById(targetId)
    if (!target) return

    const offset = window.innerWidth >= 1024 ? 120 : window.innerWidth >= 640 ? 108 : 96
    const top = target.getBoundingClientRect().top + window.scrollY - offset

    window.history.replaceState(null, "", `#${targetId}`)
    window.scrollTo({
      top: Math.max(top, 0),
      behavior: "smooth",
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className ? `${className} cursor-pointer` : "cursor-pointer"}
    >
      {children}
    </button>
  )
}
