// components/ui/ExpandButton.tsx
// "Show all X" progressive disclosure button

import { cn } from "@/lib/utils"

type Props = {
  expanded: boolean
  count: number
  label?: string
  onToggle: () => void
  className?: string
}

export default function ExpandButton({ expanded, count, label = "programmes", onToggle, className }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)]",
        "py-2.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:border-brand-400",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500",
        className
      )}
    >
      {expanded ? `▲ Show fewer` : `▼ Show all ${count} ${label}`}
    </button>
  )
}
