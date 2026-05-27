// components/ui/ProbabilityBar.tsx
// Gradient-filled probability bar with confidence band overlay

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

// Hardcoded gradient strings so the background-size trick works at any fill width
const barGradient: Record<Tier, string> = {
  safe:  "linear-gradient(90deg, #15803d 0%, #22c55e 100%)",
  match: "linear-gradient(90deg, #b45309 0%, #f59e0b 100%)",
  reach: "linear-gradient(90deg, #b91c1c 0%, #ef4444 100%)",
}

const bandBg: Record<Tier, string> = {
  safe:  "bg-emerald-200/70 dark:bg-emerald-800/40",
  match: "bg-amber-200/70   dark:bg-amber-800/40",
  reach: "bg-red-200/70     dark:bg-red-800/40",
}

export default function ProbabilityBar({
  p, low, high, tier, showLabels = true, className,
}: Props) {
  const pPct   = clamp(p   * 100, 0, 100)
  const lowPct = clamp(low * 100, 0, 100)
  const hiPct  = clamp(high* 100, 0, 100)

  return (
    <div className={cn("w-full", className)}>
      {showLabels && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[var(--muted)]">0%</span>
          <span className="text-sm font-semibold text-[var(--foreground)]">
            {formatPercent(p)} chance
          </span>
          <span className="text-xs text-[var(--muted)]">100%</span>
        </div>
      )}

      {/* Track */}
      <div
        className="relative h-3.5 w-full rounded-full bg-[var(--border)] overflow-hidden"
        role="meter"
        aria-valuenow={Math.round(pPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${Math.round(pPct)}% admission chance (range ${Math.round(lowPct)}–${Math.round(hiPct)}%)`}
      >
        {/* Confidence band: shows uncertainty range (low → high) */}
        <div
          className={cn("absolute inset-y-0 rounded-full", bandBg[tier])}
          style={{ left: `${lowPct}%`, width: `${hiPct - lowPct}%` }}
          aria-hidden="true"
        />

        {/* Gradient fill: 0 → p — rendered above band so it covers the left portion cleanly */}
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pPct}%`,
            backgroundImage: barGradient[tier],
            // Stretch gradient across the full track width, not just the filled portion
            backgroundSize: pPct > 0 ? `${10000 / pPct}% 100%` : "100% 100%",
            backgroundPosition: "left center",
          }}
          aria-hidden="true"
        />
      </div>

      {showLabels && (
        <p className="mt-1 text-xs text-[var(--muted)] text-right">
          Range: {formatPercent(low)} – {formatPercent(high)}
        </p>
      )}
    </div>
  )
}
