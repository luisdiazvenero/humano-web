import type { Metadata } from "next"
import Script from "next/script"
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
  title: "Hotel HUMANO · Miraflores",
  description:
    "Demo local de la experiencia conversacional del Hotel Humano Miraflores.",
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
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