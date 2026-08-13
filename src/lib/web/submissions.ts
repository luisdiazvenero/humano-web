/**
 * Histórico de los formularios de la web (eventos, contacto, libro de
 * reclamaciones) en Supabase, además del correo.
 *
 * Se usa la API REST de PostgREST directamente para no añadir dependencias:
 * una llamada HTTP funciona igual en las funciones serverless de Vercel.
 *
 * Variables de entorno:
 *  - SUPABASE_URL            https://<proyecto>.supabase.co
 *  - SUPABASE_SECRET_KEY     clave secreta sb_secret_… (solo servidor, nunca cliente).
 *    Se acepta SUPABASE_SERVICE_ROLE_KEY para proyectos con las claves antiguas.
 *
 * Tabla esperada: ver docs/supabase-form-submissions.sql
 */

export type Submission = {
  /** Formulario de origen: "eventos" | "contacto" | "reclamaciones" */
  form: string
  name: string
  email: string
  phone?: string
  message?: string
  lang?: string
  /** Si el correo de aviso salió correctamente */
  emailSent: boolean
  /** Campos propios de cada formulario (espacio, fecha, personas…) */
  meta?: Record<string, unknown>
  /** Para el control de envíos por IP */
  ip?: string
}

export type SaveResult = {
  ok: boolean
  id?: string
  /** Correlativo del libro de reclamaciones, asignado por la base de datos */
  claimNumber?: number
}

/**
 * Guarda la solicitud. Nunca lanza: si el histórico falla no debe tumbar el
 * envío del formulario, así que el error queda en el log del servidor.
 */
export async function saveSubmission(submission: Submission): Promise<SaveResult> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.warn("[submissions] Supabase no configurado; no se guardó el histórico")
    return { ok: false }
  }

  try {
    const response = await fetch(`${url}/rest/v1/form_submissions`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        // Devuelve la fila creada para conocer el correlativo del libro
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        form: submission.form,
        name: submission.name,
        email: submission.email,
        phone: submission.phone ?? null,
        message: submission.message ?? null,
        lang: submission.lang ?? null,
        email_sent: submission.emailSent,
        ip: submission.ip ?? null,
        meta: submission.meta ?? {},
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("[submissions] Supabase respondió", response.status, detail)
      return { ok: false }
    }

    const rows = await response.json().catch(() => null)
    const row = Array.isArray(rows) ? rows[0] : null
    return { ok: true, id: row?.id, claimNumber: row?.claim_number ?? undefined }
  } catch (error) {
    console.error("[submissions] Error guardando la solicitud", error)
    return { ok: false }
  }
}

/**
 * Marca que el aviso por correo salió. Se usa cuando el correo se envía
 * después de guardar, como en el libro de reclamaciones, donde el correo
 * debe incluir el número de la hoja.
 */
export async function markEmailSent(id: string): Promise<void> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return

  try {
    await fetch(`${url}/rest/v1/form_submissions?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email_sent: true }),
    })
  } catch (error) {
    console.error("[submissions] No se pudo marcar el envío del correo", error)
  }
}
