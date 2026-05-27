// components/features/results/TierSection.tsx
// A Safe / Match / Reach section with programme cards

import ProgrammeCard from "@/components/features/results/ProgrammeCard"
import { TIER_META } from "@/constants"
import type { ProgrammeWithProbability } from "@/types/probability"
import type { Tier } from "@/constants"

type Props = {
  tier: Tier
  programmes: ProgrammeWithProbability[]
  isBlurred?: boolean
}

export default function TierSection({ tier, programmes, isBlurred = false }: Props) {
  if (programmes.length === 0) return null

  const meta = TIER_META[tier]

  return (
    <section>
      {/* Tier header */}
      <div className={`mb-4 flex items-center gap-3 rounded-xl border ${meta.borderClass} ${meta.bgClass} px-4 py-3`}>
        <div>
          <p className={`text-lg font-bold ${meta.colorClass}`}>
            {meta.label} — {programmes.length} programme{programmes.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-[var(--muted)]">{meta.description}</p>
        </div>
      </div>

      {/* Programme cards */}
      <div className="space-y-3">
        {programmes.map((prog) => (
          <ProgrammeCard
            key={prog.programme_id}
            programme={prog}
            isBlurred={isBlurred}
          />
        ))}
      </div>
    </section>
  )
}
