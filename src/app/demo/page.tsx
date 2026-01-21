"use client"

import { useState, useEffect, useRef } from "react"
import { profiles } from "./conversations-data"
import { Logo } from "@/components/humano/Logo"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function DemoPage() {
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null)
  const [currentConvoIndex, setCurrentConvoIndex] = useState(0)
  const [messages, setMessages] = useState<any[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startConversation = (profileIndex: number) => {
    setSelectedProfile(profileIndex)
    setCurrentConvoIndex(0)
    setMessages([])
    setShowIntro(false)

    // Start first conversation
    setTimeout(() => {
      showConversation(profileIndex, 0)
    }, 500)
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
    setSelectedProfile(null)
    setCurrentConvoIndex(0)
    setMessages([])
    setShowIntro(true)
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003744] via-[#004d5c] to-[#003744] text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full text-center space-y-12">
          <div className="space-y-4">
            <div className="inline-block p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Sparkles className="h-12 w-12 text-[#E8B931]" />
            </div>
            <h1 className="text-5xl font-serif font-bold">Demo Conversacional</h1>
            <p className="text-xl text-white/80">Humano Hotel - Experiencias Personalizadas</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <p className="text-lg text-white/90 mb-6">
              Explora cómo nuestro asistente virtual adapta la conversación según el perfil del huésped.
              Selecciona un perfil para ver la experiencia completa:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile, index) => (
              <button
                key={index}
                onClick={() => startConversation(index)}
                className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl p-6 border-2 border-white/20 hover:border-[#E8B931] transition-all duration-300 text-left cursor-pointer"
              >
                <div className="text-5xl mb-3">{profile.icon}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#E8B931] transition-colors">
                  {profile.name}
                </h3>
                <p className="text-sm text-white/70">{profile.description}</p>
                <div className="mt-4 flex items-center text-[#E8B931] text-sm font-medium">
                  Ver demo
                  <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          <div className="text-sm text-white/50">
            <p>💡 Datos basados en microsite-faqs.xlsx</p>
            <p className="mt-1">Demo independiente - No integrado en navegación principal</p>
          </div>
        </div>
      </div>
    )
  }

  const profile = selectedProfile !== null ? profiles[selectedProfile] : null

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={resetDemo}
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Cambiar perfil
          </button>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{profile?.icon}</div>
            <div>
              <p className="text-sm font-bold">{profile?.name}</p>
              <p className="text-xs text-muted-foreground">{profile?.description}</p>
            </div>
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in-up">
            {msg.sender === 'agent' && msg.type === 'text' && (
              <div className="flex gap-3 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#003744] text-white shadow-md">
                  <Logo className="h-4 w-auto text-white" />
                </div>
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl rounded-tl-none px-5 py-3.5 text-sm leading-relaxed shadow-md max-w-[85%]">
                  {msg.content}
                </div>
              </div>
            )}

            {msg.type === 'header' && (
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-6 mb-2 ml-1">
                {msg.content}
              </p>
            )}

            {msg.type === 'card' && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                      {msg.content.topic}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{msg.content.titulo}</h3>
                    {msg.content.subtopic && (
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {msg.content.subtopic}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-card-foreground leading-relaxed">
                  {msg.content.contenido}
                </p>
              </div>
            )}

            {msg.type === 'ctas' && (
              <div className="flex flex-wrap gap-2 ml-11">
                {msg.content.map((cta: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleCTAClick(cta)}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary text-primary rounded-full text-sm font-medium transition-all cursor-pointer"
                  >
                    {cta}
                  </button>
                ))}
              </div>
            )}

            {msg.sender === 'user' && msg.type === 'text' && (
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-5 py-3.5 text-sm leading-relaxed shadow-md max-w-[85%] font-medium">
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#003744] text-white shadow-md">
              <Logo className="h-4 w-auto text-white" />
            </div>
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl rounded-tl-none px-5 py-3.5 flex gap-1 items-center shadow-md">
              <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Footer Info */}
      <footer className="bg-card/50 backdrop-blur-sm border-t border-border py-4">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground">
            Demo basada en datos reales de microsite-faqs.xlsx • Conversación {currentConvoIndex + 1} de {profile?.conversations.filter(c => c.intro).length}
          </p>
        </div>
      </footer>
    </div>
  )
}
