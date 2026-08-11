import { HumanoEventosPageContent } from "@/app/(web)/eventos/page"
import { WEB_I18N } from "@/lib/web/i18n"
import { buildPageMetadata } from "@/lib/web/seo"

export const metadata = buildPageMetadata("en", {
  title: WEB_I18N.en.eventsMetaTitle,
  description: WEB_I18N.en.eventsMetaDescription,
  canonical: "/en/events",
  alternates: { es: "/eventos", en: "/en/events" },
})

export default function HumanoEventsPageEn() {
  return <HumanoEventosPageContent lang="en" />
}
