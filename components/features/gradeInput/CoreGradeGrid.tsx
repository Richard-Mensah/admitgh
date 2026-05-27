"use client"
// components/features/gradeInput/CoreGradeGrid.tsx
import GradeSelect from "@/components/ui/GradeSelect"
import type { GradeState } from "@/hooks/useGradeInput"
import type { Grade } from "@/constants"

type Props = {
  grades: Pick<GradeState, "english" | "maths" | "core3">
  core3Label: string
  onGradeChange: (field: keyof GradeState, grade: Grade | "") => void
}

export default function CoreGradeGrid({ grades, core3Label, onGradeChange }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-[var(--foreground)] mb-3">
        Core subjects{" "}
        <span className="font-normal text-[var(--muted)]">(mandatory)</span>
      </p>
      <div className="grid grid-cols-3 gap-3">
        <GradeSelect
          label="English Language"
          value={grades.english}
          onChange={(g) => onGradeChange("english", g)}
        />
        <GradeSelect
          label="Core Mathematics"
          value={grades.maths}
          onChange={(g) => onGradeChange("maths", g)}
        />
        <GradeSelect
          label={core3Label}
          value={grades.core3}
          onChange={(g) => onGradeChange("core3", g)}
        />
      </div>
    </div>
  )
}
