"use client"

import { useEffect, useState } from "react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

const images = ["Malecón", "Vista Mar", "Atardecer"]

export function ScrollGallery() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const { ref, inView } = useScrollAnimation()

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, 4000) // Change image every 4 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <section ref={ref} className="relative bg-background py-24">
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Text */}
                    <div className="space-y-6 max-w-lg">
                        <p className={`text-xs uppercase tracking-wider text-primary font-bold ${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0s" }}>
                            La Experiencia Humano
                        </p>
                        <h2 className={`text-3xl sm:text-4xl font-serif leading-tight text-foreground ${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0.15s" }}>
                            Ubicación Privilegiada
                        </h2>
                        <p className={`text-base text-muted-foreground leading-relaxed ${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0.3s" }}>
                            En el corazón de Miraflores, a pasos del malecón y las mejores vistas del Pacífico.
                            Un punto estratégico donde convergen cultura, gastronomía y vida urbana.
                        </p>
                    </div>

                    {/* Right - Image Slider */}
                    <div className={`relative ${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0.45s" }}>
                        <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 bg-muted flex items-center justify-center transition-opacity duration-700 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                                        }`}
                                >
                                    <p className="text-4xl font-serif text-muted-foreground/30">
                                        {image}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Dots */}
                        <div className={`flex justify-center gap-2 mt-6 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0.6s" }}>
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all cursor-pointer ${index === currentIndex
                                        ? 'w-8 bg-primary'
                                        : 'w-2 bg-foreground/30 hover:bg-foreground/50'
                                        }`}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
