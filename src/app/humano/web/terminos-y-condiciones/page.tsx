import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Inter } from "next/font/google"
import { Facebook, Instagram } from "lucide-react"

import { WebStickyHeader } from "@/components/humano-web/WebStickyHeader"

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

const pageNavItems = [
  { label: "Hotel", href: "/humano/web#inicio" },
  { label: "Habitaciones", href: "/humano/web/habitaciones" },
  { label: "Servicios", href: "/humano/web/servicios" },
  { label: "Experiencia", href: "/humano/web/experiencia" },
  { label: "Contacto", href: "/humano/web/contacto" },
]

export const metadata: Metadata = {
  title: "Términos y Condiciones · Humano Website",
  description:
    "Información sobre privacidad, datos personales y derechos ARCO en Humano Hotel.",
}

export default function HumanoTerminosPage() {
  return (
    <div className={`${bodyFont.className} min-h-screen bg-[var(--color-crema)] text-[var(--color-azul-rgb)]`}>
      <WebStickyHeader
        brandHref="/humano/web#inicio"
        navItems={pageNavItems}
      />

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
                Información legal
              </p>
              <h1 className="mt-5 font-serif text-[36px] leading-[0.96] text-white">
                Términos y Condiciones
              </h1>
              <p className="mt-6 max-w-[58ch] text-[16px] leading-8 text-white/76 sm:text-[17px]">
                En HUMANO HOTEL respetamos tu privacidad y tu información
                personal. Para nosotros es importante que tú sepas qué datos
                tenemos, cómo los usamos y cómo puedes controlarlos.
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
                      Derechos Arco
                    </h2>
                    <p className="mt-5">
                      En HUMANO HOTEL respetamos tu privacidad y tu
                      información personal. Para nosotros es importante que tú
                      sepas qué datos tenemos, cómo los usamos y cómo puedes
                      controlarlos.
                    </p>
                    <p className="mt-4">
                      Los Derechos ARCO son un conjunto de derechos que te
                      permite ejercer control sobre tus datos personales de
                      acuerdo con la Ley de Protección de Datos Personales (Ley
                      N° 29733) en Perú. Los derechos son:
                    </p>
                    <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[var(--color-azul-rgb)]/76 marker:text-[var(--color-azul-rgb)]/56">
                      <li>Conocer qué datos tuyos tratamos</li>
                      <li>Corregir datos inexactos o desactualizados</li>
                      <li>
                        Cancelar la solicitud de la eliminación de tus datos
                        cuando corresponda
                      </li>
                      <li>
                        Oponerte al uso de tus datos para determinadas
                        finalidades
                      </li>
                    </ul>
                  </section>

                  <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                      Responsable del tratamiento de los datos
                    </h3>
                    <ul className="mt-4 list-disc space-y-1.5 pl-5">
                      <li>Razón Social: ARMANDO HOTELES S.A.C.</li>
                      <li>Nombre comercial: HUMANO HOTEL</li>
                      <li>Domicilio fiscal: Av. Grau 629 oficina 306 Barranco</li>
                      <li>
                        Correo de contacto:{" "}
                        <a
                          href="mailto:hola@humanohotel.com"
                          className="font-medium text-[var(--color-azul-rgb)] underline decoration-[rgba(0,48,53,0.22)] underline-offset-4 transition hover:decoration-[rgba(0,48,53,0.52)]"
                        >
                          hola@humanohotel.com
                        </a>
                      </li>
                    </ul>
                  </section>

                  <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                      Datos personales que recopilamos
                    </h3>
                    <p className="mt-5">
                      Podemos recopilar los siguientes datos personales, según
                      el tipo de relación que mantengas con nosotros:
                    </p>
                    <ul className="mt-4 list-disc space-y-1.5 pl-5 marker:text-[var(--color-azul-rgb)]/56">
                      <li>
                        Datos de identificación: nombre, apellido, tipo y
                        número de documento
                      </li>
                      <li>
                        Datos de contacto: correo electrónico, teléfono
                      </li>
                      <li>
                        Datos de reserva y estadía: fechas, preferencias,
                        historial de alojamiento
                      </li>
                      <li>Datos de facturación y pago</li>
                      <li>
                        Datos de navegación en nuestra web (cookies y
                        tecnologías similares)
                      </li>
                    </ul>
                    <p className="mt-4">
                      No recopilamos datos sensibles, salvo que sea
                      estrictamente necesario y con tu consentimiento expreso.
                    </p>
                  </section>

                  <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                      Finalidad del tratamiento de los datos
                    </h3>
                    <p className="mt-5">
                      Tus datos personales serán utilizados para:
                    </p>
                    <ul className="mt-4 list-disc space-y-1.5 pl-5 marker:text-[var(--color-azul-rgb)]/56">
                      <li>Gestionar reservas y servicios del hotel</li>
                      <li>Atender consultas, solicitudes o reclamos</li>
                      <li>
                        Enviar confirmaciones, información operativa y
                        comunicaciones relacionadas con tu estadía
                      </li>
                      <li>Cumplir obligaciones legales y contractuales</li>
                      <li>Mejorar nuestros servicios y tu experiencia</li>
                      <li>
                        Enviar comunicaciones comerciales o promocionales,
                        solo si nos has dado tu consentimiento
                      </li>
                    </ul>
                  </section>

                  <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                      Plazo de conservación
                    </h3>
                    <p className="mt-5">
                      Conservaremos tus datos personales únicamente durante el
                      tiempo necesario para cumplir con las finalidades para
                      las que fueron recopilados o mientras exista una relación
                      contractual o legal que lo justifique.
                    </p>
                  </section>

                  <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                      Seguridad de la información
                    </h3>
                    <p className="mt-5">
                      HUMANO HOTEL adopta las medidas técnicas, organizativas y
                      legales necesarias para garantizar la seguridad de tus
                      datos personales y evitar su pérdida, uso indebido,
                      acceso no autorizado o divulgación.
                    </p>
                  </section>

                  <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                      Derechos ARCO
                    </h3>
                    <p className="mt-5">¿Cómo ejercer tus derechos ARCO?</p>
                    <p className="mt-4">
                      Para ejercer tus derechos ARCO, envíanos una solicitud a{" "}
                      <a
                        href="mailto:hola@humanohoteles.com"
                        className="font-medium text-[var(--color-azul-rgb)] underline decoration-[rgba(0,48,53,0.22)] underline-offset-4 transition hover:decoration-[rgba(0,48,53,0.52)]"
                      >
                        hola@humanohoteles.com
                      </a>
                      .
                    </p>
                    <p className="mt-4">La solicitud debe incluir:</p>
                    <ul className="mt-4 list-disc space-y-1.5 pl-5 marker:text-[var(--color-azul-rgb)]/56">
                      <li>Nombre completo y documento de identidad</li>
                      <li>Derecho que deseas ejercer</li>
                      <li>Descripción clara de tu solicitud</li>
                      <li>Medio de respuesta (correo electrónico)</li>
                    </ul>
                    <p className="mt-4">
                      Responderemos tu solicitud dentro de los plazos
                      establecidos por la ley.
                    </p>
                  </section>

                  <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                      Transferencia de datos
                    </h3>
                    <p className="mt-5">
                      Tus datos personales no serán compartidos con terceros,
                      salvo cuando sea necesario para la prestación del servicio
                      (proveedores tecnológicos, plataformas de pago, sistemas
                      hoteleros) o por obligación legal. En todos los casos,
                      exigimos que se respeten los estándares de protección de
                      datos.
                    </p>
                  </section>

                  <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                      Uso de cookies
                    </h3>
                    <p className="mt-5">
                      Nuestro sitio web puede utilizar cookies para mejorar tu
                      experiencia de navegación. Puedes configurar tu navegador
                      para aceptar, rechazar o eliminar cookies en cualquier
                      momento.
                    </p>
                  </section>

                  <section className="border-t border-[rgba(0,48,53,0.12)] pt-7">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-azul-rgb)]">
                      Modificaciones a esta política
                  </h3>
                    <p className="mt-5">
                      HUMANO HOTEL se reserva el derecho de modificar esta
                      Política de Protección de Datos Personales. Cualquier
                      cambio será publicado en esta misma sección y entrará en
                      vigencia desde su publicación.
                    </p>
                  </section>
              </div>
            </article>
          </div>
        </section>

        <footer className="w-full bg-[var(--color-azul-rgb)] text-white">
          <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-6 px-4 py-8 text-sm text-white/90 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <Link
                href="https://www.instagram.com/humanolima/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Humano Lima"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:text-[var(--color-amarillo)]"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.facebook.com/humanolima/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Humano Lima"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:text-[var(--color-amarillo)]"
              >
                <Facebook className="h-5 w-5" />
              </Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <p>
                2026 Hotel Humano · Malecón Balta 710, Miraflores.
                Desarrollado por Armando Hoteles
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.12em] text-white/70">
                <Link
                  href="#"
                  className="transition-colors hover:text-[var(--color-amarillo)]"
                >
                  Libro de Reclamaciones
                </Link>
                <span
                  aria-hidden="true"
                  className="hidden h-1 w-1 rounded-full bg-white/30 sm:block"
                />
                <Link
                  href="/humano/web/terminos-y-condiciones"
                  className="transition-colors hover:text-[var(--color-amarillo)]"
                >
                  Términos y Condiciones
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
