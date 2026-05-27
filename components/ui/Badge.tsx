// components/ui/Badge.tsx
import { cn } from "@/lib/utils"

type Props = {
  children: React.ReactNode
  variant?: "default" | "safe" | "match" | "reach" | "muted"
  size?: "sm" | "md"
  className?: string
}

export default function Badge({ children, variant = "default", size = "sm", className }: Props) {
  const variants = {
    default: "bg-brand-100 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300",
    safe: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    match: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    reach: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
    muted: "bg-[var(--card-bg)] text-[var(--muted)] border border-[var(--border)]",
  }
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
