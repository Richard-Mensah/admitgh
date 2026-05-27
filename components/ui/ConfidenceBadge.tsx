// components/ui/ConfidenceBadge.tsx
// Shows data quality for each cut-off: Official 🟢 | Reported 🟡 | Estimated 🔴

import { CONFIDENCE_META } from "@/constants"
import type { ConfidenceLevel } from "@/constants"
import { cn } from "@/lib/utils"

type Props = {
  confidence: ConfidenceLevel
  showLabel?: boolean
  className?: string
}

export default function ConfidenceBadge({ confidence, showLabel = false, className }: Props) {
  const meta = CONFIDENCE_META[confidence]

  return (
    <span
      className={cn("inline-flex items-center gap-1 text-xs text-[var(--muted)]", className)}
      title={meta.description}
      aria-label={`Data confidence: ${meta.label} — ${meta.description}`}
    >
      <span aria-hidden="true">{meta.emoji}</span>
      {showLabel && <span>{meta.label}</span>}
    </span>
  )
}
