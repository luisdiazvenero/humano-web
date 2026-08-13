"use client"

import { useSearchParams } from "next/navigation"

/**
 * Número correlativo de la hoja del libro de reclamaciones.
 * Llega como ?n= al volver del formulario y es la constancia del consumidor.
 */
export function ClaimSheetNumber({ lang = "es" }: { lang?: "es" | "en" }) {
  const sheet = useSearchParams().get("n")
  if (!sheet) return null

  const isEn = lang === "en"

  return (
    <div className="mx-auto mt-7 max-w-[420px] rounded-[24px] border border-white/12 bg-white/[0.05] px-6 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/54">
        {isEn ? "Sheet number" : "N.º de hoja"}
      </p>
      <p className="mt-2 font-serif text-[30px] leading-none text-[var(--color-amarillo)]">
        {sheet}
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-white/62">
        {isEn
          ? "Keep this number to follow up on your submission."
          : "Guarda este número para hacer seguimiento a tu solicitud."}
      </p>
    </div>
  )
}
