"use client"

import { useState, useEffect, useRef } from "react"
import { Figtree } from "next/font/google"
import { profiles } from "./conversations-data"
import { Logo } from "@/components/humano/Logo"
import { ArrowLeft, Sparkles, Briefcase, Palmtree, Compass } from "lucide-react"
import {
  PaperAirplaneIcon,
  MicrophoneIcon,
  UserIcon,
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  CheckCircleIcon,
  ChatBubbleLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon
} from "@heroicons/react/24/solid"
import { useSpeech } from "@/hooks/useSpeech"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
})

// Definir los 3 perfiles principales
const mainProfiles = [
  {
    name: "Trabajo",
    icon: <Briefcase className="h-8 w-8" />,
    emoji: "💼",
    description: "Viajes de negocios y profesionales",
    color: "from-blue-500 to-blue-700",
    caracteristica: "trabajo"
  },
  {
    name: "Descanso",
    icon: <Palmtree className="h-8 w-8" />,
    emoji: "🌴",
    description: "Relax y desconexión total",
    color: "from-green-500 to-emerald-700",
    caracteristica: "descanso"
  },
  {
    name: "Aventura",
    icon: <Compass className="h-8 w-8" />,
    emoji: "🧭",
    description: "Exploración y experiencias únicas",
    color: "from-orange-500 to-red-600",
    caracteristica: "aventura"
  }
]

export default function DemoPage() {
  const [selectedCaracteristica, setSelectedCaracteristica] = useState<string | null>(null)
  const [selectedGrupo, setSelectedGrupo] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null)
  const [currentConvoIndex, setCurrentConvoIndex] = useState(0)
  const [messages, setMessages] = useState<any[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [waitingForGrupoSelection, setWaitingForGrupoSelection] = useState(false)
  const [userInput, setUserInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get icon for suggestion based on text
  const getSuggestionIcon = (suggestion: string) => {
    const lower = suggestion.toLowerCase()
    if (lower.includes('solo')) return <UserIcon className="h-5 w-5" />
    if (lower.includes('pareja')) return <UsersIcon className="h-5 w-5" />
    if (lower.includes('grupo')) return <UserGroupIcon className="h-5 w-5" />
    if (lower.includes('consultar')) return <ChatBubbleLeftIcon className="h-5 w-5" />
    if (lower.includes('tarifa')) return <CurrencyDollarIcon className="h-5 w-5" />
    if (lower.includes('disponibilidad')) return <ClipboardDocumentCheckIcon className="h-5 w-5" />
    if (lower.includes('superior')) return <HomeIcon className="h-5 w-5" />
    if (lower.includes('deluxe')) return <CheckCircleIcon className="h-5 w-5" />
    if (lower.includes('coworking')) return <BuildingOfficeIcon className="h-5 w-5" />
    if (lower.includes('día') || lower.includes('hora')) return <CalendarIcon className="h-5 w-5" />
    if (lower.includes('restaurante') || lower.includes('bar')) return <BuildingOfficeIcon className="h-5 w-5" />
    if (lower.includes('ubicación') || lower.includes('llegar') || lower.includes('traslad')) return <MapPinIcon className="h-5 w-5" />
    if (lower.includes('habitación') || lower.includes('habitacion') || lower.includes('reserva')) return <CheckCircleIcon className="h-5 w-5" />
    if (lower.includes('asesor') || lower.includes('contacto') || lower.includes('hablar')) return <PhoneIcon className="h-5 w-5" />
    if (lower.includes('check')) return <ChatBubbleLeftIcon className="h-5 w-5" />
    return <ChatBubbleLeftIcon className="h-5 w-5" />
  }

  // Get image for card based on topic/subtopic
  const getCardImage = (topic: string, subtopic: string) => {
    const topicLower = topic.toLowerCase()
    const subtopicLower = subtopic?.toLowerCase() || ''

    // Ubicación - Miraflores
    if (subtopicLower.includes('miraflores') && !subtopicLower.includes('llegar')) {
      return 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=800&auto=format&fit=crop&q=60'
    }
    // Traslados / Aeropuerto / Cómo llegar
    if (subtopicLower.includes('llegar') || subtopicLower.includes('aeropuerto') || subtopicLower.includes('traslad')) {
      return 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&auto=format&fit=crop&q=60'
    }
    // Alrededores / Actividades
    if (subtopicLower.includes('alrededor') || subtopicLower.includes('actividad')) {
      return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60'
    }
    // Habitaciones / Suites
    if (topicLower.includes('habitaciones') || subtopicLower.includes('suite') || subtopicLower.includes('diseño')) {
      return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=60'
    }
    return null
  }

  const speech: any = useSpeech?.() ?? {}
  const transcript: string = speech.transcript ?? ""
  const isListening: boolean = speech.isListening ?? false
  const startListening = speech.startListening ?? (() => { })
  const stopListening = speech.stopListening ?? (() => { })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleMicToggle = () => {
    if (isListening) stopListening()
    else startListening()
  }

  const handleSendMessage = () => {
    const messageText = userInput || transcript
    if (!messageText.trim()) return

    // Add user message to chat
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      content: messageText
    }])

    setUserInput("")

    // Handle different conversation states
    if (waitingForGrupoSelection) {
      // Try to match user input to grupo options
      const inputLower = messageText.toLowerCase()
      let grupo = 'Solo'
      if (inputLower.includes('pareja') || inputLower.includes('dos') || inputLower.includes('acompañ')) {
        grupo = 'En pareja'
      } else if (inputLower.includes('grupo') || inputLower.includes('familia') || inputLower.includes('amigos')) {
        grupo = 'En grupo'
      }

      setTimeout(() => {
        handleGrupoSelection(grupo)
      }, 500)
    } else if (selectedProfile !== null) {
      // Continue conversation flow
      continueConversation()
    }
  }

  const handleGrupoSelection = (grupo: string) => {
    setSelectedGrupo(grupo)
    setWaitingForGrupoSelection(false)

    // Buscar el perfil específico
    const grupoKey = grupo === 'Solo' ? 'solo' : grupo === 'En pareja' ? 'pareja' : 'grupo'
    const profileIndex = profiles.findIndex(
      p => p.caracteristica === selectedCaracteristica && p.grupo === grupoKey
    )

    if (profileIndex !== -1) {
      setSelectedProfile(profileIndex)
      setCurrentConvoIndex(0)

      // Iniciar primera conversación
      setTimeout(() => {
        showConversation(profileIndex, 0)
      }, 1000)
    }
  }

  const continueConversation = () => {
    if (selectedProfile !== null) {
      const nextIndex = currentConvoIndex + 1
      if (nextIndex < profiles[selectedProfile].conversations.length) {
        setCurrentConvoIndex(nextIndex)
        setTimeout(() => {
          showConversation(selectedProfile, nextIndex)
        }, 1000)
      } else {
        // End of conversations
        setTimeout(() => {
          setIsTyping(true)
        }, 1000)
        setTimeout(() => {
          setMessages(prev => [...prev,
          {
            id: Date.now() + 1,
            sender: 'agent',
            type: 'text',
            content: '¡Genial! ¿Te gustaría que te ayude a reservar tu habitación o tienes alguna otra pregunta?'
          },
          {
            id: Date.now() + 2,
            sender: 'agent',
            type: 'suggestions',
            content: ['Ver habitaciones', 'Hacer reserva', 'Hablar con un asesor']
          }
          ])
          setIsTyping(false)
        }, 2000)
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      content: suggestion
    }])

    // Handle response based on context
    if (waitingForGrupoSelection) {
      setTimeout(() => {
        handleGrupoSelection(suggestion)
      }, 500)
    } else if (selectedProfile !== null) {
      setTimeout(() => {
        continueConversation()
      }, 500)
    }
  }

  const startConversation = (caracteristica: string) => {
    setSelectedCaracteristica(caracteristica)
    setMessages([])
    setShowIntro(false)
    setWaitingForGrupoSelection(true)

    // Mensaje de bienvenida
    setTimeout(() => {
      setIsTyping(true)
    }, 300)

    setTimeout(() => {
      setMessages([
        {
          id: Date.now(),
          sender: 'agent',
          type: 'text',
          content: `¡Genial! Veo que vienes por ${caracteristica}. Cuéntame, ¿viajas solo, en pareja o en grupo?`
        },
        {
          id: Date.now() + 1,
          sender: 'agent',
          type: 'suggestions',
          content: ['Solo', 'En pareja', 'En grupo']
        }
      ])
      setIsTyping(false)
    }, 1000)
  }


  const showConversation = (profileIndex: number, convoIndex: number) => {
    const profile = profiles[profileIndex]
    const convo = profile.conversations[convoIndex]

    if (!convo || !convo.intro) {
      // Skip empty conversations
      if (convoIndex + 1 < profile.conversations.length) {
        showConversation(profileIndex, convoIndex + 1)
      }
      return
    }

    setIsTyping(true)

    // Show intro
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'agent',
        type: 'text',
        content: convo.intro
      }])
      setIsTyping(false)
    }, 1000)

    // Show fase + titulo
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'agent',
        type: 'header',
        content: convo.fase
      }])
    }, 2000)

    // Show content card
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        sender: 'agent',
        type: 'card',
        content: {
          subtopic: convo.sub_tema,
          titulo: convo.titulo,
          contenido: convo.contenido,
          topic: convo.topic
        }
      }])
    }, 2500)

    // Show cierre
    if (convo.cierre) {
      setTimeout(() => {
        setIsTyping(true)
      }, 3500)

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 3,
          sender: 'agent',
          type: 'text',
          content: convo.cierre
        }])
        setIsTyping(false)
      }, 4000)
    }

    // Show CTAs as suggestions
    if (convo.ctas) {
      setTimeout(() => {
        const ctaButtons = convo.ctas.split('/').map((cta: string) => cta.trim()).filter((cta: string) => cta)
        setMessages(prev => [...prev, {
          id: Date.now() + 5,
          sender: 'agent',
          type: 'suggestions',
          content: ctaButtons
        }])
      }, 4500)
    }
  }


  const resetDemo = () => {
    setSelectedCaracteristica(null)
    setSelectedGrupo(null)
    setSelectedProfile(null)
    setCurrentConvoIndex(0)
    setMessages([])
    setShowIntro(true)
    setWaitingForGrupoSelection(false)
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003744] via-[#004d5c] to-[#003744] text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-5xl w-full text-center space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="inline-block p-4 bg-white/10 rounded-3xl backdrop-blur-sm shadow-2xl">
              <Sparkles className="h-16 w-16 text-[#E8B931]" />
            </div>
            <div>
              <h1 className="text-6xl font-serif font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Demo Conversacional
              </h1>
              <p className="text-2xl text-white/70 font-light">Humano Hotel - Experiencias Personalizadas</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl">
            <p className="text-lg text-white/90 leading-relaxed">
              Descubre cómo nuestro asistente virtual se adapta a tu tipo de viaje.
              <br />
              <span className="text-white/70">Selecciona el propósito de tu visita:</span>
            </p>
          </div>

          {/* Main Profiles - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mainProfiles.map((profile) => (
              <button
                key={profile.caracteristica}
                onClick={() => startConversation(profile.caracteristica)}
                className={`group relative bg-gradient-to-br ${profile.color} rounded-3xl p-8 border-2 border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden`}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                      {profile.icon}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold">{profile.name}</h3>
                    <p className="text-white/90 text-sm font-medium">{profile.description}</p>
                  </div>

                  <div className="flex items-center justify-center text-white/90 text-sm font-semibold pt-2 group-hover:text-white transition-colors">
                    Iniciar conversación
                    <svg className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer note */}
          <div className="text-sm text-white/40 space-y-1">
            <p>💡 Sistema conversacional adaptativo basado en IA</p>
            <p>Demo técnica - Contenido real del hotel</p>
          </div>
        </div>
      </div>
    )
  }

  const profile = selectedProfile !== null ? profiles[selectedProfile] : null
  const mainProfile = selectedCaracteristica ? mainProfiles.find(p => p.caracteristica === selectedCaracteristica) : null

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

          {mainProfile && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-muted/30 text-muted-foreground">
                <div className="scale-75">
                  {mainProfile.icon}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{mainProfile.name}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {selectedGrupo ? `${selectedGrupo}` : 'Personalizando...'}
                </p>
              </div>
            </div>
          )}

          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in-up">
            {msg.sender === 'agent' && msg.type === 'text' && (
              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#003035] text-white shadow-md">
                  <Logo className="h-5 w-auto text-white" />
                </div>
                <div className="bg-white dark:bg-card rounded-2xl rounded-tl-none px-6 py-4 text-base leading-relaxed shadow-sm max-w-[85%]">
                  {msg.content}
                </div>
              </div>
            )}

            {msg.type === 'header' && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-8 mb-2 ml-1">
                {msg.content}
              </p>
            )}

            {msg.type === 'card' && (
              <div className="bg-white dark:bg-card border border-border/30 rounded-2xl overflow-hidden shadow-sm">
                {/* Image if available */}
                {getCardImage(msg.content.topic, msg.content.subtopic) && (
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={getCardImage(msg.content.topic, msg.content.subtopic)!}
                      alt={msg.content.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 bg-[#ffce5c]/20 text-[#ffce5c] text-xs font-semibold rounded-md uppercase tracking-wide">
                        {msg.content.topic}
                      </span>
                      {msg.content.subtopic && (
                        <span className="text-xs font-medium text-muted-foreground">
                          • {msg.content.subtopic}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {msg.content.titulo}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {msg.content.contenido}
                  </p>
                </div>
              </div>
            )}

            {msg.type === 'suggestions' && (
              <div className="flex gap-4 items-start">
                <div className="w-10 shrink-0" /> {/* Spacer para alinear */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                  {msg.content.map((suggestion: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="group relative bg-white dark:bg-card border border-border/30 hover:border-border/50 rounded-2xl px-5 py-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-2.5 rounded-full bg-[#ffce5c] text-[#003744]">
                          {getSuggestionIcon(suggestion)}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-base font-semibold text-foreground">
                            {suggestion}
                          </p>
                        </div>
                        <ArrowRightIcon className="h-5 w-5 text-muted-foreground/30 group-hover:text-muted-foreground/50 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {msg.sender === 'user' && msg.type === 'text' && (
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
              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Chat Input Area - Fixed at bottom */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-lg border-t border-border/30">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className={`bg-white dark:bg-card border border-border/30 rounded-2xl px-6 py-4 shadow-lg transition-opacity ${isTyping ? 'opacity-60' : 'opacity-100'}`}>
            <div className="flex items-center gap-3">
              <input
                type="text"
                disabled={isTyping}
                className="flex-1 bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder={isTyping ? "El asistente está escribiendo..." : "Escribe aquí o usa el micrófono..."}
                value={userInput || transcript}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isTyping) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              {/* Action Buttons */}
              <div className="flex gap-2">
                {/* Mic Button */}
                <button
                  disabled={isTyping}
                  onClick={handleMicToggle}
                  className={`h-12 w-12 rounded-xl transition-all duration-300 flex items-center justify-center group ${isTyping
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
                {/* Send Button - Darker/Saturated */}
                <button
                  disabled={isTyping}
                  onClick={handleSendMessage}
                  className={`h-12 w-12 rounded-xl transition-all shadow-sm flex items-center justify-center ${isTyping
                      ? "bg-muted/30 cursor-not-allowed opacity-50"
                      : "bg-[#ffce5c] hover:bg-[#ffce5c]/90 text-[#003744] hover:scale-105 cursor-pointer"
                    }`}
                  aria-label="Enviar mensaje"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="bg-background/80 backdrop-blur-sm border-t border-border/30 py-3">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground/60">
            {waitingForGrupoSelection ? (
              'Personalizando tu experiencia...'
            ) : profile ? (
              `Conversación ${currentConvoIndex + 1} de ${profile.conversations.length}`
            ) : (
              'Demo conversacional'
            )}
          </p>
        </div>
      </footer>
    </div>
  )
}
