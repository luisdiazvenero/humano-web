import { NextResponse } from "next/server"

import { sendMail } from "@/lib/web/mailer"
import { noticeBcc } from "@/lib/web/form-recipients"
import { escapeHtml } from "@/lib/web/form-utils"

/**
 * Mantiene despierto el proyecto de Supabase.
 *
 * El plan gratuito pausa los proyectos tras una semana sin "suficiente
 * actividad de base de datos"; si eso pasa, los formularios siguen enviando
 * el correo pero dejan de guardarse en el histórico. En noviembre de 2026 se
 * pausó pese a que esta tarea leía una fila al día, así que ahora escribe
 * (tabla keep_alive, ver docs/supabase-keep-alive.sql) y además lee la tabla
 * de formularios.
 *
 * Si algo falla se manda un correo de alerta a FORM_BCC, para enterarse el
 * mismo día y no semanas después.
 *
 * Lo dispara Vercel Cron según la programación de vercel.json.
 */

export const dynamic = "force-dynamic"

async function alert(detail: string) {
  console.error("[keep-alive]", detail)

  const to = noticeBcc()
  if (!to) return

  const text =
    `La tarea diaria no pudo comunicarse con Supabase.\n\n${detail}\n\n` +
    "Mientras dure, los formularios de la web envían el correo pero no se guardan " +
    "en el histórico, y el libro de reclamaciones sale sin número de hoja.\n" +
    "Revisa si el proyecto está pausado en supabase.com."

  await sendMail({
    to,
    subject: "Alerta: Supabase no responde (web Humano)",
    text,
    html: `<pre style="font-family:inherit;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
  })
}

export async function GET() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    await alert("Faltan SUPABASE_URL o SUPABASE_SECRET_KEY en las variables de entorno.")
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 })
  }

  const headers = { apikey: key, Authorization: `Bearer ${key}` }

  try {
    // Escritura: siempre la misma fila, con la hora del latido
    const write = await fetch(`${url}/rest/v1/keep_alive`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ id: 1, pinged_at: new Date().toISOString() }),
      cache: "no-store",
    })

    // Lectura: confirma que la tabla de formularios responde
    const read = await fetch(`${url}/rest/v1/form_submissions?select=id&limit=1`, {
      headers,
      cache: "no-store",
    })

    if (!write.ok || !read.ok) {
      const writeDetail = write.ok ? "ok" : `${write.status} ${await write.text()}`
      const readDetail = read.ok ? "ok" : `${read.status} ${await read.text()}`
      await alert(`Escritura en keep_alive: ${writeDetail}\nLectura de form_submissions: ${readDetail}`)
      return NextResponse.json({ ok: false }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    await alert(`Error de conexión: ${error instanceof Error ? `${error.message} ${String(error.cause ?? "")}` : String(error)}`)
    return NextResponse.json({ ok: false }, { status: 502 })
  }
}
