"use client"

import { useState } from "react"
import { X, Menu, Facebook, Instagram, Linkedin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const menuItems = [
    { label: "Propuesta", href: "/propuesta" },
    { label: "Propuesta 2", href: "/propuesta-2" },
    { label: "Propuesta 3", href: "/propuesta-3" },
    { label: "Agente", href: "/agente" },
    { label: "Inicio", href: "/inicio" },
    { label: "Hotel", href: "#hotel" },
    { label: "Habitaciones", href: "#habitaciones" },
    { label: "Reserva", href: "#reserva" },
    { label: "Turismo", href: "#turismo" },
    { label: "Gastronomía", href: "#gastronomia" },
    { label: "Contacto", href: "#contacto" },
]

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function NavMenu() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Menu Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="fixed top-3 left-3 sm:top-6 sm:left-6 z-50 h-10 w-10 rounded-full bg-card/40 backdrop-blur-sm border border-border hover:bg-card/60 transition-all hover:scale-105 cursor-pointer"
            >
                <Menu className="h-5 w-5 text-foreground" />
                <span className="sr-only">Abrir menú</span>
            </Button>

            {/* Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-background/95 backdrop-blur-md z-50 transition-opacity duration-500",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Menu */}
            <div
                className={cn(
                    "fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-[hsl(var(--sidebar-bg))] z-50 transition-transform duration-500 ease-in-out shadow-2xl",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full p-8">
                    {/* Close Button */}
                    <div className="flex justify-between items-center mb-12">
                        <div className="space-y-1">
                            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold">
                                Hotel
                            </p>
                            <h2 className="text-2xl font-serif tracking-wider text-[hsl(var(--sidebar-text))]">HUMANO</h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 rounded-full hover:bg-[hsl(var(--sidebar-text))]/10 text-[hsl(var(--sidebar-text))]"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Cerrar menú</span>
                        </Button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item, index) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "block py-3 px-4 text-lg font-medium text-[hsl(var(--sidebar-text))]/80 hover:text-[hsl(var(--sidebar-text))] hover:bg-[hsl(var(--sidebar-text))]/10 rounded-lg transition-all duration-300 hover:translate-x-2",
                                    "animate-fade-in-up"
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Social Links */}
                    <div className="border-t border-[hsl(var(--sidebar-text))]/20 pt-6">
                        <p className="text-xs uppercase tracking-widest text-[hsl(var(--sidebar-text))]/60 mb-4">
                            Síguenos
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-10 w-10 rounded-full bg-[hsl(var(--sidebar-text))]/5 border border-[hsl(var(--sidebar-text))]/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all hover:scale-110"
                                    >
                                        <Icon className="h-4 w-4 text-[hsl(var(--sidebar-text))]" />
                                        <span className="sr-only">{social.label}</span>
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
