"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Star, Calendar, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AssistantBubble } from "@/components/humano/AssistantBubble"

export default function RecomendadoPage() {
    const router = useRouter()

    return (
        <div className="min-h-dvh flex flex-col bg-background text-foreground">
            {/* Back Button - Floating like menu button on home */}
            <button
                onClick={() => router.back()}
                className="fixed top-3 left-3 sm:top-6 sm:left-6 z-50 h-10 w-10 rounded-full bg-card/40 backdrop-blur-sm border border-border hover:bg-card/60 transition-all hover:scale-105 flex items-center justify-center cursor-pointer"
            >
                <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>

            {/* Header - Consistent with home */}
            <header className="pt-16 sm:pt-24 pb-6 px-6 flex flex-col items-center">
                <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold mb-1">Hotel</p>
                <h1 className="text-2xl font-serif tracking-wider text-foreground">HUMANO</h1>
            </header>

            <main className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 pb-8 gap-8">
                <AssistantBubble
                    message="Basado en lo que me cuentas, he preparado esto para ti. Una habitación tranquila y una ruta de café para tus mañanas."
                    className="animate-fade-in-up"
                />

                {/* Room Recommendation */}
                <section className="space-y-3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
                        Habitación Sugerida
                    </h3>
                    <div className="glass-card rounded-2xl overflow-hidden group cursor-pointer transition-all hover:border-primary/30">
                        <div className="h-40 bg-muted relative">
                            {/* Placeholder for room image */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <div>
                                    <h4 className="text-lg font-serif text-white">Junior Suite Vista Mar</h4>
                                    <p className="text-xs text-white/80">Ideal para trabajo y relax</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-primary" />
                                    <span>King Size</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Check className="h-3 w-3 text-primary" />
                                    <span>Escritorio amplio</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <div className="text-lg font-semibold">$180 <span className="text-xs font-normal text-muted-foreground">/ noche</span></div>
                                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
                                    Reservar
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Itinerary / Spaces */}
                <section className="space-y-3 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
                        Espacios para ti
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="glass-card p-3 rounded-xl space-y-2">
                            <div className="h-8 w-8 rounded-full bg-secondary/50 flex items-center justify-center text-primary">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <p className="font-medium text-sm">Coworking</p>
                            <p className="text-xs text-muted-foreground">Abierto 24/7, café ilimitado.</p>
                        </div>
                        <div className="glass-card p-3 rounded-xl space-y-2">
                            <div className="h-8 w-8 rounded-full bg-secondary/50 flex items-center justify-center text-primary">
                                <Calendar className="h-4 w-4" />
                            </div>
                            <p className="font-medium text-sm">Ruta Café</p>
                            <p className="text-xs text-muted-foreground">3 cafeterías a menos de 5 min.</p>
                        </div>
                    </div>
                </section>

                <div className="h-8" /> {/* Spacer */}
            </main>
        </div>
    )
}
