import type { Metadata } from "next"
import { RoomDetailPageContent } from "@/app/(web)/[room]/page"
import { getHumanoRoomBySlug, getHumanoRooms } from "@/lib/humano/rooms"
import { WEB_I18N } from "@/lib/web/i18n"
import { buildPageMetadata } from "@/lib/web/seo"

export function generateStaticParams() {
  return getHumanoRooms("en").map((room) => ({ room: room.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ room: string }>
}): Promise<Metadata> {
  const { room } = await params
  const roomData = getHumanoRoomBySlug(room, "en")
  const esRoom = getHumanoRoomBySlug(room, "es")
  const esSlug = esRoom?.slug ?? room

  if (!roomData) {
    return buildPageMetadata("en", {
      title: "Rooms in Miraflores Lima | Hotel Humano",
      description: WEB_I18N.en.roomsMetaDescription,
      canonical: `/en/rooms/${room}`,
      alternates: { es: `/${esSlug}`, en: `/en/rooms/${room}` },
    })
  }

  return buildPageMetadata("en", {
    title: `${roomData.nombre} room in Miraflores Lima | Hotel Humano`,
    description: roomData.descripcionExperiencial,
    canonical: `/en/rooms/${roomData.slug}`,
    alternates: { es: `/${esSlug}`, en: `/en/rooms/${roomData.slug}` },
    ogImage: roomData.imagen ?? undefined,
  })
}

export default async function HumanoRoomPageEn({
  params,
}: {
  params: Promise<{ room: string }>
}) {
  const { room } = await params
  return <RoomDetailPageContent slug={room} lang="en" />
}
