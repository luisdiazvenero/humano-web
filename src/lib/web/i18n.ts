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
      "En Humano, cada experiencia sigue tu ritmo. Puedes compartir, desconectar o simplemente hacer una pausa. Los espacios están ahí para eso: para que los vivas como quieras.",
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
      "Cada habitación está diseñada para diferentes necesidades. Desde el viajero solo hasta familias completas, encuentra el espacio perfecto para tu estadía.",
    seeAll: "Ver todas",
    hotelH2: "El Hotel.",
    hotelIntro:
      "Espacios pensados para acompañar cada momento de tu estadía: coworking equipado, restaurante de autor y piscina para desconectar en el corazón de Miraflores.",
    comingSoon: "Marcha Blanca",
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
      "Tu espacio, desde que llegas. Cómodas, acogedoras y con un toque que las hace sentir tuyas desde el primer instante.",
    roomsExploreCta: "Explorar habitaciones",
    roomsMetaTitle: "Habitaciones en Miraflores Lima | Hotel Humano",
    roomsMetaDescription:
      "Habitaciones en Hotel Humano, Miraflores. Espacios cálidos, diseño curado y confort pensado para conectar contigo y con la ciudad.",
    hotelPageTitle: "El Hotel",
    hotelPageSubtitle:
      "Espacios pensados para acompañar cada momento de tu estadía: coworking equipado, restaurante de autor y piscina para desconectar en el corazón de Miraflores.",
    hotelExploreCta: "Explorar instalaciones",
    hotelMetaTitle: "Hotel en Miraflores | Instalaciones Hotel Humano",
    hotelMetaDescription:
      "Conoce las instalaciones del Hotel Humano en Miraflores: coworking, restaurante, piscina y más espacios diseñados para tu estadía.",
    servicesPageTitle: "Servicios",
    servicesPageSubtitle:
      "Servicios pensados para que tu estadía sea cómoda y sin complicaciones. Desde transfer hasta lavandería, todo al alcance de una conversación.",
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
      "At Humano, every experience follows your rhythm. You can share, disconnect, or simply pause. The spaces are there for that: so you can live them your way.",
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
      "Each room is designed for different needs. From solo travelers to full families, find the perfect space for your stay.",
    seeAll: "See all",
    hotelH2: "The Hotel.",
    hotelIntro:
      "Spaces designed to accompany every moment of your stay: equipped coworking, a signature restaurant, and a pool to unwind in the heart of Miraflores.",
    comingSoon: "Soft Opening",
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
      "Your space, from the moment you arrive. Cozy, welcoming, and with a touch that makes them feel yours from the very first instant.",
    roomsExploreCta: "Explore rooms",
    roomsMetaTitle: "Rooms in Miraflores Lima | Hotel Humano",
    roomsMetaDescription:
      "Rooms at Hotel Humano, Miraflores. Warm spaces, curated design, and comfort designed to connect you with yourself and the city.",
    hotelPageTitle: "The Hotel",
    hotelPageSubtitle:
      "Spaces designed to accompany every moment of your stay: equipped coworking, signature restaurant, and a pool to unwind in the heart of Miraflores.",
    hotelExploreCta: "Explore facilities",
    hotelMetaTitle: "Hotel in Miraflores | Hotel Humano Facilities",
    hotelMetaDescription:
      "Discover Hotel Humano's facilities in Miraflores: coworking, restaurant, pool, and more spaces designed for your stay.",
    servicesPageTitle: "Services",
    servicesPageSubtitle:
      "Services designed to make your stay comfortable and hassle-free. From transfer to laundry, everything is just a conversation away.",
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
