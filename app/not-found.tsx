// app/not-found.tsx
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center bg-[var(--card-bg)]">
        <p className="text-7xl font-bold text-brand-600 tabular-nums">404</p>
        <h1 className="mt-4 text-2xl font-bold text-[var(--foreground)]">Page not found</h1>
        <p className="mt-2 text-[var(--muted)] max-w-sm">
          This page doesn&apos;t exist or may have moved. Check the URL, or start from the homepage.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="rounded-lg bg-brand-600 px-6 py-3 text-white font-semibold hover:bg-brand-700 transition-colors"
          >
            Back to AdmitGH
          </Link>
          <Link
            href="/check"
            className="rounded-lg border border-[var(--border)] px-6 py-3 text-[var(--foreground)] font-semibold hover:bg-[var(--background)] transition-colors"
          >
            Check my grades →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
