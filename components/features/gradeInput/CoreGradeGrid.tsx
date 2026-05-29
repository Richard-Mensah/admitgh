"use client"
// components/features/gradeInput/CoreGradeGrid.tsx
import GradeSelect from "@/components/ui/GradeSelect"
import { cn } from "@/lib/utils"
import type { Grade } from "@/constants"

type Props = {
  subjects: readonly [string, string, string, string]
  grades: Record<string, Grade | "">
  onGradeChange: (subject: string, grade: Grade | "") => void
}

export default function CoreGradeGrid({ subjects, grades, onGradeChange }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-[var(--foreground)] mb-3">
        Core subjects <span className="font-normal text-[var(--muted)]">(mandatory)</span>
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {subjects.map((subject) => (
          <div
            key={subject}
            className={cn(
              "rounded-xl border p-3 transition-colors",
              grades[subject]
                ? "border-brand-500/40 bg-brand-500/5"
                : "border-[var(--border)] bg-[var(--card-bg)]"
            )}
          >
            <GradeSelect
              label={subject}
              value={grades[subject] ?? ""}
              onChange={(g) => onGradeChange(subject, g)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
