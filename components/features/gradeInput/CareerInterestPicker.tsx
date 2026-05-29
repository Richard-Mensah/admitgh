"use client"

import { Stethoscope, Cpu, Scale, TrendingUp, GraduationCap, LayoutGrid } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const OPTIONS: { key: string; Icon: LucideIcon; short: string }[] = [
  { key: "Medicine & Health",     Icon: Stethoscope,   short: "Medicine" },
  { key: "Engineering & Tech",    Icon: Cpu,           short: "Engineering" },
  { key: "Law & Social Sciences", Icon: Scale,         short: "Law & Social" },
  { key: "Business",              Icon: TrendingUp,    short: "Business" },
  { key: "Education",             Icon: GraduationCap, short: "Education" },
  { key: "Show me everything",    Icon: LayoutGrid,    short: "Everything" },
]

type Props = {
  value: string
  onChange: (interest: string) => void
}

export default function CareerInterestPicker({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-4">
        We&apos;ll surface matching programmes first in your results
      </p>
      <div className="grid grid-cols-3 gap-2.5">
        {OPTIONS.map(({ key, Icon, short }) => {
          const selected = value === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(selected ? "" : key)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center",
                "cursor-pointer transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                selected
                  ? "border-brand-500 bg-brand-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40"
              )}
            >
              <Icon
                size={20}
                strokeWidth={1.75}
                className={selected ? "text-brand-600" : "text-slate-400"}
                aria-hidden="true"
              />
              <span className={cn(
                "text-xs font-semibold leading-tight",
                selected ? "text-brand-700" : "text-slate-600",
              )}>
                {short}
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
