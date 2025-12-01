"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Medal, Mic, Activity, Coffee, Wifi, CloudSun, ChevronRight } from "lucide-react"
import { NavMenu } from "@/components/humano/NavMenu"
import { ThemeToggle } from "@/components/humano/ThemeToggle"
import { FullLogo } from "@/components/humano/FullLogo"
import { ImageSlider } from "@/components/humano/ImageSlider"
import { Logo } from "@/components/humano/Logo"



export default function AgentPage() {
  const router = useRouter()
  const [view, setView] = useState<'intro' | 'chat'>('intro')

  const handleStartChat = () => {
    setView('chat')
  }

  const [messages, setMessages] = useState<any[]>([])
  const [inputValue, setInputValue] = useState("")
  const [conversationStep, setConversationStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  // Mock weather data
  const weather = {
    temp: "22°C",
    desc: "cielo nublado brillante",
  }

  // Initial Chat Setup - Sequential message display
  useEffect(() => {
    if (view === 'chat' && messages.length === 0) {
      setIsTyping(true)

      // Message 1: Greeting
      setTimeout(() => {
        setMessages([{
          id: 1,
          sender: 'agent',
          type: 'text',
          content: 'Hola, Soy Humano Hotel, tu anfitrión en Miraflores'
        }])
        setIsTyping(false)
      }, 800)

      // Message 1.5: Image Slider
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 1.5,
          sender: 'agent',
          type: 'gallery',
          content: [
            { src: "/slider-propuesta-1.jpg", alt: "Restaurante", label: "Restaurante" },
            { src: "/slider-propuesta-2.jpg", alt: "Piscina", label: "Piscina" },
            { src: "/slider-propuesta-3.jpg", alt: "Lobby", label: "Lobby & Bar" },
            { src: "/slider-propuesta-4.jpg", alt: "Rooftop", label: "Rooftop" }
          ]
        }])
      }, 1400)

      // Message 2: Question
      setTimeout(() => {
        setIsTyping(true)
      }, 2200)

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 2,
          sender: 'agent',
          type: 'text',
          content: '¿Vienes por trabajo, descanso o aventura?'
        }])
        setIsTyping(false)
      }, 3000)

      // Message 3: Options
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 3,
          sender: 'agent',
          type: 'options',
          content: [
            { label: 'Trabajo', value: 'work', icon: 'briefcase' },
            { label: 'Descanso', value: 'rest', icon: 'coffee' },
            { label: 'Aventura', value: 'adventure', icon: 'compass' }
          ]
        }])
      }, 3400)
    }
  }, [view])

  const handleOptionSelect = (option: any) => {
    // User selection
    const userMsg = { id: Date.now(), sender: 'user', type: 'text', content: `Vengo en modo ${option.label}` }
    setMessages(prev => [...prev, userMsg])

    setIsTyping(true)

    // Agent Response Sequence - Sequential
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'agent',
        type: 'text',
        content: `Entendido, vienes en **modo ${option.label.toLowerCase()}**.`
      }])
      setIsTyping(false)
    }, 1000)

    setTimeout(() => {
      setIsTyping(true)
    }, 2200)

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        sender: 'agent',
        type: 'text',
        content: 'Dime cuántos días vienes y qué planes tienes para esos días, puedo ayudarte con buenas recomendaciones.'
      }])
      setIsTyping(false)
      setConversationStep(1)
    }, 3000)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMsg = { id: Date.now(), sender: 'user', type: 'text', content: inputValue }
    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)

    // Logic based on step
    if (conversationStep === 1) {
      // Message 1: "Genial!"
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'agent',
          type: 'text',
          content: 'Genial! tengo la habitación ideal para un viajero de negocios como tú'
        }])
        setIsTyping(false)
      }, 1000)

      // Message 2: Header
      setTimeout(() => {
        setIsTyping(true)
      }, 2200)

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 2,
          sender: 'agent',
          type: 'header',
          content: 'TE RECOMIENDO ESTA HABITACIÓN'
        }])
        setIsTyping(false)
      }, 2600)

      // Message 3: Room Card
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 3,
          sender: 'agent',
          type: 'room-card',
          content: {
            name: 'Junior Suite Vista Mar',
            description: 'Ideal para trabajo y relax',
            price: '$180',
            features: ['King Size', 'Escritorio amplio'],
            image: '/featured-room-propuesta.jpg'
          }
        }])
      }, 3000)

      // Message 4: Header for recommendations
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 4,
          sender: 'agent',
          type: 'header',
          content: 'OTRAS VENTAJAS RECOMENDADAS PARA TI'
        }])
      }, 3800)

      // Message 5: Recommendations
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 5,
          sender: 'agent',
          type: 'recommendations',
          content: [
            { title: 'Running', subtitle: 'Rutas al malecón a 2 min caminando.', icon: 'medal' },
            { title: 'Ruta Café', subtitle: '3 cafeterías a menos de 5 min.', icon: 'coffee' },
            { title: 'Coworking', subtitle: 'Abierto 24/7, café ilimitado.', icon: 'wifi' }
          ]
        }])
      }, 4200)

      // Message 6: Final question
      setTimeout(() => {
        setIsTyping(true)
      }, 5400)

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 6,
          sender: 'agent',
          type: 'text',
          content: '¿Quieres conocer más de cerca la habitación y el coworking o prefieres comenzar a explorar los alrededores del hotel?'
        }])
        setIsTyping(false)
        setConversationStep(2)
      }, 6200)
    } else if (conversationStep === 2) {
      // Final step - redirect
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'agent',
          type: 'text',
          content: 'Perfecto, te llevo a ver la habitación.'
        }])
        setIsTyping(false)
        setTimeout(() => {
          router.push('/agente-habitacion')
        }, 1500)
      }, 1000)
    }
  }

  if (view === 'intro') {
    return (
      <div className="h-screen w-full bg-background text-foreground relative overflow-hidden">
        {/* Navigation Menu */}
        <NavMenu />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hotel-acerca.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <div className="text-center space-y-8 max-w-lg mx-auto">
            {/* Logo */}
            <div className="w-48 mx-auto text-white">
              <FullLogo className="w-full h-auto text-white" />
            </div>

            {/* Text */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                Viaja con propósito,<br />
                no solo con itinerario
              </h1>
              <p className="text-white/80 text-sm tracking-widest uppercase font-medium">
                Atmósfera, Carácter, Diseño
              </p>
            </div>

            {/* Mic Button */}
            <div className="pt-12">
              <button
                onClick={handleStartChat}
                className="h-16 w-16 rounded-full bg-[#E8B931] hover:bg-[#E8B931]/90 text-[#003744] flex items-center justify-center mx-auto transition-all hover:scale-110 shadow-lg cursor-pointer"
              >
                <Mic className="h-8 w-8" />
              </button>
              <p className="text-white/60 text-xs mt-4">
                Toca para comenzar
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'chat') {
    return (
      <div className="min-h-dvh flex flex-col bg-background text-foreground">
        {/* Header */}
        <header className="pt-10 pb-16 px-6 flex items-start justify-between max-w-md mx-auto w-full">
          <div className="flex items-center gap-2">
            <FullLogo className="h-24 w-auto" />
          </div>
          <div className="text-right flex flex-col items-end">
            <div
              onClick={() => router.push('/ubicacion')}
              className="flex items-center gap-2 text-xs font-medium text-foreground bg-card/40 px-3 py-1.5 rounded-full border border-border backdrop-blur-sm cursor-pointer hover:bg-card/60 transition-colors group"
            >
              <CloudSun className="h-3.5 w-3.5 text-primary hidden sm:inline" />
              <span>{weather.temp}</span>
              <span className="w-px h-3 bg-border mx-1" />
              <span className="text-[10px] uppercase tracking-wider">Miraflores</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors ml-1" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 capitalize pr-2 hidden sm:block">
              {weather.desc}
            </p>
          </div>
        </header>

        <main className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 pb-8 gap-6">
          {/* Messages */}
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.sender === 'agent' && msg.type === 'text' && (
                  <div className="flex gap-3 items-start max-w-full animate-fade-in-up">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#003744] text-white shadow-md">
                      <Logo className="h-4 w-auto text-white" />
                    </div>
                    <div className="bg-card/60 backdrop-blur-sm rounded-2xl rounded-tl-none px-5 py-3.5 text-sm leading-relaxed shadow-md max-w-[85%]">
                      <div className="text-card-foreground" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>
                  </div>
                )}

                {msg.sender === 'user' && msg.type === 'text' && (
                  <div className="flex justify-end animate-fade-in-up">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-5 py-3.5 text-sm leading-relaxed shadow-md max-w-[85%] font-medium">
                      {msg.content}
                    </div>
                  </div>
                )}

                {msg.type === 'gallery' && (
                  <div className="w-full rounded-2xl overflow-hidden shadow-md bg-card animate-fade-in-up">
                    <div className="aspect-square">
                      <ImageSlider key={`agent-gallery-${msg.id}`} images={msg.content} />
                    </div>
                  </div>
                )}

                {msg.type === 'options' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-2 animate-fade-in-up">
                    {msg.content.map((opt: any) => (
                      <button
                        key={opt.value}
                        onClick={() => handleOptionSelect(opt)}
                        className="flex flex-col items-start p-5 bg-card/60 border-2 border-border/50 rounded-2xl hover:bg-primary/20 hover:border-primary hover:shadow-md transition-all duration-300 text-left group h-full cursor-pointer"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
                          {opt.icon === 'briefcase' && <span className="text-xl">💼</span>}
                          {opt.icon === 'coffee' && <span className="text-xl">☕</span>}
                          {opt.icon === 'compass' && <span className="text-xl">🧭</span>}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-base text-foreground mb-1">{opt.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {opt.value === 'work' && 'Wifi rápido, reuniones y foco.'}
                            {opt.value === 'rest' && 'Relax, silencio y confort.'}
                            {opt.value === 'adventure' && 'Explorar Lima como local.'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {msg.type === 'header' && (
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-6 mb-2 ml-1 animate-fade-in-up">
                    {msg.content}
                  </p>
                )}

                {msg.type === 'room-card' && (
                  <div className="glass-card rounded-2xl overflow-hidden flex flex-col w-full animate-fade-in-up">
                    {/* Room Image */}
                    <div className="relative h-40 bg-gradient-to-br from-secondary/30 to-muted overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${msg.content.image}')` }}
                      />
                      {/* Featured Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <div className="px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm">
                          <p className="text-xs font-bold text-primary-foreground">Destacada</p>
                        </div>
                      </div>
                    </div>

                    {/* Room Info */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-serif text-lg text-foreground">
                          {msg.content.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          Amplias ventanas con vista al océano Pacífico. {msg.content.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="h-3 w-3 fill-primary text-primary" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">(4.9)</span>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Desde</p>
                          <p className="text-xl font-bold text-foreground">{msg.content.price} <span className="font-normal">por noche</span></p>
                        </div>
                        <button className="px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-all hover:scale-105 cursor-pointer flex items-center gap-1">
                          Ver más
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {msg.type === 'recommendations' && (
                  <div className="grid grid-cols-2 gap-3 w-full animate-fade-in-up">
                    {msg.content.map((rec: any, idx: number) => (
                      <div key={idx} className={`bg-card p-4 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow ${idx === 2 ? 'col-span-2' : ''}`}>
                        <div className="mb-3">
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                            {rec.icon === 'medal' && <Medal className="h-5 w-5 text-primary-foreground" />}
                            {rec.icon === 'coffee' && <Coffee className="h-5 w-5 text-primary-foreground" />}
                            {rec.icon === 'wifi' && <Wifi className="h-5 w-5 text-primary-foreground" />}
                          </div>
                        </div>
                        <h4 className="font-bold text-sm text-foreground mb-1">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{rec.subtitle}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-start max-w-full">
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
          </div>

          {/* Chat Input Area - Matching cuenta-tu-plan */}
          <div className="mt-auto space-y-4 animate-fade-in-up">
            <div className="relative">
              <textarea
                className="w-full bg-card/50 border border-border/50 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] resize-none placeholder:text-muted-foreground/50"
                placeholder="Escribe aquí o usa el micrófono..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  onClick={handleSendMessage}
                  className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all cursor-pointer flex items-center justify-center"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all cursor-pointer flex items-center justify-center"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Action Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button className="whitespace-nowrap px-4 py-2 rounded-full bg-card/60 border-2 border-border/50 text-xs font-medium hover:bg-primary/20 hover:border-primary transition-all cursor-pointer">
                Todas las habitaciones
              </button>
              <button className="whitespace-nowrap px-4 py-2 rounded-full bg-card/60 border-2 border-border/50 text-xs font-medium hover:bg-primary/20 hover:border-primary transition-all cursor-pointer">
                Beneficios
              </button>
              <button className="whitespace-nowrap px-4 py-2 rounded-full bg-card/60 border-2 border-border/50 text-xs font-medium hover:bg-primary/20 hover:border-primary transition-all cursor-pointer">
                Rutas
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // This return statement will only be reached if view is neither 'intro' nor 'chat',
  // which shouldn't happen with the current state logic.
  // It's good practice to have a fallback or ensure all states are handled.
  return null;
}