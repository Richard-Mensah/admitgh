// app/universities/region/[region]/loading.tsx
import Skeleton from "@/components/ui/Skeleton"

export default function RegionLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--card-bg)]">
      <div className="h-14 border-b border-[var(--border)] bg-[var(--background)] px-4 flex items-center gap-3">
        <Skeleton className="h-5 w-24 rounded-md" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
      <div className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
          <Skeleton className="h-3 w-48 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-9 w-64 rounded-md" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-32 rounded-md" />
              <div className="rounded-xl border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between px-4 py-3 bg-[var(--background)]">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-52 rounded-md" />
                      <Skeleton className="h-3 w-28 rounded-md" />
                    </div>
                    <div className="text-right space-y-1">
                      <Skeleton className="h-5 w-8 rounded-md" />
                      <Skeleton className="h-3 w-16 rounded-md" />
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
