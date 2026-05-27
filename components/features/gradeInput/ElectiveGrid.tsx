"use client"
// components/features/gradeInput/ElectiveGrid.tsx
import GradeSelect from "@/components/ui/GradeSelect"
import type { GradeState } from "@/hooks/useGradeInput"
import type { Grade } from "@/constants"

type Props = {
  grades: Pick<GradeState, "elective1" | "elective2" | "elective3">
  onGradeChange: (field: keyof GradeState, grade: Grade | "") => void
}

const ELECTIVE_LABELS = [
  "Best Elective",
  "2nd Best Elective",
  "3rd Best Elective",
] as const

export default function ElectiveGrid({ grades, onGradeChange }: Props) {
  const fields = ["elective1", "elective2", "elective3"] as const

  return (
    <div>
      <p className="text-sm font-semibold text-[var(--foreground)] mb-1">
        3 Best Elective subjects
      </p>
      <p className="text-xs text-[var(--muted)] mb-3">
        Enter your top 3 electives — the model uses your best combination
      </p>
      <div className="grid grid-cols-3 gap-3">
        {fields.map((field, i) => (
          <GradeSelect
            key={field}
            label={ELECTIVE_LABELS[i]}
            value={grades[field]}
            onChange={(g) => onGradeChange(field, g)}
          />
        ))}
      </div>
    </div>
  )
}
