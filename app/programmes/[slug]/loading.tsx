// app/programmes/[slug]/loading.tsx
import Skeleton from "@/components/ui/Skeleton"

export default function ProgrammeLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--card-bg)]">
      <div className="h-14 border-b border-[var(--border)] bg-[var(--background)] px-4 flex items-center gap-3">
        <Skeleton className="h-5 w-24 rounded-md" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
      <div className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
          {/* Breadcrumb */}
          <Skeleton className="h-3 w-48 rounded-md" />
          {/* Header */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-8 w-80 rounded-md" />
            <Skeleton className="h-4 w-48 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>
          {/* Probability table */}
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <Skeleton className="h-10 w-full rounded-none" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-[var(--background)]">
                <Skeleton className="h-4 w-10 rounded-md" />
                <Skeleton className="h-4 w-14 rounded-md" />
                <Skeleton className="h-4 w-10 rounded-md" />
              </div>
            ))}
          </div>
          {/* Cut-off history */}
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <Skeleton className="h-10 w-full rounded-none" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-[var(--background)]">
                <Skeleton className="h-4 w-12 rounded-md" />
                <Skeleton className="h-4 w-8 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
