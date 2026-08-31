import { NextResponse, type NextRequest } from "next/server"

import { sendMail } from "@/lib/web/mailer"
import { noticeBcc, recipientFor } from "@/lib/web/form-recipients"
import { markEmailSent, saveSubmission } from "@/lib/web/submissions"
import { clean, isValidEmail, getClientIp, isRateLimited } from "@/lib/web/form-utils"
import { contactFooter, renderEmail } from "@/lib/web/mail-templates"

/**
 * Libro de reclamaciones (Indecopi).
 *
 * A diferencia de los otros formularios, aquí se guarda ANTES de enviar el
 * correo: la base de datos asigna el número correlativo de la hoja y ese
 * número tiene que aparecer en el aviso y en la constancia del consumidor.
 *
 * Destino: ver form-recipients.ts.
 */

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  if (clean(payload.website)) {
    return NextResponse.json({ ok: true })
  }

  const fullName = clean(payload.fullName)
  const guardianName = clean(payload.guardianName)
  const documentNumber = clean(payload.documentNumber)
  const address = clean(payload.address)
  const phone = clean(payload.phone)
  const email = clean(payload.email)
  const contractedItemType = clean(payload.contractedItemType)
  const itemDescription = clean(payload.itemDescription)
  const requestType = clean(payload.requestType)
  const claimTitle = clean(payload.claimTitle)
  const incidentDescription = clean(payload.incidentDescription)
  const lang = clean(payload.lang) === "en" ? "en" : "es"

  if (
    !fullName ||
    !documentNumber ||
    !address ||
    !phone ||
    !email ||
    !contractedItemType ||
    !itemDescription ||
    !requestType ||
    !claimTitle ||
    !incidentDescription
  ) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }

  const ip = getClientIp(request)
  if (await isRateLimited(ip, "reclamaciones")) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  // Primero el registro: de ahí sale el correlativo de la hoja
  const saved = await saveSubmission({
    form: "reclamaciones",
    name: fullName,
    email,
    phone,
    message: incidentDescription,
    lang,
    emailSent: false,
    ip,
    meta: {
      guardianName,
      documentNumber,
      address,
      contractedItemType,
      itemDescription,
      requestType,
      claimTitle,
    },
  })

  const isEn = lang === "en"
  const t = isEn
    ? {
        subject: "Complaints book",
        title: "New complaints book entry",
        sheet: "Sheet number",
        consumer: "Consumer",
        fullName: "Full name",
        guardian: "Parent or guardian",
        document: "ID number",
        address: "Address",
        phone: "Phone",
        email: "Email",
        item: "Contracted item",
        itemType: "Type",
        itemDesc: "Description",
        details: "Request",
        requestType: "Type",
        claimTitle: "Subject",
        incident: "Details",
        notApplicable: "Not applicable",
        deadline:
          "By law this entry must be answered within 15 business days.",
        copySubject: "Your complaints book record",
        copyTitle: "We have registered your submission",
        copyIntro:
          "Keep this sheet number as proof of your submission. We will reply within 15 business days.",
      }
    : {
        subject: "Libro de reclamaciones",
        title: "Nuevo registro del libro de reclamaciones",
        sheet: "N.º de hoja",
        consumer: "Consumidor",
        fullName: "Nombre completo",
        guardian: "Padre o apoderado",
        document: "Documento de identidad",
        address: "Domicilio",
        phone: "Teléfono",
        email: "Correo",
        item: "Bien contratado",
        itemType: "Tipo",
        itemDesc: "Descripción",
        details: "Detalle",
        requestType: "Tipo de solicitud",
        claimTitle: "Asunto",
        incident: "Detalle del reclamo",
        notApplicable: "No aplica",
        deadline:
          "Por ley este registro debe responderse en un plazo de 15 días hábiles.",
        copySubject: "Constancia de tu registro",
        copyTitle: "Registramos tu solicitud",
        copyIntro:
          "Conserva este número de hoja como constancia. Te responderemos en un plazo de 15 días hábiles.",
      }

  const sheet = saved.claimNumber ? `N-${String(saved.claimNumber).padStart(6, "0")}` : "—"

  const rows: Array<[string, string]> = [
    [t.sheet, sheet],
    [t.requestType, requestType],
    [t.claimTitle, claimTitle],
    [t.fullName, fullName],
    [t.guardian, guardianName || t.notApplicable],
    [t.document, documentNumber],
    [t.address, address],
    [t.phone, phone],
    [t.email, email],
    [t.itemType, contractedItemType],
    [t.itemDesc, itemDescription],
  ]

  const subject = `${t.subject} ${sheet} — ${requestType} — ${fullName}`
  const { text, html } = renderEmail({
    title: t.title,
    subtitle: `${t.sheet}: <strong>${sheet}</strong>`,
    rows,
    message: { label: t.incident, value: incidentDescription },
    footer: t.deadline,
  })

  const sent = await sendMail({
    to: recipientFor("reclamaciones"),
    bcc: noticeBcc(),
    subject,
    text,
    html,
    replyTo: { email, name: fullName },
  })

  if (sent.ok && saved.id) {
    await markEmailSent(saved.id)
  }

  // Constancia para el consumidor: por ley debe quedarse con una copia
  if (sent.ok) {
    const copy = renderEmail({
      title: t.copyTitle,
      subtitle: `${t.sheet}: <strong>${sheet}</strong>`,
      rows,
      message: { label: t.incident, value: incidentDescription },
      footer: `${t.copyIntro}<br>${contactFooter(lang)}`,
    })
    await sendMail({
      to: email,
      subject: `${t.copySubject} — ${sheet}`,
      text: copy.text,
      html: copy.html,
    })
  }

  if (!sent.ok) {
    return NextResponse.json(
      {
        error: sent.reason === "not_configured" ? "email_not_configured" : "send_failed",
        // El registro ya quedó guardado con su número aunque el aviso falle
        sheet: saved.claimNumber ? sheet : undefined,
      },
      { status: sent.reason === "not_configured" ? 503 : 502 }
    )
  }

  return NextResponse.json({ ok: true, sheet: saved.claimNumber ? sheet : undefined })
}
