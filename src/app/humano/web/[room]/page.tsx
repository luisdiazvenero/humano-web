import Image from "next/image"
import Link from "next/link"
import { Inter, Playfair_Display_SC } from "next/font/google"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { notFound } from "next/navigation"

import { getHumanoRoomBySlug, getHumanoRooms } from "@/lib/humano/rooms"

const headingFont = Playfair_Display_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
})

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export function generateStaticParams() {
  return getHumanoRooms().map((room) => ({ room: room.slug }))
}

export default async function HumanoRoomPage({
  params,
}: {
  params: Promise<{ room: string }>
}) {
  const { room } = await params
  const roomData = getHumanoRoomBySlug(room)

  if (!roomData) {
    notFound()
  }

  return (
    <div className={`${bodyFont.className} min-h-screen bg-white text-[var(--color-azul-rgb)]`}>
      <main className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/humano/web#habitaciones"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-azul-rgb)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a habitaciones
          </Link>
          <Link
            href="/humano/conserje"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-azul-soft)]/30 px-4 py-2 text-sm font-semibold text-[var(--color-azul-rgb)]"
          >
            Hablar con anfitrión
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <article className="space-y-6">
          <div className="relative h-[360px] overflow-hidden rounded-3xl sm:h-[460px]">
            {roomData.imagen ? (
              <Image
                src={roomData.imagen}
                alt={roomData.nombre}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1100px"
                priority
              />
            ) : (
              <div className="h-full w-full bg-[var(--color-crema-soft)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <h1
              className={`${headingFont.className} absolute bottom-6 left-6 right-6 text-4xl text-white sm:text-5xl`}
            >
              {roomData.nombre}
            </h1>
          </div>

          <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-azul-soft)]">
            {roomData.descripcion}
          </p>
        </article>
      </main>
    </div>
  )
}
