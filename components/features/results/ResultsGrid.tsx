"use client"
// components/features/results/ResultsGrid.tsx
// Client orchestrator: filter state + tier display for paid results

import { useMemo, useState } from "react"
import TierSection from "@/components/features/results/TierSection"
import ProgrammeFilters from "@/components/features/results/ProgrammeFilters"
import HonestyPanel from "@/components/features/results/HonestyPanel"
import ExpandButton from "@/components/ui/ExpandButton"
import { useRegionFilter } from "@/hooks/useRegionFilter"
import { CAREER_INTEREST_CATEGORIES } from "@/constants"
import type { ProgrammeWithProbability } from "@/types/probability"
import type { ProgrammeCategory } from "@/constants"

type Props = {
  results: ProgrammeWithProbability[]
  careerInterest: string | null
  counts: { safe: number; match: number; reach: number; total: number }
}

const INITIAL_VISIBLE = 3

export default function ResultsGrid({ results, careerInterest, counts }: Props) {
  const { selectedRegions, selectedTypes, toggleRegion, toggleType, clearAll, isActive } =
    useRegionFilter()
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({})

  const toggleTierExpand = (tier: string) =>
    setExpandedTiers((prev) => ({ ...prev, [tier]: !prev[tier] }))

  // Career interest re-ordering: surface matching programmes first within each tier
  const interestCategories: ProgrammeCategory[] =
    careerInterest && careerInterest !== "Show me everything"
      ? CAREER_INTEREST_CATEGORIES[careerInterest] ?? []
      : []

  const prioritised = useMemo(() => {
    if (interestCategories.length === 0) return results
    return [...results].sort((a, b) => {
      const aMatch = interestCategories.includes(a.category as ProgrammeCategory) ? 0 : 1
      const bMatch = interestCategories.includes(b.category as ProgrammeCategory) ? 0 : 1
      if (aMatch !== bMatch) return aMatch - bMatch
      // Within same priority, keep original order (tier → prob desc)
      return 0
    })
  }, [results, interestCategories])

  // Apply region + type filters
  const filtered = useMemo(() => {
    return prioritised.filter((r) => {
      if (selectedRegions.length > 0 && !selectedRegions.includes(r.institution_region as never))
        return false
      return true
    })
  }, [prioritised, selectedRegions])

  const safe = filtered.filter((r) => r.tier === "safe")
  const match = filtered.filter((r) => r.tier === "match")
  const reach = filtered.filter((r) => r.tier === "reach")

  const visibleFor = (tier: string, all: ProgrammeWithProbability[]) =>
    expandedTiers[tier] ? all : all.slice(0, INITIAL_VISIBLE)

  const totalFiltered = filtered.length
  const hasFilters = isActive

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Safe", count: safe.length, total: counts.safe, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800" },
          { label: "Match", count: match.length, total: counts.match, color: "text-amber-600", bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800" },
          { label: "Reach", count: reach.length, total: counts.reach, color: "text-red-600", bg: "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800" },
        ].map(({ label, count, total, color, bg }) => (
          <div key={label} className={`rounded-xl border ${bg} px-4 py-3 text-center`}>
            <p className={`text-3xl font-bold ${color}`}>{count}</p>
            <p className="text-xs text-[var(--muted)]">
              {label}
              {hasFilters && count !== total && ` / ${total}`}
            </p>
          </div>
        ))}
      </div>

      {/* Career interest banner */}
      {careerInterest && careerInterest !== "Show me everything" && (
        <div className="flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/20 px-4 py-2.5 text-sm">
          <span>✨</span>
          <span className="text-brand-700 dark:text-brand-300">
            Showing <strong>{careerInterest}</strong> programmes first
          </span>
        </div>
      )}

      {/* Filters */}
      <ProgrammeFilters
        selectedRegions={selectedRegions}
        selectedTypes={selectedTypes}
        onToggleRegion={toggleRegion}
        onToggleType={toggleType}
        onClear={clearAll}
        isActive={isActive}
      />

      {/* No results state */}
      {totalFiltered === 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-8 text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-medium">No programmes match your filters</p>
          <p className="text-sm text-[var(--muted)] mt-1">Try removing a region or type filter</p>
          <button
            onClick={clearAll}
            className="mt-4 text-sm text-brand-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Safe */}
      {safe.length > 0 && (
        <div className="space-y-3">
          <TierSection tier="safe" programmes={visibleFor("safe", safe)} />
          {safe.length > INITIAL_VISIBLE && (
            <ExpandButton
              expanded={!!expandedTiers["safe"]}
              count={safe.length}
              onToggle={() => toggleTierExpand("safe")}
            />
          )}
        </div>
      )}

      {/* Match */}
      {match.length > 0 && (
        <div className="space-y-3">
          <TierSection tier="match" programmes={visibleFor("match", match)} />
          {match.length > INITIAL_VISIBLE && (
            <ExpandButton
              expanded={!!expandedTiers["match"]}
              count={match.length}
              onToggle={() => toggleTierExpand("match")}
            />
          )}
        </div>
      )}

      {/* Reach */}
      {reach.length > 0 && (
        <div className="space-y-3">
          <TierSection tier="reach" programmes={visibleFor("reach", reach)} />
          {reach.length > INITIAL_VISIBLE && (
            <ExpandButton
              expanded={!!expandedTiers["reach"]}
              count={reach.length}
              onToggle={() => toggleTierExpand("reach")}
            />
          )}
        </div>
      )}

      <HonestyPanel />
    </div>
  )
}
