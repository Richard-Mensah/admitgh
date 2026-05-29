"use client"
// components/features/gradeInput/TrackSelector.tsx
import { TRACKS } from "@/constants"
import { cn } from "@/lib/utils"
import type { Track } from "@/constants"

type Props = {
  value: Track
  onChange: (track: Track) => void
}

const TRACK_META: Record<Track, { icon: string; short: string; desc: string }> = {
  science:        { icon: "🔬", short: "Science",       desc: "Physics, Chemistry, Biology…" },
  general_arts:   { icon: "🌍", short: "General Arts",  desc: "Literature, History, Languages…" },
  business:       { icon: "📊", short: "Business",      desc: "Accounting, Economics…" },
  home_economics: { icon: "🏠", short: "Home Econ.",    desc: "Food, Management, Textiles…" },
  technical:      { icon: "🔧", short: "Technical",     desc: "Engineering & construction…" },
  visual_arts:    { icon: "🎨", short: "Visual Arts",   desc: "Art, Design, Sculpture…" },
}

export default function TrackSelector({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-sm text-[var(--muted)] mb-4">
        Choose the programme track you studied under
      </p>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
        {TRACKS.map((track) => {
          const meta = TRACK_META[track]
          const selected = value === track
          return (
            <button
              key={track}
              type="button"
              onClick={() => onChange(track)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-xl border p-3 sm:p-4",
                "text-center cursor-pointer transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-transparent",
                selected
                  ? "border-brand-500 text-white shadow-lg shadow-brand-500/20 scale-[1.03]"
                  : "border-[var(--border)] hover:border-brand-500/40 hover:-translate-y-0.5",
              )}
              style={selected ? {
                background: "linear-gradient(135deg,rgba(20,184,166,0.2),rgba(13,148,136,0.1))",
                borderColor: "#14b8a6",
              } : undefined}
            >
              <span className="text-2xl leading-none" aria-hidden="true">{meta.icon}</span>
              <span className={cn(
                "text-[11px] font-bold leading-tight",
                selected ? "text-brand-300" : "text-[var(--foreground)]",
              )}>
                {meta.short}
              </span>
              <span className={cn(
                "hidden sm:block text-[9px] leading-tight",
                selected ? "text-brand-400/70" : "text-[var(--muted)]",
              )}>
                {meta.desc}
              </span>
              {selected && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white shadow">
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
