// app/aggregate/[track]/[score]/loading.tsx
import Skeleton from "@/components/ui/Skeleton"

export default function AggregateLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--card-bg)]">
      <div className="h-14 border-b border-[var(--border)] bg-[var(--background)] px-4 flex items-center gap-3">
        <Skeleton className="h-5 w-24 rounded-md" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
      <div className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Header */}
          <div className="mb-8 space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-9 w-72 rounded-md" />
            <Skeleton className="h-4 w-80 rounded-md" />
          </div>
          {/* CTA card */}
          <Skeleton className="h-20 w-full rounded-xl mb-8" />
          {/* Tier sections */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-8">
              <Skeleton className="h-14 w-full rounded-t-xl" />
              <div className="border border-t-0 border-[var(--border)] rounded-b-xl divide-y divide-[var(--border)] overflow-hidden">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between px-4 py-3 bg-[var(--background)]">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-52 rounded-md" />
                      <Skeleton className="h-3 w-36 rounded-md" />
                    </div>
                    <div className="ml-4 space-y-1 text-right">
                      <Skeleton className="h-5 w-12 rounded-md" />
                      <Skeleton className="h-3 w-10 rounded-md" />
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
