import { NextResponse } from "next/server"

/**
 * Mantiene despierto el proyecto de Supabase.
 *
 * El plan gratuito pausa los proyectos tras una semana sin actividad; si eso
 * pasa, los formularios seguirían enviando el correo pero dejarían de
 * guardarse en el histórico. Una consulta trivial al día lo evita.
 *
 * Lo dispara Vercel Cron según la programación de vercel.json.
 */

export const dynamic = "force-dynamic"

export async function GET() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 })
  }

  try {
    const response = await fetch(`${url}/rest/v1/form_submissions?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("[keep-alive] Supabase respondió", response.status)
      return NextResponse.json({ ok: false }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[keep-alive] Error consultando Supabase", error)
    return NextResponse.json({ ok: false }, { status: 502 })
  }
}
