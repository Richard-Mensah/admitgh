"use client"
// components/features/gradeInput/AggregatePreview.tsx
// Compact live-bar strip pinned inside the glass card header

type Props = {
  aggregate: number | null
  totalFilledGrades: number
  currentStep: number
}

export default function AggregatePreview({ aggregate, totalFilledGrades, currentStep }: Props) {
  const progressPct = Math.round((totalFilledGrades / 7) * 100)

  return (
    <div className="live-bar flex items-center justify-between gap-4 px-6 py-3">
      {/* Live indicator + label */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" aria-hidden="true" />
        <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide hidden sm:block">
          Live Aggregate
        </span>
      </div>

      {/* Aggregate value */}
      <div className="shrink-0 text-lg font-black tabular-nums text-brand-400">
        {aggregate !== null ? (
          <>
            {aggregate}
            <span className="text-xs font-normal text-[var(--muted)] ml-1">/ 6 ✓</span>
          </>
        ) : (
          <span className="text-[var(--muted)]">—</span>
        )}
      </div>

      {/* Progress bar + step counter */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="h-1.5 flex-1 rounded-full overflow-hidden step-connector-pending">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-xs text-[var(--muted)] shrink-0 tabular-nums">
          Step {currentStep}/4
        </span>
      </div>
    </div>
  )
}
