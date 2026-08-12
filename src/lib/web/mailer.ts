/**
 * Envío de correo de los formularios de la web (eventos, contacto,
 * libro de reclamaciones). Usa Mailjet, que es una llamada HTTP y por tanto
 * funciona en las funciones serverless de Vercel, donde SMTP no es fiable.
 *
 * Variables de entorno:
 *  - MAILJET_API_KEY / MAILJET_SECRET_KEY  credenciales (obligatorias)
 *  - MAIL_FROM   remitente común a todos los formularios: "Nombre <correo>"
 */

const MAILJET_ENDPOINT = "https://api.mailjet.com/v3.1/send"

// humanolima.com está verificado en Mailjet (SPF + DKIM).
// Dirección genérica: la comparten todos los formularios de la web.
const DEFAULT_FROM = "Hotel Humano <web@humanolima.com>"

export type SendMailInput = {
  to: string
  subject: string
  text: string
  html: string
  /** Al responder se escribe aquí, normalmente quien envió el formulario */
  replyTo?: { email: string; name?: string }
}

export type SendMailResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "send_failed" }

/** Acepta "Nombre <correo@dominio>" o solo "correo@dominio" */
export function parseSender(value: string): { email: string; name?: string } {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/)
  if (match) return { email: match[2].trim(), name: match[1].trim() || undefined }
  return { email: value.trim() }
}

export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  const apiKey = process.env.MAILJET_API_KEY
  const secretKey = process.env.MAILJET_SECRET_KEY

  if (!apiKey || !secretKey) {
    // Sin credenciales no perdemos la solicitud: queda en el log del servidor
    console.warn(
      "[mailer] MAILJET_API_KEY / MAILJET_SECRET_KEY no configuradas. Mensaje no enviado:\n" +
        `Para: ${input.to}\nAsunto: ${input.subject}\n\n${input.text}`
    )
    return { ok: false, reason: "not_configured" }
  }

  const sender = parseSender(process.env.MAIL_FROM || DEFAULT_FROM)
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
            To: [{ Email: input.to }],
            ...(input.replyTo
              ? { ReplyTo: { Email: input.replyTo.email, Name: input.replyTo.name } }
              : {}),
            Subject: input.subject,
            TextPart: input.text,
            HTMLPart: input.html,
          },
        ],
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("[mailer] Mailjet respondió", response.status, detail)
      return { ok: false, reason: "send_failed" }
    }

    // Mailjet devuelve 200 aunque un mensaje concreto sea rechazado: el
    // resultado real viene por mensaje en Messages[].Status.
    const result = await response.json().catch(() => null)
    if (result?.Messages?.[0]?.Status !== "success") {
      console.error("[mailer] Mailjet no aceptó el mensaje:", JSON.stringify(result))
      return { ok: false, reason: "send_failed" }
    }

    return { ok: true }
  } catch (error) {
    console.error("[mailer] Error enviando el correo", error)
    return { ok: false, reason: "send_failed" }
  }
}
