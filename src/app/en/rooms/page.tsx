import { HumanoRoomsPageContent } from "@/app/(web)/habitaciones/page"
import { WEB_I18N } from "@/lib/web/i18n"
import { buildPageMetadata } from "@/lib/web/seo"

export const metadata = buildPageMetadata("en", {
  title: WEB_I18N.en.roomsMetaTitle,
  description: WEB_I18N.en.roomsMetaDescription,
  canonical: "/en/rooms",
  alternates: { es: "/habitaciones", en: "/en/rooms" },
})

export default function HumanoRoomsPageEn() {
  return <HumanoRoomsPageContent lang="en" />
}
