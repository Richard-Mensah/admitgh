// components/layout/Navbar.tsx
import Link from "next/link"
import NavbarClient from "./NavbarClient"

function GradCapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
              <GradCapIcon />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-brand-600">Admit</span>
              <span className="text-[var(--foreground)]">GH</span>
            </span>
            <span className="hidden text-xs text-[var(--muted)] sm:block border-l border-[var(--border)] pl-2.5 leading-tight">
              Honest Admission Chances
            </span>
          </Link>

          {/* Client-side nav: desktop links + mobile hamburger */}
          <NavbarClient />

        </div>
      </div>
    </nav>
  )
}
