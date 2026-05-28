"use client"
// components/features/gradeInput/TrackSelector.tsx
import { TRACKS } from "@/constants"
import { cn } from "@/lib/utils"
import type { Track } from "@/constants"

type Props = {
  value: Track
  onChange: (track: Track) => void
}

const TRACK_ICON: Record<Track, string> = {
  science:   "🔬",
  arts:      "🎭",
  business:  "📈",
  vocational:"⚙️",
  general:   "🌍",
}

const TRACK_SHORT: Record<Track, string> = {
  science:   "Science",
  arts:      "Arts",
  business:  "Business",
  vocational:"Vocational",
  general:   "General Arts",
}

const TRACK_DESC: Record<Track, string> = {
  science:   "Physics, Chemistry, Biology…",
  arts:      "Literature, History, French…",
  business:  "Accounting, Economics…",
  vocational:"Technical & craft subjects",
  general:   "Mixed electives",
}

export default function TrackSelector({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-sm text-[var(--muted)] mb-4">
        Choose the programme track you studied under
      </p>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
        {TRACKS.map((track) => {
          const selected = value === track
          return (
            <button
              key={track}
              type="button"
              onClick={() => onChange(track)}
              data-selected={selected}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-2 rounded-xl border p-3 sm:p-4",
                "text-center cursor-pointer transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                selected
                  ? "border-brand-500 bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]"
                  : "border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:border-brand-300 hover:bg-brand-50/60 hover:shadow-sm hover:-translate-y-0.5",
              )}
            >
              {/* Emoji icon */}
              <span className="text-2xl sm:text-3xl leading-none" aria-hidden="true">
                {TRACK_ICON[track]}
              </span>

              {/* Short track name */}
              <span className={cn(
                "text-xs font-bold leading-tight",
                selected ? "text-white" : "text-[var(--foreground)]"
              )}>
                {TRACK_SHORT[track]}
              </span>

              {/* Description — visible on hover/selected on larger screens */}
              <span className={cn(
                "hidden sm:block text-[10px] leading-tight transition-colors",
                selected ? "text-white/70" : "text-[var(--muted)]"
              )}>
                {TRACK_DESC[track]}
              </span>

              {/* Selected checkmark */}
              {selected && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-400 text-white shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
