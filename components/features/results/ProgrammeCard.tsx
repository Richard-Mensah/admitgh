// components/features/results/ProgrammeCard.tsx
// Displays one programme's probability, trend, and facts

import Link from "next/link"
import ProbabilityBar from "@/components/ui/ProbabilityBar"
import TrendMiniChart from "@/components/ui/TrendMiniChart"
import ConfidenceBadge from "@/components/ui/ConfidenceBadge"
import Badge from "@/components/ui/Badge"
import { TIER_META } from "@/constants"
import { formatPercent } from "@/lib/utils"
import type { ProgrammeWithProbability } from "@/types/probability"
import type { ConfidenceLevel } from "@/constants"

type Props = {
  programme: ProgrammeWithProbability
  isBlurred?: boolean
}

export default function ProgrammeCard({ programme: p, isBlurred = false }: Props) {
  const tier = TIER_META[p.tier]

  return (
    <div
      className={`rounded-xl border ${tier.borderClass} ${tier.bgClass} p-4 sm:p-5 transition-all ${
        isBlurred ? "select-none" : ""
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={p.tier} size="sm">
              {tier.label}
            </Badge>
            <ConfidenceBadge confidence={p.confidence as ConfidenceLevel} showLabel />
          </div>
          {isBlurred ? (
            <div className="mt-1.5 h-5 w-48 rounded bg-[var(--border)] animate-pulse" />
          ) : (
            <Link
              href={`/programmes/${p.slug}`}
              className="mt-1.5 block text-base font-semibold text-[var(--foreground)] hover:text-brand-600 transition-colors"
            >
              {p.programme_name}
            </Link>
          )}
          <p className="mt-0.5 text-sm text-[var(--muted)]">
            {isBlurred ? (
              <span className="inline-block h-4 w-32 rounded bg-[var(--border)] animate-pulse" />
            ) : (
              <>{p.institution_short_name} · {p.institution_region}</>
            )}
          </p>
        </div>

        {/* Probability big number */}
        <div className="text-right flex-shrink-0">
          <p className={`text-2xl font-bold ${tier.colorClass}`}>
            {isBlurred ? "??" : formatPercent(p.probability.p)}
          </p>
          <p className="text-xs text-[var(--muted)]">chance</p>
        </div>
      </div>

      {/* Probability bar */}
      <div className="mt-3">
        <ProbabilityBar
          p={isBlurred ? 0.5 : p.probability.p}
          low={isBlurred ? 0.3 : p.probability.low}
          high={isBlurred ? 0.7 : p.probability.high}
          tier={p.tier}
          showLabels={!isBlurred}
        />
      </div>

      {/* Stats row */}
      {!isBlurred && (
        <div className="mt-3 flex items-center gap-4 flex-wrap">
          <Stat label="Cut-off" value={`Agg ${p.probability.cutoff}`} />
          <Stat
            label="Margin"
            value={
              p.probability.margin >= 0
                ? `+${p.probability.margin} above`
                : `${p.probability.margin} below`
            }
            valueClass={p.probability.margin >= 0 ? "text-emerald-600" : "text-red-600"}
          />
          {p.probability.aps > 1 && (
            <Stat
              label="Competition"
              value={`${p.probability.aps.toFixed(1)}× applicants/seat`}
            />
          )}
          {p.seats && <Stat label="Seats" value={`~${p.seats}`} />}

          {/* Cut-off trend sparkline */}
          {p.probability.drift.length >= 2 && (
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-xs text-[var(--muted)]">Trend</span>
              <TrendMiniChart values={p.probability.drift} />
            </div>
          )}
        </div>
      )}

      {/* AI summary if available */}
      {!isBlurred && p.ai_summary && (
        <p className="mt-3 text-xs text-[var(--muted)] border-t border-[var(--border)] pt-3">
          {p.ai_summary}
        </p>
      )}
    </div>
  )
}

function Stat({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className={`text-xs font-semibold text-[var(--foreground)] ${valueClass ?? ""}`}>
        {value}
      </p>
    </div>
  )
}
