import { NextResponse, type NextRequest } from "next/server"

/**
 * Solicitudes de cotización de los espacios para eventos.
 * Envía por Mailjet al buzón configurado en EVENTS_QUOTE_TO.
 */

const MAILJET_ENDPOINT = "https://api.mailjet.com/v3.1/send"

// Destino real; en pruebas se sobrescribe con EVENTS_QUOTE_TO.
const DEFAULT_TO = "lgonzales@humanohoteles.com"
// humanolima.com está verificado en Mailjet (SPF + DKIM)
const DEFAULT_FROM = "Hotel Humano <eventos@humanolima.com>"

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

/** Acepta "Nombre <correo@dominio>" o solo "correo@dominio" */
function parseSender(value: string): { email: string; name?: string } {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/)
  if (match) return { email: match[2].trim(), name: match[1].trim() || undefined }
  return { email: value.trim() }
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

  const rows: Array<[string, string]> = [
    ["Espacio", space || "—"],
    ["Nombre", name],
    ["Correo", email],
    ["Teléfono", phone],
    ["Fecha", date || "—"],
    ["Hora", time || "—"],
    ["N.º de personas", guests || "—"],
    ["Idioma de la web", lang === "en" ? "Inglés" : "Español"],
  ]

  const subject = `Cotización de evento — ${space || "Hotel Humano"} (${name})`
  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Mensaje:",
    message,
  ].join("\n")

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#003035;line-height:1.5">
      <h2 style="margin:0 0 4px">Solicitud de cotización</h2>
      <p style="margin:0 0 20px;color:#5b6f71">Enviada desde la página de Eventos</p>
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
      <p style="margin:22px 0 6px;color:#5b6f71">Mensaje</p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `

  const apiKey = process.env.MAILJET_API_KEY
  const secretKey = process.env.MAILJET_SECRET_KEY
  if (!apiKey || !secretKey) {
    // Sin credenciales todavía: no perdemos la solicitud, queda en el log del servidor
    console.warn(
      "[cotizacion] MAILJET_API_KEY / MAILJET_SECRET_KEY no configuradas. Solicitud recibida:\n" + text
    )
    return NextResponse.json({ error: "email_not_configured" }, { status: 503 })
  }

  const sender = parseSender(process.env.EVENTS_QUOTE_FROM || DEFAULT_FROM)
  const auth = Buffer.from(`${apiKey}:${secretKey}`).toString("base64")

  try {
    const response = await fetch(MAILJET_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Messages: [
          {
            From: { Email: sender.email, Name: sender.name ?? "Hotel Humano" },
            To: [{ Email: process.env.EVENTS_QUOTE_TO || DEFAULT_TO }],
            // Responder escribe directamente a quien hizo la solicitud
            ReplyTo: { Email: email, Name: name },
            Subject: subject,
            TextPart: text,
            HTMLPart: html,
          },
        ],
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("[cotizacion] Mailjet respondió", response.status, detail)
      return NextResponse.json({ error: "send_failed" }, { status: 502 })
    }

    // Mailjet devuelve 200 aunque un mensaje concreto sea rechazado: el
    // resultado real viene por mensaje en Messages[].Status.
    const result = await response.json().catch(() => null)
    const messageStatus = result?.Messages?.[0]?.Status
    if (messageStatus !== "success") {
      console.error("[cotizacion] Mailjet no aceptó el mensaje:", JSON.stringify(result))
      return NextResponse.json({ error: "send_failed" }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[cotizacion] Error enviando el correo", error)
    return NextResponse.json({ error: "send_failed" }, { status: 502 })
  }
}
