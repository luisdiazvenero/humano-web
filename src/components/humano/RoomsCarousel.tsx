"use client"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

const rooms = [
    {
        name: "Junior Suite Vista Mar",
        description: "Amplias ventanas con vista al océano Pacífico. Ideal para trabajo y descanso.",
        size: "35m²",
        capacity: "2 personas",
        price: 180,
        rating: 4.9,
        featured: true,
        video: "/bedroom-1.mp4"
    },
    {
        name: "Master Suite",
        description: "Nuestra suite más exclusiva con terraza privada y jacuzzi. Lujo sin comparación.",
        size: "65m²",
        capacity: "2-4 personas",
        price: 320,
        rating: 5.0,
        featured: false,
        video: "/bedroom-2.mp4"
    },
    {
        name: "Comfort Room",
        description: "Perfecta para estancias cortas. Todo lo esencial con el toque Humano.",
        size: "25m²",
        capacity: "1-2 personas",
        price: 120,
        rating: 4.7,
        featured: false,
        video: "/bedroom-3.mp4"
    },
    {
        name: "Family Suite",
        description: "Espacios conectados para familias. Comodidad y privacidad en armonía.",
        size: "50m²",
        capacity: "4-5 personas",
        price: 240,
        rating: 4.8,
        featured: false,
        video: "/bedroom-4.mp4"
    }
]

export function RoomsCarousel() {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollRef = useRef<HTMLDivElement>(null)
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
    const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
    const hasMovedRef = useRef(false)
    const { ref, inView } = useScrollAnimation()

    const scrollToIndex = (index: number) => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.children[0]?.getBoundingClientRect().width || 0;
            const gap = 24; // gap-6 is 24px

            scrollRef.current.scrollTo({
                left: (cardWidth + gap) * index,
                behavior: "smooth"
            })
            setCurrentIndex(index)
        }
    }

    const goToNext = () => {
        const nextIndex = (currentIndex + 1) % rooms.length
        scrollToIndex(nextIndex)
    }

    const goToPrev = () => {
        const prevIndex = (currentIndex - 1 + rooms.length) % rooms.length
        scrollToIndex(prevIndex)
    }

    const handlePointerDown = (e: React.PointerEvent) => {
        pointerStartRef.current = { x: e.clientX, y: e.clientY }
        hasMovedRef.current = false
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (pointerStartRef.current) {
            const deltaX = Math.abs(e.clientX - pointerStartRef.current.x)
            const deltaY = Math.abs(e.clientY - pointerStartRef.current.y)
            if (deltaX > 10 || deltaY > 10) {
                hasMovedRef.current = true
            }
        }
    }

    const handleCardClick = (e: React.MouseEvent) => {
        if (hasMovedRef.current) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            router.push('/habitacion')
        }
    }

    // Control video playback when currentIndex changes
    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (video) {
                if (index === currentIndex) {
                    video.play().catch(() => {
                        // Ignore autoplay errors
                    })
                } else {
                    video.pause()
                }
            }
        })
    }, [currentIndex])

    // Track manual scroll to update currentIndex
    useEffect(() => {
        const scrollContainer = scrollRef.current
        if (!scrollContainer) return

        const handleScroll = () => {
            const cardWidth = scrollContainer.children[0]?.getBoundingClientRect().width || 0
            const gap = 24
            const scrollLeft = scrollContainer.scrollLeft
            const newIndex = Math.round(scrollLeft / (cardWidth + gap))

            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < rooms.length) {
                setCurrentIndex(newIndex)
            }
        }

        scrollContainer.addEventListener('scroll', handleScroll)
        return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }, [currentIndex])

    return (
        <section ref={ref} className="relative bg-background py-24 overflow-hidden">
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                {/* Header - 2 columns */}
                <div className="grid lg:grid-cols-2 gap-12 mb-12">
                    {/* Left Column */}
                    <div className="space-y-3">
                        <p className={`text - xs uppercase tracking - wider text - primary font - bold ${inView ? 'animate-fade-in-up' : 'opacity-0'} `} style={{ animationDelay: "0s" }}>
                            Nuestras Habitaciones
                        </p>
                        <h2 className={`text - 3xl sm: text - 4xl font - serif leading - tight text - foreground ${inView ? 'animate-fade-in-up' : 'opacity-0'} `} style={{ animationDelay: "0.15s" }}>
                            Encuentra tu espacio ideal
                        </h2>
                    </div>
                    {/* Right Column */}
                    <div className="flex items-end">
                        <p className={`text - base text - muted - foreground leading - relaxed ${inView ? 'animate-fade-in-up' : 'opacity-0'} `} style={{ animationDelay: "0.3s" }}>
                            Cada habitación está diseñada para diferentes necesidades. Desde el viajero solo
                            hasta familias completas, encuentra el espacio perfecto para tu estadía.
                        </p>
                    </div>
                </div>

                {/* Carousel */}
                <div className={`relative ${inView ? 'animate-fade-in-up' : 'opacity-0'} `} style={{ animationDelay: "0.5s" }}>
                    {/* Cards Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
                        style={{ scrollbarWidth: "none" }}
                    >
                        {rooms.map((room, index) => (
                            <div
                                key={index}
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onClick={handleCardClick}
                                className="flex-shrink-0 w-[90%] lg:w-[60%] snap-start cursor-pointer group"
                            >
                                {/* Video with Play Icon */}
                                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-black mb-6">
                                    {/* Video Background */}
                                    <video
                                        ref={(el) => { videoRefs.current[index] = el }}
                                        loop
                                        muted
                                        playsInline
                                        autoPlay={index === currentIndex}
                                        onMouseEnter={(e) => e.currentTarget.play()}
                                        onMouseLeave={(e) => {
                                            if (index !== currentIndex) {
                                                e.currentTarget.pause()
                                            }
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%) scale(1.1)',
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    >
                                        <source src={room.video} type="video/mp4" />
                                    </video>

                                    {/* Dark Overlay */}
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                                    {/* Play Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-14 border-l-white border-b-8 border-b-transparent ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <h3 className="text-2xl sm:text-3xl font-serif text-foreground group-hover:text-primary transition-colors">
                                        {room.name}
                                    </h3>
                                    <p className="text-base text-muted-foreground leading-relaxed">
                                        {room.description}
                                    </p>
                                    <button className="text-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        Ver caso
                                        <span className="text-xs">→</span>
                                    </button>

                                    {/* Navigation Controls - Only show for first card */}
                                    {index === currentIndex && (
                                        <div className="flex items-center gap-4 pt-4">
                                            {/* Arrows */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        goToPrev()
                                                    }}
                                                    className="h-10 w-10 rounded-full bg-card/60 backdrop-blur-sm border border-border hover:bg-card/80 transition-all flex items-center justify-center group/btn cursor-pointer"
                                                >
                                                    <ChevronLeft className="h-4 w-4 text-foreground group-hover/btn:text-primary" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        goToNext()
                                                    }}
                                                    className="h-10 w-10 rounded-full bg-card/60 backdrop-blur-sm border border-border hover:bg-card/80 transition-all flex items-center justify-center group/btn cursor-pointer"
                                                >
                                                    <ChevronRight className="h-4 w-4 text-foreground group-hover/btn:text-primary" />
                                                </button>
                                            </div>

                                            {/* Dots */}
                                            <div className="flex gap-2">
                                                {rooms.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            scrollToIndex(idx)
                                                        }}
                                                        className={cn(
                                                            "h-2 rounded-full transition-all cursor-pointer",
                                                            idx === currentIndex
                                                                ? "w-8 bg-primary"
                                                                : "w-2 bg-foreground/30 hover:bg-foreground/50"
                                                        )}
                                                    ></button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
