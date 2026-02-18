import { OpenAI } from "openai"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const MAX_BYTES = 25 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(["mp3", "mp4", "mpeg", "mpga", "m4a", "wav", "webm", "ogg"])
const ALLOWED_MIME_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/m4a",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
  "video/mp4",
  "video/webm",
])

const DEFAULT_PROMPT =
  "Hotel Humano, Miraflores, Lima; habitaciones, servicios, recomendaciones locales."

function getExtension(name: string | undefined): string {
  if (!name) return ""
  const parts = name.split(".")
  if (parts.length < 2) return ""
  return parts[parts.length - 1].toLowerCase()
}

function normalizeMimeType(raw: string): string {
  if (!raw) return ""
  return raw.split(";")[0].trim().toLowerCase()
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Falta configurar OPENAI_API_KEY" }, { status: 500 })
    }

    let formData: FormData
    try {
      formData = await request.formData()
    } catch (error) {
      console.error("Transcribe formData error:", error)
      return NextResponse.json({ error: "No se pudo leer el audio" }, { status: 400 })
    }

    const file = formData.get("file")
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo de audio inválido" }, { status: 400 })
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "El archivo de audio está vacío" }, { status: 400 })
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "El archivo supera el máximo de 25MB" }, { status: 413 })
    }

    const extension = getExtension(file.name)
    if (extension && !ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json({ error: "Formato de audio no soportado" }, { status: 415 })
    }

    const normalizedType = normalizeMimeType(file.type || "")
    if (normalizedType && !ALLOWED_MIME_TYPES.has(normalizedType)) {
      return NextResponse.json({ error: "Tipo de audio no soportado" }, { status: 415 })
    }

    const promptRaw = formData.get("prompt")
    const languageRaw = formData.get("language")
    const prompt = typeof promptRaw === "string" && promptRaw.trim() ? promptRaw.trim() : DEFAULT_PROMPT
    const language = typeof languageRaw === "string" && languageRaw.trim() ? languageRaw.trim() : ""

    const transcription = await openai.audio.transcriptions.create({
      model: "gpt-4o-mini-transcribe",
      file,
      prompt,
      ...(language ? { language } : {}),
    })

    const text = typeof transcription.text === "string" ? transcription.text : ""
    return NextResponse.json({ text })
  } catch (error: any) {
    console.error("Conserje transcribe error:", error)
    return NextResponse.json(
      { error: "Error al transcribir audio", details: String(error?.message || error) },
      { status: 500 }
    )
  }
}
