"use client"

import Link from "next/link"
import type { ComponentProps } from "react"
import { trackEvent } from "@/lib/analytics"

type TrackLinkProps = ComponentProps<typeof Link> & {
  eventName: string
  eventParams?: Record<string, unknown>
}

export function TrackLink({ eventName, eventParams, onClick, ...props }: TrackLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent(eventName, eventParams)
        onClick?.(e)
      }}
    />
  )
}
