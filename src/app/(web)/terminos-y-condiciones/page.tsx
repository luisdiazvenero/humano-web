import Image from "next/image"
import Link from "next/link"
import { Inter } from "next/font/google"

import { WebFooterSocialLinks } from "@/components/humano-web/WebFooterSocialLinks"
import { WebStickyHeader } from "@/components/humano-web/WebStickyHeader"
import { WEB_I18N, type WebLang } from "@/lib/web/i18n"
import { buildPageMetadata } from "@/lib/web/seo"

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

const TERMS_I18N = {
  es: {
    eyebrow: "Información legal",
    h1: "Términos y Condiciones",
    intro:
      "En HUMANO HOTEL respetamos tu privacidad y tu información personal. Para nosotros es importante que tú sepas qué datos tenemos, cómo los usamos y cómo puedes controlarlos.",
    arcoH2: "Derechos ARCO",
    arcoP1:
      "En HUMANO HOTEL respetamos tu privacidad y tu información personal. Para nosotros es importante que tú sepas qué datos tenemos, cómo los usamos y cómo puedes controlarlos.",
    arcoP2:
      "Los Derechos ARCO son un conjunto de derechos que te permite ejercer control sobre tus datos personales de acuerdo con la Ley de Protección de Datos Personales (Ley N° 29733) en Perú. Los derechos son:",
    arcoList: [
      "Conocer qué datos tuyos tratamos",
      "Corregir datos inexactos o desactualizados",
      "Cancelar la solicitud de la eliminación de tus datos cuando corresponda",
      "Oponerte al uso de tus datos para determinadas finalidades",
    ],
    controllerH3: "Responsable del tratamiento de los datos",
    controllerList: {
      corp: "Razón Social: ARMANDO HOTELES S.A.C.",
      trade: "Nombre comercial: HUMANO HOTEL",
      address: "Domicilio fiscal: Malecón Balta 710, Miraflores",
      emailLabel: "Correo de contacto:",
    },
    collectH3: "Datos personales que recopilamos",
    collectIntro: "Podemos recopilar los siguientes datos personales, según el tipo de relación que mantengas con nosotros:",
    collectList: [
      "Datos de identificación: nombre, apellido, tipo y número de documento",
      "Datos de contacto: correo electrónico, teléfono",
      "Datos de reserva y estadía: fechas, preferencias, historial de alojamiento",
      "Datos de facturación y pago",
      "Datos de navegación en nuestra web (cookies y tecnologías similares)",
    ],
    collectNote:
      "No recopilamos datos sensibles, salvo que sea estrictamente necesario y con tu consentimiento expreso.",
    purposeH3: "Finalidad del tratamiento de los datos",
    purposeIntro: "Tus datos personales serán utilizados para:",
    purposeList: [
      "Gestionar reservas y servicios del hotel",
      "Atender consultas, solicitudes o reclamos",
      "Enviar confirmaciones, información operativa y comunicaciones relacionadas con tu estadía",
      "Cumplir obligaciones legales y contractuales",
      "Mejorar nuestros servicios y tu experiencia",
      "Enviar comunicaciones comerciales o promocionales, solo si nos has dado tu consentimiento",
    ],
    retentionH3: "Plazo de conservación",
    retentionP:
      "Conservaremos tus datos personales únicamente durante el tiempo necesario para cumplir con las finalidades para las que fueron recopilados o mientras exista una relación contractual o legal que lo justifique.",
    securityH3: "Seguridad de la información",
    securityP:
      "HUMANO HOTEL adopta las medidas técnicas, organizativas y legales necesarias para garantizar la seguridad de tus datos personales y evitar su pérdida, uso indebido, acceso no autorizado o divulgación.",
    exerciseH3: "Derechos ARCO",
    exerciseSub: "¿Cómo ejercer tus derechos ARCO?",
    exerciseP1Prefix: "Para ejercer tus derechos ARCO, envíanos una solicitud a ",
    exerciseP1Suffix: ".",
    exerciseP2: "La solicitud debe incluir:",
    exerciseList: [
      "Nombre completo y documento de identidad",
      "Derecho que deseas ejercer",
      "Descripción clara de tu solicitud",
      "Medio de respuesta (correo electrónico)",
    ],
    exerciseP3:
      "Responderemos tu solicitud dentro de los plazos establecidos por la ley.",
    transferH3: "Transferencia de datos",
    transferP:
      "Tus datos personales no serán compartidos con terceros, salvo cuando sea necesario para la prestación del servicio (proveedores tecnológicos, plataformas de pago, sistemas hoteleros) o por obligación legal. En todos los casos, exigimos que se respeten los estándares de protección de datos.",
    cookiesH3: "Uso de cookies",
    cookiesP:
      "Nuestro sitio web puede utilizar cookies para mejorar tu experiencia de navegación. Puedes configurar tu navegador para aceptar, rechazar o eliminar cookies en cualquier momento.",
    changesH3: "Modificaciones a esta política",
    changesP:
      "HUMANO HOTEL se reserva el derecho de modificar esta Política de Protección de Datos Personales. Cualquier cambio será publicado en esta misma sección y entrará en vigencia desde su publicación.",
  },
  en: {
    eyebrow: "Legal information",
    h1: "Terms and Conditions",
    intro:
      "At HUMANO HOTEL, we respect your privacy and personal information. It is important to us that you know what data we collect, how we use it, and how you can control it.",
    arcoH2: "ARCO Rights",
    arcoP1:
      "At HUMANO HOTEL, we respect your privacy and personal information. It is important to us that you know what data we collect, how we use it, and how you can control it.",
    arcoP2:
      "ARCO Rights are a set of rights that allow you to exercise control over your personal data in accordance with the Personal Data Protection Law (Law No. 29733) in Peru. These rights include:",
    arcoList: [
      "Knowing what personal data we process about you",
      "Correcting inaccurate or outdated information",
      "Requesting the deletion of your data when applicable",
      "Objecting to the use of your data for certain purposes",
    ],
    controllerH3: "Data Controller",
    controllerList: {
      corp: "Corporate Name: ARMANDO HOTELES S.A.C.",
      trade: "Trade Name: HUMANO HOTEL",
      address: "Registered Address: Malecón Balta 710, Miraflores",
      emailLabel: "Contact Email:",
    },
    collectH3: "Personal Data We Collect",
    collectIntro: "Depending on the type of relationship you have with us, we may collect the following personal data:",
    collectList: [
      "Identification data: first name, last name, type and number of identification document",
      "Contact information: email address, phone number",
      "Reservation and stay details: dates, preferences, accommodation history",
      "Billing and payment information",
      "Website browsing data (cookies and similar technologies)",
    ],
    collectNote:
      "We do not collect sensitive personal data unless it is strictly necessary and with your express consent.",
    purposeH3: "Purpose of Data Processing",
    purposeIntro: "Your personal data will be used to:",
    purposeList: [
      "Manage hotel reservations and services",
      "Respond to inquiries, requests, or complaints",
      "Send confirmations, operational information, and communications related to your stay",
      "Comply with legal and contractual obligations",
      "Improve our services and your experience",
      "Send commercial or promotional communications only if you have given your consent",
    ],
    retentionH3: "Data Retention Period",
    retentionP:
      "We will retain your personal data only for as long as necessary to fulfill the purposes for which it was collected or while there is a contractual or legal relationship that justifies its retention.",
    securityH3: "Information Security",
    securityP:
      "HUMANO HOTEL adopts the technical, organizational, and legal measures necessary to ensure the security of your personal data and prevent its loss, misuse, unauthorized access, or disclosure.",
    exerciseH3: "ARCO Rights",
    exerciseSub: "How to Exercise Your ARCO Rights",
    exerciseP1Prefix: "To exercise your ARCO Rights, please send us a request to ",
    exerciseP1Suffix: ".",
    exerciseP2: "Your request must include:",
    exerciseList: [
      "Full name and identification document",
      "The right you wish to exercise",
      "A clear description of your request",
      "Preferred response method (email)",
    ],
    exerciseP3:
      "We will respond to your request within the timeframes established by law.",
    transferH3: "Data Transfers",
    transferP:
      "Your personal data will not be shared with third parties except when necessary for the provision of services (technology providers, payment platforms, hotel management systems) or when required by law. In all cases, we require compliance with data protection standards.",
    cookiesH3: "Use of Cookies",
    cookiesP:
      "Our website may use cookies to improve your browsing experience. You may configure your browser to accept, reject, or delete cookies at any time.",
    changesH3: "Changes to This Policy",
    changesP:
      "HUMANO HOTEL reserves the right to modify this Personal Data Protection Policy. Any changes will be published in this same section and will become effective upon publication.",
  },
} as const

export function HumanoTerminosPageContent({ lang = "es" }: { lang?: WebLang }) {
  const t = TERMS_I18N[lang]
  const tw = WEB_I18N[lang]
  const homeHref = lang === "en" ? "/en" : "/"
  const termsHref = lang === "en" ? "/en/terms-and-conditions" : "/terminos-y-condiciones"
  const complaintsHref = lang === "en" ? "/en/complaints-book" : "/libro-de-reclamaciones"

  return (
    <div className={`${bodyFont.className} min-h-screen bg-[var(--color-crema)] text-[var(--color-azul-rgb)]`}>
      <WebStickyHeader brandHref={homeHref} lang={lang} />

      <main>
        <section className="relative overflow-hidden bg-[var(--color-azul-rgb)] pt-28 sm:pt-32">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,48,53,0.98)_0%,rgba(0,48,53,0.92)_44%,rgba(0,48,53,0.76)_100%)]" />
            <div className="absolute left-[-8%] top-[12%] h-64 w-64 rounded-full bg-[var(--color-amarillo)]/10 blur-3xl" />
            <div className="absolute bottom-[-12%] right-[2%] h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          </div>

          <div className="relative mx-auto w-full max-w-[1180px] px-6 pb-24 sm:px-10 sm:pb-28 xl:px-14">
            <div className="mx-auto max-w-[860px] pt-16 sm:pt-20 lg:pt-24">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/54">
                {t.eyebrow}
              </p>
              <h1 className="mt-5 font-serif text-[36px] leading-[0.96] text-white">
                {t.h1}
              </h1>
              <p className="mt-6 max-w-[58ch] text-[16px] leading-8 text-white/76 sm:text-[17px]">
                {t.intro}
              </p>
            </div>
          </div>
        </section>

        <section className="relative -mt-10 sm:-mt-12">
          <div className="w-full rounded-t-[38px] bg-[var(--color-crema)] px-6 pb-16 pt-12 sm:rounded-t-[42px] sm:px-10 sm:pt-14 xl:px-14">
            <article className="mx-auto max-w-[1180px]">
              <div className="mx-auto max-w-[860px] space-y-7 text-[14px] leading-[1.75] text-[var(--color-azul-rgb)]/78">
                <section>
                  <h2 className="font-serif text-[29px] leading-[1.02] text-[var(--color-azul-rgb)] sm:text-[31px]">
                    {t.arcoH2}
                  </h2>
                  <p className="mt-5">{t.arcoP1}</p>
                  <p className="mt-4">{t.arcoP2}</p>
                  <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[var(--color-azul-rgb)]/76 marker:text-[var(--color-azul-rgb)]/56">
                    {t.arcoList.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                    {t.controllerH3}
                  </h3>
                  <ul className="mt-4 list-disc space-y-1.5 pl-5">
                    <li>{t.controllerList.corp}</li>
                    <li>{t.controllerList.trade}</li>
                    <li>{t.controllerList.address}</li>
                    <li>
                      {t.controllerList.emailLabel}{" "}
                      <a
                        href="mailto:hola@humanohoteles.com"
                        className="font-medium text-[var(--color-azul-rgb)] underline decoration-[rgba(0,48,53,0.22)] underline-offset-4 transition hover:decoration-[rgba(0,48,53,0.52)]"
                      >
                        hola@humanohoteles.com
                      </a>
                    </li>
                  </ul>
                </section>

                <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                    {t.collectH3}
                  </h3>
                  <p className="mt-5">{t.collectIntro}</p>
                  <ul className="mt-4 list-disc space-y-1.5 pl-5 marker:text-[var(--color-azul-rgb)]/56">
                    {t.collectList.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-4">{t.collectNote}</p>
                </section>

                <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                    {t.purposeH3}
                  </h3>
                  <p className="mt-5">{t.purposeIntro}</p>
                  <ul className="mt-4 list-disc space-y-1.5 pl-5 marker:text-[var(--color-azul-rgb)]/56">
                    {t.purposeList.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                    {t.retentionH3}
                  </h3>
                  <p className="mt-5">{t.retentionP}</p>
                </section>

                <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                    {t.securityH3}
                  </h3>
                  <p className="mt-5">{t.securityP}</p>
                </section>

                <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                    {t.exerciseH3}
                  </h3>
                  <p className="mt-5">{t.exerciseSub}</p>
                  <p className="mt-4">
                    {t.exerciseP1Prefix}
                    <a
                      href="mailto:hola@humanohoteles.com"
                      className="font-medium text-[var(--color-azul-rgb)] underline decoration-[rgba(0,48,53,0.22)] underline-offset-4 transition hover:decoration-[rgba(0,48,53,0.52)]"
                    >
                      hola@humanohoteles.com
                    </a>
                    {t.exerciseP1Suffix}
                  </p>
                  <p className="mt-4">{t.exerciseP2}</p>
                  <ul className="mt-4 list-disc space-y-1.5 pl-5 marker:text-[var(--color-azul-rgb)]/56">
                    {t.exerciseList.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-4">{t.exerciseP3}</p>
                </section>

                <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                    {t.transferH3}
                  </h3>
                  <p className="mt-5">{t.transferP}</p>
                </section>

                <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                    {t.cookiesH3}
                  </h3>
                  <p className="mt-5">{t.cookiesP}</p>
                </section>

                <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                    {t.changesH3}
                  </h3>
                  <p className="mt-5">{t.changesP}</p>
                </section>
              </div>
            </article>
          </div>
        </section>

        <footer className="w-full bg-[var(--color-azul-rgb)] text-white">
          <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-6 px-4 py-8 text-sm text-white/90 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
            <WebFooterSocialLinks />

            <div className="flex flex-col items-center gap-4 text-center">
              <p>{tw.footerCopyright}</p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.12em] text-white/70">
                <Link href={complaintsHref} className="transition-colors hover:text-[var(--color-amarillo)]">
                  {tw.footerComplaints}
                </Link>
                <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
                <Link href={termsHref} className="transition-colors hover:text-[var(--color-amarillo)]">
                  {tw.footerTerms}
                </Link>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <Link
                href="https://www.marriott.com/default.mi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Marriott Bonvoy"
              >
                <Image
                  src="/bonvoy-wordmark.svg"
                  alt="Marriott Bonvoy"
                  width={144}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export const metadata = buildPageMetadata("es", {
  title: "Términos y Condiciones | Hotel Humano",
  description:
    "Información sobre privacidad, datos personales y derechos ARCO en Hotel Humano Miraflores.",
  canonical: "/terminos-y-condiciones",
  alternates: {
    es: "/terminos-y-condiciones",
    en: "/en/terms-and-conditions",
  },
})

export default function HumanoTerminosPage() {
  return <HumanoTerminosPageContent lang="es" />
}
