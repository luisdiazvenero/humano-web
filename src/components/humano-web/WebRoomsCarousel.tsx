"use client"

import { useRouter } from "next/navigation"
import {
  RoomMenuCarousel,
  type RoomCarouselItem,
} from "@/components/humano-v09/RoomMenuCarousel"

interface WebRoomsCarouselProps {
  items: RoomCarouselItem[]
  lang?: "es" | "en"
}

export function WebRoomsCarousel({ items, lang = "es" }: WebRoomsCarouselProps) {
  const router = useRouter()
  const basePath = lang === "en" ? "/en/rooms" : ""

  return (
    <RoomMenuCarousel
      items={items}
      slideGapPx={32}
      dotsMarginTopPx={36}
      enableReveal
      onSelect={({ id }) => router.push(`${basePath}/${id}`)}
    />
  )
}
