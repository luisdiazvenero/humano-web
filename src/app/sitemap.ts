import type { MetadataRoute } from "next"
import { getHumanoRooms } from "@/lib/humano/rooms"
import { getHumanoFacilities } from "@/lib/humano/facilities"
import { getHumanoServices } from "@/lib/humano/services"

const SITE = "https://humanohoteles.com"

function entry(
  esPath: string,
  enPath: string,
  priority: number
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE}${esPath}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
    alternates: {
      languages: {
        es: `${SITE}${esPath}`,
        en: `${SITE}${enPath}`,
      },
    },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const roomsEs = getHumanoRooms("es")
  const roomsEn = getHumanoRooms("en")
  const facilities = getHumanoFacilities("es")
  const services = getHumanoServices("es")

  const items: MetadataRoute.Sitemap = [
    entry("/", "/en", 1.0),
    entry("/habitaciones", "/en/rooms", 0.9),
    entry("/hotel", "/en/hotel", 0.9),
    entry("/servicios", "/en/services", 0.9),
    entry("/contacto", "/en/contact", 0.7),
  ]

  roomsEs.forEach((room, i) => {
    const enSlug = roomsEn[i]?.slug ?? room.slug
    items.push(entry(`/${room.slug}`, `/en/rooms/${enSlug}`, 0.7))
  })

  facilities.forEach((facility) => {
    items.push(entry(`/hotel/${facility.slug}`, `/en/hotel/${facility.slug}`, 0.6))
  })

  services.forEach((service) => {
    items.push(entry(`/servicios/${service.slug}`, `/en/services/${service.slug}`, 0.6))
  })

  return items
}
