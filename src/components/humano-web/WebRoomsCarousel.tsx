"use client"

import { useRouter } from "next/navigation"
import {
  RoomMenuCarousel,
  type RoomCarouselItem,
} from "@/components/humano-v09/RoomMenuCarousel"

interface WebRoomsCarouselProps {
  items: RoomCarouselItem[]
}

export function WebRoomsCarousel({ items }: WebRoomsCarouselProps) {
  const router = useRouter()

  return (
    <RoomMenuCarousel
      items={items}
      slideGapPx={32}
      dotsMarginTopPx={36}
      enableReveal
      onSelect={({ id }) => router.push(`/humano/web/${id}`)}
    />
  )
}
