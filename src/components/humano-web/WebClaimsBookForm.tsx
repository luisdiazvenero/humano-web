"use client"

import { type ChangeEvent, type FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRight, CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { webPrimaryButtonClass } from "@/components/humano-web/webStyles"

type ClaimsLang = "es" | "en"

const CLAIMS_I18N: Record<ClaimsLang, {
  sections: { consumer: string; item: string; details: string; info: string; consent: string }
  fields: {
    fullName: string
    guardian: string
    document: string
    address: string
    phone: string
    email: string
    contractedType: string
    itemDescription: string
    requestType: string
    claimTitle: string
    incidentDescription: string
    consent: string
    consentLong: string
    privacyLink: string
  }
  options: {
    product: string
    service: string
    claim: string
    complaint: string
    claimDesc: string
    complaintDesc: string
  }
  errors: {
    fullName: string
    documentMissing: string
    documentInvalid: string
    address: string
    phone: string
    emailMissing: string
    emailInvalid: string
    contractedType: string
    itemDescription: string
    requestType: string
    claimTitle: string
    incidentDescription: string
    consent: string
  }
  submit: string
  submitNote: string
  helperNote: string
  emailBodyLabels: {
    title: string
    company: string
    corp: string
    address: string
    consumerSection: string
    fullName: string
    guardian: string
    notApplicable: string
    document: string
    addressLabel: string
    phone: string
    email: string
    itemSection: string
    itemType: string
    itemDesc: string
    detailsSection: string
    requestType: string
    infoSection: string
    claimTitle: string
    incident: string
    consentSection: string
    consentYes: string
  }
  subjectPrefix: string
}> = {
  es: {
    sections: {
      consumer: "Identidad del Consumidor Reclamante",
      item: "Identificación del Bien Contratado",
      details: "Detalle de la Reclamación",
      info: "Información del Reclamo",
      consent: "Consentimiento",
    },
    fields: {
      fullName: "Nombre completo*",
      guardian: "Padre o madre (si es menor de edad)",
      document: "DNI / CE*",
      address: "Domicilio*",
      phone: "Teléfono*",
      email: "Email*",
      contractedType: "Tipo de bien*",
      itemDescription: "Descripción del bien*",
      requestType: "Tipo de solicitud*",
      claimTitle: "Título del reclamo*",
      incidentDescription: "Descripción de los hechos*",
      consent: "Acepto la política de tratamiento de datos*",
      consentLong:
        "Al enviar este formulario aceptas el tratamiento de tus datos conforme a nuestra ",
      privacyLink: "política de privacidad",
    },
    options: {
      product: "Producto",
      service: "Servicio",
      claim: "Reclamo",
      complaint: "Queja",
      claimDesc: "Disconformidad relacionada a productos o servicios.",
      complaintDesc: "Malestar o descontento respecto a la atención.",
    },
    errors: {
      fullName: "Ingresa el nombre completo.",
      documentMissing: "Ingresa el DNI o CE.",
      documentInvalid: "Ingresa un DNI de 8 dígitos o un CE válido.",
      address: "Ingresa el domicilio.",
      phone: "Ingresa un teléfono numérico válido.",
      emailMissing: "Ingresa el correo electrónico.",
      emailInvalid: "Ingresa un correo válido.",
      contractedType: "Selecciona si corresponde a producto o servicio.",
      itemDescription: "Describe el bien contratado.",
      requestType: "Selecciona reclamo o queja.",
      claimTitle: "Ingresa el título del reclamo.",
      incidentDescription: "Describe los hechos ocurridos.",
      consent: "Debes aceptar la política de tratamiento de datos.",
    },
    submit: "Enviar formulario",
    submitNote: "El botón se habilita solo cuando el formulario está completo.",
    helperNote:
      "Todos los campos marcados con * son obligatorios. Por ahora el envío se canaliza vía correo mientras integramos el backend definitivo.",
    emailBodyLabels: {
      title: "LIBRO DE RECLAMACIONES",
      company: "1. INFORMACION DE LA EMPRESA",
      corp: "Razon social: ARMANDO HOTELES S.A.C.",
      address: "Direccion fiscal: Malecón Balta 710, Miraflores",
      consumerSection: "2. IDENTIDAD DEL CONSUMIDOR RECLAMANTE",
      fullName: "Nombre completo",
      guardian: "Padre o madre",
      notApplicable: "No aplica",
      document: "DNI / CE",
      addressLabel: "Domicilio",
      phone: "Telefono",
      email: "Email",
      itemSection: "3. IDENTIFICACION DEL BIEN CONTRATADO",
      itemType: "Tipo de bien",
      itemDesc: "Descripcion del bien",
      detailsSection: "4. DETALLE DE LA RECLAMACION",
      requestType: "Tipo de solicitud",
      infoSection: "5. INFORMACION DEL RECLAMO",
      claimTitle: "Titulo del reclamo",
      incident: "Descripcion de los hechos",
      consentSection: "6. CONSENTIMIENTO",
      consentYes: "Acepto la politica de tratamiento de datos: Si",
    },
    subjectPrefix: "Libro de Reclamaciones",
  },
  en: {
    sections: {
      consumer: "Consumer Identification",
      item: "Identification of the Purchased",
      details: "Claim Details",
      info: "Claim Information",
      consent: "Consent",
    },
    fields: {
      fullName: "Full Name*",
      guardian: "Father or Mother (if underage)",
      document: "ID / Foreigner ID Card (CE)*",
      address: "Address*",
      phone: "Phone Number*",
      email: "Email Address*",
      contractedType: "Type of Good*",
      itemDescription: "Description of the Good or Service*",
      requestType: "Type of Request*",
      claimTitle: "Claim Title*",
      incidentDescription: "Description of the Facts*",
      consent: "I accept the data processing policy*",
      consentLong:
        "By submitting this form, you agree to the processing of your data in accordance with our ",
      privacyLink: "privacy policy",
    },
    options: {
      product: "Product",
      service: "Service",
      claim: "Claim",
      complaint: "Complaint",
      claimDesc: "Dissatisfaction related to products or services.",
      complaintDesc: "Discomfort or dissatisfaction regarding customer service.",
    },
    errors: {
      fullName: "Enter your full name.",
      documentMissing: "Enter your ID or CE.",
      documentInvalid: "Enter a valid 8-digit ID or a valid CE.",
      address: "Enter your address.",
      phone: "Enter a valid numeric phone number.",
      emailMissing: "Enter your email address.",
      emailInvalid: "Enter a valid email address.",
      contractedType: "Select whether it is a product or a service.",
      itemDescription: "Describe the purchased good or service.",
      requestType: "Select claim or complaint.",
      claimTitle: "Enter a claim title.",
      incidentDescription: "Describe what happened.",
      consent: "You must accept the data processing policy.",
    },
    submit: "Submit form",
    submitNote: "The button is enabled only when the form is complete.",
    helperNote:
      "All fields marked with * are mandatory. For now, submissions are processed via email while we integrate the final backend system.",
    emailBodyLabels: {
      title: "COMPLAINTS BOOK",
      company: "1. COMPANY INFORMATION",
      corp: "Corporate Name: ARMANDO HOTELES S.A.C.",
      address: "Registered Address: Malecón Balta 710, Miraflores",
      consumerSection: "2. CONSUMER IDENTIFICATION",
      fullName: "Full name",
      guardian: "Father or mother",
      notApplicable: "Not applicable",
      document: "ID / CE",
      addressLabel: "Address",
      phone: "Phone",
      email: "Email",
      itemSection: "3. IDENTIFICATION OF THE PURCHASED",
      itemType: "Type of good",
      itemDesc: "Description of the good",
      detailsSection: "4. CLAIM DETAILS",
      requestType: "Type of request",
      infoSection: "5. CLAIM INFORMATION",
      claimTitle: "Claim title",
      incident: "Description of the facts",
      consentSection: "6. CONSENT",
      consentYes: "I accept the data processing policy: Yes",
    },
    subjectPrefix: "Complaints Book",
  },
}

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

function getFormErrors(form: ClaimsFormState, lang: ClaimsLang) {
  const e = CLAIMS_I18N[lang].errors
  return {
    fullName: form.fullName.trim() ? "" : e.fullName,
    documentNumber: form.documentNumber.trim()
      ? isValidDocument(form.documentNumber)
        ? ""
        : e.documentInvalid
      : e.documentMissing,
    address: form.address.trim() ? "" : e.address,
    phone: /^\d{7,15}$/.test(form.phone.trim()) ? "" : e.phone,
    email: form.email.trim()
      ? isValidEmail(form.email)
        ? ""
        : e.emailInvalid
      : e.emailMissing,
    contractedItemType: form.contractedItemType ? "" : e.contractedType,
    itemDescription: form.itemDescription.trim() ? "" : e.itemDescription,
    requestType: form.requestType ? "" : e.requestType,
    claimTitle: form.claimTitle.trim() ? "" : e.claimTitle,
    incidentDescription: form.incidentDescription.trim()
      ? ""
      : e.incidentDescription,
    consent: form.consent ? "" : e.consent,
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

export function WebClaimsBookForm({ lang = "es" }: { lang?: ClaimsLang } = {}) {
  const t = CLAIMS_I18N[lang]
  const router = useRouter()
  const [form, setForm] = useState<ClaimsFormState>(initialState)
  const [showErrors, setShowErrors] = useState(false)

  const errors = useMemo(() => getFormErrors(form, lang), [form, lang])
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

    const labels = t.emailBodyLabels
    const subject = `${t.subjectPrefix} - ${form.requestType} - ${form.fullName.trim()}`
    const body = [
      labels.title,
      "",
      labels.company,
      labels.corp,
      labels.address,
      "",
      labels.consumerSection,
      `${labels.fullName}: ${form.fullName}`,
      `${labels.guardian}: ${form.guardianName || labels.notApplicable}`,
      `${labels.document}: ${form.documentNumber}`,
      `${labels.addressLabel}: ${form.address}`,
      `${labels.phone}: ${form.phone}`,
      `${labels.email}: ${form.email}`,
      "",
      labels.itemSection,
      `${labels.itemType}: ${form.contractedItemType}`,
      `${labels.itemDesc}: ${form.itemDescription}`,
      "",
      labels.detailsSection,
      `${labels.requestType}: ${form.requestType}`,
      "",
      labels.infoSection,
      `${labels.claimTitle}: ${form.claimTitle}`,
      `${labels.incident}: ${form.incidentDescription}`,
      "",
      labels.consentSection,
      labels.consentYes,
    ].join("\n")

    const mailtoUrl = `mailto:hola@humanohoteles.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    const mailtoLink = document.createElement("a")
    mailtoLink.href = mailtoUrl
    mailtoLink.click()

    router.push(lang === "en" ? "/en/complaints-book/thanks" : "/libro-de-reclamaciones/gracias")
  }

  return (
    <form noValidate className="space-y-8" onSubmit={handleSubmit}>
      <SectionHeading
        index={1}
        title={t.sections.consumer}
        showDivider={false}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
            {t.fields.fullName}
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
            {t.fields.guardian}
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
            {t.fields.document}
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
            {t.fields.address}
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
            {t.fields.phone}
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
            {t.fields.email}
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

      <SectionHeading index={2} title={t.sections.item} />

      <div className="space-y-5">
        <div>
          <span className="mb-3 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
            {t.fields.contractedType}
          </span>
          <div className="flex max-w-[360px] flex-col gap-2.5">
            <RadioCard
              compact
              name="contractedItemType"
              value="Producto"
              label={t.options.product}
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
              label={t.options.service}
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
            {t.fields.itemDescription}
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

      <SectionHeading index={3} title={t.sections.details} />

      <div>
        <span className="mb-3 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
          {t.fields.requestType}
        </span>
        <div className="flex max-w-[520px] flex-col gap-2.5">
          <RadioCard
            compact
            name="requestType"
            value="Reclamo"
            label={t.options.claim}
            description={t.options.claimDesc}
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
            label={t.options.complaint}
            description={t.options.complaintDesc}
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

      <SectionHeading index={4} title={t.sections.info} />

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-[var(--color-azul-rgb)]">
            {t.fields.claimTitle}
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
            {t.fields.incidentDescription}
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

      <SectionHeading index={5} title={t.sections.consent} />

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
              {t.fields.consent}
            </span>
            <span className="mt-1 block max-w-[52ch] text-[13px] leading-relaxed text-[var(--color-azul-rgb)]/62">
              {t.fields.consentLong}
              <Link
                href={lang === "en" ? "/en/terms-and-conditions" : "/terminos-y-condiciones"}
                className="font-medium text-[var(--color-azul-rgb)] underline decoration-[rgba(0,48,53,0.22)] underline-offset-4 transition hover:decoration-[rgba(0,48,53,0.52)]"
              >
                {t.fields.privacyLink}
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
          <p>{t.helperNote}</p>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-[12px] leading-relaxed text-[var(--color-azul-rgb)]/54">
            {t.submitNote}
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
            {t.submit}
            <ArrowUpRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </form>
  )
}
