"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { Figtree } from "next/font/google"
import { Logo } from "@/components/humano/Logo"
import { ArrowLeft, Briefcase, Palmtree, Compass } from "lucide-react"
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
  HeartIcon,
  SparklesIcon,
  TruckIcon,
  WifiIcon,
  UserIcon,
  UsersIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid"
import { useMicrophone } from "@/hooks/useMicrophone"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
})

type ConserjeItem = {
  id: string
  nombre_publico: string
  categoria: string
  desc_factual: string
  desc_experiencial: string
  imagenes_url: string[]
  ctas: string[]
  horario_apertura: string | null
  horario_cierre: string | null
  tipo: string
}

const defaultSuggestions = [
  "Habitaciones",
  "Servicios",
  "Recomendaciones locales",
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

const normalizeShortInput = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

const mapInputToSuggestion = (text: string): string | null => {
  const normalized = normalizeShortInput(text)
  if (!normalized) return null
  const words = normalized.split(/\s+/).filter(Boolean)
  if (words.length > 4) return null

  if (normalized.includes("trabajo")) return "Trabajo"
  if (normalized.includes("descanso") || normalized.includes("relax")) return "Descanso"
  if (normalized.includes("aventura") || normalized.includes("explorar")) return "Aventura"
  if (normalized.includes("solo") || normalized.includes("sola")) return "Solo"
  if (normalized.includes("pareja")) return "En pareja"
  if (normalized.includes("grupo") || normalized.includes("familia") || normalized.includes("amigos")) {
    return "En grupo"
  }
  if (normalized.includes("habitacion")) return "Habitaciones"
  if (normalized.includes("servicio")) return "Servicios"
  if (normalized.includes("recomendacion")) return "Recomendaciones locales"
  if (normalized.includes("instalacion")) return "Instalaciones"

  return null
}

export default function ConserjePage() {
  const [messages, setMessages] = useState<any[]>([])
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

  const mic = useMicrophone({ lang: "es-PE" })
  const transcript: string = mic.transcript ?? ""
  const isListening: boolean = mic.isListening ?? false
  const isTranscribing: boolean = mic.isTranscribing ?? false
  const micError: string | null = mic.error ?? null
  const isMicSupported: boolean = mic.isSupported ?? false
  const startListening = mic.startListening ?? (() => {})
  const stopListening = mic.stopListening ?? (() => {})
  const resetTranscript = mic.resetTranscript ?? (() => {})

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
    | { type: "intent"; content: Array<{ label: string; description: string; icon: ReactNode }> }
    | { type: "group"; content: Array<{ label: string; icon: ReactNode }> }
    | { type: "suggestions"; content: string[] }
    | { type: "menu"; content: Array<{ id: string; label: string }> }
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
                index === prev.length - 1 ? { ...msg, link: item.link } : msg
              )
            )
          }
          setIsTyping(false)
          await sleep(150)
          continue
        }

        await sleep(200)
        setMessages((prev) => [
          ...prev,
          { id: generateId(), sender: "agent", type: item.type, content: item.content },
        ])
      }
    })
  }

  const buildSearchUrl = (action: "reservar" | "coordinar") => {
    const parts: string[] = ["Hotel Humano Miraflores"]
    if (action === "reservar") parts.push("reservar habitación")
    if (action === "coordinar") parts.push("coordinar servicio")
    if (activeItemLabel) parts.push(activeItemLabel)
    if (conversationState.intent) parts.push(conversationState.intent)
    if (conversationState.profile) parts.push(conversationState.profile)
    if (conversationState.guests) parts.push(conversationState.guests)
    if (conversationState.dates) parts.push(conversationState.dates)
    const query = parts.filter(Boolean).join(" ")
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`
  }

  const handleCtaAction = (label: string) => {
    const lower = label.toLowerCase()
    const action = lower.includes("reservar") ? "reservar" : "coordinar"
    const url = buildSearchUrl(action as "reservar" | "coordinar")

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer")
    }

    const replyText = "Abrí una ventana nueva con lo que pediste. Clic aquí para revisarlo."
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
    if (messages.length === 0) {
      enqueueAgentSequence([
        { type: "text", content: "Hola, soy tu conserje en Humano Miraflores." },
        { type: "text", content: "¿Vienes por trabajo, descanso o aventura?" },
        { type: "intent", content: intentSuggestions },
        { type: "freetext", content: "O cuéntame tu plan libremente" },
      ])
    }
  }, [messages.length])

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
    if (lower.includes("serv")) return <BuildingOfficeIcon className="h-5 w-5" />
    if (lower.includes("recomend") || lower.includes("local")) return <MapPinIcon className="h-5 w-5" />
    if (lower.includes("tarifa") || lower.includes("precio")) return <CurrencyDollarIcon className="h-5 w-5" />
    if (lower.includes("dispon")) return <ClipboardDocumentCheckIcon className="h-5 w-5" />
    if (lower.includes("contacto") || lower.includes("asesor")) return <PhoneIcon className="h-5 w-5" />
    if (lower.includes("hora") || lower.includes("día")) return <CalendarIcon className="h-5 w-5" />
    if (lower.includes("restaurante") || lower.includes("bar")) return <BuildingStorefrontIcon className="h-5 w-5" />
    return <ChatBubbleLeftIcon className="h-5 w-5" />
  }

  const getServiceMenuIcon = (label: string) => {
    const lower = label.toLowerCase()
    if (lower.includes("transfer")) return <TruckIcon className="h-5 w-5" />
    if (lower.includes("pet") || lower.includes("mascota")) return <HeartIcon className="h-5 w-5" />
    if (lower.includes("room service")) return <BuildingStorefrontIcon className="h-5 w-5" />
    if (lower.includes("lavander")) return <SparklesIcon className="h-5 w-5" />
    if (lower.includes("estacion")) return <MapPinIcon className="h-5 w-5" />
    if (lower.includes("wifi")) return <WifiIcon className="h-5 w-5" />
    if (lower.includes("limpieza")) return <HomeIcon className="h-5 w-5" />
    if (lower.includes("concierge") || lower.includes("asistencia")) return <PhoneIcon className="h-5 w-5" />
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
    if (lower.includes("recomend") || lower.includes("local")) return "Lugares cerca del hotel"
    return null
  }

  const getItemImage = (item: ConserjeItem) => {
    if (!item.imagenes_url || item.imagenes_url.length === 0) return null
    const valid = item.imagenes_url.find((url) => url.startsWith("http"))
    return valid || null
  }

  const sendMessageToConserje = async (
    userMessage: string,
    options?: { activeItemIdOverride?: string | null; source?: "menu" | "user" }
  ) => {
    setIsAIResponding(true)

    const newHistory = [...chatHistory, { role: "user", content: userMessage }]
    setChatHistory(newHistory)

    const nextState = { ...conversationState }
    const dateHint = extractDateHint(userMessage)
    if (dateHint) nextState.dates = dateHint
    let guestsHint = extractGuestsHint(userMessage)
    if (!guestsHint) {
      const numericOnly = /^\d{1,2}$/.test(userMessage.trim())
      const lastAssistant = [...messages].reverse().find((msg) => msg.sender === "agent" && msg.type === "text")
      if (numericOnly && lastAssistant?.content?.toLowerCase().includes("personas")) {
        guestsHint = `${userMessage.trim()} personas`
      }
    }
    if (guestsHint) nextState.guests = guestsHint
    const profileHint = extractProfileHint(userMessage)
    if (profileHint) nextState.profile = profileHint
    const intentHint = extractIntentHint(userMessage)
    if (intentHint) nextState.intent = intentHint
    setConversationState(nextState)

    try {
      const response = await fetch("/api/conserje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: newHistory.slice(-6),
          contextTopic,
          activeItemId: options?.activeItemIdOverride ?? activeItemId,
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

      const sequence: AgentSequenceItem[] = []
      if (data.reply) sequence.push({ type: "text", content: data.reply })
      if (Array.isArray(data.menu) && data.menu.length > 0) {
        sequence.push({ type: "menu", content: data.menu })
      }
      if (Array.isArray(data.items) && data.items.length > 0) {
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
      const response = await fetch("/api/conserje", {
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

    const mappedSuggestion = mapInputToSuggestion(messageText)
    if (mappedSuggestion) {
      setUserInput("")
      resetTranscript()
      handleSuggestionClick(mappedSuggestion)
      return
    }

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
    if (lower.includes("reservar habitación") || lower.includes("coordinar servicio")) {
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
    if (lower.includes("reservar habitación") || lower.includes("coordinar servicio")) {
      handleCtaAction(suggestion)
      return
    }
    if (["trabajo", "descanso", "aventura"].includes(lower)) {
      const nextState = { ...conversationState, intent: lower }
      setConversationState(nextState)
      enqueueAgentSequence([
        {
          type: "text",
          content: `¡Genial! Veo que vienes por ${lower}. Cuéntame, ¿viajas solo, en pareja o en grupo?`,
        },
        { type: "group", content: groupSuggestions },
      ])
      return
    }
    if (lower === "solo" || lower === "en pareja" || lower === "en grupo") {
      const profile = lower.includes("pareja") ? "pareja" : lower.includes("grupo") ? "grupo" : "solo"
      const nextState = { ...conversationState, profile }
      setConversationState(nextState)
      enqueueAgentSequence([
        { type: "text", content: "Perfecto. ¿En qué puedo ayudarte hoy?" },
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
    sendMessageToConserje(item.label, { activeItemIdOverride: item.id, source: "menu" })
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

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${figtree.className}`}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border/30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={resetDemo}
            className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Reiniciar
          </button>

          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Conserje Humano</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {conversationState.intent || conversationState.profile
                ? `${conversationState.intent ? conversationState.intent : ""}${conversationState.intent && conversationState.profile ? " · " : ""}${conversationState.profile ? conversationState.profile : ""}`
                : "Miraflores"}
            </p>
          </div>

          <div className="w-20" />
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
                    msg.content
                  )}
                </div>
              </div>
            )}

            {msg.type === "items" && (
              <div className="bg-white dark:bg-card border border-border/30 rounded-2xl p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {msg.content.map((item: ConserjeItem) => {
                    const imageUrl = getItemImage(item)
                    const description = item.desc_factual || item.desc_experiencial
                    return (
                      <div key={item.id} className="border border-border/30 rounded-2xl overflow-hidden">
                        {imageUrl && (
                          <div className="h-32 w-full overflow-hidden">
                            <img src={imageUrl} alt={item.nombre_publico} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 bg-[#ffce5c]/20 text-[#ffce5c] text-xs font-semibold rounded-md uppercase tracking-wide">
                              {item.tipo}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-foreground">{item.nombre_publico}</h3>
                          {description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                          )}
                          {(item.horario_apertura || item.horario_cierre) && (
                            <p className="text-xs text-muted-foreground">
                              Horario: {item.horario_apertura || "-"} a {item.horario_cierre || "-"}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
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
