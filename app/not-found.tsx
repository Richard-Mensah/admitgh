// app/not-found.tsx
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-[var(--muted)]">
        This page doesn&apos;t exist — maybe the link expired?
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 text-white font-medium hover:bg-brand-700 transition-colors"
      >
        Back to AdmitGH
      </Link>
    </div>
  )
}
