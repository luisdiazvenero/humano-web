import type { SliderImage } from "@/components/humano-v09/ImageSlider"
import type { RoomCarouselItem } from "@/components/humano-v09/RoomMenuCarousel"
import type { ConserjeItem } from "@/lib/humano/types"

export const designSystemSliderImages: SliderImage[] = [
  {
    src: "/chatbot/imagenes/rec/malecon_miraflores/malecon_miraflores_2.webp",
    alt: "Malecón de Miraflores",
    label: "Malecón Miraflores",
  },
  {
    src: "/chatbot/imagenes/rec/larcomar/larcomar_1.webp",
    alt: "Larcomar",
    label: "Larcomar",
  },
  {
    src: "/chatbot/imagenes/rec/parque_kennedy/parque_kennedy_1.webp",
    alt: "Parque Kennedy",
    label: "Parque Kennedy",
  },
]

export const designSystemRoomCarouselItems: RoomCarouselItem[] = [
  {
    id: "room-comfort-queen",
    label: "Comfort Queen",
    description: "Ideal para viajes de trabajo con descanso profundo.",
    imageSrc: "/chatbot/imagenes/rec/larcomar/larcomar_1.webp",
  },
  {
    id: "room-junior-suite",
    label: "Junior Suite",
    description: "Más amplitud para estadías largas y plan mixto.",
    imageSrc: "/chatbot/imagenes/rec/malecon_miraflores/malecon_miraflores_2.webp",
  },
  {
    id: "room-master-suite",
    label: "Master Suite",
    description: "Experiencia premium con mayor privacidad.",
    imageSrc: "/chatbot/imagenes/rec/parque_kennedy/parque_kennedy_1.webp",
  },
]

export const designSystemConserjeItems: ConserjeItem[] = [
  {
    id: "habitacion-comfort-queen",
    nombre_publico: "Comfort Queen",
    categoria: "Habitaciones",
    desc_factual: "Habitación confortable con escritorio ergonómico y Wi-Fi de alta velocidad",
    desc_experiencial: "Quienes buscan productividad de día y descanso real de noche",
    intenciones: ["Trabajo", "Descanso"],
    perfil_ideal: ["Solo", "En pareja"],
    restricciones_requisitos: [],
    condiciones_servicio: [],
    imagenes_url: ["/chatbot/imagenes/rec/larcomar/larcomar_1.webp"],
    frases_sugeridas: ["Quiero una habitación para trabajar cómodo"],
    ctas: ["Reservar habitación", "Ver otras habitaciones"],
    horario_apertura: null,
    horario_cierre: null,
    precio_desde: "USD 129 por noche",
    check_in: "15:00",
    check_out: "12:00",
    redirigir:
      "https://www.marriott.com/es/hotels/limtx-humano-lima-a-tribute-portfolio-hotel/rooms/",
    link_ubicacion_mapa: "",
    tipo: "Habitaciones",
  },
  {
    id: "servicio-lavanderia-express",
    nombre_publico: "Lavandería Express",
    categoria: "Servicios",
    desc_factual: "Servicio de lavado y planchado con entrega en el mismo día",
    desc_experiencial: "Viajeros que necesitan resolver rápido y seguir con su agenda",
    intenciones: ["Trabajo", "Aventura"],
    perfil_ideal: ["Solo", "En grupo"],
    restricciones_requisitos: ["Sujeto a horario de recepción"],
    condiciones_servicio: ["Entrega en 6 horas", "Coordinar con recepción"],
    imagenes_url: ["/chatbot/imagenes/rec/parque_kennedy/parque_kennedy_1.webp"],
    frases_sugeridas: ["Necesito lavandería para hoy"],
    ctas: ["Coordinar servicio"],
    horario_apertura: "08:00",
    horario_cierre: "20:00",
    precio_desde: "Desde USD 12 por prenda",
    check_in: "",
    check_out: "",
    redirigir: "",
    link_ubicacion_mapa: "",
    tipo: "Servicios",
  },
]
