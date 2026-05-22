import { getHumanoFacilities, getHumanoFacilityBySlug } from "@/lib/humano/facilities"
import { getHumanoServiceBySlug, getHumanoServices } from "@/lib/humano/services"
import { getHumanoRoomBySlug, getHumanoRooms } from "@/lib/humano/rooms"
import { pathForLang, type WebLang } from "@/lib/web/i18n"

const ROOT_LEVEL_RESERVED = new Set([
  "en",
  "hotel",
  "habitaciones",
  "servicios",
  "contacto",
  "conserje",
  "servicios-huesped",
  "terminos-y-condiciones",
  "libro-de-reclamaciones",
])

function translateSlug(
  sourceSlug: string,
  sourceLang: WebLang,
  targetLang: WebLang,
  resource: "facility" | "service" | "room",
): string | null {
  if (resource === "facility") {
    const item = getHumanoFacilityBySlug(sourceSlug, sourceLang)
    if (!item) return null
    const target = getHumanoFacilities(targetLang).find((f) => f.id === item.id)
    return target?.slug ?? null
  }
  if (resource === "service") {
    const item = getHumanoServiceBySlug(sourceSlug, sourceLang)
    if (!item) return null
    const target = getHumanoServices(targetLang).find((s) => s.id === item.id)
    return target?.slug ?? null
  }
  // room
  const item = getHumanoRoomBySlug(sourceSlug, sourceLang)
  if (!item) return null
  const target = getHumanoRooms(targetLang).find((r) => r.id === item.id)
  return target?.slug ?? null
}

/**
 * Traduce una ruta entre idiomas, incluyendo el slug de páginas de detalle.
 * Soporta: /hotel/<slug>, /servicios/<slug>, /<roomSlug> (ES) y sus equivalentes en EN.
 */
export function localizedPath(currentPath: string, targetLang: WebLang): string {
  const sourceLang: WebLang = currentPath.startsWith("/en") ? "en" : "es"
  if (sourceLang === targetLang) return currentPath

  // Facility detail: /hotel/<slug> ↔ /en/hotel/<slug>
  const facilityMatch = currentPath.match(/^\/(?:en\/)?hotel\/([^/]+)\/?$/)
  if (facilityMatch) {
    const newSlug = translateSlug(facilityMatch[1], sourceLang, targetLang, "facility")
    if (newSlug) {
      return targetLang === "en" ? `/en/hotel/${newSlug}` : `/hotel/${newSlug}`
    }
  }

  // Service detail: /servicios/<slug> ↔ /en/services/<slug>
  const serviceMatch = currentPath.match(/^\/(?:en\/services|servicios)\/([^/]+)\/?$/)
  if (serviceMatch) {
    const newSlug = translateSlug(serviceMatch[1], sourceLang, targetLang, "service")
    if (newSlug) {
      return targetLang === "en" ? `/en/services/${newSlug}` : `/servicios/${newSlug}`
    }
  }

  // Room detail: /<slug> (ES, root) ↔ /en/rooms/<slug>
  if (sourceLang === "es") {
    const esRoomMatch = currentPath.match(/^\/([^/]+)\/?$/)
    if (esRoomMatch && !ROOT_LEVEL_RESERVED.has(esRoomMatch[1])) {
      const newSlug = translateSlug(esRoomMatch[1], "es", "en", "room")
      if (newSlug) return `/en/rooms/${newSlug}`
    }
  } else {
    const enRoomMatch = currentPath.match(/^\/en\/rooms\/([^/]+)\/?$/)
    if (enRoomMatch) {
      const newSlug = translateSlug(enRoomMatch[1], "en", "es", "room")
      if (newSlug) return `/${newSlug}`
    }
  }

  // Fallback: usar el mapeo genérico de segmentos
  return pathForLang(currentPath, targetLang)
}
