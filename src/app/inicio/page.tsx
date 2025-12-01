"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, CloudSun, ChevronRight, Mic } from "lucide-react"

import { AssistantBubble } from "@/components/humano/AssistantBubble"
import { IntentSelector, IntentId } from "@/components/humano/IntentSelector"
import { VoiceInput } from "@/components/humano/VoiceInput"
import { ImageSlider } from "@/components/humano/ImageSlider"
import { FeaturedRoom } from "@/components/humano/FeaturedRoom"
import { ScrollGallery } from "@/components/humano/ScrollGallery"
import { RoomsCarousel } from "@/components/humano/RoomsCarousel"
import { Footer } from "@/components/humano/Footer"
import { Logo } from "@/components/humano/Logo"
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

      {/* Header - Centered */}
      <header className="relative z-10 pt-16 sm:pt-24 pb-6 px-6 flex items-start justify-between max-w-screen-sm mx-auto w-full animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-2">
          <Logo className="h-12 w-auto" />
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

      {/* HERO SECTION - Full Width on Desktop */}
      <section className="relative z-10 mb-16 px-6 lg:px-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <div className="grid lg:grid-cols-2 gap-4 h-[280px] max-w-screen-2xl mx-auto">
          {/* Left Column - Video */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#003035] to-[#003744] animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 backdrop-blur-sm border-2 border-primary/50 flex items-center justify-center mx-auto cursor-pointer hover:scale-110 transition-transform group">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1 group-hover:border-l-primary/80"></div>
                </div>
                <div>
                  <p className="text-primary font-serif text-lg">Descubre Humano</p>
                  <p className="text-primary/60 text-sm">Video experiencia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Slider & Featured Room Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Image Slider */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <ImageSlider />
            </div>

            {/* Featured Room */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <FeaturedRoom />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Centered */}
      <main className="relative z-10 flex flex-col px-6 pb-8 gap-8 max-w-screen-sm mx-auto w-full pt-8">
        {/* CONVERSATION AREA */}
        <section className="flex flex-col gap-8">
          <div className="space-y-6">
            <AssistantBubble
              message="Hola, soy tu anfitrión en Humano, Miraflores."
              className="animate-fade-in-up"
              style={{ animationDelay: "0.7s" } as React.CSSProperties}
            />
            <AssistantBubble
              message="¿Vienes por trabajo, descanso o aventura?"
              className="animate-fade-in-up"
              style={{ animationDelay: "0.9s" } as React.CSSProperties}
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "1.1s" }}>
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

      {/* NEW INSTITUTIONAL SECTIONS */}

      {/* Section 1: Video Hero + Institutional Text */}
      <section className="relative bg-background py-24">
        {/* Video Container */}
        <div className="w-full h-[70vh] bg-gradient-to-br from-[#003035] to-[#003744] relative overflow-hidden mb-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-primary/20 backdrop-blur-sm border-2 border-primary/50 flex items-center justify-center mx-auto cursor-pointer hover:scale-110 transition-transform group">
                <div className="w-0 h-0 border-t-10 border-t-transparent border-l-16 border-l-primary border-b-10 border-b-transparent ml-1 group-hover:border-l-primary/80"></div>
              </div>
              <p className="text-primary font-serif text-xl">Experiencia Humano</p>
            </div>
          </div>
        </div>

        {/* Institutional Text */}
        <div className="max-w-screen-sm mx-auto px-6 text-center space-y-6">
          <p className="text-xs uppercase tracking-wider text-primary font-bold animate-fade-in-up" style={{ animationDelay: "0s" }}>
            Donde lo humano es lo esencial
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif leading-tight text-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Hospitalidad consciente en Lima
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            En Humano creemos que la hospitalidad va más allá del servicio.
            Es crear espacios donde las personas puedan reconectar consigo mismas
            y con los demás, en el corazón de Miraflores.
          </p>
        </div>
      </section>

      {/* Section 2: Scroll Gallery */}
      <ScrollGallery />

      {/* Section 3: Rooms Carousel */}
      <RoomsCarousel />

      {/* Footer */}
      <Footer />
    </div>
  )
}