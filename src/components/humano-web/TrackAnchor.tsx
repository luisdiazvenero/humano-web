"use client"

import type { ComponentProps } from "react"
import { trackEvent } from "@/lib/analytics"

type TrackAnchorProps = ComponentProps<"a"> & {
  eventName: string
  eventParams?: Record<string, unknown>
}

// Para enlaces que no son navegación interna (tel:, mailto:): next/link no aporta
// nada ahí y GA4 tampoco los ve, porque la medición mejorada solo capta http/https.
export function TrackAnchor({ eventName, eventParams, onClick, ...props }: TrackAnchorProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent(eventName, eventParams)
        onClick?.(e)
      }}
    />
  )
}
