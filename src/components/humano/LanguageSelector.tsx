"use client"

import { useState } from "react"
import { Globe, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const languages = [
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
]

export function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedLang, setSelectedLang] = useState("es")

    const currentLanguage = languages.find(lang => lang.code === selectedLang)

    const handleSelectLanguage = (code: string) => {
        setSelectedLang(code)
        setIsOpen(false)
    }

    return (
        <>
            {/* Trigger Button - Fixed Position */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-3 right-3 sm:top-6 sm:right-6 z-50 flex items-center gap-2 h-10 w-10 rounded-full bg-card/40 backdrop-blur-sm border border-border hover:bg-card/60 transition-all hover:scale-105 justify-center cursor-pointer"
            >
                <Globe className="h-5 w-5 text-foreground" />
                <span className="sr-only">Seleccionar idioma</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="fixed top-20 right-6 w-48 bg-[#ECE7D0] rounded-xl shadow-2xl border border-[#003035]/20 overflow-hidden z-50 animate-fade-in-up">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleSelectLanguage(lang.code)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer",
                                    selectedLang === lang.code
                                        ? "bg-[#003035]/10 text-[#003035]"
                                        : "text-[#003035]/80 hover:bg-[#003035]/5 hover:text-[#003035]"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{lang.flag}</span>
                                    <span className="text-sm font-medium">{lang.label}</span>
                                </div>
                                {selectedLang === lang.code && (
                                    <Check className="h-4 w-4 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}
