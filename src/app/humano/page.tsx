"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Figtree } from "next/font/google"
import { ConserjeItemsMessage } from "@/components/humano-v09/conserje-items-message"
import { Logo } from "@/components/humano-v09/Logo"
import { FullLogo } from "@/components/humano-v09/FullLogo"
import { ImageSlider } from "@/components/humano-v09/ImageSlider"
import type { SliderImage } from "@/components/humano-v09/ImageSlider"
import { RoomMenuCarousel } from "@/components/humano-v09/RoomMenuCarousel"
import type { RoomCarouselItem } from "@/components/humano-v09/RoomMenuCarousel"
import {
  Repeat2,
  Briefcase,
  Palmtree,
  Compass,
  Building2,
  Coffee,
  Dumbbell,
  UtensilsCrossed,
  WavesLadder,
  BedDouble,
  BedSingle,
  Bed,
  Accessibility,
  Users as LucideUsers,
  CarTaxiFront,
  Dog,
  Shirt,
  ParkingCircle,
  BrushCleaning,
  ConciergeBell,
  Fingerprint,
  Headset,
  Wifi,
  CloudSun,
  ChevronRight,
} from "lucide-react"
import {
  PaperAirplaneIcon,
  MicrophoneIcon,
  ArrowRightIcon,
  ChatBubbleLeftIcon,
  HomeIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ClipboardDocumentCheckIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  CalendarIcon,
  BuildingStorefrontIcon,
  UserIcon,
  UsersIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid"
import { useMicrophoneHumano } from "@/hooks/useMicrophoneHumano"
import { useMirafloresWeather } from "@/hooks/useMirafloresWeather"
import conserjeDataRaw from "@/data/humano.json"
import type { ConserjeData, ConserjeItem } from "@/lib/humano/types"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
})

const conserjeData = conserjeDataRaw as ConserjeData
const MARRIOTT_ROOMS_URL =
  "https://www.marriott.com/es/hotels/limtx-humano-lima-a-tribute-portfolio-hotel/rooms/"
const HUMAN_ESCALATION_EMAIL = "recepcion@humanohoteles.com"

const defaultSuggestions = [
  "Habitaciones",
  "Servicios",
  "Instalaciones",
  "Recomendaciones",
]

// Toggle rápido para recuperar el menú clásico de botones si hace falta.
const ENABLE_ROOM_MENU_CAROUSEL = true

const onboardingRecImages: SliderImage[] = [
  {
    src: "/chatbot/imagenes/rec/malecon_miraflores/malecon_miraflores_2.webp",
    alt: "Malecón de Miraflores",
    label: "Malecón Miraflores",
  },
  {
    src: "/chatbot/imagenes/rec/larcomar/larcomar_1.webp",
    alt: "Larcomar en Miraflores",
    label: "Larcomar",
  },
  {
    src: "/chatbot/imagenes/rec/parque_kennedy/parque_kennedy_1.webp",
    alt: "Parque Kennedy",
    label: "Parque Kennedy",
  },
]

const intentSuggestions = [
  { label: "Trabajo", description: "Wifi rápido, reuniones y foco", icon: <Briefcase className="h-5 w-5" /> },
  { label: "Descanso", description: "Relax, silencio y confort", icon: <Palmtree className="h-5 w-5" /> },
  { label: "Aventura", description: "Explorar Lima como local", icon: <Compass className="h-5 w-5" /> },
]

const groupSuggestions = [
  { label: "Solo", icon: <UserIcon className="h-5 w-5" /> },
  { label: "En pareja", icon: <UsersIcon className="h-5 w-5" /> },
  { label: "En grupo", icon: <UserGroupIcon className="h-5 w-5" /> },
]

const initialHostLines = [
  "Bienvenido a Humano. Soy tu anfitrión.",
  "Hola, soy tu anfitrión en Humano.",
  "Qué gusto tenerte aquí. Soy tu anfitrión en Humano.",
  "Bienvenido a Humano, encantado de recibirte.",
  "Hola, bienvenido a Humano. Estoy por aquí para ayudarte.",
  "Qué bueno tenerte en Humano. Soy tu anfitrión.",
  "Bienvenido. Si quieres, empezamos con tu plan de viaje.",
  "Hola, gracias por pasar por Humano. Te acompaño en lo que necesites.",
  "Bienvenido a Humano. ¿Listo para que veamos opciones?",
  "Hola, qué gusto saludarte. Soy tu anfitrión en Humano.",
  "Bienvenido, estás en Humano. Vamos viendo lo que te convenga más.",
  "Hola, bienvenido a Humano. Empezamos cuando quieras.",
  "Qué tal, bienvenido a Humano.",
  "Bienvenido. Cuéntame y te voy guiando.",
  "Hola, ya estamos en Humano. Te acompaño durante tu búsqueda.",
]

const initialIntentQuestion = [
  "Para ubicarte mejor: ¿vienes por trabajo, descanso o aventura?",
  "¿Qué plan te trae hoy a Miraflores: trabajo, descanso o aventura?",
  "Empecemos por tu viaje: ¿trabajo, descanso o aventura?",
  "¿Tu viaje esta vez es más trabajo, descanso o aventura?",
  "Para orientarte bien, dime: ¿trabajo, descanso o aventura?",
  "¿Cómo viene tu viaje: trabajo, descanso o aventura?",
  "¿Qué estás buscando en esta estadía: trabajo, descanso o aventura?",
  "Para empezar, ¿tu plan es trabajo, descanso o aventura?",
  "¿Qué ritmo trae tu viaje hoy: trabajo, descanso o aventura?",
  "¿Vienes en modo trabajo, descanso o aventura?",
  "Si te parece, arrancamos por aquí: ¿trabajo, descanso o aventura?",
  "¿Cuál describe mejor tu viaje: trabajo, descanso o aventura?",
  "Cuéntame el enfoque del viaje: ¿trabajo, descanso o aventura?",
  "¿Qué tipo de estadía quieres hoy: trabajo, descanso o aventura?",
  "Para guiarte mejor, ¿te mueve trabajo, descanso o aventura?",
]

const intentToProfilePrompt: Record<string, string[]> = {
  trabajo: [
    "Perfecto, vamos por trabajo. ¿Viajas solo, en pareja o en grupo?",
    "Buenísimo, enfoque trabajo. ¿Viajas solo, en pareja o en grupo?",
    "Genial, lo tomamos en clave trabajo. ¿Viajas solo, en pareja o en grupo?",
    "Listo, vamos por un viaje de trabajo. ¿Vienes solo, en pareja o en grupo?",
    "Entendido. Para afinarlo: ¿viajas solo, en pareja o en grupo?",
    "Perfecto, gracias. ¿Tu viaje es solo, en pareja o en grupo?",
    "Queda claro, viaje de trabajo. ¿Solo, en pareja o en grupo?",
    "Excelente. ¿Cómo vienes: solo, en pareja o en grupo?",
    "Bien, entonces priorizamos trabajo. ¿Viajas solo, en pareja o en grupo?",
    "Anotado. ¿Te hospedas solo, en pareja o en grupo?",
    "Perfecto, ya lo tengo. ¿Viajas solo, en pareja o en grupo?",
    "Gracias, eso ayuda mucho. ¿Vienes solo, en pareja o en grupo?",
    "Súper. Para continuar: ¿solo, en pareja o en grupo?",
    "Muy bien. ¿Tu viaje es solo, en pareja o en grupo?",
    "Con eso me ubico mejor. ¿Viajas solo, en pareja o en grupo?",
  ],
  descanso: [
    "Perfecto, vamos con plan de descanso. ¿Viajas solo, en pareja o en grupo?",
    "Buen plan. ¿Vienes solo, en pareja o en grupo?",
    "Excelente, descanso entonces. ¿Viajas solo, en pareja o en grupo?",
    "Genial, ya voy entendiendo tu viaje. ¿Solo, en pareja o en grupo?",
    "Me encanta ese plan. ¿Tu viaje es solo, en pareja o en grupo?",
    "Perfecto, gracias. ¿Te hospedas solo, en pareja o en grupo?",
    "Listo, descanso en mente. ¿Viajas solo, en pareja o en grupo?",
    "Buenísimo. Para afinarlo: ¿solo, en pareja o en grupo?",
    "Queda claro. ¿Vienes solo, en pareja o en grupo?",
    "Muy bien. ¿Cómo viajas: solo, en pareja o en grupo?",
    "Excelente. ¿Tu estadía será solo, en pareja o en grupo?",
    "Perfecto, sigamos. ¿Viajas solo, en pareja o en grupo?",
    "Anotado. ¿Vienes solo, en pareja o en grupo?",
    "Qué bien. ¿Solo, en pareja o en grupo?",
    "Con eso me ubico. ¿Viajas solo, en pareja o en grupo?",
  ],
  aventura: [
    "Perfecto, vamos por aventura. ¿Viajas solo, en pareja o en grupo?",
    "Buen plan. ¿Vienes solo, en pareja o en grupo?",
    "Excelente, aventura entonces. ¿Solo, en pareja o en grupo?",
    "Genial, ya me ubico mejor. ¿Viajas solo, en pareja o en grupo?",
    "Qué buen plan. ¿Tu viaje es solo, en pareja o en grupo?",
    "Perfecto, gracias. ¿Te hospedas solo, en pareja o en grupo?",
    "Listo, con plan de aventura. ¿Viajas solo, en pareja o en grupo?",
    "Buenísimo. Para afinarlo: ¿solo, en pareja o en grupo?",
    "Anotado. ¿Vienes solo, en pareja o en grupo?",
    "Muy bien. ¿Cómo viajas: solo, en pareja o en grupo?",
    "Excelente. ¿Tu estadía será solo, en pareja o en grupo?",
    "Perfecto, sigamos. ¿Viajas solo, en pareja o en grupo?",
    "Gracias, eso ayuda. ¿Vienes solo, en pareja o en grupo?",
    "Súper. ¿Solo, en pareja o en grupo?",
    "Con eso me ubico mejor. ¿Viajas solo, en pareja o en grupo?",
  ],
}

const profileCompletionPrompt = [
  "Listo, ya tengo contexto para recomendarte con criterio. ¿Qué quieres explorar primero?",
  "Perfecto, con eso puedo orientarte mejor. ¿Qué te gustaría revisar primero?",
  "Genial, ya tengo una base clara de tu viaje. ¿Por dónde empezamos?",
  "Perfecto, ya te ubico mejor. ¿Quieres empezar por habitaciones, servicios, instalaciones o recomendaciones?",
  "Gracias, con eso puedo guiarte mejor. ¿Qué te gustaría ver primero?",
  "Listo. ¿Empezamos por habitaciones, servicios, instalaciones o recomendaciones?",
  "Excelente, ya tengo contexto. ¿Por dónde te gustaría empezar?",
  "Perfecto, ya estamos alineados. ¿Qué quieres revisar primero?",
  "Muy bien. ¿Te muestro habitaciones, servicios, instalaciones o recomendaciones?",
  "Genial, gracias. ¿Cuál prefieres explorar primero?",
  "Listo, ya tengo una buena base. ¿Con qué tema empezamos?",
  "Perfecto, ya entiendo tu viaje. ¿Qué quieres ver primero?",
  "Anotado. ¿Arrancamos por habitaciones, servicios, instalaciones o recomendaciones?",
  "Súper, gracias. ¿Por dónde prefieres que empecemos?",
  "Con eso basta para orientarte bien. ¿Qué revisamos primero?",
]

const freeTextPrompts = [
  "O cuéntame tu plan libremente",
  "También puedes contármelo con tus palabras",
  "Si prefieres, cuéntame tu plan de forma libre",
  "También puedes escribir lo que estás buscando",
  "Si quieres, dime directamente qué necesitas",
  "También puedes contarme tu idea de viaje",
  "Si prefieres, describe tu plan en una frase",
  "También puedes decirme qué te gustaría hacer",
  "O simplemente cuéntame cómo vienes",
  "También puedes contarme qué esperas de tu estadía",
  "Si te sirve más, escríbeme tu plan tal cual",
  "También puedes empezar con una pregunta directa",
  "Si prefieres, dime qué te gustaría resolver primero",
  "También puedes contarme qué tienes en mente",
  "O si quieres, arrancamos con lo que más te importa",
]

type IntentOption = { label: string; description: string; icon: ReactNode }
type GroupOption = { label: string; icon: ReactNode }
type MenuOption = { id: string; label: string }

type AgentTextMessage = {
  id: string
  sender: "agent"
  type: "text"
  content: string
  link?: string
}

type UserTextMessage = {
  id: string
  sender: "user"
  type: "text"
  content: string
}

type AgentMessage =
  | AgentTextMessage
  | { id: string; sender: "agent"; type: "intent"; content: IntentOption[] }
  | { id: string; sender: "agent"; type: "group"; content: GroupOption[] }
  | { id: string; sender: "agent"; type: "gallery"; content: SliderImage[] }
  | { id: string; sender: "agent"; type: "suggestions"; content: string[] }
  | { id: string; sender: "agent"; type: "menu"; content: MenuOption[] }
  | { id: string; sender: "agent"; type: "items"; content: ConserjeItem[] }
  | { id: string; sender: "agent"; type: "freetext"; content: string }
  | { id: string; sender: "agent"; type: "link"; content: { url: string } }

type ChatMessage = AgentMessage | UserTextMessage

const isAgentTextMessage = (message: ChatMessage): message is AgentTextMessage =>
  message.sender === "agent" && message.type === "text"

const extractDateHint = (text: string): string | null => {
  const normalized = text.toLowerCase()
  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "setiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ]
  const datePattern = /\b\d{1,2}[/-]\d{1,2}([/-]\d{2,4})?\b/
  const yearPattern = /\b20\d{2}\b/
  if (datePattern.test(normalized)) return text.trim()
  const tokens = normalized.split(/\s+/).filter(Boolean)
  if (monthNames.some((m) => tokens.includes(m))) return text.trim()
  if (yearPattern.test(normalized)) return text.trim()
  return null
}

const extractGuestsHint = (text: string): string | null => {
  const normalized = text.toLowerCase()
  if (normalized.includes("pareja")) return "2 personas"
  if (normalized.includes("solo") || normalized.includes("sola")) return "1 persona"
  const match = normalized.match(/\b(\d{1,2})\b/)
  if (match) {
    if (normalized.includes("persona") || normalized.includes("personas") || normalized.includes("pax")) {
      return `${match[1]} personas`
    }
  }
  return null
}

const extractProfileHint = (text: string): string | null => {
  const normalized = text.toLowerCase()
  if (normalized.includes("pareja")) return "pareja"
  if (normalized.includes("solo") || normalized.includes("sola")) return "solo"
  if (normalized.includes("familia")) return "familia"
  if (normalized.includes("grupo") || normalized.includes("amigos")) return "grupo"
  return null
}

const extractIntentHint = (text: string): string | null => {
  const normalized = text.toLowerCase()
  if (normalized.includes("trabajo") || normalized.includes("negocio")) return "trabajo"
  if (normalized.includes("descanso") || normalized.includes("relax")) return "descanso"
  if (normalized.includes("aventura") || normalized.includes("explorar")) return "aventura"
  return null
}

const pickVariant = (variants: string[], seed: string) => {
  if (variants.length === 0) return ""
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return variants[hash % variants.length]
}

const normalizeForCompare = (value: string) =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const overlapRatio = (a: string, b: string) => {
  const tokensA = normalizeForCompare(a).split(" ").filter((t) => t.length >= 4)
  const tokensB = new Set(normalizeForCompare(b).split(" ").filter((t) => t.length >= 4))
  if (tokensA.length === 0 || tokensB.size === 0) return 0
  let overlap = 0
  for (const token of tokensA) {
    if (tokensB.has(token)) overlap += 1
  }
  return overlap / tokensA.length
}

const CARD_ECHO_STOPWORDS = new Set([
  "hotel",
  "humano",
  "miraflores",
  "ideal",
  "opcion",
  "opciones",
  "habitacion",
  "servicio",
  "instalacion",
  "recomendacion",
  "para",
  "como",
  "desde",
  "hasta",
  "con",
  "sin",
])

const meaningfulTokens = (text: string) =>
  normalizeForCompare(text)
    .split(" ")
    .filter((token) => token.length >= 4 && !CARD_ECHO_STOPWORDS.has(token))

const replyEchoesItemCard = (reply: string, items: ConserjeItem[]) => {
  if (!reply || !items.length) return false
  const first = items[0]
  const cardCorpus = [
    first.desc_factual || "",
    first.desc_experiencial || "",
    first.check_in ? `check in ${first.check_in}` : "",
    first.check_out ? `check out ${first.check_out}` : "",
    first.horario_apertura ? `horario ${first.horario_apertura}` : "",
    first.horario_cierre ? `horario ${first.horario_cierre}` : "",
    first.precio_desde || "",
  ]
    .filter(Boolean)
    .join(" ")
  if (!cardCorpus) return false
  const overlapForward = overlapRatio(reply, cardCorpus)
  const overlapBackward = overlapRatio(cardCorpus, reply)
  if (overlapForward >= 0.45 || overlapBackward >= 0.45) return true
  const replyTokens = new Set(meaningfulTokens(reply))
  const cardTokens = Array.from(new Set(meaningfulTokens(cardCorpus)))
  const keywordHits = cardTokens.filter((token) => replyTokens.has(token)).length
  return keywordHits >= 4
}

const renderTextWithLinks = (text: string) => {
  if (!text) return null

  const markdownRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
  const parts: Array<{ type: "text" | "link"; value: string; href?: string }> = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = markdownRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: "link", value: match[1], href: match[2] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) })
  }

  const fallbackParts = parts.length > 0 ? parts : [{ type: "text" as const, value: text }]
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const rendered: Array<{ type: "text" | "link"; value: string; href?: string }> = []

  for (const part of fallbackParts) {
    if (part.type === "link") {
      rendered.push(part)
      continue
    }
    let pointer = 0
    let urlMatch: RegExpExecArray | null
    while ((urlMatch = urlRegex.exec(part.value)) !== null) {
      if (urlMatch.index > pointer) {
        rendered.push({ type: "text", value: part.value.slice(pointer, urlMatch.index) })
      }
      rendered.push({ type: "link", value: urlMatch[0], href: urlMatch[0] })
      pointer = urlMatch.index + urlMatch[0].length
    }
    if (pointer < part.value.length) {
      rendered.push({ type: "text", value: part.value.slice(pointer) })
    }
    urlRegex.lastIndex = 0
  }

  return rendered.map((part, index) =>
    part.type === "link" ? (
      <a
        key={`link-${index}`}
        href={part.href}
        target="_blank"
        rel="noreferrer"
        className="text-[#003744] underline underline-offset-4"
      >
        {part.value}
      </a>
    ) : (
      <Fragment key={`text-${index}`}>{part.value}</Fragment>
    )
  )
}

export default function HumanoPage() {
  const router = useRouter()
  const [view, setView] = useState<"intro" | "chat">("intro")
  const [experienceMode, setExperienceMode] = useState<"agente" | "website">("agente")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [isAIResponding, setIsAIResponding] = useState(false)
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([])
  const [contextTopic, setContextTopic] = useState<string | null>(null)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [activeItemLabel, setActiveItemLabel] = useState<string | null>(null)
  const [conversationState, setConversationState] = useState<{
    dates: string | null
    guests: string | null
    profile: string | null
    intent: string | null
  }>({
    dates: null,
    guests: null,
    profile: null,
    intent: null,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queueRef = useRef(Promise.resolve())
  const sessionSeedRef = useRef(`${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)

  const mic = useMicrophoneHumano({ lang: "es-PE" })
  const transcript: string = mic.transcript ?? ""
  const isListening: boolean = mic.isListening ?? false
  const isTranscribing: boolean = mic.isTranscribing ?? false
  const micError: string | null = mic.error ?? null
  const isMicSupported: boolean = mic.isSupported ?? false
  const startListening = mic.startListening ?? (() => {})
  const stopListening = mic.stopListening ?? (() => {})
  const resetTranscript = mic.resetTranscript ?? (() => {})
  const { weather } = useMirafloresWeather({ enabled: view === "chat" })

  const idCounter = useRef(0)
  const generateId = () => {
    idCounter.current += 1
    return `${Date.now()}-${idCounter.current}`
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const estimateTypingDelay = (text: string) => {
    const base = 350
    const perChar = 18
    return Math.min(1800, base + text.length * perChar)
  }

  type AgentSequenceItem =
    | { type: "text"; content: string; link?: string }
    | { type: "intent"; content: IntentOption[] }
    | { type: "group"; content: GroupOption[] }
    | { type: "gallery"; content: SliderImage[] }
    | { type: "suggestions"; content: string[] }
    | { type: "menu"; content: MenuOption[] }
    | { type: "items"; content: ConserjeItem[] }
    | { type: "freetext"; content: string }
    | { type: "link"; content: { url: string } }

  const enqueueAgentSequence = (sequence: AgentSequenceItem[]) => {
    queueRef.current = queueRef.current.then(async () => {
      for (const item of sequence) {
        if (item.type === "text") {
          setIsTyping(true)
          await sleep(estimateTypingDelay(item.content))
          setMessages((prev) => [
            ...prev,
            { id: generateId(), sender: "agent", type: "text", content: item.content },
          ])
          if (item.link) {
            setMessages((prev) =>
              prev.map((msg, index) =>
                index === prev.length - 1 && msg.sender === "agent" && msg.type === "text"
                  ? { ...msg, link: item.link }
                  : msg
              )
            )
          }
          setIsTyping(false)
          await sleep(150)
          continue
        }

        await sleep(200)
        const nextMessage = {
          id: generateId(),
          sender: "agent" as const,
          type: item.type,
          content: item.content,
        } as AgentMessage
        setMessages((prev) => [
          ...prev,
          nextMessage,
        ])
      }
    })
  }

  const normalizeExternalUrl = (value: string) => {
    const trimmed = (value || "").trim()
    if (!trimmed) return ""
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("mailto:")) {
      return trimmed
    }
    if (trimmed.includes("@")) return `mailto:${trimmed}`
    return `https://${trimmed}`
  }

  const resolveActiveItem = () => {
    if (activeItemId) {
      return conserjeData.items.find((item) => item.id === activeItemId) || null
    }
    if (activeItemLabel) {
      const normalized = activeItemLabel.trim().toLowerCase()
      return (
        conserjeData.items.find((item) => item.nombre_publico.trim().toLowerCase() === normalized) || null
      )
    }
    return null
  }

  const buildServiceMailto = (email: string, item: ConserjeItem, actionLabel: string) => {
    const action =
      actionLabel.toLowerCase().includes("reservar") || actionLabel.toLowerCase().includes("disponibilidad")
        ? "reservar"
        : "coordinar"
    const subject = `${action === "reservar" ? "Reserva" : "Coordinación"} ${item.nombre_publico} - Hotel Humano`
    const bodyLines = [
      "Hola equipo de Humano,",
      "",
      `Quisiera ${action} ${item.nombre_publico}.`,
      conversationState.intent ? `Motivo del viaje: ${conversationState.intent}` : "",
      conversationState.profile ? `Perfil: ${conversationState.profile}` : "",
      conversationState.guests ? `Personas: ${conversationState.guests}` : "",
      conversationState.dates ? `Fechas: ${conversationState.dates}` : "",
      "",
      "Nombre:",
      "Teléfono:",
      "Comentarios:",
      "",
      "Gracias.",
    ].filter(Boolean)
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`
  }

  const buildGenericMailto = (actionLabel: string) => {
    const subject = `${actionLabel} - Hotel Humano`
    const bodyLines = [
      "Hola equipo de Humano,",
      "",
      `Quisiera ${actionLabel.toLowerCase()}.`,
      conversationState.intent ? `Motivo del viaje: ${conversationState.intent}` : "",
      conversationState.profile ? `Perfil: ${conversationState.profile}` : "",
      conversationState.guests ? `Personas: ${conversationState.guests}` : "",
      conversationState.dates ? `Fechas: ${conversationState.dates}` : "",
      "",
      "Nombre:",
      "Teléfono:",
      "Comentarios:",
      "",
      "Gracias.",
    ].filter(Boolean)
    return `mailto:${HUMAN_ESCALATION_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`
  }

  const handleCtaAction = (label: string, itemOverride?: ConserjeItem | null) => {
    const lower = label.toLowerCase()
    const activeItem = itemOverride || resolveActiveItem()

    if (lower.includes("ver otras habitaciones") || lower.includes("otras habitaciones")) {
      setActiveItemId(null)
      setActiveItemLabel(null)
      setContextTopic("Habitaciones")
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          sender: "user",
          type: "text",
          content: label,
        },
      ])
      sendMessageToConserje("Habitaciones", {
        activeItemIdOverride: null,
        activeItemLabelOverride: null,
        source: "user",
      })
      return
    }

    let url = ""
    let replyText = "Abrí una ventana nueva con lo que pediste. Clic aquí para revisarlo."

    if (
      (lower.includes("ubicación") || lower.includes("ubicacion") || lower.includes("mapa")) &&
      activeItem?.link_ubicacion_mapa
    ) {
      url = normalizeExternalUrl(activeItem.link_ubicacion_mapa)
    } else if (activeItem?.tipo === "Servicios" && activeItem.redirigir && activeItem.redirigir.includes("@")) {
      url = buildServiceMailto(activeItem.redirigir, activeItem as ConserjeItem, label)
      replyText = "Abrí tu correo con un borrador listo para que lo edites y envíes."
    } else if (
      (lower.includes("reservar") || lower.includes("disponibilidad") || lower.includes("coordinar")) &&
      activeItem?.redirigir
    ) {
      const redirectTarget = normalizeExternalUrl(activeItem.redirigir)
      if (redirectTarget.startsWith("mailto:")) {
        url = buildServiceMailto(activeItem.redirigir, activeItem as ConserjeItem, label)
        replyText = "Abrí tu correo con un borrador listo para que lo edites y envíes."
      } else {
        url = redirectTarget
      }
    }

    const action = lower.includes("reservar") || lower.includes("disponibilidad") ? "reservar" : "coordinar"
    if (!url) {
      if (action === "reservar") {
        url = MARRIOTT_ROOMS_URL
      } else {
        url = buildGenericMailto(label)
        replyText = "Abrí tu correo con un borrador listo para que lo edites y envíes."
      }
    }

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer")
    }

    enqueueAgentSequence([
      { type: "text", content: replyText, link: url },
      { type: "text", content: "¿Necesitas algo más?" },
    ])

    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: label },
      { role: "assistant", content: `${replyText} ${url}` },
      { role: "assistant", content: "¿Necesitas algo más?" },
    ])
  }

  useEffect(() => {
    if (view === "chat" && messages.length === 0) {
      const seed = sessionSeedRef.current
      enqueueAgentSequence([
        { type: "text", content: pickVariant(initialHostLines, seed) },
        { type: "gallery", content: onboardingRecImages },
        { type: "text", content: pickVariant(initialIntentQuestion, `${seed}-intent`) },
        { type: "intent", content: intentSuggestions },
        { type: "freetext", content: pickVariant(freeTextPrompts, `${seed}-freetext`) },
      ])
    }
  }, [messages.length, view])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleMicToggle = () => {
    if (!isMicSupported) return
    if (isListening) stopListening()
    else if (!isTranscribing) startListening()
  }

  const getSuggestionIcon = (suggestion: string) => {
    const lower = suggestion.toLowerCase()
    if (lower.includes("habit")) return <HomeIcon className="h-5 w-5" />
    if (lower.includes("serv")) return <ConciergeBell className="h-5 w-5" />
    if (lower.includes("instal")) return <Building2 className="h-5 w-5" />
    if (lower.includes("recomend") || lower.includes("local")) return <MapPinIcon className="h-5 w-5" />
    if (lower.includes("tarifa") || lower.includes("precio")) return <CurrencyDollarIcon className="h-5 w-5" />
    if (lower.includes("dispon")) return <ClipboardDocumentCheckIcon className="h-5 w-5" />
    if (lower.includes("contacto") || lower.includes("asesor")) return <PhoneIcon className="h-5 w-5" />
    if (lower.includes("hora") || lower.includes("día")) return <CalendarIcon className="h-5 w-5" />
    if (lower.includes("restaurante") || lower.includes("bar")) return <BuildingStorefrontIcon className="h-5 w-5" />
    return <ChatBubbleLeftIcon className="h-5 w-5" />
  }

  const normalizeIconLabel = (label: string) =>
    label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "")

  const getServiceMenuIcon = (label: string) => {
    const lower = label.toLowerCase()
    const normalized = normalizeIconLabel(label)
    if (normalized.includes("transfer")) return <CarTaxiFront className="h-5 w-5" />
    if (normalized.includes("pet") || normalized.includes("mascota")) return <Dog className="h-5 w-5" />
    if (normalized.includes("roomservice")) return <ConciergeBell className="h-5 w-5" />
    if (normalized.includes("lavander")) return <Shirt className="h-5 w-5" />
    if (normalized.includes("estacion")) return <ParkingCircle className="h-5 w-5" />
    if (normalized.includes("wifi")) return <Wifi className="h-5 w-5" />
    if (normalized.includes("limpieza")) return <BrushCleaning className="h-5 w-5" />
    if (normalized.includes("concierge") || normalized.includes("asistencia")) return <Headset className="h-5 w-5" />
    if (normalized.includes("lobby")) return <Building2 className="h-5 w-5" />
    if (normalized.includes("desayuno")) return <Coffee className="h-5 w-5" />
    if (normalized.includes("restaurante")) return <UtensilsCrossed className="h-5 w-5" />
    if (normalized.includes("gimnasio")) return <Dumbbell className="h-5 w-5" />
    if (normalized.includes("piscina")) return <WavesLadder className="h-5 w-5" />
    if (normalized.includes("coworking")) return <Building2 className="h-5 w-5" />
    if (normalized.includes("cafe")) return <Coffee className="h-5 w-5" />
    if (normalized.includes("family") || normalized.includes("familiar")) return <LucideUsers className="h-5 w-5" />
    if (normalized.includes("accessible") || normalized.includes("accesible")) return <Accessibility className="h-5 w-5" />
    if (normalized.includes("suite")) return <BedDouble className="h-5 w-5" />
    if (normalized.includes("king") || normalized.includes("double")) return <BedDouble className="h-5 w-5" />
    if (normalized.includes("room") || normalized.includes("habit")) return <BedSingle className="h-5 w-5" />
    if (normalized.includes("deluxe")) return <Bed className="h-5 w-5" />
    if (lower.includes("room service")) return <ConciergeBell className="h-5 w-5" />
    return <BuildingOfficeIcon className="h-5 w-5" />
  }

  const getSuggestionDescription = (suggestion: string) => {
    const lower = suggestion.toLowerCase()
    if (
      lower.includes("solicitar") ||
      lower.includes("coordinar") ||
      lower.includes("reservar") ||
      lower.includes("información") ||
      lower.includes("informacion")
    ) {
      return null
    }
    if (lower.includes("habit")) return "Opciones y disponibilidad"
    if (lower.includes("serv")) return "Traslados, pet friendly y más"
    if (lower.includes("instal")) return "Lobby, piscina, gym y más"
    if (lower.includes("recomend") || lower.includes("local")) return "Cafés, restaurantes y más"
    return null
  }

  const normalizeImageSrc = (value: string | null | undefined) => {
    const raw = (value || "").trim()
    if (!raw) return null
    if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) return raw
    return `/${raw.replace(/^\/+/, "")}`
  }

  const resolveRoomMenuCarouselItems = (menuOptions: MenuOption[]): RoomCarouselItem[] | null => {
    if (!ENABLE_ROOM_MENU_CAROUSEL || menuOptions.length === 0) return null

    const cards = menuOptions.map((option) => {
      const sourceItem =
        conserjeData.items.find((item) => item.id === option.id) ||
        conserjeData.items.find(
          (item) => normalizeForCompare(item.nombre_publico) === normalizeForCompare(option.label)
        )

      if (!sourceItem || sourceItem.tipo !== "Habitaciones") return null

      const textCandidate = (sourceItem.desc_experiencial || sourceItem.desc_factual || "").trim()
      const firstSentence = textCandidate.split(/[.!?]/)[0]?.trim()
      const description = firstSentence || textCandidate || "Ideal para tu estadía en Miraflores"

      return {
        id: option.id,
        label: option.label,
        description,
        imageSrc: normalizeImageSrc(sourceItem.imagenes_url?.[0]),
      } satisfies RoomCarouselItem
    })

    if (cards.some((card) => card === null)) return null
    return cards as RoomCarouselItem[]
  }

  const sendMessageToConserje = async (
    userMessage: string,
    options?: {
      activeItemIdOverride?: string | null
      activeItemLabelOverride?: string | null
      source?: "menu" | "user"
    }
  ) => {
    setIsAIResponding(true)

    const lowerMessage = userMessage.trim().toLowerCase()
    const lastAssistant = [...messages].reverse().find(isAgentTextMessage)
    const lastAssistantText = lastAssistant?.content?.toLowerCase() || ""
    const isInitialIntentStep =
      !conversationState.intent &&
      !conversationState.profile &&
      !activeItemId &&
      !contextTopic &&
      (lastAssistantText.includes("vienes por trabajo") ||
        lastAssistantText.includes("trabajo, descanso o aventura") ||
        lastAssistantText.includes("vienes por trabajo, descanso o aventura"))
    const isInitialProfileStep =
      conversationState.intent &&
      !conversationState.profile &&
      !activeItemId &&
      !contextTopic &&
      (lastAssistantText.includes("viajas solo") ||
        lastAssistantText.includes("viajas solo, en pareja o en grupo") ||
        lastAssistantText.includes("solo, en pareja o en grupo"))

    const newHistory = [...chatHistory, { role: "user", content: userMessage }]
    setChatHistory(newHistory)

    const nextState = { ...conversationState }
    const dateHint = extractDateHint(userMessage)
    if (dateHint) nextState.dates = dateHint
    let guestsHint = extractGuestsHint(userMessage)
    if (!guestsHint) {
      const numericOnly = /^\d{1,2}$/.test(userMessage.trim())
      const lastAssistant = [...messages].reverse().find(isAgentTextMessage)
      if (numericOnly && lastAssistant?.content?.toLowerCase().includes("personas")) {
        guestsHint = `${userMessage.trim()} personas`
      }
    }
    if (guestsHint) nextState.guests = guestsHint
    const profileHint = extractProfileHint(userMessage)
    if (profileHint) {
      const isStandaloneProfile =
        (lowerMessage === "solo" || lowerMessage === "en pareja" || lowerMessage === "en grupo") &&
        !isInitialProfileStep
      if (!isStandaloneProfile) nextState.profile = profileHint
    }
    const intentHint = extractIntentHint(userMessage)
    if (intentHint) {
      const isStandaloneIntent =
        (lowerMessage === "trabajo" || lowerMessage === "descanso" || lowerMessage === "aventura") &&
        !isInitialIntentStep
      if (!isStandaloneIntent) nextState.intent = intentHint
    }
    setConversationState(nextState)

    try {
      const response = await fetch("/api/humano", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: newHistory.slice(-6),
          contextTopic,
          activeItemId: options?.activeItemIdOverride ?? activeItemId,
          activeItemLabel: options?.activeItemLabelOverride ?? activeItemLabel,
          source: options?.source ?? "user",
          state: nextState,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => "")
        console.error("Conserje API error:", response.status, errorText)
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            sender: "agent",
            type: "text",
            content:
              "Disculpa, hubo un problema al procesar tu mensaje. ¿Puedes intentar de nuevo?",
          },
        ])
        return
      }

      const data = await response.json()
      const decisionMode = data?.decision?.mode as
        | "inform"
        | "clarify"
        | "redirect_reservation"
        | "escalate_human"
        | "show_menu"
        | undefined
      const normalizedReply = typeof data.reply === "string" ? data.reply.trim().toLowerCase() : ""
      const lastAssistant = [...messages].reverse().find(isAgentTextMessage)
      const normalizedLastAssistant = lastAssistant?.content?.trim().toLowerCase() || ""
      if (
        normalizedReply &&
        normalizedReply === normalizedLastAssistant &&
        decisionMode !== "show_menu"
      ) {
        data.reply = "Entendido. Podemos seguir con otro detalle de tu estadía."
      }
      if (decisionMode === "redirect_reservation" && (!Array.isArray(data.suggestions) || data.suggestions.length === 0)) {
        data.suggestions = ["Revisar disponibilidad"]
      }
      if (decisionMode === "escalate_human") {
        data.suggestions = []
        if (!data.reply || !String(data.reply).includes(HUMAN_ESCALATION_EMAIL)) {
          data.reply = `Para gestionarlo correctamente, prefiero que escribas directamente a nuestro equipo: ${HUMAN_ESCALATION_EMAIL}.`
        }
      }

      if (Array.isArray(data.items) && data.items.length > 0 && typeof data.reply === "string") {
        if (replyEchoesItemCard(data.reply, data.items)) {
          data.reply = ""
        }
      }

      const sequence: AgentSequenceItem[] = []
      const hasItems = Array.isArray(data.items) && data.items.length > 0
      const prioritizeItems = hasItems && Boolean(data.activeItemId)
      if (prioritizeItems) {
        sequence.push({ type: "items", content: data.items })
      }
      if (data.reply) sequence.push({ type: "text", content: data.reply })
      if (Array.isArray(data.menu) && data.menu.length > 0) {
        sequence.push({ type: "menu", content: data.menu })
      }
      if (hasItems && !prioritizeItems) {
        sequence.push({ type: "items", content: data.items })
      }
      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        sequence.push({ type: "suggestions", content: data.suggestions })
      }
      if (sequence.length > 0) {
        enqueueAgentSequence(sequence)
      }

      if (data.tipo) {
        setContextTopic(data.tipo)
      }
      if (typeof data.activeItemId !== "undefined") {
        setActiveItemId(data.activeItemId || null)
        if (data.activeItemId) {
          const current = conserjeData.items.find((item) => item.id === data.activeItemId)
          setActiveItemLabel(current?.nombre_publico || null)
        } else {
          setActiveItemLabel(null)
        }
      }

      setChatHistory([...newHistory, { role: "assistant", content: data.reply }])
    } catch (error) {
      console.error("Error in sendMessageToConserje:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          sender: "agent",
          type: "text",
          content:
            "Disculpa, hubo un error al conectar con el conserje. ¿Puedes intentar de nuevo?",
        },
      ])
    } finally {
      setIsAIResponding(false)
    }
  }

  const requestFollowUp = async (field: "dates" | "guests" | "profile" | "intent", nextState: {
    dates: string | null
    guests: string | null
    profile: string | null
    intent: string | null
  }) => {
    setIsAIResponding(true)
    try {
      const response = await fetch("/api/humano", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "followup",
          missingField: field,
          history: chatHistory.slice(-6),
          activeItemId,
          contextTopic,
          state: nextState,
        }),
      })

      if (!response.ok) throw new Error("API request failed")

      const data = await response.json()
      if (data.reply) {
        enqueueAgentSequence([{ type: "text", content: data.reply }])
        setChatHistory((prev) => [...prev, { role: "assistant", content: data.reply }])
      }
    } catch (error) {
      console.error("Error in requestFollowUp:", error)
    } finally {
      setIsAIResponding(false)
    }
  }

  const handleClearField = (field: "dates" | "guests" | "profile" | "intent") => {
    const nextState = { ...conversationState, [field]: null }
    setConversationState(nextState)
    requestFollowUp(field, nextState)
  }

  const handleSendMessage = () => {
    const messageText = userInput || transcript
    if (!messageText.trim() || isAIResponding) return
    if (isListening) stopListening()

    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        sender: "user",
        type: "text",
        content: messageText,
      },
    ])

    setUserInput("")
    resetTranscript()
    const lower = messageText.toLowerCase()
    if (
      lower.includes("reservar habitación") ||
      lower.includes("revisar disponibilidad") ||
      lower.includes("coordinar servicio") ||
      lower.includes("coordinar por correo") ||
      lower.includes("ver ubicación") ||
      lower.includes("ver ubicacion") ||
      lower.includes("mapa")
    ) {
      handleCtaAction(messageText)
      return
    }
    sendMessageToConserje(messageText)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        sender: "user",
        type: "text",
        content: suggestion,
      },
    ])

    const lower = suggestion.toLowerCase()
    const lastAssistant = [...messages].reverse().find(isAgentTextMessage)
    const lastAssistantText = lastAssistant?.content?.toLowerCase() || ""
    const isInitialIntentStep =
      !conversationState.intent &&
      !conversationState.profile &&
      !activeItemId &&
      !contextTopic &&
      (lastAssistantText.includes("vienes por trabajo") ||
        lastAssistantText.includes("trabajo, descanso o aventura") ||
        lastAssistantText.includes("vienes por trabajo, descanso o aventura"))
    const isInitialProfileStep =
      conversationState.intent &&
      !conversationState.profile &&
      !activeItemId &&
      !contextTopic &&
      (lastAssistantText.includes("viajas solo") ||
        lastAssistantText.includes("viajas solo, en pareja o en grupo") ||
        lastAssistantText.includes("solo, en pareja o en grupo"))

    if (
      lower.includes("reservar") ||
      lower.includes("disponibilidad") ||
      lower.includes("coordinar") ||
      lower.includes("ubicación") ||
      lower.includes("ubicacion") ||
      lower.includes("mapa")
    ) {
      handleCtaAction(suggestion)
      return
    }
    if (["trabajo", "descanso", "aventura"].includes(lower) && isInitialIntentStep) {
      const nextState = { ...conversationState, intent: lower }
      setConversationState(nextState)
      const variants = intentToProfilePrompt[lower] || []
      enqueueAgentSequence([
        {
          type: "text",
          content: variants.length
            ? pickVariant(variants, `${sessionSeedRef.current}-${lower}-${messages.length}`)
            : "Perfecto. ¿Viajas solo, en pareja o en grupo?",
        },
        { type: "group", content: groupSuggestions },
      ])
      return
    }
    if ((lower === "solo" || lower === "en pareja" || lower === "en grupo") && isInitialProfileStep) {
      const profile = lower.includes("pareja") ? "pareja" : lower.includes("grupo") ? "grupo" : "solo"
      const nextState = { ...conversationState, profile }
      setConversationState(nextState)
      enqueueAgentSequence([
        { type: "text", content: pickVariant(profileCompletionPrompt, `${sessionSeedRef.current}-${profile}-${messages.length}`) },
        { type: "suggestions", content: defaultSuggestions },
      ])
      return
    }
    if (
      lower.includes("habitaciones") ||
      lower.includes("servicios") ||
      lower.includes("recomendaciones") ||
      lower.includes("instalaciones")
    ) {
      setActiveItemId(null)
      setActiveItemLabel(null)
      if (lower.includes("habitaciones")) setContextTopic("Habitaciones")
      if (lower.includes("servicios")) setContextTopic("Servicios")
      if (lower.includes("recomendaciones")) setContextTopic("Recomendaciones_Locales")
      if (lower.includes("instalaciones")) setContextTopic("Instalaciones")
    }
    sendMessageToConserje(suggestion)
  }

  const handleMenuSelect = (item: { id: string; label: string }) => {
    const isCategory = item.id?.startsWith("CAT_")
    if (isCategory) {
      setActiveItemId(null)
      setActiveItemLabel(null)
    } else {
      setActiveItemId(item.id)
      setActiveItemLabel(item.label)
    }
    const lower = item.label.toLowerCase()
    if (lower.includes("habit")) setContextTopic("Habitaciones")
    else if (lower.includes("serv")) setContextTopic("Servicios")
    else if (lower.includes("recomend")) setContextTopic("Recomendaciones_Locales")
    else if (lower.includes("instal")) setContextTopic("Instalaciones")
    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        sender: "user",
        type: "text",
        content: item.label,
      },
    ])
    sendMessageToConserje(item.label, {
      activeItemIdOverride: item.id,
      activeItemLabelOverride: item.label,
      source: "menu",
    })
  }

  const resetDemo = () => {
    setMessages([])
    setUserInput("")
    setIsAIResponding(false)
    setChatHistory([])
    setContextTopic(null)
    setActiveItemId(null)
    setConversationState({ dates: null, guests: null, profile: null, intent: null })
  }

  const switchLabel = experienceMode === "agente" ? "Modo Website" : "Modo Agente"

  const handleModeSwitch = () => {
    setExperienceMode((prev) => (prev === "agente" ? "website" : "agente"))
    resetDemo()
  }

  if (view === "intro") {
    return (
      <div className="h-screen w-full bg-background text-foreground relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/hotel-acerca.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <div className="text-center space-y-8 max-w-lg mx-auto">
            <div className="w-48 mx-auto text-white">
              <FullLogo className="w-full h-auto text-white" />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                Viaja con propósito,
                <br />
                no solo con itinerario
              </h1>
              <p className="text-white/80 text-sm tracking-widest uppercase font-medium">
                Atmósfera, Carácter, Diseño
              </p>
            </div>

            <div className="pt-12">
              <button
                onClick={() => setView("chat")}
                className="h-16 w-16 rounded-full bg-[#E8B931] hover:bg-[#E8B931]/90 text-[#003744] flex items-center justify-center mx-auto transition-all hover:scale-110 shadow-lg cursor-pointer"
              >
                <Fingerprint className="h-8 w-8" />
              </button>
              <p className="text-white/60 text-xs mt-4">Toca para comenzar</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${figtree.className}`}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border/30">
        <div className="max-w-4xl mx-auto px-6 py-3 sm:py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="shrink-0 text-[#003744]">
              <FullLogo className="h-24 w-auto" />
            </div>

            <div className="flex min-w-0 flex-col items-end text-right">
              <button
                type="button"
                onClick={handleModeSwitch}
                className="mb-4 sm:mb-6 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-foreground hover:text-foreground/75 transition-colors"
              >
                <Repeat2 className="h-3.5 w-3.5" />
                {switchLabel}
              </button>
              <button
                type="button"
                onClick={() => router.push("/ubicacion")}
                className="flex items-center gap-2 whitespace-nowrap text-xs font-medium text-foreground bg-card/40 px-3 py-1.5 rounded-full border border-border backdrop-blur-sm hover:bg-card/60 transition-colors group"
              >
                <CloudSun className="h-3.5 w-3.5 text-primary" />
                <span>{weather?.tempLabel ?? "--°C"}</span>
                <span className="w-px h-3 bg-border mx-1" />
                <span className="text-[10px] uppercase tracking-wider">Miraflores</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors ml-1" />
              </button>
              <p className="text-[10px] text-muted-foreground mt-1">
                {weather?.description ?? "Clima no disponible"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in-up">
            {msg.sender === "agent" && msg.type === "text" && (
              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#003035] text-white shadow-md">
                  <Logo className="h-5 w-auto text-white" />
                </div>
                <div className="bg-white dark:bg-card rounded-2xl rounded-tl-none px-6 py-4 text-base leading-relaxed shadow-sm max-w-[85%]">
                  {msg.link ? (
                    <>
                      {msg.content.split("Clic aquí")[0]}
                      <a
                        href={msg.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#003744] underline underline-offset-4"
                      >
                        Clic aquí
                      </a>
                      {msg.content.split("Clic aquí")[1] || ""}
                    </>
                  ) : (
                    renderTextWithLinks(msg.content)
                  )}
                </div>
              </div>
            )}

            {msg.type === "gallery" && (
              <div className="flex gap-4 items-start">
                <div className="w-10 shrink-0" />
                <div className="w-full max-w-[560px] rounded-2xl overflow-hidden shadow-md bg-card">
                  <div className="aspect-[4/5] sm:aspect-[16/10]">
                    <ImageSlider images={msg.content} />
                  </div>
                </div>
              </div>
            )}

            {msg.type === "items" && (
              <ConserjeItemsMessage
                items={msg.content}
                onAction={(action, item) => handleCtaAction(action, item)}
              />
            )}

            {msg.type === "suggestions" && (
              <div className="flex gap-4 items-start">
                <div className="w-10 shrink-0" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                  {msg.content.map((suggestion: string, idx: number) => {
                    const description = getSuggestionDescription(suggestion)
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="group relative bg-white dark:bg-card border border-border/30 hover:border-border/50 hover:shadow-md hover:-translate-y-0.5 hover:ring-1 hover:ring-border/40 rounded-2xl px-5 py-4 transition-all duration-200 cursor-pointer shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 p-2.5 rounded-full bg-[#ffce5c] text-[#003744]">
                            {getSuggestionIcon(suggestion)}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-base font-semibold text-foreground">{suggestion}</p>
                            {description && (
                              <p className="text-sm text-muted-foreground mt-1">{description}</p>
                            )}
                          </div>
                          <ArrowRightIcon className="h-5 w-5 text-muted-foreground/30 group-hover:text-muted-foreground/50 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {msg.type === "intent" && (
              <div className="flex gap-4 items-start">
                <div className="w-10 shrink-0" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                  {msg.content.map((intent: { label: string; description: string; icon: React.ReactNode }, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(intent.label)}
                      className="group relative bg-white dark:bg-card border border-border/30 hover:border-border/50 hover:shadow-md hover:-translate-y-0.5 hover:ring-1 hover:ring-border/40 rounded-2xl px-5 py-4 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2.5 rounded-full bg-[#ffce5c] text-[#003744]">
                          {intent.icon}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-base font-semibold text-foreground">{intent.label}</p>
                          <p className="text-sm text-muted-foreground mt-1">{intent.description}</p>
                        </div>
                        <ArrowRightIcon className="h-5 w-5 text-muted-foreground/30 group-hover:text-muted-foreground/50 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {msg.type === "group" && (
              <div className="flex gap-4 items-start">
                <div className="w-10 shrink-0" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                  {msg.content.map((group: { label: string; icon: React.ReactNode }, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(group.label)}
                      className="group relative bg-white dark:bg-card border border-border/30 hover:border-border/50 hover:shadow-md hover:-translate-y-0.5 hover:ring-1 hover:ring-border/40 rounded-2xl px-5 py-4 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2.5 rounded-full bg-[#ffce5c] text-[#003744]">
                          {group.icon}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-base font-semibold text-foreground">{group.label}</p>
                        </div>
                        <ArrowRightIcon className="h-5 w-5 text-muted-foreground/30 group-hover:text-muted-foreground/50 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {msg.type === "freetext" && (
              <div className="flex justify-center">
                <p className="text-sm text-muted-foreground/70 text-center">
                  {msg.content}
                </p>
              </div>
            )}


            {msg.type === "menu" && (
              (() => {
                const roomCarouselItems = resolveRoomMenuCarouselItems(msg.content)
                if (roomCarouselItems && roomCarouselItems.length > 0) {
                  return (
                    <div className="flex gap-4 items-start">
                      <div className="w-10 shrink-0" />
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <RoomMenuCarousel items={roomCarouselItems} onSelect={handleMenuSelect} />
                      </div>
                    </div>
                  )
                }

                return (
                  <div className="flex gap-4 items-start">
                    <div className="w-10 shrink-0" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
                      {msg.content.map((item: { id: string; label: string }, idx: number) => (
                        <button
                          key={item.id || idx}
                          onClick={() => handleMenuSelect(item)}
                          className="group bg-white dark:bg-card border border-border/30 hover:border-border/50 hover:shadow-md hover:-translate-y-0.5 hover:ring-1 hover:ring-border/40 rounded-xl px-3 py-3 text-left text-sm font-semibold text-foreground shadow-sm transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-[#ffce5c] text-[#003744]">
                              {getServiceMenuIcon(item.label)}
                            </div>
                            <span className="line-clamp-2">{item.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })()
            )}

            {msg.sender === "user" && msg.type === "text" && (
              <div className="flex justify-end">
                <div className="bg-[#ffce5c] text-[#003744] rounded-2xl px-6 py-4 text-base leading-relaxed shadow-sm max-w-[85%]">
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#003035] text-white shadow-md">
              <Logo className="h-5 w-auto text-white" />
            </div>
            <div className="bg-white dark:bg-card rounded-2xl rounded-tl-none px-5 py-3 flex gap-1 items-center shadow-sm">
              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Chat Input Area */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-lg border-t border-border/30">
        <div className="max-w-4xl mx-auto px-6 py-5">
          {(conversationState.dates || conversationState.guests || conversationState.profile || conversationState.intent) && (
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {conversationState.intent && (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/40 border border-border/40">
                  Motivo: {conversationState.intent}
                  <button
                    type="button"
                    aria-label="Quitar motivo"
                    onClick={() => handleClearField("intent")}
                    className="rounded-full p-0.5 hover:bg-muted/60 transition-colors"
                  >
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              {conversationState.profile && (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/40 border border-border/40">
                  Perfil: {conversationState.profile}
                  <button
                    type="button"
                    aria-label="Quitar perfil"
                    onClick={() => handleClearField("profile")}
                    className="rounded-full p-0.5 hover:bg-muted/60 transition-colors"
                  >
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              {conversationState.guests && (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/40 border border-border/40">
                  Personas: {conversationState.guests}
                  <button
                    type="button"
                    aria-label="Quitar personas"
                    onClick={() => handleClearField("guests")}
                    className="rounded-full p-0.5 hover:bg-muted/60 transition-colors"
                  >
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              {conversationState.dates && (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/40 border border-border/40">
                  Fechas: {conversationState.dates}
                  <button
                    type="button"
                    aria-label="Quitar fechas"
                    onClick={() => handleClearField("dates")}
                    className="rounded-full p-0.5 hover:bg-muted/60 transition-colors"
                  >
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
            </div>
          )}
          <div
            className={`bg-white dark:bg-card border border-border/30 rounded-2xl px-6 py-4 shadow-lg transition-opacity ${
              isTyping ? "opacity-60" : "opacity-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                disabled={isTyping}
                className="flex-1 bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder={isTyping ? "El conserje está escribiendo..." : "Escribe tu pregunta..."}
                value={userInput || transcript}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isTyping) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  disabled={isTyping || !isMicSupported || (isTranscribing && !isListening)}
                  onClick={handleMicToggle}
                  className={`h-12 w-12 rounded-xl transition-all duration-300 flex items-center justify-center group ${
                    isTyping || !isMicSupported || (isTranscribing && !isListening)
                      ? "bg-muted/30 cursor-not-allowed opacity-50 border border-border"
                      : isListening
                        ? "bg-red-500/20 border border-red-500/50 scale-105 cursor-pointer"
                        : "bg-white border-2 border-[#ffce5c] hover:bg-[#ffce5c]/5 hover:scale-105 cursor-pointer"
                  }`}
                  aria-label={isListening ? "Detener grabación" : "Iniciar grabación"}
                >
                  {isListening && !isTyping && (
                    <span className="absolute inset-0 rounded-xl animate-ping bg-red-500/20" />
                  )}
                  {isListening ? (
                    <MicrophoneIcon className="h-5 w-5 text-red-600" />
                  ) : (
                    <MicrophoneIcon className="h-5 w-5 text-[#ffce5c]" />
                  )}
                </button>
                <button
                  disabled={isTyping || isTranscribing}
                  onClick={handleSendMessage}
                  className={`h-12 w-12 rounded-xl transition-all shadow-sm flex items-center justify-center ${
                    isTyping || isTranscribing
                      ? "bg-muted/30 cursor-not-allowed opacity-50"
                      : "bg-[#ffce5c] hover:bg-[#ffce5c]/90 text-[#003744] hover:scale-105 cursor-pointer"
                  }`}
                  aria-label="Enviar mensaje"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            {micError && (
              <p className="mt-2 text-sm text-red-600">{micError}</p>
            )}
            {!isMicSupported && (
              <p className="mt-2 text-xs text-muted-foreground">
                Tu navegador no soporta micrófono.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
