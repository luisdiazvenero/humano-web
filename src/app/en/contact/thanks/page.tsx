import { HumanoContactoGraciasContent } from "@/app/(web)/contacto/gracias/page"
import { buildPageMetadata } from "@/lib/web/seo"

export const metadata = buildPageMetadata("en", {
  title: "Message received | Hotel Humano",
  description: "Hotel Humano contact confirmation page.",
  canonical: "/en/contact/thanks",
  alternates: {
    es: "/contacto/gracias",
    en: "/en/contact/thanks",
  },
})

export default function HumanoContactoThanksPageEn() {
  return <HumanoContactoGraciasContent lang="en" />
}
