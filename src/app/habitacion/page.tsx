"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Bed, Users, Wifi, Square, Star, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HabitacionPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-background">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="fixed top-3 left-3 sm:top-6 sm:left-6 z-50 h-10 w-10 rounded-full bg-card/40 backdrop-blur-sm border border-border hover:bg-card/60 transition-all hover:scale-105 flex items-center justify-center cursor-pointer"
            >
                <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 min-h-screen">
                {/* Left Column - Info Panel */}
                <div className="bg-[#003035] dark:bg-[#003035] text-[#ECE7D0] p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="max-w-lg mx-auto w-full space-y-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                        {/* Logo */}
                        <div className="mb-8">
                            <div className="h-12 w-12 border-2 border-primary rounded-md flex items-center justify-center mb-4">
                                <span className="text-primary font-serif text-2xl font-bold">H</span>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <p className="text-primary text-xs uppercase tracking-wider font-bold">Junior Suite</p>
                            <h1 className="text-4xl sm:text-5xl font-serif">
                                Descanso con<br />Personalidad
                            </h1>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Bed className="h-4 w-4 text-primary" />
                                    <p className="text-3xl font-bold">197</p>
                                </div>
                                <p className="text-sm text-[#ECE7D0]/70">Habitaciones</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Square className="h-4 w-4 text-primary" />
                                    <p className="text-3xl font-bold">3</p>
                                </div>
                                <p className="text-sm text-[#ECE7D0]/70">Accessible Rooms</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-primary" />
                                    <p className="text-3xl font-bold">135</p>
                                </div>
                                <p className="text-sm text-[#ECE7D0]/70">Comfort</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-primary" />
                                    <p className="text-3xl font-bold">8</p>
                                </div>
                                <p className="text-sm text-[#ECE7D0]/70">Familiares</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Bed className="h-4 w-4 text-primary" />
                                    <p className="text-3xl font-bold">12</p>
                                </div>
                                <p className="text-sm text-[#ECE7D0]/70">Junior Suites</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-primary" />
                                    <p className="text-3xl font-bold">1</p>
                                </div>
                                <p className="text-sm text-[#ECE7D0]/70">Master Suite</p>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="pt-6 border-t border-[#ECE7D0]/20">
                            <div className="flex items-center gap-3">
                                <Wifi className="h-5 w-5 text-primary" />
                                <p className="text-sm">Wi-Fi y conexión humana incluidas</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3 pt-4">
                            <h3 className="text-sm uppercase tracking-wider text-primary font-bold">Descripción</h3>
                            <p className="text-[#ECE7D0]/90 leading-relaxed">
                                Espaciosa suite de 35m² con cama king, área de trabajo dedicada, y vistas panorámicas al océano Pacífico.
                                Diseñada para quienes buscan el equilibrio perfecto entre productividad y descanso.
                            </p>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between pt-6">
                            <div>
                                <p className="text-4xl font-bold text-primary">$180</p>
                                <p className="text-sm text-[#ECE7D0]/70">por noche</p>
                            </div>
                            <Button
                                size="lg"
                                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                            >
                                <Calendar className="h-4 w-4 mr-2" />
                                Reservar
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Image */}
                <div className="relative min-h-[50vh] lg:min-h-screen bg-gradient-to-br from-secondary/30 to-muted animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    {/* Image Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-muted-foreground/40 text-lg font-serif">Junior Suite Vista Mar</p>
                    </div>
                    {/* 
                    Replace with actual image:
                    <img
                        src="/images/junior-suite.jpg"
                        alt="Junior Suite"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    */}
                </div>
            </div>
        </div>
    )
}
