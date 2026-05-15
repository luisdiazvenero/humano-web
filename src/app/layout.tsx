import type { Metadata } from "next"
import Script from "next/script"
import { headers } from "next/headers"
// Commented temporarily for build - fonts work fine in production
// import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// })

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// })

export const metadata: Metadata = {
  metadataBase: new URL("https://humanohoteles.com"),
  title: "Hotel HUMANO · Miraflores",
  description:
    "Hotel Humano en Miraflores, Lima. Tribute Portfolio by Marriott con diseño único, experiencias locales y conexión auténtica con la ciudad.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Hotel Humano",
    locale: "es_PE",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/logo-humano.svg",
        width: 800,
        height: 800,
        alt: "Hotel Humano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel HUMANO · Miraflores",
    description:
      "Hotel Humano en Miraflores, Lima. Tribute Portfolio by Marriott con diseño único, experiencias locales y conexión auténtica con la ciudad.",
    images: ["/logo-humano.svg"],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = (await headers()).get("x-pathname") || ""
  const lang = pathname.startsWith("/en") ? "en" : "es"
  return (
    <html lang={lang}>
      <body
        className="font-sans bg-background text-foreground antialiased"
      >
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-72C40YXW4P" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-72C40YXW4P');
        `}</Script>
        {children}
      </body>
    </html>
  )
}