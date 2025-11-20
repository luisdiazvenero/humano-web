"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CloudSun, ChevronRight } from "lucide-react"

import { AssistantBubble } from "@/components/humano/AssistantBubble"
import { IntentSelector, IntentId } from "@/components/humano/IntentSelector"
import { VoiceInput } from "@/components/humano/VoiceInput"
import { NavMenu } from "@/components/humano/NavMenu"
import { LanguageSelector } from "@/components/humano/LanguageSelector"
import { ThemeToggle } from "@/components/humano/ThemeToggle"
import { useSpeech } from "@/hooks/useSpeech"

export default function Home() {
  const router = useRouter()
  const [intent, setIntent] = useState<IntentId | null>(null)

  // Mock weather data
  const weather = {
    temp: "22°C",
    desc: "cielo nublado brillante",
  }

  const speech: any = useSpeech?.() ?? {}
  const transcript: string = speech.transcript ?? ""
  const isListening: boolean = speech.isListening ?? false
  const startListening = speech.startListening ?? (() => { })
  const stopListening = speech.stopListening ?? (() => { })

  const handleMicToggle = () => {
    if (isListening) stopListening()
    else startListening()
  }

  const handleIntentSelect = (selected: IntentId) => {
    setIntent(selected)
    // Small delay for visual feedback before navigation
    setTimeout(() => {
      router.push(`/cuenta-tu-plan?intent=${selected}`)
    }, 600)
  }

  // Auto-navigate if voice transcript detects keywords (mock logic)
  useEffect(() => {
    if (!isListening && transcript) {
      const lower = transcript.toLowerCase()
      if (lower.includes("trabajo")) handleIntentSelect("work")
      else if (lower.includes("descanso")) handleIntentSelect("rest")
      else if (lower.includes("aventura")) handleIntentSelect("adventure")
    }
  }, [isListening, transcript])

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground relative overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Navigation Menu */}
      <NavMenu />

      {/* Language Selector */}
      <LanguageSelector />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col px-6 pt-16 sm:pt-8 pb-8 gap-8 max-w-screen-sm mx-auto w-full">
        {/* HEADER */}
        <header className="flex items-start justify-between animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold">
              Hotel
            </p>
            <h1 className="text-2xl font-serif tracking-wider text-foreground">HUMANO</h1>
          </div>
          <div className="text-right flex flex-col items-end">
            <div
              onClick={() => router.push('/ubicacion')}
              className="flex items-center gap-2 text-xs font-medium text-foreground bg-card/40 px-3 py-1.5 rounded-full border border-border backdrop-blur-sm cursor-pointer hover:bg-card/60 transition-colors group"
            >
              <CloudSun className="h-3.5 w-3.5 text-primary hidden sm:inline" />
              <span>{weather.temp}</span>
              <span className="w-px h-3 bg-border mx-1" />
              <span className="text-[10px] uppercase tracking-wider">Miraflores</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors ml-1" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 capitalize pr-2 hidden sm:block">
              {weather.desc}
            </p>
          </div>
        </header>

        {/* CONVERSATION AREA */}
        <section className="flex-1 flex flex-col justify-center gap-8">
          <div className="space-y-6">
            <AssistantBubble
              message="Hola, soy tu anfitrión en Humano, Miraflores."
              className="animate-fade-in-up"
              style={{ animationDelay: "0.4s" } as React.CSSProperties}
            />
            <AssistantBubble
              message="¿Vienes por trabajo, descanso o aventura?"
              className="animate-fade-in-up"
              style={{ animationDelay: "0.7s" } as React.CSSProperties}
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "1.0s" }}>
            <IntentSelector
              selectedIntent={intent}
              onSelect={handleIntentSelect}
            />
          </div>
        </section>

        {/* VOICE INPUT */}
        <section className="flex flex-col items-center gap-4 pb-8 animate-fade-in-up" style={{ animationDelay: "1.3s" }}>
          <p className="text-xs text-center text-muted-foreground">
            O cuéntame tu plan libremente
          </p>

          <div className="relative">
            <VoiceInput
              isListening={isListening}
              onToggle={handleMicToggle}
            />
            {transcript && (
              <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-632 glass-card p-3 rounded-xl text-xs text-center">
                "{transcript}"
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}