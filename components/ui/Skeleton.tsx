// components/ui/Skeleton.tsx
import { cn } from "@/lib/utils"

type Props = { className?: string }

export default function Skeleton({ className }: Props) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--border)]",
        className
      )}
      aria-hidden="true"
    />
  )
}
