"use client"

import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import { ArrowUpRight, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { webPrimaryButtonClass } from "@/components/humano-web/webStyles"

type ContactFormState = {
  name: string
  email: string
  subject: string
  countryCode: string
  countryLabel: string
  countryShort: string
  phone: string
  message: string
}

const initialState: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  countryCode: "+51",
  countryLabel: "Perú",
  countryShort: "PE",
  phone: "",
  message: "",
}

const internationalCodes = [
  { short: "PE", label: "Perú", value: "+51" },
  { short: "CL", label: "Chile", value: "+56" },
  { short: "CO", label: "Colombia", value: "+57" },
  { short: "EC", label: "Ecuador", value: "+593" },
  { short: "MX", label: "México", value: "+52" },
  { short: "AR", label: "Argentina", value: "+54" },
  { short: "US", label: "United States", value: "+1" },
  { short: "ES", label: "España", value: "+34" },
]

export function WebContactForm() {
  const router = useRouter()
  const [form, setForm] = useState<ContactFormState>(initialState)
  const [isPhoneMenuOpen, setIsPhoneMenuOpen] = useState(false)
  const phoneMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!phoneMenuRef.current?.contains(event.target as Node)) {
        setIsPhoneMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const subject = form.subject.trim() || `Consulta de ${form.name || "nuevo contacto"}`
    const body = [
      `Nombre: ${form.name}`,
      `Correo: ${form.email}`,
      `Teléfono: ${form.countryCode} ${form.phone}`,
      "",
      "Mensaje:",
      form.message,
    ].join("\n")

    const mailtoUrl = `mailto:hola@humanohoteles.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    // Preserve the current mailto-based flow for now and then show the
    // thank-you screen in the site while backend submission is still pending.
    const mailtoLink = document.createElement("a")
    mailtoLink.href = mailtoUrl
    mailtoLink.click()

    router.push("/humano/contacto/gracias")
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Nombre</span>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            required
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            className="h-12 w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 text-[15px] text-white placeholder:text-white/40 outline-none transition focus:border-white/28 focus:bg-white/[0.06] focus:ring-2 focus:ring-white/10"
          />
        </label>

        <label className="block">
          <span className="sr-only">Correo</span>
          <input
            type="email"
            name="email"
            placeholder="Correo"
            required
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className="h-12 w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 text-[15px] text-white placeholder:text-white/40 outline-none transition focus:border-white/28 focus:bg-white/[0.06] focus:ring-2 focus:ring-white/10"
          />
        </label>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="sr-only">Asunto</span>
          <input
            type="text"
            name="subject"
            placeholder="Asunto"
            required
            value={form.subject}
            onChange={(event) =>
              setForm((current) => ({ ...current, subject: event.target.value }))
            }
            className="h-12 w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 text-[15px] text-white placeholder:text-white/40 outline-none transition focus:border-white/28 focus:bg-white/[0.06] focus:ring-2 focus:ring-white/10"
          />
        </label>

        <div className="relative" ref={phoneMenuRef}>
          <span className="sr-only">Teléfono</span>
          <div className="flex overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] transition focus-within:border-white/28 focus-within:bg-white/[0.06] focus-within:ring-2 focus-within:ring-white/10">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isPhoneMenuOpen}
              onClick={() => setIsPhoneMenuOpen((current) => !current)}
              className="inline-flex min-w-[108px] cursor-pointer items-center gap-2 border-r border-white/12 px-3 text-[15px] text-white/92 transition hover:bg-white/[0.04]"
            >
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/[0.08] px-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/82">
                {form.countryShort}
              </span>
              <span className="whitespace-nowrap">{form.countryCode}</span>
              <ChevronDown
                className={`ml-auto h-4 w-4 text-white/60 transition-transform ${isPhoneMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            <label className="block min-w-0 flex-1">
              <input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                required
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
                className="h-12 w-full bg-transparent px-4 text-[15px] text-white placeholder:text-white/40 outline-none"
              />
            </label>
          </div>

          {isPhoneMenuOpen ? (
            <div className="absolute left-0 top-[calc(100%+10px)] z-20 w-[240px] overflow-hidden rounded-[20px] border border-white/12 bg-[#0a444a] p-2 shadow-[0_20px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <ul role="listbox" aria-label="Códigos internacionales" className="space-y-1">
                {internationalCodes.map((code) => {
                  const isSelected = code.value === form.countryCode

                  return (
                    <li key={code.value}>
                      <button
                        type="button"
                        onClick={() => {
                          setForm((current) => ({
                            ...current,
                            countryCode: code.value,
                            countryLabel: code.label,
                            countryShort: code.short,
                          }))
                          setIsPhoneMenuOpen(false)
                        }}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                          isSelected
                            ? "bg-white/[0.08] text-white"
                            : "text-white/76 hover:bg-white/[0.05] hover:text-white"
                        )}
                      >
                        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-white/[0.08] px-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/82">
                          {code.short}
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {code.label} ({code.value})
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <label className="block">
        <span className="sr-only">Mensaje</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Cuéntanos brevemente cómo podemos ayudarte."
          required
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          className="min-h-[140px] w-full rounded-[22px] border border-white/12 bg-white/[0.04] px-4 py-3 text-[15px] leading-relaxed text-white placeholder:text-white/40 outline-none transition focus:border-white/28 focus:bg-white/[0.06] focus:ring-2 focus:ring-white/10"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="text-[12px] leading-relaxed text-white/42">
          Te responderemos por correo en un plazo breve.
        </p>

        <button
          type="submit"
          className={cn(
            webPrimaryButtonClass,
            "min-h-12 cursor-pointer bg-white px-5 py-2.5 text-sm text-[var(--color-azul-rgb)] hover:bg-[var(--color-crema-soft)]"
          )}
        >
          Enviar
          <ArrowUpRight className="h-4.5 w-4.5" />
        </button>
      </div>
    </form>
  )
}
