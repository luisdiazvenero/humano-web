import type { NextRequest } from "next/server"

/** Utilidades comunes a los formularios de la web (eventos, contacto, reclamaciones). */

const MAX_FIELD_LENGTH = 2000
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5

export function clean(value: unknown): string {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, MAX_FIELD_LENGTH)
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
}

/**
 * Comprueba el token de Cloudflare Turnstile (captcha).
 *
 * Si TURNSTILE_SECRET_KEY no está definida no se exige: así el formulario
 * sigue funcionando mientras no se configuren las claves. Si Cloudflare no
 * responde se deja pasar, igual que con el límite de envíos.
 */
export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false

  const body = new URLSearchParams({ secret, response: token })
  if (ip !== "unknown") body.set("remoteip", ip)

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    })
    if (!response.ok) {
      console.error("[form-utils] Turnstile respondió", response.status)
      return true
    }
    const data = (await response.json()) as { success?: boolean; "error-codes"?: string[] }
    if (!data.success) {
      console.warn("[form-utils] Captcha rechazado", data["error-codes"])
    }
    return Boolean(data.success)
  } catch (error) {
    console.error("[form-utils] No se pudo verificar el captcha", error)
    return true
  }
}

/** Respaldo para cuando Supabase no está configurado (desarrollo local) */
const recentSubmissions = new Map<string, number[]>()

function isRateLimitedInMemory(key: string): boolean {
  const now = Date.now()
  const timestamps = (recentSubmissions.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  )

  if (timestamps.length >= RATE_LIMIT_MAX) {
    recentSubmissions.set(key, timestamps)
    return true
  }

  timestamps.push(now)
  recentSubmissions.set(key, timestamps)

  if (recentSubmissions.size > 500) {
    for (const [k, values] of recentSubmissions) {
      if (values.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
        recentSubmissions.delete(k)
      }
    }
  }

  return false
}

/**
 * Máximo de envíos por IP y formulario en la última hora.
 *
 * Se cuenta contra Supabase y no en memoria: en Vercel cada invocación puede
 * caer en una instancia distinta, así que un contador en memoria no vería los
 * envíos anteriores. Si Supabase no responde no se bloquea el formulario:
 * perder una solicitud legítima es peor que aceptar una de más.
 */
export async function isRateLimited(ip: string, form: string): Promise<boolean> {
  if (ip === "unknown") return false

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return isRateLimitedInMemory(`${form}:${ip}`)

  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
  const query =
    `${url}/rest/v1/form_submissions` +
    `?select=id&ip=eq.${encodeURIComponent(ip)}` +
    `&form=eq.${encodeURIComponent(form)}` +
    `&created_at=gte.${encodeURIComponent(since)}`

  try {
    const response = await fetch(query, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        // Devuelve el total en la cabecera sin traer las filas
        Prefer: "count=exact",
        Range: "0-0",
      },
    })

    if (!response.ok) return false

    const range = response.headers.get("content-range") // "0-0/12"
    const total = Number(range?.split("/")[1] ?? 0)
    return Number.isFinite(total) && total >= RATE_LIMIT_MAX
  } catch (error) {
    console.error("[form-utils] No se pudo comprobar el límite de envíos", error)
    return false
  }
}
