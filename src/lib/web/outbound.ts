// Enlaces que salen de humanolima.com hacia otro dominio.
//
// Llevan UTM para que Marriott y Mesa 247 puedan atribuir el tráfico que les
// manda la web: esos parámetros se leen en la analítica de ELLOS, no en la
// nuestra. La nuestra ya tiene el evento propio (web_reserve_click,
// web_room_reserve_click, web_restaurant_reserve_click).
//
// Toda la convención vive en este archivo: cambiarla es cambiar estas líneas.

const UTM_SOURCE = "humanolima.com"
const UTM_MEDIUM = "referral"

export const UTM_CAMPAIGN = {
  hotel: "hotel-booking",
  restaurant: "restaurant-booking",
  bonvoy: "bonvoy",
} as const

export const MARRIOTT_ROOMS_URL =
  "https://www.marriott.com/es/hotels/limtx-humano-lima-a-tribute-portfolio-hotel/rooms/"
export const MARRIOTT_BONVOY_URL = "https://www.marriott.com/default.mi"

// WhatsApp descarta el query string al abrir el chat, así que sus enlaces
// (wa.me, wa.link) se devuelven intactos: etiquetarlos solo ensucia la URL.
const NO_UTM_HOSTS = ["wa.me", "wa.link", "api.whatsapp.com"]

export function withUtm(url: string, campaign: string, content: string): string {
  if (!url.startsWith("https://") && !url.startsWith("http://")) return url
  try {
    const parsed = new URL(url)
    if (NO_UTM_HOSTS.includes(parsed.hostname)) return url
    parsed.searchParams.set("utm_source", UTM_SOURCE)
    parsed.searchParams.set("utm_medium", UTM_MEDIUM)
    parsed.searchParams.set("utm_campaign", campaign)
    parsed.searchParams.set("utm_content", content)
    return parsed.toString()
  } catch {
    return url
  }
}

// Atajos para los tres flujos que existen hoy.
export const marriottRoomsUrl = (content: string) =>
  withUtm(MARRIOTT_ROOMS_URL, UTM_CAMPAIGN.hotel, content)

export const bonvoyUrl = (content = "footer") =>
  withUtm(MARRIOTT_BONVOY_URL, UTM_CAMPAIGN.bonvoy, content)
