"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const images = [
    "/images/lobby.jpg",
    "/images/rooftop.jpg",
    "/images/pool.jpg",
    "/images/restaurant.jpg"
]

// Slide backgrounds with brand colors
const imagePlaceholders = [
    { color: "bg-primary", label: "Lobby" },                    // Amarillo
    { color: "bg-muted", label: "Rooftop" },                    // Gris
    { color: "bg-primary", label: "Piscina" },                  // Amarillo
    { color: "bg-muted", label: "Restaurante" }                 // Gris
]

interface ImageSliderProps {
    images?: { src: string, alt: string, label?: string }[]
}

export function ImageSlider({ images }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Use provided images or fallback to placeholders
    const items = images || imagePlaceholders
    const isCustomImages = !!images

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [items.length])

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length)
    }

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    }

    return (
        <div className="relative h-full rounded-2xl overflow-hidden group">
            {/* Images */}
            <div className="relative h-full">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-700",
                            !isCustomImages && (item as any).color,
                            index === currentIndex ? "opacity-100" : "opacity-0"
                        )}
                    >
                        {isCustomImages ? (
                            <>
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url('${(item as any).src}')` }}
                                />
                                {/* Gradient Overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Label */}
                                {(item as any).label && (
                                    <div className="absolute inset-0 flex items-end justify-center pb-12">
                                        <p className="text-white text-lg font-serif tracking-wide drop-shadow-md">
                                            {(item as any).label}
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-foreground/40 text-lg font-serif">{(item as any).label}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={goToPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/60 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-card/80"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/60 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-card/80"
            >
                <ChevronRight className="h-4 w-4" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={cn(
                            "h-1.5 rounded-full transition-all cursor-pointer",
                            index === currentIndex
                                ? "w-6 bg-primary"
                                : "w-1.5 bg-foreground/30 hover:bg-foreground/50"
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
