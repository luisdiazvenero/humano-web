"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import { Check, ChevronDown, Mail, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"
import type { WebLang } from "@/lib/web/i18n"

type QuoteSpace = { id: string; name: string }

type QuoteContextValue = {
  open: (spaceId: string) => void
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

function useQuotePanel() {
  const context = useContext(QuoteContext)
  if (!context) {
    throw new Error("EventQuoteButton debe usarse dentro de EventQuoteProvider")
  }
  return context
}

const HOURS = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"))
const MINUTES = ["00", "15", "30", "45"]

type FormState = {
  spaceId: string
  name: string
  email: string
  phone: string
  message: string
  date: string
  hour: string
  minute: string
  guests: string
  website: string
}

function emptyForm(spaceId: string): FormState {
  return {
    spaceId,
    name: "",
    email: "",
    phone: "",
    message: "",
    date: "",
    hour: "",
    minute: "",
    guests: "",
    website: "",
  }
}

export function EventQuoteProvider({
  spaces,
  lang = "es",
  children,
}: {
  spaces: QuoteSpace[]
  lang?: WebLang
  children: ReactNode
}) {
  const isEn = lang === "en"
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(() => emptyForm(spaces[0]?.id ?? ""))
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fieldId = useId()

  const isOpen = activeSpaceId !== null

  const open = useCallback((spaceId: string) => {
    setStatus("idle")
    setErrorMessage(null)
    setForm(emptyForm(spaceId))
    setActiveSpaceId(spaceId)
  }, [])

  const close = useCallback(() => setActiveSpaceId(null), [])

  const contextValue = useMemo<QuoteContextValue>(() => ({ open }), [open])

  const t = useMemo(
    () => ({
      title: isEn ? "Request a quote" : "Solicitar un presupuesto",
      intro: isEn
        ? "Tell us about your event and we'll get back to you with a tailored proposal."
        : "Cuéntanos sobre tu evento y te respondemos con una propuesta a tu medida.",
      space: isEn ? "Space" : "Espacio",
      name: isEn ? "Name" : "Nombre",
      email: isEn ? "Email" : "Correo electrónico",
      phone: isEn ? "Phone" : "Teléfono",
      message: isEn ? "Message" : "Mensaje",
      date: isEn ? "Date" : "Fecha",
      time: isEn ? "Time" : "Horas",
      hour: isEn ? "Hour" : "Hora",
      minute: isEn ? "Minute" : "Minuto",
      guests: isEn ? "Number of guests" : "Número de personas",
      submit: isEn ? "Send" : "Enviar",
      sending: isEn ? "Sending…" : "Enviando…",
      required: isEn ? "Required fields" : "Campos obligatorios",
      close: isEn ? "Close" : "Cerrar",
      sentTitle: isEn ? "Request sent" : "Solicitud enviada",
      sentBody: isEn
        ? "Thank you. Our events team will reply to your email shortly."
        : "Gracias. Nuestro equipo de eventos te responderá por correo en un plazo breve.",
      sentCta: isEn ? "Close" : "Cerrar",
      errorGeneric: isEn
        ? "We couldn't send your request. Please try again or write to us on WhatsApp."
        : "No pudimos enviar tu solicitud. Inténtalo otra vez o escríbenos por WhatsApp.",
      errorRate: isEn
        ? "Too many requests from this connection. Please try again later."
        : "Demasiadas solicitudes desde esta conexión. Inténtalo más tarde.",
      errorConfig: isEn
        ? "Sending is not enabled yet. Please write to us on WhatsApp in the meantime."
        : "El envío aún no está habilitado. Escríbenos por WhatsApp mientras tanto.",
    }),
    [isEn]
  )

  // Cerrar con Escape; en móvil el panel es overlay y bloquea el scroll
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    window.addEventListener("keydown", onKeyDown)

    const mobileQuery = window.matchMedia("(max-width: 1023px)")
    const previousOverflow = document.body.style.overflow
    if (mobileQuery.matches) document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, close])

  // Marca el documento para que el CSS empuje header y contenido en desktop
  useEffect(() => {
    document.documentElement.dataset.quotePanel = isOpen ? "open" : "closed"
    return () => {
      delete document.documentElement.dataset.quotePanel
    }
  }, [isOpen])

  const activeSpace = spaces.find((space) => space.id === form.spaceId) ?? spaces[0]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "sending") return

    setStatus("sending")
    setErrorMessage(null)

    const time = form.hour ? `${form.hour}:${form.minute || "00"}` : ""

    try {
      const response = await fetch("/api/eventos/cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          space: activeSpace?.name ?? "",
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          date: form.date,
          time,
          guests: form.guests,
          website: form.website,
          lang,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setStatus("error")
        setErrorMessage(
          data?.error === "rate_limited"
            ? t.errorRate
            : data?.error === "email_not_configured"
              ? t.errorConfig
              : t.errorGeneric
        )
        return
      }

      trackEvent("web_event_quote_sent", { space: activeSpace?.name ?? "" })
      setStatus("sent")
    } catch {
      setStatus("error")
      setErrorMessage(t.errorGeneric)
    }
  }

  const inputClass =
    "h-12 w-full rounded-2xl border border-white/16 bg-white/[0.07] px-4 text-[15px] text-white outline-none transition placeholder:text-white/45 focus:border-white/45 focus:bg-white/[0.11] focus:ring-2 focus:ring-white/20"
  const labelClass =
    "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/64"
  // Un punto más profundo que la superficie del panel, para que el desplegable
  // abierto se lea como una capa por encima sin cambiar de color.
  const optionClass = "bg-[#01262A] text-white"

  return (
    <QuoteContext.Provider value={contextValue}>
      {children}

      {/* Fondo oscurecido: solo en móvil, donde el panel es overlay */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-[65] bg-black/45 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        aria-hidden={!isOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-[70] flex w-full flex-col bg-[var(--color-azul-rgb)] text-white shadow-[-18px_0_48px_rgba(0,55,68,0.28)] transition-transform duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:w-[var(--quote-panel-w)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/12 px-6 pb-5 pt-6 sm:px-8">
          <div>
            <h2 className="font-serif text-[30px] leading-tight text-white sm:text-[34px]">
              {t.title}
            </h2>
            <p className="mt-1.5 max-w-[38ch] text-sm leading-relaxed text-white/68">
              {t.intro}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={t.close}
            tabIndex={isOpen ? 0 : -1}
            className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/18"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {status === "sent" ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-[var(--color-azul-rgb)]">
                <Check className="h-7 w-7" />
              </span>
              <p className="mt-5 font-serif text-2xl text-white">{t.sentTitle}</p>
              <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-white/70">
                {t.sentBody}
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-7 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[var(--color-azul-rgb)] transition-colors hover:bg-[var(--color-crema-soft)]"
              >
                {t.sentCta}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor={`${fieldId}-space`}
                  className={cn(labelClass, "text-[var(--color-amarillo)]")}
                >
                  {t.space}
                </label>
                <div className="relative">
                  <select
                    id={`${fieldId}-space`}
                    value={form.spaceId}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, spaceId: event.target.value }))
                    }
                    className={cn(
                      inputClass,
                      "cursor-pointer appearance-none border-[var(--color-amarillo)] pr-11 font-semibold [color-scheme:dark] focus:border-[var(--color-amarillo)] focus:ring-[var(--color-amarillo)]/30"
                    )}
                  >
                    {spaces.map((space) => (
                      <option key={space.id} value={space.id} className={optionClass}>
                        {space.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-amarillo)]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${fieldId}-name`} className={labelClass}>
                  {t.name} *
                </label>
                <input
                  id={`${fieldId}-name`}
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor={`${fieldId}-email`} className={labelClass}>
                  {t.email} *
                </label>
                <input
                  id={`${fieldId}-email`}
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor={`${fieldId}-phone`} className={labelClass}>
                  {t.phone} *
                </label>
                <input
                  id={`${fieldId}-phone`}
                  type="tel"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor={`${fieldId}-message`} className={labelClass}>
                  {t.message} *
                </label>
                <textarea
                  id={`${fieldId}-message`}
                  required
                  rows={3}
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, message: event.target.value }))
                  }
                  className="min-h-[68px] w-full rounded-[20px] border border-white/16 bg-white/[0.07] px-4 py-3 text-[15px] leading-relaxed text-white outline-none transition focus:border-white/45 focus:bg-white/[0.11] focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label htmlFor={`${fieldId}-date`} className={labelClass}>
                  {t.date}
                </label>
                <input
                  id={`${fieldId}-date`}
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, date: event.target.value }))
                  }
                  className={cn(inputClass, "cursor-pointer [color-scheme:dark]")}
                />
              </div>

              <div>
                <span className={labelClass}>{t.time}</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <select
                      aria-label={t.hour}
                      value={form.hour}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, hour: event.target.value }))
                      }
                      className={cn(inputClass, "cursor-pointer appearance-none pr-11 [color-scheme:dark]")}
                    >
                      <option value="" className={optionClass}>
                        {t.hour}
                      </option>
                      {HOURS.map((hour) => (
                        <option key={hour} value={hour} className={optionClass}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
                    />
                  </div>
                  <div className="relative">
                    <select
                      aria-label={t.minute}
                      value={form.minute}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, minute: event.target.value }))
                      }
                      className={cn(inputClass, "cursor-pointer appearance-none pr-11 [color-scheme:dark]")}
                    >
                      <option value="" className={optionClass}>
                        {t.minute}
                      </option>
                      {MINUTES.map((minute) => (
                        <option key={minute} value={minute} className={optionClass}>
                          {minute}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor={`${fieldId}-guests`} className={labelClass}>
                  {t.guests}
                </label>
                <input
                  id={`${fieldId}-guests`}
                  type="number"
                  min={1}
                  max={500}
                  inputMode="numeric"
                  value={form.guests}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, guests: event.target.value }))
                  }
                  className={inputClass}
                />
              </div>

              {/* Campo trampa para bots: invisible y fuera del orden de tabulación */}
              <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
                <label htmlFor={`${fieldId}-website`}>Website</label>
                <input
                  id={`${fieldId}-website`}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, website: event.target.value }))
                  }
                />
              </div>

              {errorMessage ? (
                <p role="alert" className="rounded-2xl border border-[#ffb4a6]/28 bg-[#ffb4a6]/12 px-4 py-3 text-sm leading-relaxed text-[#ffcfc6]">
                  {errorMessage}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <p className="text-[12px] text-white/56">* {t.required}</p>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[var(--color-azul-rgb)] transition-colors hover:bg-[var(--color-crema-soft)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? t.sending : t.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </aside>
    </QuoteContext.Provider>
  )
}

export function EventQuoteButton({
  spaceId,
  spaceName,
  label,
  className,
}: {
  spaceId: string
  spaceName: string
  label: string
  className?: string
}) {
  const { open } = useQuotePanel()

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent("web_event_quote_open", { space: spaceName })
        open(spaceId)
      }}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-[var(--color-azul-rgb)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:text-[var(--color-amarillo)]",
        className
      )}
    >
      <Mail className="h-4 w-4" />
      {label}
    </button>
  )
}
