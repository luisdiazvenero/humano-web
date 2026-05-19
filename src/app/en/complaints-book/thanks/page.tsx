import { HumanoClaimsBookThanksContent } from "@/app/(web)/libro-de-reclamaciones/gracias/page"
import { buildPageMetadata } from "@/lib/web/seo"

export const metadata = buildPageMetadata("en", {
  title: "Submission received | Hotel Humano",
  description: "Hotel Humano complaints book confirmation page.",
  canonical: "/en/complaints-book/thanks",
  alternates: {
    es: "/libro-de-reclamaciones/gracias",
    en: "/en/complaints-book/thanks",
  },
})

export default function HumanoClaimsBookThanksPageEn() {
  return <HumanoClaimsBookThanksContent lang="en" />
}
