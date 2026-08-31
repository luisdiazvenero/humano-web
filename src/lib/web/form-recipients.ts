/**
 * Destinatarios de los avisos que generan los formularios de la web.
 *
 * Estas direcciones viven aquí, en el repositorio, y no en variables de
 * entorno: un correo de destino no es un secreto, y tenerlo a la vista evita
 * el problema de no saber a quién está llegando realmente cada formulario.
 * Cambiarlo es un commit, así que git guarda qué cambió, cuándo y por quién.
 * Las credenciales (Mailjet, Supabase) sí siguen siendo variables secretas.
 *
 * Cada dirección admite un override por variable de entorno, pensado para
 * desarrollo: en local se apuntan a un correo propio desde .env.local para
 * probar sin molestar al hotel. En producción no deberían existir.
 */

export type FormKey = "eventos" | "contacto" | "reclamaciones"

const RECIPIENTS: Record<FormKey, { to: string; envVar: string }> = {
  // Cotizaciones de los espacios para eventos
  eventos: { to: "lgonzales@humanohoteles.com", envVar: "FORM_EVENTS_TO" },
  // Formulario de contacto general
  contacto: { to: "hola@humanohoteles.com", envVar: "FORM_CONTACT_TO" },
  // Libro de reclamaciones (Indecopi)
  reclamaciones: { to: "hola@humanohoteles.com", envVar: "FORM_CLAIMS_TO" },
}

/** A quién se avisa cuando alguien rellena el formulario. */
export function recipientFor(form: FormKey): string {
  const entry = RECIPIENTS[form]
  return process.env[entry.envVar]?.trim() || entry.to
}

/**
 * Copia oculta de todos los avisos, para vigilar que el circuito funciona.
 * Va en variable de entorno (FORM_BCC) y no aquí porque suele ser un correo
 * personal y este repositorio es público. Vacía = no se manda copia.
 */
export function noticeBcc(): string | undefined {
  return process.env.FORM_BCC?.trim() || undefined
}
