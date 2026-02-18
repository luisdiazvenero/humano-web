import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  Activity,
  BedDouble,
  Building2,
  CloudSun,
  Compass,
  ConciergeBell,
  Mic,
  Sparkles,
  ArrowRight,
} from "lucide-react"

import { FullLogo } from "@/components/humano/FullLogo"

type VersionCard = {
  id: string
  title: string
  subtitle: string
  href: string
  featured?: boolean
  icon: LucideIcon
}

const versions: VersionCard[] = [
  {
    id: "V09",
    title: "V09 · Humano",
    subtitle: "Nueva principal: intro inmersivo de anfitrión + flujo completo de conserje.",
    href: "/humano",
    featured: true,
    icon: ConciergeBell,
  },
  {
    id: "V08",
    title: "V08 · Conserje",
    subtitle: "Asistente conversacional avanzado con catalogo, contexto y acciones.",
    href: "/conserje",
    icon: ConciergeBell,
  },
  {
    id: "V07",
    title: "V07 · Demo AI",
    subtitle: "Flujo experimental con respuestas dinamicas asistidas por IA.",
    href: "/demoai",
    icon: Sparkles,
  },
  {
    id: "V06",
    title: "V06 · Demo Guiada",
    subtitle: "Recorrido conversacional estructurado con perfiles predefinidos.",
    href: "/demo",
    icon: Activity,
  },
  {
    id: "V05",
    title: "V05 · Agente",
    subtitle: "Experiencia anfitrion con entrada inmersiva y chat.",
    href: "/agente",
    icon: Mic,
  },
  {
    id: "V04",
    title: "V04 · Preview Video",
    subtitle: "Version de apertura audiovisual y transicion a contenido.",
    href: "/propuesta-2",
    icon: CloudSun,
  },
  {
    id: "V03",
    title: "V03 · Layout Alternativo",
    subtitle: "Composicion split-screen para narrativa visual de marca.",
    href: "/propuesta-3",
    icon: Building2,
  },
  {
    id: "V02",
    title: "V02 · Propuesta Directa",
    subtitle: "Base integral de propuesta institucional y experiencia principal.",
    href: "/propuesta",
    icon: BedDouble,
  },
  {
    id: "V01",
    title: "V01 · Wireframe",
    subtitle: "Primera iteracion funcional del recorrido de usuario.",
    href: "/inicio",
    icon: Compass,
  },
]

export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-10 sm:px-8 sm:pt-14">
        <header className="mb-10 rounded-3xl border border-border/40 bg-card/75 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <FullLogo className="h-16 w-auto text-[#003744] sm:h-20" />
            </div>

            <div className="max-w-xl space-y-2 sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Dashboard de Presentacion
              </p>
              <h1 className="text-balance text-2xl font-semibold leading-tight sm:text-4xl">
                Versiones de Experiencia HUMANO
              </h1>
              <p className="text-pretty text-sm text-muted-foreground sm:text-base">
                Navega de la version mas reciente a la primera iteracion para contar el avance con claridad.
              </p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {versions.map((version, index) => {
            const Icon = version.icon

            return (
              <article
                key={version.id}
                className={[
                  "animate-fade-in-up rounded-2xl border border-border/45 bg-card/85 p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  version.featured
                    ? "sm:p-7 md:col-span-2 md:min-h-[280px] lg:min-h-[300px]"
                    : "min-h-[225px]",
                ].join(" ")}
                style={{ animationDelay: `${120 + index * 70}ms` }}
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <span className="inline-flex min-h-8 items-center rounded-full border border-border/60 bg-muted/25 px-2.5 text-xs font-semibold uppercase tracking-wide text-foreground/85">
                    {version.id}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                <div className="space-y-3">
                  <h2
                    className={[
                      "text-balance font-semibold leading-tight",
                      version.featured ? "text-2xl sm:text-3xl" : "text-xl",
                    ].join(" ")}
                  >
                    {version.title}
                  </h2>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {version.subtitle}
                  </p>
                </div>

                <div className="mt-7">
                  <Link
                    href={version.href}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Ver version
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            )
          })}
        </section>
      </main>
    </div>
  )
}
