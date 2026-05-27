// components/ui/ProbabilityBar.tsx
// Visual bar showing probability point + confidence band

import { formatPercent, clamp } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { Tier } from "@/constants"

type Props = {
  p: number
  low: number
  high: number
  tier: Tier
  showLabels?: boolean
  className?: string
}

export default function ProbabilityBar({ p, low, high, tier, showLabels = true, className }: Props) {
  const pPct = clamp(p * 100, 0, 100)
  const lowPct = clamp(low * 100, 0, 100)
  const highPct = clamp(high * 100, 0, 100)

  const barColor = {
    safe: "bg-emerald-500",
    match: "bg-amber-500",
    reach: "bg-red-500",
  }[tier]

  const bandColor = {
    safe: "bg-emerald-200 dark:bg-emerald-900/50",
    match: "bg-amber-200 dark:bg-amber-900/50",
    reach: "bg-red-200 dark:bg-red-900/50",
  }[tier]

  return (
    <div className={cn("w-full", className)}>
      {showLabels && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-[var(--muted)]">0%</span>
          <span className="text-xs font-semibold text-[var(--foreground)]">
            {formatPercent(p)} chance
          </span>
          <span className="text-xs text-[var(--muted)]">100%</span>
        </div>
      )}

      {/* Track */}
      <div className="relative h-3 w-full rounded-full bg-[var(--border)] overflow-hidden">
        {/* Confidence band */}
        <div
          className={cn("absolute inset-y-0 rounded-full", bandColor)}
          style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
          aria-hidden="true"
        />
        {/* Point estimate */}
        <div
          className={cn("absolute inset-y-0 w-1 rounded-full", barColor)}
          style={{ left: `${pPct}%`, transform: "translateX(-50%)" }}
          aria-hidden="true"
        />
      </div>

      {showLabels && (
        <p className="mt-1 text-xs text-[var(--muted)] text-center">
          Range: {formatPercent(low)}–{formatPercent(high)}
        </p>
      )}
    </div>
  )
}
