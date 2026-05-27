"use client"
// components/features/gradeInput/AggregatePreview.tsx
// Live aggregate display — updates as the student fills grades

import { cn } from "@/lib/utils"

type Props = {
  aggregate: number | null
  isComplete: boolean
}

export default function AggregatePreview({ aggregate, isComplete }: Props) {
  const getQualityLabel = (agg: number) => {
    if (agg <= 8) return { label: "Excellent", color: "text-emerald-600 dark:text-emerald-400" }
    if (agg <= 12) return { label: "Very Good", color: "text-emerald-500 dark:text-emerald-400" }
    if (agg <= 18) return { label: "Good", color: "text-amber-600 dark:text-amber-400" }
    if (agg <= 24) return { label: "Average", color: "text-amber-500 dark:text-amber-400" }
    return { label: "Below Average", color: "text-red-600 dark:text-red-400" }
  }

  if (!isComplete) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 text-center">
        <p className="text-4xl font-bold text-[var(--muted)]">—</p>
        <p className="mt-1 text-sm text-[var(--muted)]">Fill all 6 grades to see your aggregate</p>
      </div>
    )
  }

  const quality = aggregate ? getQualityLabel(aggregate) : null

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/30 p-5 text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
        Your Aggregate
      </p>
      <p className="text-5xl font-bold text-brand-700 dark:text-brand-300">
        {aggregate}
      </p>
      {quality && (
        <p className={cn("mt-1 text-sm font-medium", quality.color)}>
          {quality.label}
        </p>
      )}
      <p className="mt-2 text-xs text-[var(--muted)]">
        Lower is better · Best possible: 6 · Passing range: 6–36
      </p>
    </div>
  )
}
