"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bed, Users, Wifi, Square, Star, Calendar, Medal, Coffee, Mic, CloudSun, ChevronRight, Landmark, RollerCoaster, Kayak, Bike } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/humano/Logo"
import { FullLogo } from "@/components/humano/FullLogo"
import { NavMenu } from "@/components/humano/NavMenu"
import { ImageSlider } from "@/components/humano/ImageSlider"

const rooms = [
    {
        name: "Junior Suite Vista Mar",
        description: "Amplias ventanas con vista al océano Pacífico. Ideal para trabajo y descanso.",
        price: 180,
        video: "/bedroom-1.mp4"
    },
    {
        name: "Master Suite",
        description: "Nuestra suite más exclusiva con terraza privada y jacuzzi.",
        price: 320,
        video: "/bedroom-2.mp4"
    },
    {
        name: "Comfort Room",
        description: "Perfecta para estancias cortas. Todo lo esencial con el toque Humano.",
        price: 120,
        video: "/bedroom-3.mp4"
    },
    {
        name: "Family Suite",
        description: "Espacios conectados para familias. Comodidad y privacidad en armonía.",
        price: 240,
        video: "/bedroom-4.mp4"
    }
]

export default function AgentRoomPage() {
    const router = useRouter()
    const [messages, setMessages] = useState<any[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [hasStarted, setHasStarted] = useState(false)
    const [conversationStep, setConversationStep] = useState(0)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const chatSectionRef = useRef<HTMLDivElement>(null)

    // Mock weather data
    const weather = {
        temp: "22°C",
        desc: "cielo nublado brillante",
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (hasStarted) {
            scrollToBottom()
        }
    }, [messages, isTyping, hasStarted])

    // Initial Chat Sequence
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStarted) {
                    setHasStarted(true)
                    startChatSequence()
                }
            },
            { threshold: 0.1 }
        )

        if (chatSectionRef.current) {
            observer.observe(chatSectionRef.current)
        }

        return () => observer.disconnect()
    }, [hasStarted])

    const startChatSequence = () => {
        // Start the sequence
        setIsTyping(true)

        // Message 1: Ideal para descansar...
        setTimeout(() => {
            setMessages([{
                id: 1,
                sender: 'agent',
                type: 'text',
                content: 'Ideal para descansar después de un día de trabajo, pero si quieres estirar un poco el día puedes revisar estas otras ventajas del hotel'
            }])
            setIsTyping(false)
        }, 1000)

        // Message 2: Header Recommendations
        setTimeout(() => {
            setIsTyping(true)
        }, 2000)

        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: 2,
                sender: 'agent',
                type: 'header',
                content: 'OTRAS VENTAJAS RECOMENDADAS PARA TI'
            }])
            setIsTyping(false)
        }, 2500)

        // Message 3: Recommendations Cards
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: 3,
                sender: 'agent',
                type: 'recommendations',
                content: [
                    { title: 'Running', subtitle: 'Abierto 24/7, café ilimitado.', icon: 'medal' },
                    { title: 'Ruta Café', subtitle: '3 cafeterías a menos de 5 min.', icon: 'coffee' },
                    { title: 'Coworking', subtitle: 'Abierto 24/7, café ilimitado.', icon: 'wifi' }
                ]
            }])
        }, 3000)

        // Message 4: Follow up
        setTimeout(() => {
            setIsTyping(true)
        }, 4000)

        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: 4,
                sender: 'agent',
                type: 'text',
                content: 'Creo que esta es una buena opción para tu tipo de viaje y preferencias. Te gustaría conocer más del hotel?'
            }])
            setIsTyping(false)
            setConversationStep(1)
        }, 5000)
    }

    const handleSendMessage = () => {
        if (!inputValue.trim()) return
        const userMsg = { id: Date.now(), sender: 'user', type: 'text', content: inputValue }
        setMessages(prev => [...prev, userMsg])
        setInputValue("")

        if (conversationStep === 1) {
            setIsTyping(true)
            setConversationStep(2)

            // Message 6: Agent Response
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 6,
                    sender: 'agent',
                    type: 'text',
                    content: 'Claro, miraflores es un sitio perfecto para salir a correr y conocer la ciudad. Aquí tienes el detalle de las rutas y distancias'
                }])
                setIsTyping(false)
            }, 1500)

            // Message 7: Map Card
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 7,
                    sender: 'agent',
                    type: 'map-card',
                    content: {
                        title: 'Running por el Malecón',
                        description: 'En el corazón de Miraflores, a pasos del malecón y las mejores vistas del Pacífico. Un punto estratégico donde convergen cultura, gastronomía y vida urbana.'
                    }
                }])
            }, 2500)

            // Message 8: Sneakers
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 8,
                    sender: 'agent',
                    type: 'text',
                    content: 'No olvides tu zapatillas :)'
                }])
            }, 4000)

            // Message 9: Question
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 9,
                    sender: 'agent',
                    type: 'text',
                    content: '¿Te gustaria conocer otras habitaciones disponibles?'
                }])
                setIsTyping(false)
            }, 5500)
        } else if (conversationStep === 2) {
            setIsTyping(true)
            setConversationStep(3)

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 10,
                    sender: 'agent',
                    type: 'text',
                    content: 'Entiendo, aquí tienes los detalles de nuestra habitaciones dispoibles:'
                }])
                setIsTyping(false)
            }, 1500)

            // Message 11: Rooms Carousel
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 11,
                    sender: 'agent',
                    type: 'rooms-carousel',
                    content: rooms
                }])
            }, 2000)

            // Message 12: Facilities Question
            setTimeout(() => {
                setIsTyping(true)
            }, 3000)

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 12,
                    sender: 'agent',
                    type: 'text',
                    content: '¿Te gustaria conocer las instalaciones del Hotel?'
                }])
                setIsTyping(false)
                setConversationStep(3)
            }, 3500)
        } else if (conversationStep === 3) {
            setIsTyping(true)
            setConversationStep(4)

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 13,
                    sender: 'agent',
                    type: 'text',
                    content: 'Adelante, acá tienes una geleria de fotos de los principales ambientes diseñados especialmente para disfrutar de tus dias en Lima:'
                }])
                setIsTyping(false)
            }, 1500)

            // Message 14: Image Gallery
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 14,
                    sender: 'agent',
                    type: 'gallery',
                    content: [
                        { src: "/slider-propuesta-1.jpg", alt: "Restaurante", label: "Restaurante" },
                        { src: "/slider-propuesta-2.jpg", alt: "Piscina", label: "Piscina" },
                        { src: "/slider-propuesta-3.jpg", alt: "Lobby", label: "Lobby & Bar" },
                        { src: "/slider-propuesta-4.jpg", alt: "Rooftop", label: "Rooftop" }
                    ]
                }])
            }, 2000)

            // Message 15: Activities Question
            setTimeout(() => {
                setIsTyping(true)
            }, 3000)

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 15,
                    sender: 'agent',
                    type: 'text',
                    content: 'Tengo recomendaciones adicionales sobre actividades en la zona, ¿te las muestro?'
                }])
                setIsTyping(false)
                setConversationStep(4)
            }, 3500)
        } else if (conversationStep === 4) {
            setIsTyping(true)
            setConversationStep(5)

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 16,
                    sender: 'agent',
                    type: 'recommendations',
                    content: [
                        { title: 'Museo de Arte Contemporáneo', subtitle: 'Arte moderno peruano e internacional', icon: 'landmark' },
                        { title: 'Larcomar', subtitle: 'Centro comercial frente al mar', icon: 'roller-coaster' },
                        { title: 'Escuelas de surf', subtitle: 'Clases para todos los niveles', icon: 'kayak' },
                        { title: 'Bike city tours', subtitle: 'Recorre Lima en bicicleta', icon: 'bike' }
                    ]
                }])
                setIsTyping(false)
            }, 1500)

            // Message 17: Happenings Question
            setTimeout(() => {
                setIsTyping(true)
            }, 2500)

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 17,
                    sender: 'agent',
                    type: 'text',
                    content: 'Tenemos happenings en el hotel. ¿Te los muestro?'
                }])
                setIsTyping(false)
                setConversationStep(5)
            }, 3000)
        } else if (conversationStep === 5) {
            setIsTyping(true)
            setConversationStep(6)

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 18,
                    sender: 'agent',
                    type: 'video',
                    content: 'https://www.youtube.com/embed/U4sMvS0cWjk?start=2'
                }])
                setIsTyping(false)
            }, 1500)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <NavMenu />

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

            {/* Room Details Section */}
            <div className="px-6 space-y-6 max-w-md mx-auto">
                <div className="space-y-2">
                    <h2 className="font-serif text-2xl text-foreground">Junior Suite Vista Mar</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Amplias ventanas con vista al océano Pacífico.
                        Ideal para trabajo y descanso.
                    </p>
                </div>

                {/* Image Slider */}
                <div className="rounded-2xl overflow-hidden aspect-square bg-[#F8D478] relative">
                    {/* Using a placeholder color/text to match the yellow box in the design, 
                         but wrapping ImageSlider if real images were desired. 
                         For now, matching the 'Lobby' yellow box look roughly or using real images.
                         The prompt says "adapta... como la imagen adjunta". 
                         The image shows a yellow box saying "Lobby". 
                         I'll use the ImageSlider with the yellow placeholder style or real images.
                         Let's use real images for better quality, but style it simply.
                     */}
                    <ImageSlider
                        images={[
                            { src: "/slider-propuesta-3.jpg", alt: "Lobby", label: "Lobby" },
                            { src: "/featured-room-propuesta.jpg", alt: "Room", label: "Suite" }
                        ]}
                    />
                </div>
            </div>

            {/* Stats Grid - Dark Background */}
            <div className="mt-8 bg-[#003035] text-[#ECE7D0] p-8">
                <div className="max-w-md mx-auto">
                    <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                <p className="text-3xl font-bold">135</p>
                            </div>
                            <p className="text-xs text-[#ECE7D0]/70 uppercase tracking-wider">Comfort</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-primary" />
                                <p className="text-3xl font-bold">8</p>
                            </div>
                            <p className="text-xs text-[#ECE7D0]/70 uppercase tracking-wider">Familiares</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Bed className="h-4 w-4 text-primary" />
                                <p className="text-3xl font-bold">12</p>
                            </div>
                            <p className="text-xs text-[#ECE7D0]/70 uppercase tracking-wider">Junior Suites</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-primary" />
                                <p className="text-3xl font-bold">1</p>
                            </div>
                            <p className="text-xs text-[#ECE7D0]/70 uppercase tracking-wider">Master Suite</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#ECE7D0]/20 flex items-center gap-3">
                        <Wifi className="h-5 w-5 text-primary" />
                        <p className="text-sm">Wi-Fi y conexión humana incluidas</p>
                    </div>

                    <div className="mt-8 space-y-3">
                        <h3 className="text-xs uppercase tracking-wider text-primary font-bold">DESCRIPCIÓN</h3>
                        <p className="text-[#ECE7D0]/90 text-sm leading-relaxed">
                            Espaciosa suite de 35m² con cama king, área de trabajo dedicada, y vistas panorámicas al océano Pacífico. Diseñada para quienes buscan el equilibrio perfecto entre productividad y descanso.
                        </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-primary">$180</p>
                            <p className="text-xs text-[#ECE7D0]/70">por noche</p>
                        </div>
                        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                            <Calendar className="h-4 w-4 mr-2" />
                            Reservar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Chat Section */}
            <div ref={chatSectionRef} className="px-6 py-8 max-w-md mx-auto space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id}>
                        {msg.sender === 'agent' && msg.type === 'text' && (
                            <div className="flex gap-3 items-start max-w-full animate-fade-in-up">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8B931] text-[#003744] shadow-md font-bold text-xs">
                                    H
                                </div>
                                <div className="bg-white border border-border rounded-2xl rounded-tl-none px-5 py-3.5 text-sm leading-relaxed shadow-sm max-w-[85%]">
                                    <div className="text-foreground">{msg.content}</div>
                                </div>
                            </div>
                        )}

                        {msg.sender === 'user' && msg.type === 'text' && (
                            <div className="flex justify-end animate-fade-in-up">
                                <div className="bg-[#F9EBC8] text-foreground rounded-2xl rounded-tr-none px-5 py-3.5 text-sm leading-relaxed shadow-sm max-w-[85%]">
                                    {msg.content}
                                </div>
                            </div>
                        )}

                        {msg.type === 'header' && (
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mt-6 mb-2 ml-1 animate-fade-in-up">
                                {msg.content}
                            </p>
                        )}

                        {msg.type === 'recommendations' && (
                            <div className="grid grid-cols-2 gap-3 w-full animate-fade-in-up">
                                {msg.content.map((rec: any, idx: number) => (
                                    <div key={idx} className={`bg-card p-4 rounded-2xl border border-border shadow-sm ${idx === 0 ? 'row-span-2' : ''}`}>
                                        <div className="mb-3">
                                            <div className="h-8 w-8 rounded-full bg-transparent border border-primary/20 flex items-center justify-center text-primary">
                                                {rec.icon === 'medal' && <Medal className="h-4 w-4" />}
                                                {rec.icon === 'coffee' && <Coffee className="h-4 w-4" />}
                                                {rec.icon === 'wifi' && <Wifi className="h-4 w-4" />}
                                                {rec.icon === 'landmark' && <Landmark className="h-4 w-4" />}
                                                {rec.icon === 'roller-coaster' && <RollerCoaster className="h-4 w-4" />}
                                                {rec.icon === 'kayak' && <Kayak className="h-4 w-4" />}
                                                {rec.icon === 'bike' && <Bike className="h-4 w-4" />}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-sm text-foreground mb-1">{rec.title}</h4>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed">{rec.subtitle}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {msg.type === 'map-card' && (
                            <div className="w-full animate-fade-in-up space-y-4">
                                <h3 className="font-serif text-xl text-foreground">{msg.content.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {msg.content.description}
                                </p>
                                <div className="w-full aspect-square bg-muted rounded-2xl overflow-hidden shadow-sm">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.713022635406!2d-77.03459192415605!3d-12.126589643486793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c81c205a764d%3A0x2655076d57ac50d4!2sMiraflores%2C%20Lima%2015074!5e0!3m2!1sen!2spe!4v1701394000000!5m2!1sen!2spe"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                        )}

                        {msg.type === 'rooms-carousel' && (
                            <div className="w-full animate-fade-in-up">
                                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4" style={{ scrollbarWidth: "none" }}>
                                    {msg.content.map((room: any, idx: number) => (
                                        <div key={idx} className="flex-shrink-0 w-[85%] snap-start">
                                            {/* Video */}
                                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black mb-3">
                                                <video
                                                    loop
                                                    muted
                                                    playsInline
                                                    autoPlay
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                >
                                                    <source src={room.video} type="video/mp4" />
                                                </video>
                                                <div className="absolute inset-0 bg-black/20" />
                                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                                    <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center">
                                                        <div className="w-0 h-0 border-t-6 border-t-transparent border-l-10 border-l-white border-b-6 border-b-transparent ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Content */}
                                            <div className="space-y-2">
                                                <h3 className="font-serif text-lg text-foreground">{room.name}</h3>
                                                <p className="text-xs text-muted-foreground leading-relaxed">{room.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {msg.type === 'gallery' && (
                            <div className="w-full rounded-2xl overflow-hidden shadow-md bg-card animate-fade-in-up">
                                <div className="aspect-square">
                                    <ImageSlider key={`gallery-${msg.id}`} images={msg.content} />
                                </div>
                            </div>
                        )}

                        {msg.type === 'video' && (
                            <div className="w-full rounded-2xl overflow-hidden shadow-md bg-card animate-fade-in-up">
                                <div className="aspect-video">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={msg.content}
                                        title="Hotel Happenings"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3 items-start max-w-full">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8B931] text-[#003744] shadow-md font-bold text-xs">
                            H
                        </div>
                        <div className="bg-white border border-border rounded-2xl rounded-tl-none px-5 py-3.5 flex gap-1 items-center shadow-sm">
                            <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/50">
                <div className="max-w-md mx-auto relative">
                    <textarea
                        className="w-full bg-card border border-border/50 rounded-2xl p-4 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px] resize-none placeholder:text-muted-foreground/50"
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
                        <button className="h-10 w-10 rounded-full bg-[#E8B931] text-[#003744] hover:scale-105 transition-all cursor-pointer flex items-center justify-center">
                            <Mic className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleSendMessage}
                            className="h-10 w-10 rounded-full bg-[#E8B931] text-[#003744] hover:scale-105 transition-all cursor-pointer flex items-center justify-center"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
