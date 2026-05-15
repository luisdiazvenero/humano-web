import { HumanoServicesPageContent } from "@/app/(web)/servicios/page"
import { WEB_I18N } from "@/lib/web/i18n"
import { buildPageMetadata } from "@/lib/web/seo"

export const metadata = buildPageMetadata("en", {
  title: WEB_I18N.en.servicesMetaTitle,
  description: WEB_I18N.en.servicesMetaDescription,
  canonical: "/en/services",
  alternates: { es: "/servicios", en: "/en/services" },
})

export default function HumanoServicesPageEn() {
  return <HumanoServicesPageContent lang="en" />
}
