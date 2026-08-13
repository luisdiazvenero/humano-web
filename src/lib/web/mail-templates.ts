import { escapeHtml } from "@/lib/web/form-utils"

/** Plantilla común de los correos de formularios: aviso interno y copia al remitente. */

export type EmailContent = {
  title: string
  /** Línea bajo el título: origen del mensaje o número de hoja */
  subtitle?: string
  rows: Array<[string, string]>
  message?: { label: string; value: string }
  /** Nota final: plazo legal, datos de contacto… */
  footer?: string
}

export function renderEmail(content: EmailContent): { text: string; html: string } {
  const text = [
    content.title,
    content.subtitle ?? "",
    "",
    ...content.rows.map(([label, value]) => `${label}: ${value}`),
    ...(content.message ? ["", `${content.message.label}:`, content.message.value] : []),
    ...(content.footer ? ["", content.footer] : []),
  ]
    .filter((line, index, all) => !(line === "" && all[index - 1] === ""))
    .join("\n")

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#003035;line-height:1.5">
      <h2 style="margin:0 0 4px">${escapeHtml(content.title)}</h2>
      ${
        content.subtitle
          ? `<p style="margin:0 0 20px;color:#5b6f71">${content.subtitle}</p>`
          : `<div style="height:16px"></div>`
      }
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:620px">
        ${content.rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 12px 8px 0;color:#5b6f71;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
            <td style="padding:8px 0;font-weight:600">${escapeHtml(value)}</td>
          </tr>`
          )
          .join("")}
      </table>
      ${
        content.message
          ? `<p style="margin:22px 0 6px;color:#5b6f71">${escapeHtml(content.message.label)}</p>
             <p style="margin:0;white-space:pre-wrap">${escapeHtml(content.message.value)}</p>`
          : ""
      }
      ${
        content.footer
          ? `<p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #dfe4e4;color:#5b6f71;font-size:13px">${content.footer}</p>`
          : ""
      }
    </div>
  `

  return { text, html }
}

/** Pie de la copia que recibe quien rellena el formulario */
export function contactFooter(lang: "es" | "en"): string {
  return lang === "en"
    ? "Hotel Humano · Malecón Balta 710, Miraflores, Lima · +51 1 904 1400"
    : "Hotel Humano · Malecón Balta 710, Miraflores, Lima · +51 1 904 1400"
}
