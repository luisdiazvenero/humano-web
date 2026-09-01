// El apex humanolima.com redirige 307 a www, así que el dominio canónico es www.
// Todo lo que apunte al sitio (canonical, hreflang, sitemap, robots, JSON-LD)
// sale de aquí para que no vuelvan a divergir.
export const SITE_URL = "https://www.humanolima.com"

export const abs = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`

// Las redes no renderizan SVG: la imagen para compartir tiene que ser JPG o PNG,
// y 1200x630 es la proporción que esperan Facebook, WhatsApp, LinkedIn y X.
export const OG_IMAGE = {
  url: "/og-humano.jpg",
  width: 1200,
  height: 630,
  alt: "Piscina en la azotea del Hotel Humano, Miraflores, al atardecer",
} as const
