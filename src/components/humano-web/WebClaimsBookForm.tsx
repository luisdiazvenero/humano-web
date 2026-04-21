"use client"

import { type ChangeEvent, type FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRight, CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { webPrimaryButtonClass } from "@/components/humano-web/webStyles"

type ClaimsFormState = {
  fullName: string
  guardianName: string
  documentNumber: string
  address: string
  phone: string
  email: string
  contractedItemType: "" | "Producto" | "Servicio"
  itemDescription: string
  requestType: "" | "Reclamo" | "Queja"
  claimTitle: string
  incidentDescription: string
  consent: boolean
}

const initialState: ClaimsFormState = {
  fullName: "",
  guardianName: "",
  documentNumber: "",
  address: "",
  phone: "",
  email: "",
  contractedItemType: "",
  itemDescription: "",
  requestType: "",
  claimTitle: "",
  incidentDescription: "",
  consent: false,
}

const textInputClassName =
  "h-12 w-full rounded-[14px] border border-[rgba(0,48,53,0.22)] bg-[rgba(255,255,255,0.8)] px-4 text-[15px] text-[var(--color-azul-rgb)] shadow-[0_1px_2px_rgba(0,48,53,0.04)] outline-none transition placeholder:text-[var(--color-azul-rgb)]/30 focus:border-[rgba(0,48,53,0.38)] focus:bg-white focus:ring-2 focus:ring-[rgba(0,48,53,0.1)]"

const textAreaClassName =
  "w-full rounded-[16px] border border-[rgba(0,48,53,0.22)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-[15px] leading-relaxed text-[var(--color-azul-rgb)] shadow-[0_1px_2px_rgba(0,48,53,0.04)] outline-none transition placeholder:text-[var(--color-azul-rgb)]/30 focus:border-[rgba(0,48,53,0.38)] focus:bg-white focus:ring-2 focus:ring-[rgba(0,48,53,0.1)]"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidDocument(documentNumber: string) {
  const trimmedValue = documentNumber.trim()

  if (!trimmedValue) {
    return false
  }

  if (/^\d+$/.test(trimmedValue)) {
    return trimmedValue.length === 8
  }

  return /^[A-Za-z0-9-]{4,16}$/.test(trimmedValue)
}

function getFormErrors(form: ClaimsFormState) {
  return {
    fullName: form.fullName.trim() ? "" : "Ingresa el nombre completo.",
    documentNumber: form.documentNumber.trim()
      ? isValidDocument(form.documentNumber)
        ? ""
        : "Ingresa un DNI de 8 dígitos o un CE válido."
      : "Ingresa el DNI o CE.",
    address: form.address.trim() ? "" : "Ingresa el domicilio.",
    phone: /^\d{7,15}$/.test(form.phone.trim())
      ? ""
      : "Ingresa un teléfono numérico válido.",
    email: form.email.trim()
      ? isValidEmail(form.email)
        ? ""
        : "Ingresa un correo válido."
      : "Ingresa el correo electrónico.",
    contractedItemType: form.contractedItemType
      ? ""
      : "Selecciona si corresponde a producto o servicio.",
    itemDescription: form.itemDescription.trim()
      ? ""
      : "Describe el bien contratado.",
    requestType: form.requestType ? "" : "Selecciona reclamo o queja.",
    claimTitle: form.claimTitle.trim() ? "" : "Ingresa el título del reclamo.",
    incidentDescription: form.incidentDescription.trim()
      ? ""
      : "Describe los hechos ocurridos.",
    consent: form.consent
      ? ""
      : "Debes aceptar la política de tratamiento de datos.",
  }
}

function FieldError({
  message,
}: {
  message: string
}) {
  if (!message) {
    return null
  }

  return (
    <p className="mt-2 text-[12px] leading-relaxed text-[#9d432c]">
      {message}
    </p>
  )
}

function SectionHeading({
  showDivider = true,
  index,
  title,
}: {
  index: number
  showDivider?: boolean
  title: string
}) {
  return (
    <div
      className={cn(
        "pt-8",
        showDivider ? "border-t border-[rgba(0,48,53,0.12)]" : ""
      )}
    >
      <h2 className="text-[18px] font-bold text-[var(--color-azul-rgb)]">
        {index}. {title}
      </h2>
    </div>
  )
}

function RadioCard({
  checked,
  compact = false,
  description,
  label,
  name,
  onChange,
  value,
}: {
  checked: boolean
  compact?: boolean
  description?: string
  label: string
  name: string
  onChange: (value: string) => void
  value: string
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer gap-3 transition",
        compact
          ? checked
            ? "rounded-full bg-[rgba(0,48,53,0.07)] px-4 py-2"
            : "rounded-full px-4 py-2 hover:bg-[rgba(0,48,53,0.04)]"
          : checked
            ? "rounded-[18px] border border-[rgba(0,48,53,0.34)] px-4 py-3 ring-1 ring-[rgba(0,48,53,0.06)]"
            : "rounded-[18px] border border-[rgba(0,48,53,0.14)] px-4 py-3 hover:border-[rgba(0,48,53,0.24)]"
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-1 h-4 w-4 border-[var(--color-azul-rgb)] bg-transparent text-[var(--color-azul-rgb)] focus:ring-[rgba(0,48,53,0.16)]"
      />
      <span className="block">
        <span className="block text-[15px] font-semibold text-[var(--color-azul-rgb)]">
          {label}
        </span>
        {description ? (
          <span className="mt-1 block text-[13px] leading-relaxed text-[var(--color-azul-rgb)]/62">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  )
}

export function WebClaimsBookForm() {
  const router = useRouter()
  const [form, setForm] = useState<ClaimsFormState>(initialState)
  const [showErrors, setShowErrors] = useState(false)

  const errors = useMemo(() => getFormErrors(form), [form])
  const isFormValid = Object.values(errors).every((error) => !error)

  const handleFieldChange =
    (field: keyof ClaimsFormState) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const value =
        field === "phone"
          ? event.target.value.replace(/\D/g, "")
          : event.target.value

      setForm((current) => ({
        ...current,
        [field]: value,
      }))
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setShowErrors(true)

    if (!isFormValid) {
      return
    }

    const subject = `Libro de Reclamaciones - ${form.requestType} - ${form.fullName.trim()}`
    const body = [
      "LIBRO DE RECLAMACIONES",
      "",
      "1. INFORMACION DE LA EMPRESA",
      "Razon social: ARMANDO HOTELES S.A.C.",
      "Direccion fiscal: Av. Grau 629 oficina 306 Barranco",
      "",
      "2. IDENTIDAD DEL CONSUMIDOR RECLAMANTE",
      `Nombre completo: ${form.fullName}`,
      `Padre o madre: ${form.guardianName || "No aplica"}`,
      `DNI / CE: ${form.documentNumber}`,
      `Domicilio: ${form.address}`,
      `Telefono: ${form.phone}`,
      `Email: ${form.email}`,
      "",
      "3. IDENTIFICACION DEL BIEN CONTRATADO",
      `Tipo de bien: ${form.contractedItemType}`,
      `Descripcion del bien: ${form.itemDescription}`,
      "",
      "4. DETALLE DE LA RECLAMACION",
      `Tipo de solicitud: ${form.requestType}`,
      "",
      "5. INFORMACION DEL RECLAMO",
      `Titulo del reclamo: ${form.claimTitle}`,
      `Descripcion de los hechos: ${form.incidentDescription}`,
      "",
      "6. CONSENTIMIENTO",
      "Acepto la politica de tratamiento de datos: Si",
    ].join("\n")

    const mailtoUrl = `mailto:hola@humanohoteles.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    const mailtoLink = document.createElement("a")
    mailtoLink.href = mailtoUrl
    mailtoLink.click()

    router.push("/humano/libro-de-reclamaciones/gracias")
  }

  return (
    <form noValidate className="space-y-8" onSubmit={handleSubmit}>
      <SectionHeading
        index={1}
        title="Identidad del Consumidor Reclamante"
        showDivider={false}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
            Nombre completo*
          </span>
          <input
            type="text"
            value={form.fullName}
            onChange={handleFieldChange("fullName")}
            className={textInputClassName}
          />
          {showErrors ? <FieldError message={errors.fullName} /> : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
            Padre o madre (si es menor de edad)
          </span>
          <input
            type="text"
            value={form.guardianName}
            onChange={handleFieldChange("guardianName")}
            className={textInputClassName}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
            DNI / CE*
          </span>
          <input
            type="text"
            value={form.documentNumber}
            onChange={handleFieldChange("documentNumber")}
            className={textInputClassName}
          />
          {showErrors ? <FieldError message={errors.documentNumber} /> : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
            Domicilio*
          </span>
          <input
            type="text"
            value={form.address}
            onChange={handleFieldChange("address")}
            className={textInputClassName}
          />
          {showErrors ? <FieldError message={errors.address} /> : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
            Teléfono*
          </span>
          <input
            type="tel"
            value={form.phone}
            onChange={handleFieldChange("phone")}
            className={textInputClassName}
            inputMode="numeric"
          />
          {showErrors ? <FieldError message={errors.phone} /> : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
            Email*
          </span>
          <input
            type="email"
            value={form.email}
            onChange={handleFieldChange("email")}
            className={textInputClassName}
          />
          {showErrors ? <FieldError message={errors.email} /> : null}
        </label>
      </div>

      <SectionHeading index={2} title="Identificación del Bien Contratado" />

      <div className="space-y-5">
        <div>
          <span className="mb-3 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
            Tipo de bien*
          </span>
          <div className="flex max-w-[360px] flex-col gap-2.5">
            <RadioCard
              compact
              name="contractedItemType"
              value="Producto"
              label="Producto"
              checked={form.contractedItemType === "Producto"}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  contractedItemType: value as ClaimsFormState["contractedItemType"],
                }))
              }
            />
            <RadioCard
              compact
              name="contractedItemType"
              value="Servicio"
              label="Servicio"
              checked={form.contractedItemType === "Servicio"}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  contractedItemType: value as ClaimsFormState["contractedItemType"],
                }))
              }
            />
          </div>
          {showErrors ? <FieldError message={errors.contractedItemType} /> : null}
        </div>

        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
            Descripción del bien*
          </span>
          <textarea
            rows={3}
            value={form.itemDescription}
            onChange={handleFieldChange("itemDescription")}
            className={textAreaClassName}
          />
          {showErrors ? <FieldError message={errors.itemDescription} /> : null}
        </label>
      </div>

      <SectionHeading index={3} title="Detalle de la Reclamación" />

      <div>
        <span className="mb-3 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
          Tipo de solicitud*
        </span>
        <div className="flex max-w-[520px] flex-col gap-2.5">
          <RadioCard
            compact
            name="requestType"
            value="Reclamo"
            label="Reclamo"
            description="Disconformidad relacionada a productos o servicios."
            checked={form.requestType === "Reclamo"}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                requestType: value as ClaimsFormState["requestType"],
              }))
            }
          />
          <RadioCard
            compact
            name="requestType"
            value="Queja"
            label="Queja"
            description="Malestar o descontento respecto a la atención."
            checked={form.requestType === "Queja"}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                requestType: value as ClaimsFormState["requestType"],
              }))
            }
          />
        </div>
        {showErrors ? <FieldError message={errors.requestType} /> : null}
      </div>

      <SectionHeading index={4} title="Información del Reclamo" />

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
            Título del reclamo*
          </span>
          <input
            type="text"
            value={form.claimTitle}
            onChange={handleFieldChange("claimTitle")}
            className={textInputClassName}
          />
          {showErrors ? <FieldError message={errors.claimTitle} /> : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
            Descripción de los hechos*
          </span>
          <textarea
            rows={7}
            value={form.incidentDescription}
            onChange={handleFieldChange("incidentDescription")}
            className={textAreaClassName}
          />
          {showErrors ? <FieldError message={errors.incidentDescription} /> : null}
        </label>
      </div>

      <SectionHeading index={5} title="Consentimiento" />

      <div className="max-w-[560px] pt-1">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                consent: event.target.checked,
              }))
            }
            className="mt-1 h-4 w-4 rounded border-[var(--color-azul-rgb)] bg-transparent text-[var(--color-azul-rgb)] focus:ring-[rgba(0,48,53,0.16)]"
          />
          <span className="block">
            <span className="block text-[15px] font-medium text-[var(--color-azul-rgb)]">
              Acepto la política de tratamiento de datos*
            </span>
            <span className="mt-1 block max-w-[52ch] text-[13px] leading-relaxed text-[var(--color-azul-rgb)]/62">
              Al enviar este formulario aceptas el tratamiento de tus datos
              conforme a nuestra{" "}
              <Link
                href="/humano/terminos-y-condiciones"
                className="font-medium text-[var(--color-azul-rgb)] underline decoration-[rgba(0,48,53,0.22)] underline-offset-4 transition hover:decoration-[rgba(0,48,53,0.52)]"
              >
                política de privacidad
              </Link>
              .
            </span>
          </span>
        </label>
        {showErrors ? <FieldError message={errors.consent} /> : null}
      </div>

      <div className="flex flex-col gap-4 border-t border-[rgba(0,48,53,0.12)] pt-6">
        <div className="flex items-start gap-3 rounded-[24px] bg-[rgba(0,48,53,0.04)] px-4 py-3 text-[13px] leading-relaxed text-[var(--color-azul-rgb)]/72">
          <CircleAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[var(--color-azul-rgb)]/62" />
          <p>
            Todos los campos marcados con * son obligatorios. Por ahora el
            envío se canaliza vía correo mientras integramos el backend
            definitivo.
          </p>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-[12px] leading-relaxed text-[var(--color-azul-rgb)]/54">
            El botón se habilita solo cuando el formulario está completo.
          </p>

          <button
            type="submit"
            disabled={!isFormValid}
            className={cn(
              webPrimaryButtonClass,
              "min-h-12 px-5 py-2.5 text-sm",
              isFormValid
                ? "bg-[var(--color-azul-rgb)] text-white hover:bg-[#00262a]"
                : "cursor-not-allowed bg-[var(--color-azul-rgb)]/18 text-[var(--color-azul-rgb)]/38 shadow-none hover:translate-y-0 hover:shadow-none"
            )}
          >
            Enviar formulario
            <ArrowUpRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </form>
  )
}
