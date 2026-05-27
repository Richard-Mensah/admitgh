// app/universities/[slug]/loading.tsx
import Skeleton from "@/components/ui/Skeleton"

export default function UniversityLoading() {
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
            <Skeleton className="h-9 w-72 rounded-md" />
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="rounded-xl border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 bg-[var(--background)]">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-56 rounded-md" />
                  <Skeleton className="h-3 w-32 rounded-md" />
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-10 rounded-md ml-auto" />
                  <Skeleton className="h-3 w-14 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
