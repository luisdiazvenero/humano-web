"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AssistantBubble } from "@/components/humano/AssistantBubble"
import { VoiceInput } from "@/components/humano/VoiceInput"
import { useSpeech } from "@/hooks/useSpeech"

function CuentaTuPlanContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const intent = searchParams.get("intent")
    const [step, setStep] = useState(0)
    const [userInput, setUserInput] = useState("")

    const speech: any = useSpeech?.() ?? {}
    const transcript: string = speech.transcript ?? ""
    const isListening: boolean = speech.isListening ?? false
    const startListening = speech.startListening ?? (() => { })
    const stopListening = speech.stopListening ?? (() => { })

    const handleMicToggle = () => {
        if (isListening) stopListening()
        else startListening()
    }

    const getInitialMessage = () => {
        const modeLabels: Record<string, string> = {
            work: "modo trabajo",
            rest: "modo descanso",
            adventure: "modo aventura"
        }

        const modeLabel = intent && modeLabels[intent as keyof typeof modeLabels]

        switch (intent) {
            case "work":
                return (
                    <>
                        Entendido, <span className="bg-primary text-[#003035] font-bold text-[1.05rem] px-2 py-0.5 rounded font-serif">{modeLabel}</span>. ¿Cuántos días te quedas y qué necesitas para ser productivo?
                    </>
                )
            case "rest":
                return (
                    <>
                        Perfecto, <span className="bg-primary text-[#003035] font-bold text-[1.05rem] px-2 py-0.5 rounded font-serif">{modeLabel}</span>. ¿Vienes solo/a o acompañado/a? ¿Alguna preferencia para tu habitación?
                    </>
                )
            case "adventure":
                return (
                    <>
                        ¡Excelente! <span className="bg-primary text-[#003035] font-bold text-[1.05rem] px-2 py-0.5 rounded font-serif">{modeLabel}</span>. Lima tiene mucho por ver. ¿Cuánto tiempo tienes para explorar?
                    </>
                )
            default:
                return "¿Cuéntame un poco más sobre tu viaje?"
        }
    }

    const handleContinue = () => {
        router.push("/recomendado")
    }

    const handleChipClick = (chipText: string) => {
        setUserInput(chipText)
    }

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

            <main className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 pb-8 gap-6">
                <AssistantBubble
                    message={getInitialMessage()}
                    className="animate-fade-in-up"
                />

                {/* Chat Input Area */}
                <div className="mt-auto space-y-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <div className="relative">
                        <textarea
                            className="w-full bg-card/50 border border-border/50 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] resize-none placeholder:text-muted-foreground/50"
                            placeholder="Escribe aquí o usa el micrófono..."
                            value={userInput || transcript}
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                        <div className="absolute bottom-3 right-3 flex gap-2">
                            <VoiceInput
                                isListening={isListening}
                                onToggle={handleMicToggle}
                                size="small"
                            />
                            <Button
                                size="icon"
                                className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all cursor-pointer"
                                onClick={handleContinue}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {["Solo 24 horas", "3 días", "Necesito escritorio", "Vista al mar"].map((chip) => (
                            <button
                                key={chip}
                                onClick={() => handleChipClick(chip)}
                                className="whitespace-nowrap px-4 py-2 rounded-full bg-card/60 border-2 border-border/50 text-xs font-medium hover:bg-primary/20 hover:border-primary transition-all cursor-pointer"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function CuentaTuPlanPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Cargando...</div>}>
            <CuentaTuPlanContent />
        </Suspense>
    )
}
