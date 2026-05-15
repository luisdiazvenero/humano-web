import type { Metadata } from "next"
import type { WebLang } from "@/lib/web/i18n"

interface PageSeoInput {
  title: string
  description: string
  canonical: string
  alternates: { es: string; en: string }
  ogImage?: string
}

export function buildPageMetadata(lang: WebLang, opts: PageSeoInput): Metadata {
  const ogImage = opts.ogImage ?? "/logo-humano.svg"
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: opts.canonical,
      languages: {
        es: opts.alternates.es,
        en: opts.alternates.en,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Hotel Humano",
      title: opts.title,
      description: opts.description,
      url: opts.canonical,
      locale: lang === "en" ? "en_US" : "es_PE",
      alternateLocale: lang === "en" ? ["es_PE"] : ["en_US"],
      images: [
        {
          url: ogImage,
          alt: "Hotel Humano",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [ogImage],
    },
  }
}
