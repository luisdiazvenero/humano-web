import type { Metadata } from "next"
import { FacilityDetailPageContent } from "@/app/(web)/hotel/[facility]/page"
import { getHumanoFacilities, getHumanoFacilityBySlug } from "@/lib/humano/facilities"
import { WEB_I18N } from "@/lib/web/i18n"
import { buildPageMetadata } from "@/lib/web/seo"

export function generateStaticParams() {
  return getHumanoFacilities("en").map((facility) => ({ facility: facility.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ facility: string }>
}): Promise<Metadata> {
  const { facility } = await params
  const facilityData = getHumanoFacilityBySlug(facility, "en")

  if (!facilityData) {
    return buildPageMetadata("en", {
      title: "Hotel facilities in Miraflores Lima | Hotel Humano",
      description: WEB_I18N.en.hotelMetaDescription,
      canonical: `/en/hotel/${facility}`,
      alternates: { es: `/hotel/${facility}`, en: `/en/hotel/${facility}` },
    })
  }

  return buildPageMetadata("en", {
    title: `${facilityData.nombre} | Hotel Humano Miraflores`,
    description: facilityData.descripcionExperiencial,
    canonical: `/en/hotel/${facilityData.slug}`,
    alternates: { es: `/hotel/${facilityData.slug}`, en: `/en/hotel/${facilityData.slug}` },
    ogImage: facilityData.imagen ?? undefined,
  })
}

export default async function HumanoFacilityDetailPageEn({
  params,
}: {
  params: Promise<{ facility: string }>
}) {
  const { facility } = await params
  return <FacilityDetailPageContent slug={facility} lang="en" />
}
