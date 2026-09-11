import type { WebLang } from "@/lib/web/i18n"
import { TRIPADVISOR_FALLBACK, type TripadvisorStats } from "@/lib/web/tripadvisor"

// Insignia propia: el widget oficial de Tripadvisor carga por script externo y
// los bloqueadores lo dejan en blanco.
const REVIEW_URL: Record<WebLang, string> = {
  es: "https://www.tripadvisor.es/Hotel_Review-g294316-d34049476-Reviews-Humano_Lima_a_Tribute_Portfolio_Hotel-Lima_Lima_Region.html",
  en: "https://www.tripadvisor.com/Hotel_Review-g294316-d34049476-Reviews-Humano_Lima_a_Tribute_Portfolio_Hotel-Lima_Lima_Region.html",
}

const TA_GREEN = "#00AA6C"

function RatingDots({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((index) => {
        const fill = Math.min(Math.max(value - index, 0), 1)

        return (
          <svg key={index} viewBox="0 0 12 12" className="h-[11px] w-[11px]">
            <defs>
              <linearGradient id={`ta-dot-${index}`}>
                <stop offset={`${fill * 100}%`} stopColor={TA_GREEN} />
                <stop offset={`${fill * 100}%`} stopColor="transparent" />
              </linearGradient>
            </defs>
            <circle
              cx="6"
              cy="6"
              r="5"
              fill={`url(#ta-dot-${index})`}
              stroke={TA_GREEN}
              strokeWidth="1.4"
            />
          </svg>
        )
      })}
    </span>
  )
}

export function TripAdvisorBadge({
  lang = "es",
  className = "",
  stats = TRIPADVISOR_FALLBACK,
}: {
  lang?: WebLang
  className?: string
  stats?: TripadvisorStats
}) {
  const isEn = lang === "en"
  const { rating, reviews, ranking, rankingTotal } = stats
  const ratingLabel = isEn ? rating.toFixed(1) : rating.toFixed(1).replace(".", ",")
  const reviewsLabel = isEn ? `${reviews} reviews` : `${reviews} opiniones`
  const rankingLabel =
    ranking && rankingTotal
      ? isEn
        ? `#${ranking} of ${rankingTotal} hotels in Lima`
        : `N.º ${ranking} de ${rankingTotal} hoteles en Lima`
      : null
  const ariaLabel = isEn
    ? `Tripadvisor: ${ratingLabel} out of 5, ${reviews} reviews. Open the hotel page.`
    : `Tripadvisor: ${ratingLabel} de 5, ${reviews} opiniones. Abrir la ficha del hotel.`

  return (
    <a
      href={REVIEW_URL[lang]}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`group inline-flex items-center gap-4 rounded-full border border-white/25 bg-black/35 px-5 py-3 text-white backdrop-blur-md transition hover:border-white/40 hover:bg-black/45 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/tripadvisor-lockup-white.svg"
        alt="Tripadvisor"
        width={143}
        height={22}
        className="h-[22px] w-auto shrink-0"
      />

      <span className="h-6 w-px shrink-0 bg-white/25" aria-hidden="true" />

      <span className="flex flex-col leading-tight">
        <span className="flex items-center gap-2">
          <span className="text-[15px] font-semibold">{ratingLabel}</span>
          <RatingDots value={rating} />
          <span className="text-[12px] text-white/80">{reviewsLabel}</span>
        </span>
        {rankingLabel ? (
          <span className="mt-0.5 text-[11px] text-white/60">{rankingLabel}</span>
        ) : null}
      </span>
    </a>
  )
}
