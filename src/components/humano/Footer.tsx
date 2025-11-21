"use client"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

export function Footer() {
    const { ref, inView } = useScrollAnimation()

    return (
        <footer ref={ref} className="relative bg-background border-t border-border/50">
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                {/* Main Footer Content */}
                <div className="py-16 relative">
                    {/* Top Section with Tagline and Links */}
                    <div className="flex flex-col lg:flex-row justify-between items-start mb-20 gap-8">
                        {/* Left - Tagline */}
                        <div className="lg:w-1/4">
                            <p className={`text-sm text-muted-foreground ${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0s" }}>
                                Hospitalidad consciente
                            </p>
                        </div>

                        {/* Right - Link Columns */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-16">
                            {/* Hotel Column */}
                            <div className={`${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0.15s" }}>
                                <h3 className="text-sm font-bold mb-4 text-foreground">Hotel</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            Habitaciones
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            Ubicación
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            Galería
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            Reservar
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Servicios Column */}
                            <div className={`${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0.25s" }}>
                                <h3 className="text-sm font-bold mb-4 text-foreground">Servicios</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            Restaurante
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            Concierge
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            Eventos
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            Experiencias
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Contacto Column */}
                            <div className={`${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0.35s" }}>
                                <h3 className="text-sm font-bold mb-4 text-foreground">Contacto</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            Nosotros
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            Blog
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            Trabaja con nosotros
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            Contacto
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Center - Large Logo */}
                    <div className={`flex items-center justify-center mb-16 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0.5s" }}>
                        <h1 className="text-[10rem] sm:text-[12rem] lg:text-[16rem] font-serif leading-none tracking-tighter text-foreground">
                            Humano
                        </h1>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={`border-t border-border/50 py-6 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0.65s" }}>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Left - Brand */}
                        <p className="text-sm text-muted-foreground">
                            Hotel Humano
                        </p>

                        {/* Right - Legal Links */}
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                                Sobre Humano
                            </a>
                            <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                                Privacidad
                            </a>
                            <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                                Términos
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
