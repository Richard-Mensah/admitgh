"use client"
// components/features/results/ProgrammeFilters.tsx
// Region + institution type filter bar on the results page

import { useState } from "react"
import RegionPill from "@/components/ui/RegionPill"
import { GHANA_REGIONS, INSTITUTION_TYPE_LABEL } from "@/constants"
import { cn } from "@/lib/utils"
import type { GhanaRegion, InstitutionType } from "@/constants"

type Props = {
  selectedRegions: GhanaRegion[]
  selectedTypes: InstitutionType[]
  onToggleRegion: (r: GhanaRegion) => void
  onToggleType: (t: InstitutionType) => void
  onClear: () => void
  isActive: boolean
}

export default function ProgrammeFilters({
  selectedRegions,
  selectedTypes,
  onToggleRegion,
  onToggleType,
  onClear,
  isActive,
}: Props) {
  const [regionExpanded, setRegionExpanded] = useState(false)

  const visibleRegions = regionExpanded ? GHANA_REGIONS : GHANA_REGIONS.slice(0, 8)

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--foreground)]">Filter results</p>
        {isActive && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-brand-600 hover:text-brand-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Region filter */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)] mb-2">
          Region
        </p>
        <div className="flex flex-wrap gap-1.5">
          {visibleRegions.map((region) => (
            <RegionPill
              key={region}
              region={region}
              selected={selectedRegions.includes(region)}
              onToggle={onToggleRegion}
            />
          ))}
          <button
            type="button"
            onClick={() => setRegionExpanded((p) => !p)}
            className="rounded-full border border-dashed border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {regionExpanded ? "Less" : `+${GHANA_REGIONS.length - 8} more`}
          </button>
        </div>
      </div>

      {/* Institution type filter */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)] mb-2">
          Institution type
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(INSTITUTION_TYPE_LABEL) as [InstitutionType, string][]).map(
            ([type, label]) => (
              <button
                key={type}
                type="button"
                onClick={() => onToggleType(type)}
                aria-pressed={selectedTypes.includes(type)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-brand-500",
                  selectedTypes.includes(type)
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400 hover:text-[var(--foreground)]"
                )}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
