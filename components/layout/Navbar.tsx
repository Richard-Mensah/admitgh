// components/layout/Navbar.tsx
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
              Admit<span className="text-[var(--foreground)]">GH</span>
            </span>
            <span className="hidden text-xs text-[var(--muted)] sm:block">
              Honest Admission Chances
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/check"
              className="rounded-md px-3 py-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Check Chances
            </Link>
            <Link
              href="/check"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
