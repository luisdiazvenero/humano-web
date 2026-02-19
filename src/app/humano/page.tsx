"use client"

import { useRouter } from "next/navigation"
import { Fingerprint } from "lucide-react"
import { FullLogo } from "@/components/humano-v09/FullLogo"

export default function HumanoPage() {
  const router = useRouter()

  return (
    <div className="h-screen w-full bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/hotel-acerca.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-8 max-w-lg mx-auto">
          <div className="w-48 mx-auto text-white">
            <FullLogo className="w-full h-auto text-white" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
              Viaja con propósito,
              <br />
              no solo con itinerario
            </h1>
            <p className="text-white/80 text-sm tracking-widest uppercase font-medium">
              Atmósfera, Carácter, Diseño
            </p>
          </div>

          <div className="pt-12">
            <button
              type="button"
              onClick={() => router.push("/humano/conserje")}
              className="h-16 w-16 rounded-full bg-[var(--color-amarillo-strong)] hover:brightness-95 text-[var(--color-azul-rgb)] flex items-center justify-center mx-auto transition-all hover:scale-110 shadow-lg cursor-pointer"
            >
              <Fingerprint className="h-8 w-8" />
            </button>
            <p className="text-white/60 text-xs mt-4">Toca para comenzar</p>
          </div>
        </div>
      </div>
    </div>
  )
}
