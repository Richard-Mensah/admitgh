"use client"

import { useState } from "react"
import Link from "next/link"

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function NavbarClient() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop nav links — hidden on mobile */}
      <div className="hidden sm:flex items-center gap-1">
        <Link
          href="/check"
          className="rounded-md px-3 py-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Check Chances
        </Link>
        <Link
          href="/#how-it-works"
          className="rounded-md px-3 py-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          How it works
        </Link>
        <Link
          href="/check"
          className="ml-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 transition-colors shadow-sm"
        >
          Get Started →
        </Link>
      </div>

      {/* Hamburger button — mobile only */}
      <button
        className="sm:hidden rounded-md p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
      >
        {isOpen ? <XIcon /> : <MenuIcon />}
      </button>

      {/* Mobile slide-down menu */}
      {isOpen && (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-16 z-40 border-b border-[var(--border)] bg-[var(--background)] shadow-lg sm:hidden animate-fade-in"
        >
          <div className="flex flex-col gap-1 px-4 py-4">
            <Link
              href="/check"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--card-bg)] transition-colors"
            >
              Check My Chances
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--muted)] hover:bg-[var(--card-bg)] transition-colors"
            >
              How it works
            </Link>
            <div className="border-t border-[var(--border)] mt-2 pt-3">
              <Link
                href="/check"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-lg bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-500 transition-colors"
              >
                Get Started — GHS 15 →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
