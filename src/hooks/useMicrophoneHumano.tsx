"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useSpeech } from "@/hooks/useSpeechHumano"

interface UseMicrophoneOptions {
  lang?: string
  maxDurationMs?: number
  prompt?: string
}

interface UseMicrophoneReturn {
  isSupported: boolean
  isListening: boolean
  isTranscribing: boolean
  transcript: string
  error: string | null
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

const DEFAULT_PROMPT =
  "Hotel Humano, Miraflores, Lima; habitaciones, servicios, recomendaciones locales."

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/mpeg",
    "audio/wav",
  ]
  for (const type of candidates) {
    if ((MediaRecorder as any).isTypeSupported?.(type)) return type
  }
  return undefined
}

function stopStream(stream: MediaStream | null) {
  if (!stream) return
  stream.getTracks().forEach((track) => track.stop())
}

function hasMediaRecorderSupport(): boolean {
  if (typeof window === "undefined") return false
  if (typeof navigator === "undefined") return false
  return !!navigator.mediaDevices && typeof (window as any).MediaRecorder !== "undefined"
}

function shouldFallbackFromSpeechError(error: string | null): boolean {
  if (!error) return false
  const normalized = error.toLowerCase()
  return (
    normalized.includes("error de red") ||
    normalized.includes("servicio de voz") ||
    normalized.includes("network")
  )
}

export function useMicrophoneHumano(options: UseMicrophoneOptions = {}): UseMicrophoneReturn {
  const { lang = "es-PE", maxDurationMs = 45000, prompt = DEFAULT_PROMPT } = options
  const languageCode = lang.includes("-") ? lang.split("-")[0] : lang
  const promptNormalized = normalizeText(prompt)

  const speech = useSpeech({ lang })
  const [mode, setMode] = useState<"speech" | "media" | "unsupported">("unsupported")
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isListeningLocal, setIsListeningLocal] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timeoutRef = useRef<number | null>(null)
  const pendingChunksRef = useRef<Blob[]>([])
  const processingRef = useRef(false)
  const transcriptRef = useRef("")
  const sessionRef = useRef(0)
  const activeSessionRef = useRef<number | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

  useEffect(() => {
    if (speech.isSupported) {
      setMode("speech")
      return
    }

    setMode(hasMediaRecorderSupport() ? "media" : "unsupported")
  }, [speech.isSupported])

  const resetTranscript = () => {
    if (mode === "speech") {
      speech.resetTranscript()
      return
    }
    setTranscript("")
    setError(null)
  }

  const transcribeChunk = useCallback(
    async (blob: Blob): Promise<string> => {
      const type = blob.type || "audio/webm"
      let filename = "audio.webm"
      if (type.includes("mp4")) filename = "audio.mp4"
      else if (type.includes("mpeg") || type.includes("mp3")) filename = "audio.mp3"
      else if (type.includes("wav")) filename = "audio.wav"
      else if (type.includes("ogg")) filename = "audio.ogg"

      const file = new File([blob], filename, { type })
      const formData = new FormData()
      formData.append("file", file)
      formData.append("prompt", prompt)
      if (languageCode) formData.append("language", languageCode)

      const response = await fetch("/api/humano/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const raw = await response.text().catch(() => "")
        let message = "Error al transcribir el audio."
        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            if (parsed?.error) message = String(parsed.error)
          } catch {
            message = raw
          }
        }
        throw new Error(message)
      }

      const data = await response.json().catch(() => null)
      return typeof data?.text === "string" ? data.text.trim() : ""
    },
    [languageCode, prompt]
  )

  const processQueue = useCallback(
    async (flush = false) => {
      if (processingRef.current) return
      processingRef.current = true
      setIsTranscribing(true)

      while (pendingChunksRef.current.length > 0) {
        const chunk = pendingChunksRef.current.shift()
        if (!chunk) continue
        if (chunk.size < 800) continue
        const currentSession = activeSessionRef.current
        if (!currentSession) break
        try {
          const text = await transcribeChunk(chunk)
          if (currentSession !== activeSessionRef.current) continue
          const normalizedText = normalizeText(text)
          const isPromptEcho =
            normalizedText &&
            promptNormalized &&
            (normalizedText === promptNormalized ||
              normalizedText.startsWith(promptNormalized) ||
              promptNormalized.startsWith(normalizedText))
          if (!isPromptEcho && text && mountedRef.current) {
            setTranscript((prev) => (prev ? `${prev} ${text}` : text))
            setError(null)
          }
        } catch (err: any) {
          if (mountedRef.current && !transcriptRef.current) {
            setError(String(err?.message || "Error al transcribir el audio."))
          }
          if (!flush) break
        }
      }

      processingRef.current = false
      if (mountedRef.current) {
        setIsTranscribing(false)
      }
    },
    [transcribeChunk]
  )

  const beginMediaRecording = useCallback(async () => {
    if (!hasMediaRecorderSupport()) {
      setError("El micrófono no es compatible con este navegador.")
      return
    }

    try {
      setError(null)
      setTranscript("")

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = pickMimeType()
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
      recorderRef.current = recorder
      chunksRef.current = []
      pendingChunksRef.current = []
      sessionRef.current += 1
      activeSessionRef.current = sessionRef.current

      recorder.onstart = () => {
        setIsListeningLocal(true)
      }

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data)
          pendingChunksRef.current.push(event.data)
          void processQueue()
        }
      }

      recorder.onerror = () => {
        setError("Error al grabar audio.")
        setIsListeningLocal(false)
        stopStream(streamRef.current)
      }

      recorder.onstop = async () => {
        setIsListeningLocal(false)
        stopStream(streamRef.current)
        streamRef.current = null
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }

        if (chunksRef.current.length === 0) {
          window.setTimeout(() => {
            if (chunksRef.current.length === 0) {
              setError("No se detectó audio. Intenta hablar más cerca del micrófono.")
              return
            }
            void processQueue(true)
          }, 200)
          return
        }

        void processQueue(true)
      }

      recorder.start(1200)

      if (maxDurationMs > 0) {
        timeoutRef.current = window.setTimeout(() => {
          if (recorder.state !== "inactive") recorder.stop()
        }, maxDurationMs)
      }
    } catch (err: any) {
      let message = "No se pudo acceder al micrófono."
      if (err?.name === "NotAllowedError") {
        message = "No diste permiso para usar el micrófono."
      } else if (err?.name === "NotFoundError") {
        message = "No se encontró un micrófono disponible."
      }
      setError(message)
      setIsListeningLocal(false)
    }
  }, [languageCode, maxDurationMs, prompt, processQueue])

  useEffect(() => {
    if (mode !== "speech") return
    if (shouldFallbackFromSpeechError(speech.error) && hasMediaRecorderSupport()) {
      speech.stopListening()
      setMode("media")
      setTranscript("")
      setError("El reconocimiento del navegador falló. Usando transcripción del servidor.")
      void beginMediaRecording()
      return
    }
    setTranscript(speech.transcript)
    setError(speech.error)
  }, [mode, speech.transcript, speech.error, beginMediaRecording])

  const stopListening = () => {
    if (mode === "speech") {
      speech.stopListening()
      return
    }
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop()
    }
    activeSessionRef.current = null
  }

  const startListening = async () => {
    if (mode === "speech") {
      speech.resetTranscript()
      speech.startListening()
      return
    }

    if (mode !== "media") {
      setError("El micrófono no es compatible con este navegador.")
      return
    }
    await beginMediaRecording()
  }

  useEffect(() => {
    return () => {
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop()
      }
      stopStream(streamRef.current)
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const isSupported = mode !== "unsupported"
  const isListening = mode === "speech" ? speech.isListening : isListeningLocal

  return {
    isSupported,
    isListening,
    isTranscribing,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  }
}
