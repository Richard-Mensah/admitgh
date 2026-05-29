"use client"
// components/features/gradeInput/ElectiveGrid.tsx
import GradeSelect from "@/components/ui/GradeSelect"
import { cn } from "@/lib/utils"
import type { Grade } from "@/constants"

type Props = {
  subjects: readonly string[]
  grades: Record<string, Grade | "">
  onGradeChange: (subject: string, grade: Grade | "") => void
  filledCount: number
}

export default function ElectiveGrid({ subjects, grades, onGradeChange, filledCount }: Props) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">Elective subjects</p>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Fill the ones you sat — we pick your best 3 automatically
          </p>
        </div>
        {filledCount >= 3 && (
          <span className="shrink-0 text-xs font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20 rounded-full px-3 py-1">
            {filledCount} filled ✓
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
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

      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-brand-500/20 bg-brand-500/5 px-4 py-3">
        <span className="text-base mt-0.5 shrink-0" aria-hidden="true">💡</span>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          <span className="font-semibold text-[var(--foreground)]">Best 3 count toward your aggregate.</span>{" "}
          Fill as many subjects as you sat — we automatically use your highest-scoring 3.
        </p>
      </div>
    </div>
  )
}
