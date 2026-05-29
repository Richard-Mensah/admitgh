"use client"

import { GRADES } from "@/constants"
import { cn } from "@/lib/utils"
import type { Grade } from "@/constants"
import type { SubjectSlot } from "@/hooks/useGradeInput"

type Props = {
  title: string
  subtitle: string
  subjects: readonly string[]
  slots: [SubjectSlot, SubjectSlot, SubjectSlot]
  onChange: (index: 0 | 1 | 2, field: "subject" | "grade", value: string) => void
}

export default function SubjectSlotPicker({ title, subtitle, subjects, slots, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Teal header band */}
      <div className="px-5 py-4 bg-gradient-to-r from-brand-500 to-brand-600">
        <p className="text-base font-bold text-white">{title}</p>
        <p className="text-xs text-brand-100 mt-0.5">{subtitle}</p>
      </div>

      {/* 3 slot rows */}
      <div className="divide-y divide-slate-100">
        {slots.map((slot, i) => {
          const idx = i as 0 | 1 | 2
          const isFilled = slot.subject !== "" && slot.grade !== ""
          const otherPicked = slots
            .filter((_, j) => j !== i)
            .map((s) => s.subject)
            .filter(Boolean)

          return (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2.5 px-4 py-3 transition-colors",
                isFilled ? "bg-brand-50/50" : "bg-white"
              )}
            >
              {/* Slot number badge */}
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  isFilled ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-400"
                )}
              >
                {i + 1}
              </span>

              {/* Subject dropdown */}
              <select
                value={slot.subject}
                onChange={(e) => onChange(idx, "subject", e.target.value)}
                className={cn(
                  "flex-1 min-w-0 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                  slot.subject === "" ? "text-slate-400" : "text-slate-800"
                )}
              >
                <option value="">— Choose subject —</option>
                {subjects.map((subject) => (
                  <option
                    key={subject}
                    value={subject}
                    disabled={otherPicked.includes(subject)}
                  >
                    {subject}
                  </option>
                ))}
              </select>

              {/* Grade dropdown */}
              <select
                value={slot.grade}
                onChange={(e) => onChange(idx, "grade", e.target.value as Grade | "")}
                disabled={slot.subject === ""}
                className={cn(
                  "w-[4.5rem] shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-semibold",
                  "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  slot.grade === "" ? "text-slate-400 font-normal" : "text-brand-700"
                )}
              >
                <option value="">—</option>
                {GRADES.map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}
