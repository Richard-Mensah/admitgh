// components/ui/GradeSelect.tsx
// Grade dropdown — A1 through F9, accessible, mobile-friendly

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

export default function GradeSelect({ label, value, onChange, disabled = false, className }: Props) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-xs font-medium text-[var(--muted)] truncate" title={label}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Grade | "")}
        disabled={disabled}
        className={cn(
          "w-full rounded-lg border border-[var(--border)] bg-[var(--background)]",
          "px-3 py-2.5 text-sm font-medium text-[var(--foreground)]",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors hover:border-brand-400",
          value === "" && "text-[var(--muted)]"
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
