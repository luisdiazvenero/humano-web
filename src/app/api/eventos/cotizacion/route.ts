import { NextResponse, type NextRequest } from "next/server"

import { sendMail } from "@/lib/web/mailer"
import { saveSubmission } from "@/lib/web/submissions"
import { clean, isValidEmail, getClientIp, isRateLimited } from "@/lib/web/form-utils"
import { contactFooter, renderEmail } from "@/lib/web/mail-templates"

/**
 * Solicitudes de cotización de los espacios para eventos.
 *
 * Cada formulario define su propio destino: FORM_EVENTS_TO aquí,
 * FORM_CONTACT_TO en contacto, FORM_CLAIMS_TO en reclamaciones.
 * Lo único común a los tres es el remitente (MAIL_FROM).
 */

// Destino real; en pruebas se sobrescribe con FORM_EVENTS_TO.
const DEFAULT_TO = "lgonzales@humanohoteles.com"

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

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }

  const ip = getClientIp(request)
  if (await isRateLimited(ip, "eventos")) {
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
        copySubject: "We received your request",
        copyTitle: "Thank you for your request",
        copyIntro: "This is a copy of what you sent us. Our events team will reply shortly.",
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
        copySubject: "Recibimos tu solicitud",
        copyTitle: "Gracias por escribirnos",
        copyIntro: "Esta es una copia de lo que nos enviaste. Nuestro equipo de eventos te responderá pronto.",
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
  const { text, html } = renderEmail({
    title: t.title,
    subtitle: t.source,
    rows,
    message: { label: t.message, value: message },
  })

  const sent = await sendMail({
    // EVENTS_QUOTE_TO era el nombre anterior; se acepta por compatibilidad
    to: process.env.FORM_EVENTS_TO || process.env.EVENTS_QUOTE_TO || DEFAULT_TO,
    subject,
    text,
    html,
    replyTo: { email, name },
  })

  // Copia para quien rellenó el formulario: si falla, no afecta a la solicitud
  if (sent.ok) {
    const copy = renderEmail({
      title: t.copyTitle,
      subtitle: t.copyIntro,
      rows,
      message: { label: t.message, value: message },
      footer: contactFooter(lang),
    })
    await sendMail({
      to: email,
      subject: `${t.copySubject} — ${space || "Hotel Humano"}`,
      text: copy.text,
      html: copy.html,
    })
  }

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
    ip,
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
