"use client"
// components/features/gradeInput/CareerInterestPicker.tsx
// Optional step — surfaces AI Smart Match category preference

import { CAREER_INTEREST_CATEGORIES } from "@/constants"
import { cn } from "@/lib/utils"

const OPTIONS = [
  { key: "Medicine & Health", emoji: "🏥" },
  { key: "Engineering & Tech", emoji: "⚙️" },
  { key: "Law & Social Sciences", emoji: "⚖️" },
  { key: "Business", emoji: "📊" },
  { key: "Education", emoji: "📚" },
  { key: "Show me everything", emoji: "🌐" },
]

type Props = {
  value: string
  onChange: (interest: string) => void
}

export default function CareerInterestPicker({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-[var(--foreground)] mb-1">
        What field interests you most?{" "}
        <span className="font-normal text-[var(--muted)]">(optional)</span>
      </p>
      <p className="text-xs text-[var(--muted)] mb-3">
        We&apos;ll prioritise matching programmes in your results
      </p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map(({ key, emoji }) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(value === key ? "" : key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all",
              "focus:outline-none focus:ring-2 focus:ring-brand-500",
              value === key
                ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300"
                : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400 hover:text-[var(--foreground)]"
            )}
            aria-pressed={value === key}
          >
            <span aria-hidden="true">{emoji}</span>
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}
