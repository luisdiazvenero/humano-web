import type { Metadata } from "next"
import { ServiceDetailPageContent } from "@/app/(web)/servicios/[service]/page"
import { getHumanoServiceBySlug, getHumanoServices } from "@/lib/humano/services"
import { WEB_I18N } from "@/lib/web/i18n"
import { buildPageMetadata } from "@/lib/web/seo"

export function generateStaticParams() {
  return getHumanoServices("en").map((service) => ({ service: service.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>
}): Promise<Metadata> {
  const { service } = await params
  const serviceData = getHumanoServiceBySlug(service, "en")

  if (!serviceData) {
    return buildPageMetadata("en", {
      title: "Hotel services in Miraflores Lima | Hotel Humano",
      description: WEB_I18N.en.servicesMetaDescription,
      canonical: `/en/services/${service}`,
      alternates: { es: `/servicios/${service}`, en: `/en/services/${service}` },
    })
  }

  return buildPageMetadata("en", {
    title: `${serviceData.nombre} | Hotel Humano Miraflores`,
    description: serviceData.descripcionExperiencial,
    canonical: `/en/services/${serviceData.slug}`,
    alternates: { es: `/servicios/${serviceData.slug}`, en: `/en/services/${serviceData.slug}` },
    ogImage: serviceData.imagen ?? undefined,
  })
}

export default async function HumanoServiceDetailPageEn({
  params,
}: {
  params: Promise<{ service: string }>
}) {
  const { service } = await params
  return <ServiceDetailPageContent slug={service} lang="en" />
}
