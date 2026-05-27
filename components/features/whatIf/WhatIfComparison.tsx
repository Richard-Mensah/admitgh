"use client"
// components/features/whatIf/WhatIfComparison.tsx
// Side-by-side Safe / Match / Reach counts: current vs hypothetical new aggregate.
// Recomputes tiers client-side using stored probability factors (no API call needed).

import { useMemo } from "react"
import { tierOf } from "@/lib/probability"
import type { ProgrammeWithProbability } from "@/types/probability"

type Props = {
  results: ProgrammeWithProbability[]
  originalAggregate: number
  newAggregate: number
  delta: number // negative = improvement
}

/** Recompute tier for a programme given a different aggregate, using stored factors */
function recomputeTier(result: ProgrammeWithProbability, newAggregate: number) {
  const { cutoff, aps, tightening } = result.probability
  const newMargin = cutoff - newAggregate

  const base = 1 / (1 + Math.exp(-0.9 * newMargin))
  const compFactor = 1 / (1 + 0.16 * Math.max(0, aps - 1))
  const driftFactor = 1 - Math.min(0.18, Math.max(0, tightening) * 0.04)

  let p = base * compFactor * driftFactor
  if (newMargin < 0) p = Math.min(p, 0.08)
  p = Math.max(0.02, Math.min(0.97, p))

  return tierOf(p, newMargin)
}

const TIERS = [
  {
    key: "safe" as const,
    label: "Safe",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800",
  },
  {
    key: "match" as const,
    label: "Match",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800",
  },
  {
    key: "reach" as const,
    label: "Reach",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800",
  },
]

export default function WhatIfComparison({ results, originalAggregate, newAggregate, delta }: Props) {
  const newCounts = useMemo(() => {
    const tiers = results.map((r) => recomputeTier(r, newAggregate))
    return {
      safe: tiers.filter((t) => t === "safe").length,
      match: tiers.filter((t) => t === "match").length,
      reach: tiers.filter((t) => t === "reach").length,
    }
  }, [results, newAggregate])

  const originalCounts = {
    safe: results.filter((r) => r.tier === "safe").length,
    match: results.filter((r) => r.tier === "match").length,
    reach: results.filter((r) => r.tier === "reach").length,
  }

  const improved = delta < 0

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          How your chances would change
        </p>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            improved
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-[var(--card-bg)] text-[var(--muted)]"
          }`}
        >
          Aggregate {originalAggregate} → {newAggregate}{" "}
          ({delta < 0 ? `${delta}` : `+${delta}`})
        </span>
      </div>

      {/* Side-by-side grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Current */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-center text-[var(--muted)]">Now</p>
          {TIERS.map(({ key, label, color, bg }) => (
            <div key={key} className={`rounded-lg border ${bg} px-3 py-2 flex items-center justify-between`}>
              <span className="text-xs text-[var(--muted)]">{label}</span>
              <span className={`text-xl font-bold ${color}`}>{originalCounts[key]}</span>
            </div>
          ))}
        </div>

        {/* After resit */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-center text-brand-600 dark:text-brand-400">
            After resit
          </p>
          {TIERS.map(({ key, label, color, bg }) => {
            const diff = newCounts[key] - originalCounts[key]
            return (
              <div key={key} className={`rounded-lg border ${bg} px-3 py-2 flex items-center justify-between`}>
                <span className="text-xs text-[var(--muted)]">{label}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xl font-bold ${color}`}>{newCounts[key]}</span>
                  {diff !== 0 && (
                    <span
                      className={`text-xs font-semibold ${
                        diff > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                      }`}
                    >
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-center text-[var(--muted)]">
        Estimates only — competition varies each admissions cycle
      </p>
    </div>
  )
}
