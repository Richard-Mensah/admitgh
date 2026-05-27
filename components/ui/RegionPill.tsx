// components/ui/RegionPill.tsx
// Toggleable region filter chip for the results page

import { cn } from "@/lib/utils"
import type { GhanaRegion } from "@/constants"

type Props = {
  region: GhanaRegion
  selected: boolean
  onToggle: (region: GhanaRegion) => void
}

export default function RegionPill({ region, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={() => onToggle(region)}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-all",
        "focus:outline-none focus:ring-2 focus:ring-brand-500",
        selected
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400 hover:text-[var(--foreground)]"
      )}
    >
      {region}
    </button>
  )
}
