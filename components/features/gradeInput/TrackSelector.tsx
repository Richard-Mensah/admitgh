"use client"

import { FlaskConical, BookOpen, Briefcase, UtensilsCrossed, Wrench, Palette } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { TRACKS } from "@/constants"
import { cn } from "@/lib/utils"
import type { Track } from "@/constants"

type Props = {
  value: Track
  onChange: (track: Track) => void
}

const TRACK_META: Record<Track, { Icon: LucideIcon; short: string; desc: string }> = {
  science:        { Icon: FlaskConical,    short: "Science",      desc: "Physics, Chemistry" },
  general_arts:   { Icon: BookOpen,        short: "General Arts", desc: "Literature, Languages" },
  business:       { Icon: Briefcase,       short: "Business",     desc: "Accounting, Economics" },
  home_economics: { Icon: UtensilsCrossed, short: "Home Econ.",   desc: "Food, Textiles" },
  technical:      { Icon: Wrench,          short: "Technical",    desc: "Engineering, Drawing" },
  visual_arts:    { Icon: Palette,         short: "Visual Arts",  desc: "Art, Design, Craft" },
}

export default function TrackSelector({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-sm text-slate-500 mb-3">
        Choose the programme track you studied under
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {TRACKS.map((track) => {
          const { Icon, short, desc } = TRACK_META[track]
          const selected = value === track
          return (
            <button
              key={track}
              type="button"
              onClick={() => onChange(track)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 rounded-xl border p-3",
                "text-center cursor-pointer transition-all duration-150",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                selected
                  ? "border-brand-500 bg-brand-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50/40"
              )}
            >
              <Icon
                size={22}
                strokeWidth={1.75}
                className={selected ? "text-brand-600" : "text-slate-400"}
                aria-hidden="true"
              />
              <span className={cn(
                "text-[11px] font-bold leading-tight",
                selected ? "text-brand-700" : "text-slate-700",
              )}>
                {short}
              </span>
              <span className={cn(
                "hidden sm:block text-[9px] leading-tight",
                selected ? "text-brand-500" : "text-slate-400",
              )}>
                {desc}
              </span>
              {selected && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-white shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
