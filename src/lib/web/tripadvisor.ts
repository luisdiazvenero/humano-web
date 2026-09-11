import fallback from "@/data/tripadvisor.json"

export type TripadvisorStats = {
  rating: number
  reviews: number
  // El widget público no expone el ranking: sale del JSON y se actualiza a mano.
  ranking: number | null
  rankingTotal: number | null
}

export const TRIPADVISOR_LOCATION_ID = "34049476"

export const TRIPADVISOR_EMBED_URL =
  `https://www.tripadvisor.es/WidgetEmbed-cdsratingsonlynarrow?locationId=${TRIPADVISOR_LOCATION_ID}&display_version=2&uniq=148&lang=es&border=false`

// El embed devuelve JavaScript que arma el HTML del widget: de ahí salen la
// calificación (bubble_50 = 5.0) y el número de opiniones.
export function parseTripadvisorWidget(body: string): { rating: number; reviews: number } | null {
  const ratingMatch = body.match(/bubble_(\d{2})\b/)
  const reviewsMatch = body.match(/([\d.,]+)\s*(?:opiniones|opini[óo]n|reviews|review)\b/i)

  if (!ratingMatch || !reviewsMatch) return null

  const rating = Number(ratingMatch[1]) / 10
  const reviews = Number(reviewsMatch[1].replace(/[.,]/g, ""))

  if (!Number.isFinite(rating) || rating <= 0 || rating > 5) return null
  if (!Number.isFinite(reviews) || reviews <= 0) return null

  return { rating, reviews }
}

export const TRIPADVISOR_FALLBACK: TripadvisorStats = fallback

// Se consulta en el servidor y se cachea un día; si Tripadvisor falla, quedan
// los valores guardados en src/data/tripadvisor.json.
export async function getTripadvisorStats(): Promise<TripadvisorStats> {
  try {
    const response = await fetch(TRIPADVISOR_EMBED_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9",
      },
      next: { revalidate: 86400 },
    })

    if (!response.ok) return TRIPADVISOR_FALLBACK

    const parsed = parseTripadvisorWidget(await response.text())
    if (!parsed) return TRIPADVISOR_FALLBACK

    return { ...TRIPADVISOR_FALLBACK, ...parsed }
  } catch {
    return TRIPADVISOR_FALLBACK
  }
}
