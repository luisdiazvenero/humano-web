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
}

/**
 * Guarda la solicitud. Nunca lanza: si el histórico falla no debe tumbar el
 * envío del formulario, así que el error queda en el log del servidor.
 */
export async function saveSubmission(submission: Submission): Promise<boolean> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.warn("[submissions] Supabase no configurado; no se guardó el histórico")
    return false
  }

  try {
    const response = await fetch(`${url}/rest/v1/form_submissions`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        form: submission.form,
        name: submission.name,
        email: submission.email,
        phone: submission.phone ?? null,
        message: submission.message ?? null,
        lang: submission.lang ?? null,
        email_sent: submission.emailSent,
        meta: submission.meta ?? {},
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("[submissions] Supabase respondió", response.status, detail)
      return false
    }

    return true
  } catch (error) {
    console.error("[submissions] Error guardando la solicitud", error)
    return false
  }
}
