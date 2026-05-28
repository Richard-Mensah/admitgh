// components/ui/GradeSelect.tsx
// Grade dropdown — A1 through F9, color-coded by quality

import { GRADES } from "@/constants"
import { cn } from "@/lib/utils"
import type { Grade } from "@/constants"

type Props = {
  label: string
  value: Grade | ""
  onChange: (grade: Grade | "") => void
  disabled?: boolean
  className?: string
}

function gradeQuality(grade: Grade | ""): { border: string; dot: string } {
  if (!grade) return { border: "", dot: "" }
  if (grade === "A1") return { border: "border-l-[3px] border-l-emerald-500", dot: "bg-emerald-500" }
  if (grade === "B2" || grade === "B3") return { border: "border-l-[3px] border-l-teal-500", dot: "bg-teal-500" }
  if (grade === "C4" || grade === "C5" || grade === "C6") return { border: "border-l-[3px] border-l-amber-500", dot: "bg-amber-500" }
  return { border: "border-l-[3px] border-l-red-400", dot: "bg-red-400" }
}

export default function GradeSelect({ label, value, onChange, disabled = false, className }: Props) {
  const quality = gradeQuality(value)

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Label — shows colored quality dot when a grade is selected */}
      <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] truncate" title={label}>
        {value !== "" && (
          <span className={cn("inline-block h-2 w-2 shrink-0 rounded-full", quality.dot)} aria-hidden="true" />
        )}
        <span className="truncate">{label}</span>
      </label>

      {/* Select — gains a colored left accent border when a grade is chosen */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Grade | "")}
        disabled={disabled}
        className={cn(
          "w-full rounded-lg border border-[var(--border)] bg-[var(--background)]",
          "px-3 py-2.5 text-sm font-semibold text-[var(--foreground)]",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all hover:border-brand-400",
          value === "" && "text-[var(--muted)] font-normal",
          value !== "" && quality.border,
        )}
        aria-label={label}
      >
        <option value="">Select grade</option>
        {GRADES.map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </select>
    </div>
  )
}
