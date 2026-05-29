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
import { CORE_SUBJECTS, ELECTIVE_SUBJECTS } from "@/constants"
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
    <div className="flex items-center justify-center gap-0 px-6 py-5">
      {STEPS.map((step, i) => {
        const done   = step.n < currentStep
        const active = step.n === currentStep
        return (
          <div key={step.n} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all",
                  done   && "border-2 border-brand-500 bg-brand-500/15 text-brand-400",
                  active && "text-white shadow-[0_0_0_4px_rgba(20,184,166,0.15)]",
                  !done && !active && "border-2 border-[var(--border)] text-[var(--muted)]",
                )}
                style={active ? { background: "linear-gradient(135deg,#14b8a6,#0d9488)" } : undefined}
              >
                {done ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                ) : step.n}
              </span>
              <span className={cn(
                "hidden sm:block text-[10px] font-semibold uppercase tracking-wide",
                active ? "text-brand-400" : "text-[var(--muted)]",
              )}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-14 sm:w-20 h-px mx-2 transition-all",
                  done ? "step-connector-done" : "step-connector-pending",
                )}
                style={{ marginBottom: "18px" }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Section wrapper ──────────────────────────────────────────────────────── */
function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-border-top px-6 py-6">
      {children}
    </div>
  )
}

/* ─── Step heading ─────────────────────────────────────────────────────────── */
function StepLabel({ n, title, optional }: { n: number; title: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ background: "linear-gradient(135deg,#14b8a6,#0d9488)" }}
      >
        {n}
      </span>
      <div>
        <p className="font-semibold text-[var(--foreground)]">{title}</p>
        {optional && <p className="text-xs text-[var(--muted)]">Optional — you can skip this step</p>}
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
    aggregate, isComplete,
    coreCount, filledElectiveCount, totalFilledGrades,
  } = useGradeInput()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasCores  = coreCount === 4
  const hasElects = filledElectiveCount >= 3
  const progressStep = !hasCores ? 2 : !hasElects ? 3 : 4

  async function handleSubmit() {
    if (!isComplete || aggregate === null) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track, grades, career_interest: careerInterest || undefined, aggregate }),
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
      {/* Live aggregate bar */}
      <AggregatePreview
        aggregate={aggregate}
        totalFilledGrades={totalFilledGrades}
        currentStep={progressStep}
      />

      {/* Step progress */}
      <StepProgressBar currentStep={progressStep} />

      {/* Step 1 — Track */}
      <Section>
        <StepLabel n={1} title="Select your programme track" />
        <TrackSelector value={track} onChange={setTrack} />
      </Section>

      {/* Step 2 — Core grades */}
      <Section>
        <StepLabel n={2} title="Core subjects" />
        <CoreGradeGrid
          subjects={CORE_SUBJECTS[track]}
          grades={grades.core}
          onGradeChange={(subject, grade) => setGrade("core", subject, grade)}
        />
      </Section>

      {/* Step 3 — Electives */}
      <Section>
        <StepLabel n={3} title="Elective subjects" />
        <ElectiveGrid
          subjects={ELECTIVE_SUBJECTS[track]}
          grades={grades.electives}
          onGradeChange={(subject, grade) => setGrade("electives", subject, grade)}
          filledCount={filledElectiveCount}
        />
      </Section>

      {/* Step 4 — Career interest (optional) */}
      <Section>
        <StepLabel n={4} title="What field interests you most?" optional />
        <CareerInterestPicker value={careerInterest} onChange={setCareerInterest} />
      </Section>

      {/* Submit footer */}
      <div className="check-footer px-6 py-5">
        {error && (
          <div className="mb-4 rounded-lg border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted)]">
            {isComplete
              ? "All grades filled — ready to check!"
              : "Fill 4 core + 3 elective grades to unlock results"}
          </p>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isComplete || loading}
            loading={loading}
            size="lg"
            className="!rounded-xl !px-8 whitespace-nowrap"
          >
            {loading ? "Calculating…" : "Check My Chances →"}
          </Button>
        </div>

        <div className="mt-4 rounded-xl border border-amber-800/30 bg-amber-950/20 px-4 py-3 text-xs text-amber-400/80 leading-relaxed">
          <span className="font-semibold text-amber-300">How we calculate:</span>{" "}
          Aggregate = 4 core + best 3 elective grades — best 6 count (lower is better). Probability
          uses 4-year cut-off history, competition data, and trend direction.
        </div>

        <p className="mt-3 text-center text-xs text-[var(--muted)]">
          Free preview · GHS {process.env.NEXT_PUBLIC_PRICE_GHS ?? "15"} to unlock full results via MoMo
        </p>
      </div>
    </div>
  )
}
