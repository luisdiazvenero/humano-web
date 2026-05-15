import { HumanoHotelPageContent } from "@/app/(web)/hotel/page"
import { WEB_I18N } from "@/lib/web/i18n"
import { buildPageMetadata } from "@/lib/web/seo"

export const metadata = buildPageMetadata("en", {
  title: WEB_I18N.en.hotelMetaTitle,
  description: WEB_I18N.en.hotelMetaDescription,
  canonical: "/en/hotel",
  alternates: { es: "/hotel", en: "/en/hotel" },
})

export default function HumanoHotelPageEn() {
  return <HumanoHotelPageContent lang="en" />
}
