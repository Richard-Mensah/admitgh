"use client"
// components/features/gradeInput/AggregatePreview.tsx
// Premium live aggregate display — updates as the student fills grades

import { cn } from "@/lib/utils"
import { AGGREGATE_MIN, AGGREGATE_MAX } from "@/constants"

type Props = {
  aggregate: number | null
  isComplete: boolean
}

type Quality = { label: string; color: string; bg: string; border: string; barColor: string }

function getQuality(agg: number): Quality {
  if (agg <= 8)  return { label: "Excellent 🏆", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-950/40", border: "border-emerald-300 dark:border-emerald-700", barColor: "bg-emerald-500" }
  if (agg <= 12) return { label: "Very Good ⭐",  color: "text-teal-700 dark:text-teal-300",    bg: "bg-teal-100 dark:bg-teal-950/40",    border: "border-teal-300 dark:border-teal-700",    barColor: "bg-teal-500" }
  if (agg <= 18) return { label: "Good",           color: "text-amber-700 dark:text-amber-300",   bg: "bg-amber-100 dark:bg-amber-950/40",   border: "border-amber-300 dark:border-amber-700",   barColor: "bg-amber-500" }
  if (agg <= 24) return { label: "Average",         color: "text-orange-700 dark:text-orange-300",  bg: "bg-orange-100 dark:bg-orange-950/40",  border: "border-orange-300 dark:border-orange-700",  barColor: "bg-orange-500" }
  return               { label: "Below Average",    color: "text-red-700 dark:text-red-300",     bg: "bg-red-100 dark:bg-red-950/40",     border: "border-red-300 dark:border-red-700",     barColor: "bg-red-400" }
}

export default function AggregatePreview({ aggregate, isComplete }: Props) {
  if (!isComplete || aggregate === null) {
    return (
      <div className="mx-6 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--card-bg)] py-7 px-6 text-center">
        <div className="flex justify-center gap-2 mb-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-[var(--border)] animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <p className="text-xl font-bold text-[var(--muted)]">—</p>
        <p className="mt-1 text-sm text-[var(--muted)]">Fill all 6 grades to see your aggregate</p>
      </div>
    )
  }

  const quality = getQuality(aggregate)
  // Position on the 6–36 scale as a percentage (clamped 0–100)
  const pct = Math.min(100, Math.max(0, Math.round(((aggregate - AGGREGATE_MIN) / (AGGREGATE_MAX - AGGREGATE_MIN)) * 100)))

  return (
    <div
      className={cn(
        "mx-6 rounded-2xl border-2 p-6 text-center",
        "bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/30 dark:to-[var(--card-bg)]",
        "border-brand-200 dark:border-brand-800",
      )}
    >
      {/* Section label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">
        Your Aggregate
      </p>

      {/* Giant number */}
      <p className="text-7xl font-black tracking-tighter text-brand-700 dark:text-brand-300 leading-none tabular-nums">
        {aggregate}
      </p>

      {/* Quality badge */}
      <div className="mt-4 flex justify-center">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold",
            quality.color, quality.bg, quality.border,
          )}
        >
          {quality.label}
        </span>
      </div>

      {/* Scale bar — lower is better, so bar fills from LEFT (better = more bar) */}
      <div className="mt-6 px-1">
        {/* Inverted: aggregate 6 = 100% fill, aggregate 36 = 0% fill */}
        <div className="relative h-2.5 w-full rounded-full bg-[var(--border)]">
          <div
            className={cn("h-full rounded-full transition-all duration-700", quality.barColor)}
            style={{ width: `${100 - pct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-[var(--muted)]">
          <span className="font-medium text-emerald-600">6 ← Best</span>
          <span>Worst → 36</span>
        </div>
      </div>

      {/* Context */}
      <p className="mt-4 text-xs text-[var(--muted)]">
        Lower is better · Based on your best 6 grades · Range: 6 – 36
      </p>
    </div>
  )
}
