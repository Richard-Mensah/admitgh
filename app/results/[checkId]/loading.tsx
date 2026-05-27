// app/results/[checkId]/loading.tsx
import Skeleton from "@/components/ui/Skeleton"

export default function ResultsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--card-bg)]">
      <div className="h-14 border-b border-[var(--border)] bg-[var(--background)] px-4 flex items-center gap-3">
        <Skeleton className="h-5 w-24 rounded-md" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
      <div className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          {/* Tier sections */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-12 w-full rounded-t-xl" />
              <div className="rounded-b-xl border border-t-0 border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between px-4 py-3 bg-[var(--background)]">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-52 rounded-md" />
                      <Skeleton className="h-3 w-36 rounded-md" />
                    </div>
                    <div className="text-right space-y-1">
                      <Skeleton className="h-5 w-12 rounded-md" />
                      <Skeleton className="h-1.5 w-24 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
