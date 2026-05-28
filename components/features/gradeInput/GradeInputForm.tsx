"use client"
// components/features/gradeInput/GradeInputForm.tsx
// Orchestrates the full grade entry flow — client component (uses state)

import { useState } from "react"
import { useRouter } from "next/navigation"
import TrackSelector from "@/components/features/gradeInput/TrackSelector"
import CoreGradeGrid from "@/components/features/gradeInput/CoreGradeGrid"
import ElectiveGrid from "@/components/features/gradeInput/ElectiveGrid"
import AggregatePreview from "@/components/features/gradeInput/AggregatePreview"
import CareerInterestPicker from "@/components/features/gradeInput/CareerInterestPicker"
import Button from "@/components/ui/Button"
import { useGradeInput } from "@/hooks/useGradeInput"
import { cn } from "@/lib/utils"

/* ─── Step progress indicator ──────────────────────────────────────────────── */
const STEPS = [
  { n: 1, label: "Track" },
  { n: 2, label: "Core" },
  { n: 3, label: "Electives" },
  { n: 4, label: "Interest" },
]

function StepProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
      {STEPS.map((step, i) => {
        const done    = step.n < currentStep
        const active  = step.n === currentStep
        return (
          <div key={step.n} className="flex items-center flex-1">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                  done   && "bg-emerald-500 text-white",
                  active && "bg-brand-600 text-white ring-2 ring-brand-300 ring-offset-1",
                  !done && !active && "bg-[var(--card-bg)] border border-[var(--border)] text-[var(--muted)]",
                )}
              >
                {done ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                ) : step.n}
              </span>
              <span className={cn(
                "hidden sm:block text-[10px] font-medium uppercase tracking-wide",
                done   && "text-emerald-600",
                active && "text-brand-600",
                !done && !active && "text-[var(--muted)]",
              )}>
                {step.label}
              </span>
            </div>

            {/* Connector line (not after last) */}
            {i < STEPS.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2 rounded-full transition-all",
                done ? "bg-emerald-400" : "bg-[var(--border)]",
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Section wrapper ──────────────────────────────────────────────────────── */
function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-t border-[var(--border)] px-6 py-6", className)}>
      {children}
    </div>
  )
}

/* ─── Step heading ─────────────────────────────────────────────────────────── */
function StepLabel({ n, title, optional }: { n: number; title: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
        {n}
      </span>
      <div>
        <p className="font-semibold text-[var(--foreground)]">{title}</p>
        {optional && (
          <p className="text-xs text-[var(--muted)]">Optional — you can skip this step</p>
        )}
      </div>
    </div>
  )
}

/* ─── Main form ────────────────────────────────────────────────────────────── */
export default function GradeInputForm() {
  const router = useRouter()
  const {
    track, setTrack,
    grades, setGrade,
    careerInterest, setCareerInterest,
    aggregate, isComplete, core3Label,
  } = useGradeInput()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Determine current "furthest active" step for the progress bar
  const hasTrack = true // always step 1
  const hasCores  = grades.english !== "" && grades.maths !== "" && grades.core3 !== ""
  const hasElects = grades.elective1 !== "" && grades.elective2 !== "" && grades.elective3 !== ""
  const currentStep = !hasCores ? 1 : !hasElects ? 2 : !isComplete ? 3 : 4

  async function handleSubmit() {
    if (!isComplete || aggregate === null) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track,
          grades,
          career_interest: careerInterest || undefined,
          aggregate,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Something went wrong")
      }

      const data = await res.json()
      router.push(`/results/${data.checkId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process grades")
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Progress bar */}
      <StepProgressBar currentStep={currentStep} />

      {/* Step 1 — Track */}
      <Section>
        <StepLabel n={1} title="Select your programme track" />
        <TrackSelector value={track} onChange={setTrack} />
      </Section>

      {/* Step 2 — Core grades */}
      <Section>
        <StepLabel n={2} title="Core subjects" />
        <CoreGradeGrid
          grades={grades}
          core3Label={core3Label}
          onGradeChange={setGrade}
        />
      </Section>

      {/* Step 3 — Electives */}
      <Section>
        <StepLabel n={3} title="3 Best elective subjects" />
        <ElectiveGrid grades={grades} onGradeChange={setGrade} />
      </Section>

      {/* Live aggregate preview — between steps 3 & 4 */}
      <div className="py-4">
        <AggregatePreview aggregate={aggregate} isComplete={isComplete} />
      </div>

      {/* Step 4 — Career interest (optional) */}
      <Section>
        <StepLabel n={4} title="What field interests you most?" optional />
        <CareerInterestPicker value={careerInterest} onChange={setCareerInterest} />
      </Section>

      {/* Submit + error */}
      <div className="px-6 pb-8 space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isComplete || loading}
          loading={loading}
          size="lg"
          className="w-full !rounded-xl !text-base !py-4"
        >
          {loading ? "Calculating your chances…" : "See My Chances →"}
        </Button>

        {/* Honesty note */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/20 dark:text-amber-300 leading-relaxed">
          <span className="font-semibold">How we calculate:</span> Aggregate = best 6 grades
          combined (lower is better). Probability uses 4-year cut-off history, competition
          data, and trend direction. We always show a range — never a fake single number.
        </div>

        <p className="text-center text-xs text-[var(--muted)]">
          Free preview · GHS {process.env.NEXT_PUBLIC_PRICE_GHS ?? "15"} to unlock full results via MoMo
        </p>
      </div>
    </div>
  )
}
