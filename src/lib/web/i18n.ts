export type WebLang = "es" | "en"

export interface WebNavItem {
  label: string
  href: string
}

export const WEB_I18N: Record<WebLang, {
  // Header
  nav: WebNavItem[]
  reserve: string
  menuOpen: string
  // Hero
  heroTitle: string
  heroTitleLine2: string
  heroSubtitle: string
  heroPlayVideo: string
  heroClose: string
  heroVideoTitle: string
  // Home — Experiencia
  eyebrowExperience: string
  homeH1: string
  homeIntro: string
  iconsAriaPrefix: string
  iconLabels: { larcomar: string; caminatas: string; running: string; surf: string }
  homeLocation: string
  // Home — Habitaciones
  roomsH2: string
  roomsIntro: string
  seeAll: string
  // Home — Hotel
  hotelH2: string
  hotelIntro: string
  comingSoon: string
  // Footer
  footerCopyright: string
  footerComplaints: string
  footerTerms: string
  // Metadata
  metaTitle: string
  metaDescription: string
  htmlLang: string
  // Inner pages
  backToHotel: string
  ratingExcellent: string
  idealFor: string
  intentsList: string
  // Habitaciones
  roomsPageTitle: string
  roomsPageSubtitle: string
  roomsExploreCta: string
  roomsMetaTitle: string
  roomsMetaDescription: string
  // Hotel
  hotelPageTitle: string
  hotelPageSubtitle: string
  hotelExploreCta: string
  hotelMetaTitle: string
  hotelMetaDescription: string
  // Servicios
  servicesPageTitle: string
  servicesPageSubtitle: string
  servicesExploreCta: string
  servicesMetaTitle: string
  servicesMetaDescription: string
  // Contacto
  contactPageTitle: string
  contactPageSubtitle: string
  contactExploreCta: string
  contactMetaTitle: string
  contactMetaDescription: string
  // Filter galleries
  filterAll: string
  // Contact form (basic)
  formName: string
  formEmail: string
  formPhone: string
  formMessage: string
  formSubmit: string
  formCheckIn: string
  formCheckOut: string
  formGuests: string
}> = {
  es: {
    nav: [
      { label: "Home", href: "/" },
      { label: "Habitaciones", href: "/habitaciones" },
      { label: "Hotel", href: "/hotel" },
      { label: "Servicios", href: "/servicios" },
      { label: "Contacto", href: "/contacto" },
    ],
    reserve: "Reserva",
    menuOpen: "Abrir menú",
    heroTitle: "Viaja con propósito,",
    heroTitleLine2: "no solo con itinerario",
    heroSubtitle: "Descubre Humano",
    heroPlayVideo: "Reproducir video",
    heroClose: "Cerrar",
    heroVideoTitle: "Hotel Humano",
    eyebrowExperience: "Experiencia Humano",
    homeH1: "Hospitalidad consciente en Lima.",
    homeIntro:
      "En Humano, la hospitalidad va más allá del servicio. Creamos espacios donde las personas pueden reconectar consigo mismas y con los demás, en el corazón de Miraflores.",
    iconsAriaPrefix: "Abrir",
    iconLabels: {
      larcomar: "Larcomar",
      caminatas: "Caminatas",
      running: "Running",
      surf: "Surf y playa",
    },
    homeLocation:
      "En el corazón de Miraflores, a pasos del malecón y las mejores vistas del Pacífico. Un punto estratégico donde convergen cultura, gastronomía y vida urbana.",
    roomsH2: "Nuestras habitaciones.",
    roomsIntro:
      "Cada habitación está pensada para distintas formas de viajar. Desde quienes llegan solos hasta familias completas, aquí encuentras el espacio ideal para tu estadía.",
    seeAll: "Ver todas",
    hotelH2: "El Hotel.",
    hotelIntro:
      "Espacios diseñados para acompañar cada momento de tu visita: un coworking equipado, un restaurante de carnes y un restaurante para cualquier momento del día.",
    comingSoon: "Apertura Junio 2026",
    footerCopyright:
      "2026 Hotel Humano · Malecón Balta 710, Miraflores. Desarrollado por Armando Hoteles",
    footerComplaints: "Libro de Reclamaciones",
    footerTerms: "Términos y Condiciones",
    metaTitle: "Hotel en Miraflores Lima | Hotel Humano Tribute Portfolio by Marriott",
    metaDescription:
      "Descubre Hotel Humano en Miraflores, Lima. Un hotel Tribute Portfolio con diseño único, experiencias locales y una conexión auténtica con la ciudad.",
    htmlLang: "es",
    backToHotel: "Volver al Hotel",
    ratingExcellent: "Excelente",
    idealFor: "Ideal para:",
    intentsList: "Trabajo, Descanso, Aventura",
    roomsPageTitle: "Habitaciones",
    roomsPageSubtitle:
      "Cada habitación está pensada para distintas formas de viajar. Desde quienes llegan solos hasta familias completas, aquí encuentras el espacio ideal para tu estadía.",
    roomsExploreCta: "Explorar habitaciones",
    roomsMetaTitle: "Habitaciones en Miraflores Lima | Hotel Humano",
    roomsMetaDescription:
      "Habitaciones en Hotel Humano, Miraflores. Espacios cálidos, diseño curado y confort pensado para conectar contigo y con la ciudad.",
    hotelPageTitle: "El Hotel",
    hotelPageSubtitle:
      "Espacios diseñados para acompañar cada momento de tu visita: un coworking equipado, un restaurante de carnes y un restaurante para cualquier momento del día.",
    hotelExploreCta: "Explorar instalaciones",
    hotelMetaTitle: "Hotel en Miraflores | Instalaciones Hotel Humano",
    hotelMetaDescription:
      "Conoce las instalaciones del Hotel Humano en Miraflores: coworking, restaurante, piscina y más espacios diseñados para tu estadía.",
    servicesPageTitle: "Servicios",
    servicesPageSubtitle:
      "En Humano, cada detalle está pensado para hacer tu estadía más simple, cómoda y auténtica. Porque para nosotros, la hospitalidad se siente, no solo se ofrece.",
    servicesExploreCta: "Explorar servicios",
    servicesMetaTitle: "Servicios en Hotel Humano Miraflores",
    servicesMetaDescription:
      "Servicios del Hotel Humano en Miraflores: transfer al aeropuerto, lavandería, Wi-Fi, estacionamiento y más.",
    contactPageTitle: "Contacto",
    contactPageSubtitle:
      "Cuéntanos lo que necesitas para tu estadía. Te respondemos pronto con detalles y propuestas a tu medida.",
    contactExploreCta: "Escríbenos",
    contactMetaTitle: "Contacto | Hotel Humano Miraflores",
    contactMetaDescription:
      "Contacta con Hotel Humano en Miraflores, Lima. Atendemos solicitudes, consultas y reservas con respuesta rápida.",
    filterAll: "Todos",
    formName: "Nombre completo",
    formEmail: "Correo electrónico",
    formPhone: "Teléfono",
    formMessage: "Mensaje",
    formSubmit: "Enviar",
    formCheckIn: "Check-in",
    formCheckOut: "Check-out",
    formGuests: "Huéspedes",
  },
  en: {
    nav: [
      { label: "Home", href: "/en" },
      { label: "Rooms", href: "/en/rooms" },
      { label: "Hotel", href: "/en/hotel" },
      { label: "Services", href: "/en/services" },
      { label: "Contact", href: "/en/contact" },
    ],
    reserve: "Book",
    menuOpen: "Open menu",
    heroTitle: "Travel with purpose,",
    heroTitleLine2: "not just an itinerary",
    heroSubtitle: "Discover Humano",
    heroPlayVideo: "Play video",
    heroClose: "Close",
    heroVideoTitle: "Hotel Humano",
    eyebrowExperience: "Humano Experience",
    homeH1: "Conscious hospitality in Lima.",
    homeIntro:
      "At Humano, hospitality goes beyond service. We create spaces where people can reconnect with themselves and with others, in the heart of Miraflores.",
    iconsAriaPrefix: "Open",
    iconLabels: {
      larcomar: "Larcomar",
      caminatas: "Strolls",
      running: "Running",
      surf: "Surf & beach",
    },
    homeLocation:
      "In the heart of Miraflores, steps from the boardwalk and the best views of the Pacific. A strategic spot where culture, gastronomy, and urban life come together.",
    roomsH2: "Our rooms.",
    roomsIntro:
      "Our rooms are designed to adapt to how you travel. From solo travelers to full families, you'll find the ideal space for your stay here.",
    seeAll: "See all",
    hotelH2: "The Hotel.",
    hotelIntro:
      "Spaces designed to accompany every moment of your visit: a fully equipped coworking area, a grill restaurant, and a restaurant for any moment of the day.",
    comingSoon: "Opening June 2026",
    footerCopyright:
      "2026 Hotel Humano · Malecón Balta 710, Miraflores. Developed by Armando Hoteles",
    footerComplaints: "Complaints Book",
    footerTerms: "Terms and Conditions",
    metaTitle: "Hotel in Miraflores Lima | Hotel Humano Tribute Portfolio by Marriott",
    metaDescription:
      "Discover Hotel Humano in Miraflores, Lima. A Tribute Portfolio hotel with unique design, local experiences, and an authentic connection to the city.",
    htmlLang: "en",
    backToHotel: "Back to the Hotel",
    ratingExcellent: "Excellent",
    idealFor: "Ideal for:",
    intentsList: "Work, Rest, Adventure",
    roomsPageTitle: "Rooms",
    roomsPageSubtitle:
      "Our rooms are designed to adapt to how you travel. From solo travelers to full families, you'll find the ideal space for your stay here.",
    roomsExploreCta: "Explore rooms",
    roomsMetaTitle: "Rooms in Miraflores Lima | Hotel Humano",
    roomsMetaDescription:
      "Rooms at Hotel Humano, Miraflores. Warm spaces, curated design, and comfort designed to connect you with yourself and the city.",
    hotelPageTitle: "The Hotel",
    hotelPageSubtitle:
      "Spaces designed to accompany every moment of your visit: a fully equipped coworking area, a grill restaurant, and a restaurant for any moment of the day.",
    hotelExploreCta: "Explore facilities",
    hotelMetaTitle: "Hotel in Miraflores | Hotel Humano Facilities",
    hotelMetaDescription:
      "Discover Hotel Humano's facilities in Miraflores: coworking, restaurant, pool, and more spaces designed for your stay.",
    servicesPageTitle: "Services",
    servicesPageSubtitle:
      "At Humano, every detail is designed to make your stay more effortless, more comfortable, and more authentic. Because we believe true hospitality is felt in every detail, not just offered.",
    servicesExploreCta: "Explore services",
    servicesMetaTitle: "Services at Hotel Humano Miraflores",
    servicesMetaDescription:
      "Hotel Humano services in Miraflores: airport transfer, laundry, Wi-Fi, parking, and more.",
    contactPageTitle: "Contact",
    contactPageSubtitle:
      "Tell us what you need for your stay. We'll get back to you soon with details and tailored proposals.",
    contactExploreCta: "Write us",
    contactMetaTitle: "Contact | Hotel Humano Miraflores",
    contactMetaDescription:
      "Contact Hotel Humano in Miraflores, Lima. We handle requests, inquiries, and reservations with a quick reply.",
    filterAll: "All",
    formName: "Full name",
    formEmail: "Email",
    formPhone: "Phone",
    formMessage: "Message",
    formSubmit: "Send",
    formCheckIn: "Check-in",
    formCheckOut: "Check-out",
    formGuests: "Guests",
  },
}

/**
 * Mapping bidireccional de URLs entre ES y EN.
 * Key: prefijo ES, Value: prefijo EN.
 * Las páginas dinámicas mantienen su slug (que se traduce vía getHumano*).
 */
const SEGMENT_MAP: ReadonlyArray<{ es: string; en: string }> = [
  { es: "/habitaciones", en: "/en/rooms" },
  { es: "/hotel", en: "/en/hotel" },
  { es: "/servicios", en: "/en/services" },
  { es: "/contacto/gracias", en: "/en/contact/thanks" },
  { es: "/contacto", en: "/en/contact" },
  { es: "/terminos-y-condiciones", en: "/en/terms-and-conditions" },
  { es: "/libro-de-reclamaciones/gracias", en: "/en/complaints-book/thanks" },
  { es: "/libro-de-reclamaciones", en: "/en/complaints-book" },
]

export function pathForLang(currentPath: string, targetLang: WebLang): string {
  const isEn = currentPath.startsWith("/en")
  const sourceLang: WebLang = isEn ? "en" : "es"
  if (sourceLang === targetLang) return currentPath

  if (targetLang === "en") {
    if (currentPath === "/") return "/en"
    for (const seg of SEGMENT_MAP) {
      if (currentPath === seg.es) return seg.en
      if (currentPath.startsWith(`${seg.es}/`)) {
        const rest = currentPath.slice(seg.es.length)
        return `${seg.en}${rest}`
      }
    }
    // Detalle de room (/[room]) sin prefijo conocido → /en/rooms/[room]
    // Excluir rutas que NO son rooms (conserje vive fuera de la web layout)
    if (/^\/[^/]+$/.test(currentPath) && currentPath !== "/conserje") {
      return `/en/rooms${currentPath}`
    }
    return `/en${currentPath}`
  }

  // targetLang === "es"
  if (currentPath === "/en") return "/"
  for (const seg of SEGMENT_MAP) {
    if (currentPath === seg.en) return seg.es
    if (currentPath.startsWith(`${seg.en}/`)) {
      const rest = currentPath.slice(seg.en.length)
      // Caso especial: /en/rooms/<slug> → /<slug> (rooms ES están en raíz)
      if (seg.en === "/en/rooms" && /^\/[^/]+$/.test(rest)) return rest
      return `${seg.es}${rest}`
    }
  }
  const rest = currentPath.replace(/^\/en/, "")
  return rest === "" ? "/" : rest
}
