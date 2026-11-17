"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

/**
 * Captcha de Cloudflare Turnstile para los formularios de la web.
 *
 * El widget de Cloudflare debe crearse en modo "Invisible": no se ve nada en
 * el formulario y el token llega solo a los pocos segundos de cargar.
 *
 * Si NEXT_PUBLIC_TURNSTILE_SITE_KEY no está definida no pinta nada, y el
 * servidor tampoco exige el token (ver verifyTurnstile en form-utils.ts).
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      language?: string
      theme?: "light" | "dark" | "auto"
      callback: (token: string) => void
      "expired-callback": () => void
      "error-callback": () => void
    }
  ) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = SCRIPT_SRC
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => {
        scriptPromise = null
        reject(new Error("turnstile_script_failed"))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

export type TurnstileHandle = {
  /** El token es de un solo uso: hay que pedir otro tras cada envío */
  reset: () => void
}

type Props = {
  lang?: "es" | "en"
  theme?: "light" | "dark"
  onToken: (token: string) => void
  className?: string
}

export const isTurnstileEnabled = Boolean(SITE_KEY)

export const TurnstileWidget = forwardRef<TurnstileHandle, Props>(function TurnstileWidget(
  { lang = "es", theme = "light", onToken, className },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)

  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useImperativeHandle(ref, () => ({
    reset: () => {
      onTokenRef.current("")
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
      }
    },
  }))

  useEffect(() => {
    if (!SITE_KEY) return
    let cancelled = false

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          language: lang,
          theme,
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "error-callback": () => onTokenRef.current(""),
        })
      })
      .catch(() => {
        // Sin el script el servidor rechazará el envío; no hay nada más que hacer aquí
      })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
      widgetIdRef.current = null
    }
  }, [lang, theme])

  if (!SITE_KEY) return null
  // Modo invisible: el contenedor no ocupa espacio en el formulario
  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className ?? "absolute h-0 w-0 overflow-hidden"}
    />
  )
})
