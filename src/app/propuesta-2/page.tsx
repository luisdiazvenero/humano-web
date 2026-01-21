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
import { FullLogo } from "@/components/humano/FullLogo"
import { NavMenu } from "@/components/humano/NavMenu"
import { LanguageSelector } from "@/components/humano/LanguageSelector"
import { ThemeToggle } from "@/components/humano/ThemeToggle"
import { useSpeech } from "@/hooks/useSpeech"

export default function Propuesta2() {
    const router = useRouter()
    const [view, setView] = useState<'intro' | 'content'>('intro')
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

    const handleStartContent = () => {
        setView('content')
    }

    // INTRO VIEW - Preview screen like /agente
    if (view === 'intro') {
        return (
            <div className="h-screen w-full bg-background text-foreground relative overflow-hidden">
                {/* Navigation Menu */}
                <NavMenu />

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Video Background */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/hotel-acerca.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
                    <div className="text-center space-y-8 max-w-lg mx-auto">
                        {/* Logo */}
                        <div className="w-48 mx-auto text-white">
                            <FullLogo className="w-full h-auto text-white" />
                        </div>

                        {/* Text */}
                        <div className="space-y-4">
                            <h1 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                                Viaja con propósito,<br />
                                no solo con itinerario
                            </h1>
                            <p className="text-white/80 text-sm tracking-widest uppercase font-medium">
                                Atmósfera, Carácter, Diseño
                            </p>
                        </div>

                        {/* Mic Button */}
                        <div className="pt-12">
                            <button
                                onClick={handleStartContent}
                                className="h-16 w-16 rounded-full bg-[#E8B931] hover:bg-[#E8B931]/90 text-[#003744] flex items-center justify-center mx-auto transition-all hover:scale-110 shadow-lg cursor-pointer"
                            >
                                <Mic className="h-8 w-8" />
                            </button>
                            <p className="text-white/60 text-xs mt-4">
                                Toca para comenzar
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // CONTENT VIEW - Full propuesta content
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
                    <FullLogo className="h-24 w-auto" />
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
                    <div className="relative rounded-2xl overflow-hidden group">
                        {/* Background Video */}
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        >
                            <source src="/hero-home.mp4" type="video/mp4" />
                        </video>

                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black/30" />

                        {/* Video Label */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="text-center space-y-4">
                                <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center mx-auto cursor-pointer hover:scale-110 transition-transform group-hover:bg-white/20">
                                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                                </div>
                                <div>
                                    <p className="text-white font-serif text-lg tracking-wide">Descubre Humano</p>
                                    <p className="text-white/80 text-sm">Video experiencia</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Slider & Featured Room Side by Side */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Image Slider */}
                        <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                            <ImageSlider
                                images={[
                                    { src: "/slider-propuesta-1.jpg", alt: "Interior Humano 1", label: "Restaurante" },
                                    { src: "/slider-propuesta-2.jpg", alt: "Interior Humano 2", label: "Piscina" },
                                    { src: "/slider-propuesta-3.jpg", alt: "Interior Humano 3", label: "Lobby & Bar" },
                                    { src: "/slider-propuesta-4.jpg", alt: "Interior Humano 4", label: "Rooftop" }
                                ]}
                            />
                        </div>

                        {/* Featured Room */}
                        <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                            <FeaturedRoom image="/featured-room-propuesta.jpg" />
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
                <div className="w-full h-[100vh] relative overflow-hidden mb-16">
                    {/* Background Video with Parallax */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-[120%] object-cover"
                        style={{ transform: 'translateY(-10%)' }}
                    >
                        <source src="/hotel-acerca.mp4" type="video/mp4" />
                    </video>

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center space-y-12">
                            {/* Humano Hotel Logo */}
                            <svg className="mx-auto" width="200" height="173" viewBox="0 0 392 339" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M40.08 254.45V245.72C30.55 245.45 20.51 245.45 10.89 245.72V254.45C10.89 263.81 10.98 269.05 11.32 275.35H0C0.34 269.05 0.51 263.81 0.51 254.45V235C0.51 225.74 0.34 220.49 0 214.2H11.32C10.98 220.49 10.89 225.74 10.89 235V240.85C20.51 241.03 30.55 241.03 40.08 240.85V235C40.08 225.74 39.91 220.49 39.57 214.2H50.89C50.55 220.49 50.46 225.74 50.46 235.09V254.49C50.46 263.85 50.55 269.09 50.89 275.39H39.57C39.91 269.05 40.08 263.81 40.08 254.45Z" fill="white" />
                                <path d="M89.88 276.57C74.31 276.57 65.2 266.51 65.2 250.08V235C65.2 225.55 65.12 220.66 64.69 214.2H76C75.66 220.49 75.57 225.74 75.57 235V251.35C75.57 262.88 82.3 270.14 92.94 270.14C103.06 270.14 109.1 263.85 110.04 253.71C110.362 250.805 110.505 247.883 110.47 244.96C110.374 234.681 109.747 224.414 108.59 214.2H115.06L115 249.38C114.9 266.51 105.54 276.57 89.88 276.57Z" fill="white" />
                                <path d="M132.2 214.16H141.05L161.81 263.54L181.72 214.16H190.57L197 275.35H185.81C185.55 267.21 184.96 260.05 183.93 249.91L181.64 227.45L161.39 275.45H155.86L135.26 226.45C133.39 244.8 132.46 259.58 132.2 275.45H125.73L132.2 214.16Z" fill="white" />
                                <path d="M205.62 275.35L231.62 214.16H239.02L262.16 275.35H250.55C248.08 267.48 245.55 260.05 242.72 252.35C235.57 252.27 227.66 252.27 220.51 252.35C217.7 259.7 215.07 266.95 212.25 275.35H205.62ZM241.1 248L232.1 223.6C228.44 232.52 225.21 240.39 222.23 248C228.25 248.07 235.06 248.07 241.1 248Z" fill="white" />
                                <path d="M270.9 214.16H279.06L314.89 262.94C314.8 244.05 314.21 233.04 312.59 214.16H319.32V275.52H312.08L275.32 225.35C275.41 245.1 276.01 256.35 277.62 275.35H270.9V214.16Z" fill="white" />
                                <path d="M360.71 276.66C342.93 276.66 329.91 263.11 329.91 244.75C329.91 226.39 342.91 212.84 360.71 212.84C378.51 212.84 391.6 226.4 391.6 244.75C391.6 263.1 378.58 276.66 360.71 276.66ZM360.71 217.13C348.88 217.13 340.88 228.13 340.88 244.75C340.88 261.37 348.88 272.37 360.71 272.37C372.54 272.37 380.62 261.37 380.62 244.75C380.62 228.13 372.62 217.13 360.71 217.13Z" fill="white" />
                                <path d="M141.93 329.11V325.38C137.76 325.27 133.37 325.27 129.17 325.38V329.11C129.17 333.11 129.17 335.34 129.35 338.03H124.4C124.55 335.34 124.62 333.1 124.62 329.11V320.79C124.62 316.79 124.55 314.6 124.4 311.91H129.35C129.2 314.6 129.17 316.84 129.17 320.79V323.29C133.37 323.37 137.76 323.37 141.93 323.29V320.79C141.93 316.79 141.86 314.6 141.71 311.91H146.66C146.51 314.6 146.48 316.84 146.48 320.83V329.11C146.48 333.11 146.48 335.34 146.66 338.03H141.71C141.86 335.34 141.93 333.1 141.93 329.11Z" fill="white" />
                                <path d="M172.3 338.59C164.52 338.59 158.83 332.8 158.83 324.97C158.83 317.14 164.52 311.35 172.3 311.35C175.912 311.35 179.377 312.785 181.931 315.339C184.485 317.893 185.92 321.358 185.92 324.97C185.92 328.582 184.485 332.047 181.931 334.601C179.377 337.155 175.912 338.59 172.3 338.59ZM172.3 313.18C167.13 313.18 163.63 317.88 163.63 324.97C163.63 332.06 167.13 336.76 172.3 336.76C177.47 336.76 181 332.06 181 325C181 317.94 177.51 313.18 172.3 313.18Z" fill="white" />
                                <path d="M202.19 329.11V313.78C199.523 313.736 196.861 314.012 194.26 314.6V311.91H214.66V314.6C212.059 314.012 209.397 313.737 206.73 313.78V329.11C206.73 333.11 206.73 335.34 206.92 338.03H202C202.11 335.34 202.19 333.1 202.19 329.11Z" fill="white" />
                                <path d="M225.51 329.11V320.83C225.51 316.83 225.44 314.67 225.29 311.91H239.81V314.49C237.073 313.884 234.272 313.619 231.47 313.7H230.06V323.44H232.25C234.541 323.485 236.831 323.348 239.1 323.03V325.6C236.828 325.322 234.539 325.198 232.25 325.23H230.06V336.23H231.62C234.446 336.297 237.27 336.021 240.03 335.41V338H225.29C225.44 335.3 225.51 333.07 225.51 329.11Z" fill="white" />
                                <path d="M252.15 329.11V320.79C252.15 316.79 252.08 314.6 251.93 311.91H256.88C256.73 314.6 256.7 316.84 256.7 320.83V336.24H258.45C261.281 336.307 264.108 336.004 266.86 335.34V338H251.93C252.08 335.3 252.15 333.07 252.15 329.11Z" fill="white" />
                                <path d="M266.91 48.41V0H262.26V48.41C262.277 55.8036 261.005 63.1435 258.5 70.1L257.91 71.72L257 70.23C255.477 67.6387 253.762 65.1651 251.87 62.83L251.61 62.51L251.72 62.12C253.062 57.2982 253.735 52.315 253.72 47.31V0.08H249.09V47.31C249.087 50.4633 248.796 53.6097 248.22 56.71L248 58.26L246.9 57.11C244.952 55.0904 242.878 53.1966 240.69 51.44L240.35 51.17V50.74C240.511 49.2353 240.595 47.7233 240.6 46.21V0H236V48L234.74 47.19C223.198 39.7405 209.76 35.7625 196.023 35.7288C182.286 35.6951 168.828 39.6072 157.25 47L155.68 47.82C155.68 47.4 155.68 46.99 155.63 46.57V0H151V46.21C151 47.76 151.07 49.21 151.22 50.77C151.476 53.0908 151.914 55.3879 152.53 57.64C153.217 60.2661 154.169 62.8158 155.37 65.25C156.303 67.1336 157.359 68.9541 158.53 70.7C161.084 74.4992 164.219 77.8737 167.82 80.7C175.797 86.9922 185.66 90.4143 195.82 90.4143C205.98 90.4143 215.843 86.9922 223.82 80.7L224.4 80.25L224.91 80.77C226.73 82.6428 228.358 84.693 229.77 86.89L230.15 87.48L229.6 87.93C220.033 95.6521 208.11 99.8638 195.815 99.8638C183.52 99.8638 171.597 95.6521 162.03 87.93C160.344 86.6178 158.769 85.1696 157.32 83.6C155.47 81.7381 153.771 79.7317 152.24 77.6C150.922 75.7585 149.723 73.8345 148.65 71.84C147.29 69.3189 146.15 66.686 145.24 63.97C144.43 61.6176 143.798 59.2075 143.35 56.76C142.774 53.6532 142.486 50.4998 142.49 47.34V0.08H137.84V47.31C137.839 52.3206 138.512 57.3086 139.84 62.14C140.468 64.5301 141.273 66.87 142.25 69.14C143.328 71.7568 144.622 74.2789 146.12 76.68C147.297 78.6185 148.592 80.4821 150 82.26C151.604 84.296 153.352 86.2143 155.23 88C156.745 89.5114 158.359 90.9211 160.06 92.22L160.37 92.48C170.618 100.248 183.136 104.432 195.996 104.389C208.855 104.346 221.344 100.077 231.54 92.24L232.36 91.61L232.78 92.61C233.89 95.1797 234.718 97.862 235.25 100.61L235.35 101.1L234.93 101.4C223.52 109.574 209.836 113.97 195.8 113.97C181.764 113.97 168.08 109.574 156.67 101.4C154.767 100.046 152.941 98.5868 151.2 97.03C149.149 95.1762 147.206 93.2063 145.38 91.13C143.742 89.2729 142.226 87.3121 140.84 85.26C139.142 82.8009 137.608 80.2319 136.25 77.57L136.17 77.37C134.992 75.0504 133.97 72.6551 133.11 70.2C130.601 63.2443 129.326 55.9042 129.34 48.51V0.08H124.69V48.41C124.68 58.1953 126.756 67.8705 130.78 76.79L130.93 77.11L130.78 77.43C126.749 86.3262 124.672 95.9832 124.69 105.75V160.31H129.34V105.75C129.33 98.3724 130.606 91.0496 133.11 84.11L133.69 82.51L134.56 83.98C136.101 86.5651 137.818 89.041 139.7 91.39L139.95 91.7L139.84 92.09C138.514 96.8979 137.841 101.863 137.84 106.85V160.28H142.49V106.85C142.483 103.717 142.771 100.589 143.35 97.51L143.63 95.99L144.72 97.09C146.685 99.0858 148.762 100.969 150.94 102.73L151.28 103V103.42C151.105 104.941 151.012 106.469 151 108V160.33H155.66V106.23L156.91 107.04C168.518 114.511 182.031 118.484 195.835 118.484C209.639 118.484 223.152 114.511 234.76 107.04L236.01 106.23V160.36H240.66V108C240.66 106.61 240.58 105.15 240.41 103.42C240.163 101.101 239.725 98.8066 239.1 96.56C238.397 93.9287 237.453 91.3679 236.28 88.91C235.322 87.0087 234.226 85.1804 233 83.44C231.595 81.3726 230.013 79.4319 228.27 77.64C226.877 76.1604 225.373 74.7897 223.77 73.54C215.796 67.2437 205.93 63.8225 195.77 63.83C185.602 63.7749 175.721 67.2014 167.77 73.54L167.19 74L166.68 73.47C164.846 71.5839 163.207 69.5167 161.79 67.3L161.33 66.56L162.68 65.69C172.258 58.2369 184.073 54.2378 196.209 54.3413C208.345 54.4447 220.09 58.6447 229.54 66.26C230.39 66.94 231.19 67.63 232.01 68.36C232.83 69.09 233.56 69.83 234.28 70.59C236.061 72.4089 237.696 74.365 239.17 76.44L239.31 76.64C240.655 78.4588 241.858 80.3777 242.91 82.38C244.278 84.8933 245.42 87.5237 246.32 90.24C246.53 90.83 246.72 91.42 246.89 92.03C247.442 93.8178 247.882 95.6379 248.21 97.48C248.795 100.569 249.09 103.706 249.09 106.85V160.28H253.72V106.85C253.729 101.839 253.056 96.8497 251.72 92.02C251.117 89.6225 250.311 87.2807 249.31 85.02C248.225 82.4004 246.93 79.8723 245.44 77.46C244.261 75.5284 242.969 73.6685 241.57 71.89C240.032 69.9346 238.361 68.087 236.57 66.36L236.33 66.13C234.808 64.6281 233.191 63.2252 231.49 61.93C221.339 54.0786 208.884 49.7889 196.051 49.7238C183.218 49.6588 170.72 53.8219 160.49 61.57L159.14 62.47C159.01 62.2 158.88 61.92 158.76 61.64C157.64 59.0733 156.808 56.3902 156.28 53.64C156.28 53.44 156.22 53.23 156.18 53.02L157.65 52.11C169.035 44.2873 182.554 40.1616 196.367 40.294C210.18 40.4264 223.617 44.8105 234.85 52.85C236.767 54.2008 238.597 55.6703 240.33 57.25C242.394 59.0937 244.338 61.0677 246.15 63.16C247.815 64.9991 249.352 66.9504 250.75 69C252.501 71.4603 254.05 74.0588 255.38 76.77C256.595 79.1315 257.638 81.5779 258.5 84.09C261 91.0442 262.273 98.38 262.26 105.77V160.3H266.91V105.75C266.918 95.9745 264.842 86.3097 260.82 77.4L260.67 77.08L260.82 76.76C264.855 67.8546 266.932 58.1869 266.91 48.41ZM171.53 76.48C178.537 71.241 187.051 68.4099 195.8 68.4099C204.549 68.4099 213.063 71.241 220.07 76.48L220.91 77.11L220.07 77.74C213.055 82.9607 204.544 85.7803 195.8 85.7803C187.056 85.7803 178.545 82.9607 171.53 77.74L170.69 77.11L171.53 76.48Z" fill="white" />
                            </svg>

                            <p className="text-white font-serif text-xl tracking-wide uppercase leading-relaxed">
                                Viaja con propósito,<br />no solo con itinerario
                            </p>
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
