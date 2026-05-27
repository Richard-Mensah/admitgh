"use client"
// components/features/gradeInput/TrackSelector.tsx
import { TRACKS, TRACK_LABEL } from "@/constants"
import { cn } from "@/lib/utils"
import type { Track } from "@/constants"

type Props = {
  value: Track
  onChange: (track: Track) => void
}

export default function TrackSelector({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-[var(--foreground)] mb-3">
        Select your programme track
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {TRACKS.map((track) => (
          <button
            key={track}
            type="button"
            onClick={() => onChange(track)}
            className={cn(
              "rounded-lg border px-3 py-2.5 text-sm font-medium text-left transition-all",
              "focus:outline-none focus:ring-2 focus:ring-brand-500",
              value === track
                ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300"
                : "border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:border-brand-400 hover:text-[var(--foreground)]"
            )}
            aria-pressed={value === track}
          >
            {TRACK_LABEL[track]}
          </button>
        ))}
      </div>
    </div>
  )
}
