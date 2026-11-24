import { NextResponse, type NextRequest } from "next/server"

import { sendMail } from "@/lib/web/mailer"
import {
  contactRecipientFor,
  isContactTopic,
  noticeBcc,
} from "@/lib/web/form-recipients"
import { saveSubmission } from "@/lib/web/submissions"
import {
  clean,
  isValidEmail,
  getClientIp,
  isRateLimited,
  verifyTurnstile,
} from "@/lib/web/form-utils"
import { contactFooter, renderEmail } from "@/lib/web/mail-templates"

/**
 * Formulario de contacto general.
 * El destino depende del motivo elegido: las consultas de eventos van al
 * equipo de eventos y el resto al buzón general (ver form-recipients.ts).
 * Remitente común: MAIL_FROM.
 */

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
  // Motivo desconocido o ausente (p. ej. una versión antigua de la página en
  // caché): se trata como consulta general, no se rechaza.
  const topicInput = clean(payload.topic)
  const topic = isContactTopic(topicInput) ? topicInput : "general"

  if (!name || !email || !message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }

  const ip = getClientIp(request)
  if (!(await verifyTurnstile(clean(payload.captchaToken), ip))) {
    return NextResponse.json({ error: "captcha_failed" }, { status: 400 })
  }

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
        reason: "Reason",
        reasonValue: {
          general: "General inquiry",
          reservas: "Bookings and stays",
          eventos: "Events and meetings",
          facturacion: "Invoicing",
        },
        language: "Website language",
        languageValue: "English",
        message: "Message",
        copySubject: "We received your message",
        copyTitle: "Thank you for writing to us",
        copyIntro: "This is a copy of your message. We'll reply shortly.",
      }
    : {
        subject: "Contacto web",
        title: "Nuevo mensaje de contacto",
        source: "Enviado desde la página de Contacto",
        name: "Nombre",
        email: "Correo",
        phone: "Teléfono",
        topic: "Asunto",
        reason: "Motivo",
        reasonValue: {
          general: "Consulta general",
          reservas: "Reservas y estancias",
          eventos: "Eventos y reuniones",
          facturacion: "Facturación",
        },
        language: "Idioma de la web",
        languageValue: "Español",
        message: "Mensaje",
        copySubject: "Recibimos tu mensaje",
        copyTitle: "Gracias por escribirnos",
        copyIntro: "Esta es una copia de tu mensaje. Te responderemos en un plazo breve.",
      }

  const rows: Array<[string, string]> = [
    [t.reason, t.reasonValue[topic]],
    [t.topic, subjectInput || "—"],
    [t.name, name],
    [t.email, email],
    [t.phone, phone || "—"],
    [t.language, t.languageValue],
  ]

  const subject = `${t.subject} (${t.reasonValue[topic]}) — ${subjectInput || name}`
  const { text, html } = renderEmail({
    title: t.title,
    subtitle: t.source,
    rows,
    message: { label: t.message, value: message },
  })

  const sent = await sendMail({
    to: contactRecipientFor(topic),
    bcc: noticeBcc(),
    subject,
    text,
    html,
    replyTo: { email, name },
  })

  // Copia para quien escribió
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
      subject: t.copySubject,
      text: copy.text,
      html: copy.html,
    })
  }

  await saveSubmission({
    form: "contacto",
    name,
    email,
    phone,
    message,
    lang,
    emailSent: sent.ok,
    ip,
    meta: { topic, subject: subjectInput },
  })

  if (!sent.ok) {
    return NextResponse.json(
      { error: sent.reason === "not_configured" ? "email_not_configured" : "send_failed" },
      { status: sent.reason === "not_configured" ? 503 : 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
