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

export default function GradeInputForm() {
  const router = useRouter()
  const { track, setTrack, grades, setGrade, careerInterest, setCareerInterest, aggregate, isComplete, core3Label } =
    useGradeInput()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    <div className="space-y-8">
      {/* Step 1 — Track */}
      <section>
        <StepLabel n={1} />
        <TrackSelector value={track} onChange={setTrack} />
      </section>

      {/* Step 2 — Core grades */}
      <section>
        <StepLabel n={2} />
        <CoreGradeGrid
          grades={grades}
          core3Label={core3Label}
          onGradeChange={setGrade}
        />
      </section>

      {/* Step 3 — Electives */}
      <section>
        <StepLabel n={3} />
        <ElectiveGrid grades={grades} onGradeChange={setGrade} />
      </section>

      {/* Live aggregate preview */}
      <AggregatePreview aggregate={aggregate} isComplete={isComplete} />

      {/* Step 4 — Career interest (optional) */}
      <section>
        <StepLabel n={4} optional />
        <CareerInterestPicker value={careerInterest} onChange={setCareerInterest} />
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!isComplete || loading}
        loading={loading}
        size="lg"
        className="w-full"
      >
        {loading ? "Calculating your chances…" : "See My Chances →"}
      </Button>

      <p className="text-center text-xs text-[var(--muted)]">
        Free preview · GHS {process.env.NEXT_PUBLIC_PRICE_GHS ?? "15"} to unlock full results via MoMo
      </p>
    </div>
  )
}

function StepLabel({ n, optional }: { n: number; optional?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
        {n}
      </span>
      <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
        Step {n}{optional ? " (optional)" : ""}
      </span>
    </div>
  )
}
