export type DesignSystemComponent = {
  id: string
  name: string
  sourcePath: string
  usedIn: string[]
  status: "active" | "legacy"
  tokens: string[]
  notes: string
}

export const designSystemComponents: DesignSystemComponent[] = [
  {
    id: "humano-v09-full-logo",
    name: "FullLogo",
    sourcePath: "src/components/humano-v09/FullLogo.tsx",
    usedIn: ["/humano"],
    status: "active",
    tokens: ["--color-azul-rgb"],
    notes: "Marca principal para encabezados y piezas de identidad.",
  },
  {
    id: "humano-v09-logo",
    name: "Logo",
    sourcePath: "src/components/humano-v09/Logo.tsx",
    usedIn: ["/humano"],
    status: "active",
    tokens: ["--color-azul-rgb", "--foreground"],
    notes: "Isotipo compacto para avatar del asistente y navegación contextual.",
  },
  {
    id: "humano-v09-image-slider",
    name: "ImageSlider",
    sourcePath: "src/components/humano-v09/ImageSlider.tsx",
    usedIn: ["/humano"],
    status: "active",
    tokens: ["--color-amarillo"],
    notes: "Galería inmersiva con auto-play y dots de navegación.",
  },
  {
    id: "humano-v09-room-menu-carousel",
    name: "RoomMenuCarousel",
    sourcePath: "src/components/humano-v09/RoomMenuCarousel.tsx",
    usedIn: ["/humano"],
    status: "active",
    tokens: ["--color-amarillo", "--border", "--foreground"],
    notes: "Carrusel de menú para selección de habitaciones en flujo conversacional.",
  },
  {
    id: "humano-v09-conserje-items-message",
    name: "ConserjeItemsMessage",
    sourcePath: "src/components/humano-v09/conserje-items-message.tsx",
    usedIn: ["/humano"],
    status: "active",
    tokens: ["--color-azul", "--color-overlay", "--shadow-brand-lg", "--color-amarillo"],
    notes: "Contenedor de cards con CTAs y metadata factual por tipo de contenido.",
  },
  {
    id: "ui-button",
    name: "Button",
    sourcePath: "src/components/ui/button.tsx",
    usedIn: ["/humano", "/design-system"],
    status: "active",
    tokens: ["--primary", "--primary-foreground", "--ring"],
    notes: "Botón base del sistema para acciones primarias y secundarias.",
  },
  {
    id: "ui-card",
    name: "Card",
    sourcePath: "src/components/ui/card.tsx",
    usedIn: ["/design-system"],
    status: "active",
    tokens: ["--card", "--card-foreground", "--border"],
    notes: "Superficie modular para agrupar previews, specs y bloques de documentación.",
  },
]

export const activeDesignSystemComponents = designSystemComponents.filter(
  (component) => component.status === "active"
)
