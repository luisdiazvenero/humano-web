import { HumanoContactoPageContent } from "@/app/(web)/contacto/page"
import { WEB_I18N } from "@/lib/web/i18n"
import { buildPageMetadata } from "@/lib/web/seo"

export const metadata = buildPageMetadata("en", {
  title: WEB_I18N.en.contactMetaTitle,
  description: WEB_I18N.en.contactMetaDescription,
  canonical: "/en/contact",
  alternates: { es: "/contacto", en: "/en/contact" },
})

export default function HumanoContactoPageEn() {
  return <HumanoContactoPageContent lang="en" />
}
