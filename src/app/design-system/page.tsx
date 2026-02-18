"use client"

import Link from "next/link"
import { ArrowLeft, CircleDot, Palette, SwatchBook } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ConserjeItemsMessage } from "@/components/humano-v09/conserje-items-message"
import { FullLogo } from "@/components/humano-v09/FullLogo"
import { ImageSlider } from "@/components/humano-v09/ImageSlider"
import { Logo } from "@/components/humano-v09/Logo"
import { RoomMenuCarousel } from "@/components/humano-v09/RoomMenuCarousel"
import {
  activeDesignSystemComponents,
  type DesignSystemComponent,
} from "@/lib/design-system/component-registry"
import {
  designSystemConserjeItems,
  designSystemRoomCarouselItems,
  designSystemSliderImages,
} from "@/lib/design-system/mocks"

const foundationSwatches = [
  {
    name: "Azul oficial (HEX)",
    token: "--color-azul",
    value: "#003035",
    textClass: "text-white",
    note: "Color principal oficial por regla de marca.",
  },
  {
    name: "Azul manual (RGB 0/55/68)",
    token: "--color-azul-rgb",
    value: "#003744",
    textClass: "text-white",
    note: "Se conserva como tono intermedio de soporte.",
  },
  {
    name: "Crema",
    token: "--color-crema",
    value: "#ECE7D0",
    textClass: "text-[var(--color-azul)]",
    note: "Base de superficie y fondos cálidos.",
  },
  {
    name: "Amarillo",
    token: "--color-amarillo",
    value: "#FFC85D",
    textClass: "text-[var(--color-azul)]",
    note: "Acento principal para acciones.",
  },
]

const semanticTokens = [
  {
    token: "--background",
    usage: "Fondo principal de la app",
    sampleClass: "bg-background text-foreground",
  },
  {
    token: "--foreground",
    usage: "Texto principal y titulares",
    sampleClass: "bg-foreground text-background",
  },
  {
    token: "--primary",
    usage: "CTA principal y estados enfáticos",
    sampleClass: "bg-primary text-primary-foreground",
  },
  {
    token: "--card",
    usage: "Superficies de cards y módulos",
    sampleClass: "bg-card text-card-foreground border border-border",
  },
  {
    token: "--muted",
    usage: "Fondos suaves y chips secundarios",
    sampleClass: "bg-muted text-muted-foreground",
  },
  {
    token: "--ring",
    usage: "Focus ring y accesibilidad",
    sampleClass: "bg-ring text-[var(--color-azul)]",
  },
]

const scaleRows = [
  { token: "--color-azul", value: "#003035" },
  { token: "--color-azul-rgb", value: "#003744" },
  { token: "--color-azul-soft", value: "#004D5C" },
  { token: "--color-azul-deep", value: "#00262A" },
  { token: "--color-crema", value: "#ECE7D0" },
  { token: "--color-crema-soft", value: "#F5F5DC" },
  { token: "--color-crema-muted", value: "#C9C4B1" },
  { token: "--color-amarillo", value: "#FFC85D" },
  { token: "--color-amarillo-strong", value: "#E8B931" },
  { token: "--color-amarillo-soft", value: "#F8D478" },
  { token: "--color-amarillo-pale", value: "#F9EBC8" },
  { token: "--color-overlay", value: "#0F1113" },
]

const manualRows = [
  {
    name: "Azul oficial",
    pantone: "3035 U / 3035 C",
    cmyk: "C 100 / M 47 / Y 23 / K 60",
    rgb: "0 / 55 / 68",
    hex: "3035 (manual)",
    operational: "#003035 (oficial) + #003744 (intermedio RGB)",
  },
  {
    name: "Crema",
    pantone: "7527 U / 7527 C",
    cmyk: "C 3 / M 4 / Y 14 / K 8",
    rgb: "236 / 231 / 208",
    hex: "#ECE7D0",
    operational: "#ECE7D0",
  },
  {
    name: "Amarillo",
    pantone: "141 U / 141 C",
    cmyk: "C 0 / M 25 / Y 76 / K 0",
    rgb: "255 / 200 / 93",
    hex: "#FFC85D",
    operational: "#FFC85D",
  },
]

const usageRules = [
  "Usar siempre tokens (`bg-primary`, `text-foreground`, `border-border`) y evitar hardcodes hex en componentes activos.",
  "Mantener `--color-azul` como primario oficial. `--color-azul-rgb` se usa como soporte por coherencia con RGB del manual.",
  "Reutilizar `--color-overlay` y `--shadow-brand-lg` para modales/visor ampliado, evitando sombras ad-hoc.",
  "Para nuevos componentes, registrar metadata en `src/lib/design-system/component-registry.ts`.",
]

function renderPreview(component: DesignSystemComponent) {
  switch (component.id) {
    case "humano-v09-full-logo":
      return (
        <div className="rounded-2xl border border-border/50 bg-[var(--color-crema)] p-8">
          <FullLogo className="h-16 w-auto" />
        </div>
      )
    case "humano-v09-logo":
      return (
        <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-azul)] text-white">
            <Logo className="h-6 w-auto text-white" />
          </div>
          <p className="text-sm text-muted-foreground">Isotipo usado como avatar del asistente.</p>
        </div>
      )
    case "humano-v09-image-slider":
      return (
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="aspect-[16/10]">
            <ImageSlider images={designSystemSliderImages} intervalMs={4500} />
          </div>
        </div>
      )
    case "humano-v09-room-menu-carousel":
      return (
        <div className="rounded-2xl border border-border/50 bg-card p-4">
          <RoomMenuCarousel
            items={designSystemRoomCarouselItems}
            onSelect={() => {}}
            autoPlayMs={5000}
          />
        </div>
      )
    case "humano-v09-conserje-items-message":
      return (
        <div className="rounded-2xl border border-border/50 bg-background p-4">
          <ConserjeItemsMessage items={designSystemConserjeItems} onAction={() => {}} />
        </div>
      )
    case "ui-button":
      return (
        <div className="flex flex-wrap gap-3 rounded-2xl border border-border/50 bg-card p-6">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      )
    case "ui-card":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Card Base</CardTitle>
            <CardDescription>Superficie estándar para contenido modular.</CardDescription>
            <CardAction>
              <Button size="sm" variant="outline">
                Acción
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Este bloque hereda `card`, `card-foreground` y `border`.
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">Estado: activo</CardFooter>
        </Card>
      )
    default:
      return null
  }
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:px-8 sm:pt-14">
        <header className="mb-8 rounded-3xl border border-border/40 bg-card/70 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                HUMANO Web
              </p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">Design System</h1>
              <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
                Catálogo operativo de tokens y componentes activos de la experiencia actual (`/humano`).
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al dashboard
              </Link>
            </Button>
          </div>
        </header>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <h2 className="text-xl font-semibold">Brand Foundations</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {foundationSwatches.map((swatch) => (
              <Card key={swatch.token} className="overflow-hidden p-0">
                <CardContent className="p-0">
                  <div
                    className={`flex min-h-36 flex-col justify-between p-4 ${swatch.textClass}`}
                    style={{ backgroundColor: swatch.value }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide">{swatch.name}</p>
                    <div>
                      <p className="text-sm font-medium">{swatch.value}</p>
                      <p className="text-xs opacity-80">{swatch.token}</p>
                    </div>
                  </div>
                  <div className="border-t border-border/50 p-4">
                    <p className="text-xs text-muted-foreground">{swatch.note}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-5">
            <CardHeader>
              <CardTitle className="text-base">Regla aplicada del manual</CardTitle>
              <CardDescription>
                Se prioriza HEX literal oficial (`#003035`) y se documenta el RGB del manual como tono
                intermedio (`#003744`).
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="px-2 py-2 font-medium">Color</th>
                    <th className="px-2 py-2 font-medium">Pantone</th>
                    <th className="px-2 py-2 font-medium">CMYK</th>
                    <th className="px-2 py-2 font-medium">RGB</th>
                    <th className="px-2 py-2 font-medium">HEX (manual)</th>
                    <th className="px-2 py-2 font-medium">Operativo Web</th>
                  </tr>
                </thead>
                <tbody>
                  {manualRows.map((row) => (
                    <tr key={row.name} className="border-b border-border/40">
                      <td className="px-2 py-2 font-medium">{row.name}</td>
                      <td className="px-2 py-2">{row.pantone}</td>
                      <td className="px-2 py-2">{row.cmyk}</td>
                      <td className="px-2 py-2">{row.rgb}</td>
                      <td className="px-2 py-2">{row.hex}</td>
                      <td className="px-2 py-2">{row.operational}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-primary" />
            <h2 className="text-xl font-semibold">Semantic Tokens</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {semanticTokens.map((item) => (
              <Card key={item.token}>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-sm font-semibold">{item.token}</p>
                    <p className="text-xs text-muted-foreground">{item.usage}</p>
                  </div>
                  <div
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm ${item.sampleClass}`}
                  >
                    Sample
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <SwatchBook className="h-4 w-4 text-primary" />
            <h2 className="text-xl font-semibold">Color Scales & Shadows</h2>
          </div>
          <Card>
            <CardContent className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
              {scaleRows.map((row) => (
                <div key={row.token} className="rounded-xl border border-border/50 p-3">
                  <div className="mb-2 h-12 rounded-md border border-black/10" style={{ backgroundColor: row.value }} />
                  <p className="text-xs font-semibold">{row.token}</p>
                  <p className="text-xs text-muted-foreground">{row.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-[var(--shadow-brand-sm)]">
              <p className="text-sm font-semibold">Shadow Small</p>
              <p className="mt-1 text-xs text-muted-foreground">`--shadow-brand-sm`</p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-[var(--color-overlay)] p-5 text-white shadow-[var(--shadow-brand-lg)]">
              <p className="text-sm font-semibold">Shadow Large + Overlay</p>
              <p className="mt-1 text-xs text-white/70">`--shadow-brand-lg` + `--color-overlay`</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <SwatchBook className="h-4 w-4 text-primary" />
            <h2 className="text-xl font-semibold">Component Gallery (active)</h2>
          </div>
          <div className="space-y-4">
            {activeDesignSystemComponents.map((component) => (
              <Card key={component.id}>
                <CardHeader>
                  <CardTitle className="text-base">{component.name}</CardTitle>
                  <CardDescription>{component.notes}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    <p>Source: {component.sourcePath}</p>
                    <p>Used in: {component.usedIn.join(", ")}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {component.tokens.map((token) => (
                      <span
                        key={token}
                        className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] font-semibold"
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                  {renderPreview(component)}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-primary" />
            <h2 className="text-xl font-semibold">Usage Rules</h2>
          </div>
          <Card>
            <CardContent className="space-y-2 p-5">
              {usageRules.map((rule) => (
                <p key={rule} className="text-sm text-foreground/90">
                  - {rule}
                </p>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
