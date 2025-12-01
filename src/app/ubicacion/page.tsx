"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Clock, Plane, Phone, Mail, Thermometer, Cloud } from "lucide-react"
import { FullLogo } from "@/components/humano/FullLogo"

export default function UbicacionPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="fixed top-3 left-3 sm:top-6 sm:left-6 z-50 h-10 w-10 rounded-full bg-card/40 backdrop-blur-sm border border-border hover:bg-card/60 transition-all hover:scale-105 flex items-center justify-center cursor-pointer"
            >
                <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 min-h-screen">
                {/* Left Column */}
                <div className="flex flex-col p-6 sm:p-12 gap-8 lg:h-screen lg:overflow-y-auto">
                    {/* Header */}
                    <header className="pt-12 sm:pt-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                        <p className="text-xs tracking-[0.3em] uppercase text-primary font-bold mb-4">Ubicación</p>
                        <FullLogo className="h-32 w-auto mb-4" />
                        <p className="text-sm text-muted-foreground">Miraflores, Lima - Perú</p>
                    </header>

                    {/* Info Cards Grid */}
                    <div className="grid sm:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        {/* Weather Card */}
                        <div className="glass-card p-6 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <Thermometer className="h-5 w-5" />
                                <span className="text-xs font-bold uppercase tracking-wider">Clima Actual</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-bold">22°C</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Cloud className="h-4 w-4" />
                                    Parcialmente nublado
                                </p>
                            </div>
                        </div>

                        {/* Address Card */}
                        <div className="glass-card p-6 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <MapPin className="h-5 w-5" />
                                <span className="text-xs font-bold uppercase tracking-wider">Dirección</span>
                            </div>
                            <p className="text-sm leading-relaxed">
                                Av. José Larco 1301<br />
                                Miraflores, Lima 15074
                            </p>
                        </div>

                        {/* Airport Distance Card */}
                        <div className="glass-card p-6 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <Plane className="h-5 w-5" />
                                <span className="text-xs font-bold uppercase tracking-wider">Desde Aeropuerto</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold">35 min</p>
                                <p className="text-sm text-muted-foreground">25 km aprox.</p>
                            </div>
                        </div>

                        {/* Local Time Card */}
                        <div className="glass-card p-6 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <Clock className="h-5 w-5" />
                                <span className="text-xs font-bold uppercase tracking-wider">Horario</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold">Check-in 3pm</p>
                                <p className="text-sm text-muted-foreground">Check-out 12pm</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="glass-card p-6 rounded-2xl space-y-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Contacto</h3>
                        <div className="space-y-3">
                            <a href="tel:+51123456789" className="flex items-center gap-3 text-sm hover:text-primary transition-colors cursor-pointer group">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Phone className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">+51 1 234 5678</p>
                                    <p className="text-xs text-muted-foreground">Llámanos 24/7</p>
                                </div>
                            </a>
                            <a href="mailto:hola@humanohotel.com" className="flex items-center gap-3 text-sm hover:text-primary transition-colors cursor-pointer group">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Mail className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">hola@humanohotel.com</p>
                                    <p className="text-xs text-muted-foreground">Respuesta en 24h</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Video Section */}
                    <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Conoce Humano</h3>
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                            >
                                <source src="/hotel-acerca.mp4" type="video/mp4" />
                            </video>
                        </div>
                    </div>

                    {/* Spacer for mobile */}
                    <div className="h-4 lg:hidden"></div>
                </div>

                {/* Right Column - Map */}
                <div className="relative h-[50vh] lg:h-screen bg-muted/30 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    {/* Google Maps */}
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.713022635406!2d-77.03459192415605!3d-12.126589643486793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c81c205a764d%3A0x2655076d57ac50d4!2sAv.%20Jos%C3%A9%20Larco%201301%2C%20Miraflores%2015074!5e0!3m2!1sen!2spe!4v1701394000000!5m2!1sen!2spe"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </div>
    )
}
