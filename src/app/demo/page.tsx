"use client"

import { useState, useEffect, useRef } from "react"
import { profiles } from "./conversations-data"
import { Logo } from "@/components/humano/Logo"
import { ArrowLeft, Sparkles, Briefcase, Palmtree, Compass } from "lucide-react"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      setMessages([{
        id: Date.now(),
        sender: 'agent',
        type: 'text_with_buttons',
        content: `¡Genial! Veo que vienes por ${caracteristica}. Cuéntame, ¿viajas solo, en pareja o en grupo?`,
        buttons: ['Solo', 'En pareja', 'En grupo']
      }])
      setIsTyping(false)
    }, 1000)
  }

  const selectGrupo = (grupo: string) => {
    setSelectedGrupo(grupo)
    setWaitingForGrupoSelection(false)

    // Mensaje del usuario
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      content: `Viajo ${grupo.toLowerCase()}`
    }])

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

    // Show CTAs
    if (convo.ctas) {
      setTimeout(() => {
        const ctaButtons = convo.ctas.split('/').map((cta: string) => cta.trim()).filter((cta: string) => cta)
        setMessages(prev => [...prev, {
          id: Date.now() + 4,
          sender: 'agent',
          type: 'ctas',
          content: ctaButtons
        }])
      }, 4500)
    }
  }

  const handleCTAClick = (cta: string) => {
    // User clicks CTA
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      content: `Cuéntame más sobre: ${cta}`
    }])

    // Move to next conversation
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
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            sender: 'agent',
            type: 'text',
            content: '¡Genial! ¿Te gustaría que te ayude a reservar tu habitación o tienes alguna otra pregunta?'
          }])
          setIsTyping(false)
        }, 2000)
      }
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={resetDemo}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Reiniciar
          </button>

          {mainProfile && (
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${mainProfile.color} text-white shadow-md`}>
                {mainProfile.icon}
              </div>
              <div>
                <p className="text-sm font-bold">{mainProfile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedGrupo ? `Viajero ${selectedGrupo.toLowerCase()}` : 'Personalizando...'}
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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#003744] to-[#004d5c] text-white shadow-lg">
                  <Logo className="h-5 w-auto text-white" />
                </div>
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl rounded-tl-none px-6 py-4 text-sm leading-relaxed shadow-lg max-w-[85%] border border-border/30">
                  {msg.content}
                </div>
              </div>
            )}

            {msg.sender === 'agent' && msg.type === 'text_with_buttons' && (
              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#003744] to-[#004d5c] text-white shadow-lg">
                  <Logo className="h-5 w-auto text-white" />
                </div>
                <div className="flex-1 max-w-[85%]">
                  <div className="bg-card/80 backdrop-blur-sm rounded-2xl rounded-tl-none px-6 py-4 text-sm leading-relaxed shadow-lg border border-border/30">
                    {msg.content}
                  </div>
                  {/* Botones de sugerencia dentro del contexto del mensaje */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.buttons?.map((button: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => selectGrupo(button)}
                        className="group px-5 py-2.5 bg-card hover:bg-card/80 border-2 border-border hover:border-primary/60 rounded-xl text-sm font-medium transition-all cursor-pointer shadow-sm hover:shadow-md text-foreground hover:text-primary"
                      >
                        <span className="flex items-center gap-2">
                          {button}
                          <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {msg.type === 'header' && (
              <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mt-6 mb-2 ml-1">
                {msg.content}
              </p>
            )}

            {msg.type === 'card' && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md uppercase tracking-wide">
                      {msg.content.topic}
                    </span>
                    {msg.content.subtopic && (
                      <span className="text-xs font-medium text-muted-foreground">
                        • {msg.content.subtopic}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {msg.content.titulo}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {msg.content.contenido}
                </p>
              </div>
            )}

            {msg.type === 'ctas' && (
              <div className="flex gap-4 items-start">
                <div className="w-10 shrink-0" /> {/* Spacer para alinear con el mensaje */}
                <div className="flex flex-wrap gap-2">
                  {msg.content.map((cta: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleCTAClick(cta)}
                      className="group px-4 py-2 bg-card hover:bg-card/80 border border-border hover:border-primary/60 rounded-lg text-xs font-medium transition-all cursor-pointer shadow-sm hover:shadow-md text-muted-foreground hover:text-primary"
                    >
                      <span className="flex items-center gap-1.5">
                        {cta}
                        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {msg.sender === 'user' && msg.type === 'text' && (
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-6 py-3.5 text-sm leading-relaxed shadow-md max-w-[85%]">
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#003744] to-[#004d5c] text-white shadow-lg">
              <Logo className="h-5 w-auto text-white" />
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl rounded-tl-none px-5 py-3 flex gap-1 items-center shadow-lg border border-border/30">
              <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Footer Info */}
      <footer className="bg-card/50 backdrop-blur-sm border-t border-border py-4">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground">
            {waitingForGrupoSelection ? (
              '🎯 Personalizando tu experiencia...'
            ) : profile ? (
              `Conversación ${currentConvoIndex + 1} de ${profile.conversations.length} • ${mainProfile?.name} - ${selectedGrupo}`
            ) : (
              'Demo conversacional interactiva'
            )}
          </p>
        </div>
      </footer>
    </div>
  )
}
