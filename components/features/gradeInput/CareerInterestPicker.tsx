"use client"
// components/features/gradeInput/CareerInterestPicker.tsx
// Optional step — surfaces AI Smart Match category preference

import { cn } from "@/lib/utils"

const OPTIONS = [
  { key: "Medicine & Health",   emoji: "🏥", short: "Medicine" },
  { key: "Engineering & Tech",  emoji: "⚙️", short: "Engineering" },
  { key: "Law & Social Sciences", emoji: "⚖️", short: "Law & Social" },
  { key: "Business",            emoji: "📊", short: "Business" },
  { key: "Education",           emoji: "📚", short: "Education" },
  { key: "Show me everything",  emoji: "🌐", short: "Everything" },
]

type Props = {
  value: string
  onChange: (interest: string) => void
}

export default function CareerInterestPicker({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)] mb-4">
        We&apos;ll surface matching programmes first in your results
      </p>
      <div className="grid grid-cols-3 gap-2.5">
        {OPTIONS.map(({ key, emoji, short }) => {
          const selected = value === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(selected ? "" : key)}
              data-selected={selected}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center",
                "cursor-pointer transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                selected
                  ? "border-brand-500 bg-brand-600 text-white shadow-md shadow-brand-500/20 scale-[1.03]"
                  : "border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-sm hover:-translate-y-0.5",
              )}
            >
              <span className="text-2xl leading-none" aria-hidden="true">{emoji}</span>
              <span className={cn(
                "text-xs font-semibold leading-tight",
                selected ? "text-white" : "text-[var(--foreground)]",
              )}>
                {short}
              </span>

              {/* Selected tick */}
              {selected && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-400 text-white shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
