import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "AdmitGH — Know Your Real Admission Chance",
    template: "%s | AdmitGH",
  },
  description:
    "Ghana's first admission probability engine for WASSCE/SSSCE students. Get your honest Reach / Match / Safe portfolio — not just whether you qualify, but your real chance of getting in.",
  keywords: [
    "Ghana university admission",
    "WASSCE aggregate",
    "SSSCE",
    "cut-off points Ghana",
    "university chances Ghana",
    "KNUST admission",
    "UG admission",
    "UCC admission",
    "admitgh",
  ],
  openGraph: {
    title: "AdmitGH — Know Your Real Admission Chance",
    description:
      "Enter your WASSCE grades and get an honest probability of admission at every Ghanaian university — sorted into Reach, Match and Safe.",
    type: "website",
    locale: "en_GH",
    siteName: "AdmitGH",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdmitGH — Know Your Real Admission Chance",
    description: "Honest admission probabilities for Ghanaian WASSCE students.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://admitgh.com"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  )
}
