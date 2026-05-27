"use client"
// components/features/whatIf/WhatIfToggle.tsx
// Button that opens/closes the what-if grade simulator panel.

type Props = {
  isOpen: boolean
  onToggle: () => void
}

export default function WhatIfToggle({ isOpen, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:border-brand-400 hover:text-brand-600 transition-colors w-full sm:w-auto"
    >
      {/* Sparkle / wand icon */}
      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current text-brand-500 shrink-0" aria-hidden="true">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
      </svg>
      <span>{isOpen ? "Hide what-if simulator" : "What if I improved a grade?"}</span>
      {/* Chevron */}
      <svg
        viewBox="0 0 20 20"
        className={`h-4 w-4 fill-current ml-auto text-[var(--muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
        aria-hidden="true"
      >
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  )
}
