import { HumanoTerminosPageContent } from "@/app/(web)/terminos-y-condiciones/page"
import { buildPageMetadata } from "@/lib/web/seo"

export const metadata = buildPageMetadata("en", {
  title: "Terms and Conditions | Hotel Humano",
  description:
    "Information about privacy, personal data, and ARCO Rights at Hotel Humano Miraflores.",
  canonical: "/en/terms-and-conditions",
  alternates: {
    es: "/terminos-y-condiciones",
    en: "/en/terms-and-conditions",
  },
})

export default function HumanoTerminosPageEn() {
  return <HumanoTerminosPageContent lang="en" />
}
