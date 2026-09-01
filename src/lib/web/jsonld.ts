// Datos estructurados schema.org.
//
// Es la forma en que Google y los rastreadores de los LLM entienden qué es el
// negocio sin tener que interpretar el texto. Todo lo de aquí sale de datos
// verificados del hotel: no se inventan coordenadas, estrellas, precios ni
// valoraciones, porque un dato falso aquí es peor que no tener nada.

import type { WebLang } from "@/lib/web/i18n"
import { SITE_URL, abs } from "@/lib/web/site"

const HOTEL_ID = `${SITE_URL}/#hotel`

const HOTEL = {
  name: "Hotel Humano",
  legalName: "Humano Hotel",
  street: "Malecón Balta 710",
  locality: "Miraflores",
  region: "Lima",
  postalCode: "15074",
  country: "PE",
  phone: "+51 1 904 1400",
  email: "hola@humanohoteles.com",
  checkinTime: "15:00",
  checkoutTime: "12:00",
  sameAs: [
    "https://www.instagram.com/humanolima/",
    "https://www.facebook.com/humanolima/",
    "https://www.marriott.com/es/hotels/limtx-humano-lima-a-tribute-portfolio-hotel/overview/",
  ],
} as const

// Solo instalaciones que existen de verdad, con el nombre schema.org habitual.
const AMENITIES = [
  "Piscina",
  "Gimnasio",
  "Restaurante",
  "Bar",
  "Coworking",
  "Salas de reuniones",
  "Desayuno",
  "Wi-Fi gratuito",
]

const address = {
  "@type": "PostalAddress",
  streetAddress: HOTEL.street,
  addressLocality: HOTEL.locality,
  addressRegion: HOTEL.region,
  postalCode: HOTEL.postalCode,
  addressCountry: HOTEL.country,
}

export function hotelJsonLd(lang: WebLang, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": HOTEL_ID,
    name: HOTEL.name,
    legalName: HOTEL.legalName,
    description,
    url: lang === "en" ? `${SITE_URL}/en` : SITE_URL,
    image: abs("/og-humano.jpg"),
    logo: abs("/logo-humano.png"),
    telephone: HOTEL.phone,
    email: HOTEL.email,
    address,
    brand: { "@type": "Brand", name: "Tribute Portfolio" },
    parentOrganization: { "@type": "Organization", name: "Marriott International" },
    checkinTime: HOTEL.checkinTime,
    checkoutTime: HOTEL.checkoutTime,
    // Admite perros hasta 15 kg con cargo adicional (ver SERV_MASCOTAS).
    petsAllowed: true,
    amenityFeature: AMENITIES.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    sameAs: [...HOTEL.sameAs],
  }
}

export function roomJsonLd(opts: {
  name: string
  description: string
  url: string
  image?: string | null
  bookingUrl: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: opts.name,
    description: opts.description,
    url: abs(opts.url),
    ...(opts.image ? { image: abs(opts.image) } : {}),
    containedInPlace: { "@id": HOTEL_ID },
    potentialAction: {
      "@type": "ReserveAction",
      target: opts.bookingUrl,
      name: "Reservar",
    },
  }
}

export function restaurantJsonLd(opts: {
  name: string
  description: string
  url: string
  image?: string | null
  servesCuisine: string
  telephone: string
  menuUrl: string
  reservationUrl?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: opts.name,
    description: opts.description,
    url: abs(opts.url),
    ...(opts.image ? { image: abs(opts.image) } : {}),
    servesCuisine: opts.servesCuisine,
    telephone: opts.telephone,
    hasMenu: abs(opts.menuUrl),
    address,
    containedInPlace: { "@id": HOTEL_ID },
    ...(opts.reservationUrl
      ? {
          acceptsReservations: "True",
          potentialAction: {
            "@type": "ReserveAction",
            target: opts.reservationUrl,
            name: "Reservar mesa",
          },
        }
      : {}),
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  }
}
