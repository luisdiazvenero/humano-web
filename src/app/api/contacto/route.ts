import { NextResponse, type NextRequest } from "next/server"

import { sendMail } from "@/lib/web/mailer"
import { saveSubmission } from "@/lib/web/submissions"
import { clean, escapeHtml, isValidEmail, getClientIp, isRateLimited } from "@/lib/web/form-utils"

/**
 * Formulario de contacto general.
 * Destino: FORM_CONTACT_TO. Remitente común: MAIL_FROM.
 */

const DEFAULT_TO = "hola@humanohoteles.com"

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

  const name = clean(payload.name)
  const email = clean(payload.email)
  const subjectInput = clean(payload.subject)
  const phone = clean(payload.phone)
  const message = clean(payload.message)
  const lang = clean(payload.lang) === "en" ? "en" : "es"

  if (!name || !email || !message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }

  const ip = getClientIp(request)
  if (await isRateLimited(ip, "contacto")) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  const isEn = lang === "en"
  const t = isEn
    ? {
        subject: "Website contact",
        title: "New contact message",
        source: "Sent from the Contact page",
        name: "Name",
        email: "Email",
        phone: "Phone",
        topic: "Subject",
        language: "Website language",
        languageValue: "English",
        message: "Message",
      }
    : {
        subject: "Contacto web",
        title: "Nuevo mensaje de contacto",
        source: "Enviado desde la página de Contacto",
        name: "Nombre",
        email: "Correo",
        phone: "Teléfono",
        topic: "Asunto",
        language: "Idioma de la web",
        languageValue: "Español",
        message: "Mensaje",
      }

  const rows: Array<[string, string]> = [
    [t.topic, subjectInput || "—"],
    [t.name, name],
    [t.email, email],
    [t.phone, phone || "—"],
    [t.language, t.languageValue],
  ]

  const subject = `${t.subject} — ${subjectInput || name}`
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
    to: process.env.FORM_CONTACT_TO || DEFAULT_TO,
    subject,
    text,
    html,
    replyTo: { email, name },
  })

  await saveSubmission({
    form: "contacto",
    name,
    email,
    phone,
    message,
    lang,
    emailSent: sent.ok,
    ip,
    meta: { subject: subjectInput },
  })

  if (!sent.ok) {
    return NextResponse.json(
      { error: sent.reason === "not_configured" ? "email_not_configured" : "send_failed" },
      { status: sent.reason === "not_configured" ? 503 : 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
