// app/check/loading.tsx
import Skeleton from "@/components/ui/Skeleton"

export default function CheckLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--card-bg)]">
      <div className="h-14 border-b border-[var(--border)] bg-[var(--background)] px-4 flex items-center gap-3">
        <Skeleton className="h-5 w-24 rounded-md" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56 rounded-md" />
            <Skeleton className="h-4 w-80 rounded-md" />
          </div>
          {/* Track selector */}
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
          </div>
          {/* Grade grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
