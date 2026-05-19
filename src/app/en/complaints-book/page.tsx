import { HumanoClaimsBookPageContent } from "@/app/(web)/libro-de-reclamaciones/page"
import { buildPageMetadata } from "@/lib/web/seo"

export const metadata = buildPageMetadata("en", {
  title: "Complaints Book | Hotel Humano",
  description: "Hotel Humano Miraflores complaints book form.",
  canonical: "/en/complaints-book",
  alternates: {
    es: "/libro-de-reclamaciones",
    en: "/en/complaints-book",
  },
})

export default function HumanoClaimsBookPageEn() {
  return <HumanoClaimsBookPageContent lang="en" />
}
