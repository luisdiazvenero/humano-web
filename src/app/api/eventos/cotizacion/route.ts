import { NextResponse, type NextRequest } from "next/server"

import { sendMail } from "@/lib/web/mailer"
import { saveSubmission } from "@/lib/web/submissions"

/**
 * Solicitudes de cotización de los espacios para eventos.
 *
 * Cada formulario define su propio destino: FORM_EVENTS_TO aquí,
 * FORM_CONTACT_TO en contacto, FORM_CLAIMS_TO en reclamaciones.
 * Lo único común a los tres es el remitente (MAIL_FROM).
 */

// Destino real; en pruebas se sobrescribe con FORM_EVENTS_TO.
const DEFAULT_TO = "lgonzales@humanohoteles.com"

const MAX_FIELD_LENGTH = 2000
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5

const recentSubmissions = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (recentSubmissions.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  )

  if (timestamps.length >= RATE_LIMIT_MAX) {
    recentSubmissions.set(ip, timestamps)
    return true
  }

  timestamps.push(now)
  recentSubmissions.set(ip, timestamps)

  // Poda para que el mapa no crezca sin límite en procesos de larga vida
  if (recentSubmissions.size > 500) {
    for (const [key, values] of recentSubmissions) {
      if (values.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
        recentSubmissions.delete(key)
      }
    }
  }

  return false
}

function clean(value: unknown): string {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, MAX_FIELD_LENGTH)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  // Campo trampa: los bots lo rellenan, las personas no lo ven
  if (clean(payload.website)) {
    return NextResponse.json({ ok: true })
  }

  const space = clean(payload.space)
  const name = clean(payload.name)
  const email = clean(payload.email)
  const phone = clean(payload.phone)
  const message = clean(payload.message)
  const date = clean(payload.date)
  const time = clean(payload.time)
  const guests = clean(payload.guests)
  const lang = clean(payload.lang) === "en" ? "en" : "es"

  if (!name || !email || !phone || !message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  // El aviso se escribe en el idioma en que el visitante rellenó el formulario
  const isEn = lang === "en"
  const t = isEn
    ? {
        space: "Space",
        name: "Name",
        email: "Email",
        phone: "Phone",
        date: "Date",
        time: "Time",
        guests: "Number of guests",
        language: "Website language",
        languageValue: "English",
        subject: "Event quote request",
        title: "Quote request",
        source: "Sent from the Events page",
        message: "Message",
      }
    : {
        space: "Espacio",
        name: "Nombre",
        email: "Correo",
        phone: "Teléfono",
        date: "Fecha",
        time: "Hora",
        guests: "N.º de personas",
        language: "Idioma de la web",
        languageValue: "Español",
        subject: "Cotización de evento",
        title: "Solicitud de cotización",
        source: "Enviada desde la página de Eventos",
        message: "Mensaje",
      }

  const rows: Array<[string, string]> = [
    [t.space, space || "—"],
    [t.name, name],
    [t.email, email],
    [t.phone, phone],
    [t.date, date || "—"],
    [t.time, time || "—"],
    [t.guests, guests || "—"],
    [t.language, t.languageValue],
  ]

  const subject = `${t.subject} — ${space || "Hotel Humano"} (${name})`
  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `${t.message}:`,
    message,
  ].join("\n")

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#003035;line-height:1.5">
      <h2 style="margin:0 0 4px">${t.title}</h2>
      <p style="margin:0 0 20px;color:#5b6f71">${t.source}</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:560px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 12px 8px 0;color:#5b6f71;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
            <td style="padding:8px 0;font-weight:600">${escapeHtml(value)}</td>
          </tr>`
          )
          .join("")}
      </table>
      <p style="margin:22px 0 6px;color:#5b6f71">${t.message}</p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `

  const sent = await sendMail({
    // EVENTS_QUOTE_TO era el nombre anterior; se acepta por compatibilidad
    to: process.env.FORM_EVENTS_TO || process.env.EVENTS_QUOTE_TO || DEFAULT_TO,
    subject,
    text,
    html,
    replyTo: { email, name },
  })

  // El histórico se guarda pase lo que pase con el correo: si el envío falla,
  // la solicitud no se pierde y queda registrado que no salió el aviso.
  await saveSubmission({
    form: "eventos",
    name,
    email,
    phone,
    message,
    lang,
    emailSent: sent.ok,
    meta: { space, date, time, guests },
  })

  if (!sent.ok) {
    return NextResponse.json(
      { error: sent.reason === "not_configured" ? "email_not_configured" : "send_failed" },
      { status: sent.reason === "not_configured" ? 503 : 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
