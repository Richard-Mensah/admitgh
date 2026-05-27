"use client"
// components/features/whatIf/WhatIfBanner.tsx
// Grade-change selector panel inside the what-if simulator.
// Student picks a subject and a better hypothetical grade.

import { GRADE_VALUE } from "@/constants"
import type { Grade } from "@/constants"
import type { GradeChange } from "@/hooks/useWhatIf"

type Props = {
  grades: Record<string, string>
  change: GradeChange | null
  onPickSubject: (subject: string) => void
  onPickGrade: (grade: Grade) => void
  betterGrades: (current: Grade) => Grade[]
}

export default function WhatIfBanner({ grades, change, onPickSubject, onPickGrade, betterGrades }: Props) {
  const subjects = Object.keys(grades)
  const selectedSubject = change?.subject ?? subjects[0] ?? ""
  const currentGrade = (grades[selectedSubject] ?? "C6") as Grade
  const better = betterGrades(currentGrade)

  return (
    <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/20 p-4 space-y-4">
      <p className="text-sm font-medium text-brand-800 dark:text-brand-300">
        💡 Simulate a resit — pick a subject and a better grade to see how your chances change
      </p>

      <div className="flex flex-wrap gap-3">
        {/* Subject selector */}
        <div className="flex-1 min-w-44">
          <label className="block text-xs text-[var(--muted)] mb-1.5">Subject to improve</label>
          <select
            value={selectedSubject}
            onChange={(e) => onPickSubject(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s} ({grades[s]})
              </option>
            ))}
          </select>
        </div>

        {/* New grade selector */}
        <div className="w-32">
          <label className="block text-xs text-[var(--muted)] mb-1.5">Improve to</label>
          {better.length === 0 ? (
            <p className="text-sm text-[var(--muted)] pt-2">Already A1!</p>
          ) : (
            <select
              value={change?.toGrade ?? better[0]}
              onChange={(e) => onPickGrade(e.target.value as Grade)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {better.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Summary line */}
      {change && better.length > 0 && (
        <p className="text-xs text-[var(--muted)]">
          Simulating: {change.subject} from{" "}
          <span className="font-semibold">{change.fromGrade}</span> →{" "}
          <span className="font-semibold text-brand-700 dark:text-brand-400">{change.toGrade}</span>
        </p>
      )}
    </div>
  )
}
