"use client";

import { useEffect, useRef, useState } from "react";

type SpeechRecognitionInstance = any;

interface UseSpeechOptions {
  lang?: string;
}

interface UseSpeechReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeech(options: UseSpeechOptions = {}): UseSpeechReturn {
  const { lang = "es-PE" } = options;

  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Inicializar reconocimiento solo en el cliente
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition: SpeechRecognitionInstance = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false; // una “frase” por vez
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript("");
    };

    recognition.onerror = (event: any) => {
  console.warn("Speech recognition warning:", event);
  let message = "Error de reconocimiento de voz";

  if (event.error === "network") {
    message = "No se pudo conectar al servicio de voz del navegador (error de red).";
  } else if (event.error === "not-allowed") {
    message = "No diste permiso para usar el micrófono.";
  } else if (event.error === "no-speech") {
    message = "No se detectó audio. Intenta hablar más cerca del micrófono.";
  }

  setError(message);
  setIsListening(false);
};


    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text.trim());
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [lang]);

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) return;
    setError(null);
    setTranscript("");
    try {
      recognitionRef.current.start();
    } catch (err) {
      // Safari y otros lanzan si ya está corriendo
      console.warn("No se pudo iniciar el reconocimiento:", err);
    }
  };

  const stopListening = () => {
    if (!isSupported || !recognitionRef.current) return;
    recognitionRef.current.stop();
  };

  const resetTranscript = () => {
    setTranscript("");
    setError(null);
  };

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
