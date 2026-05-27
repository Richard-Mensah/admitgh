"use client"
// app/error.tsx
import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl">⚠️</p>
      <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-[var(--muted)]">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-brand-600 px-6 py-3 text-white font-medium hover:bg-brand-700 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[var(--border)] px-6 py-3 text-[var(--foreground)] font-medium hover:bg-[var(--card-bg)] transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
