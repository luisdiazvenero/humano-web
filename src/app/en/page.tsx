import { HumanoWebHome } from "@/app/(web)/page"
import { WEB_I18N } from "@/lib/web/i18n"
import { buildPageMetadata } from "@/lib/web/seo"

export const metadata = buildPageMetadata("en", {
  title: WEB_I18N.en.metaTitle,
  description: WEB_I18N.en.metaDescription,
  canonical: "/en",
  alternates: { es: "/", en: "/en" },
})

export default function HumanoWebPageEn() {
  return <HumanoWebHome lang="en" />
}
