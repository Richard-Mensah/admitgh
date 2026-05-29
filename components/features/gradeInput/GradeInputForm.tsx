"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import TrackSelector from "@/components/features/gradeInput/TrackSelector"
import SubjectSlotPicker from "@/components/features/gradeInput/SubjectSlotPicker"
import CareerInterestPicker from "@/components/features/gradeInput/CareerInterestPicker"
import Button from "@/components/ui/Button"
import { useGradeInput } from "@/hooks/useGradeInput"
import { CORE_SUBJECTS, ELECTIVE_SUBJECTS } from "@/constants"
import type { Grade } from "@/constants"

export default function GradeInputForm() {
  const router = useRouter()
  const {
    track, setTrack,
    grades, setSlot,
    careerInterest, setCareerInterest,
    aggregate, isComplete,
    totalFilledGrades,
  } = useGradeInput()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!isComplete || aggregate === null) return
    setLoading(true)
    setError(null)
    const coreRecord = Object.fromEntries(
      grades.coreSlots
        .filter((s) => s.subject && s.grade)
        .map((s) => [s.subject, s.grade as Grade])
    )
    const electivesRecord = Object.fromEntries(
      grades.electiveSlots
        .filter((s) => s.subject && s.grade)
        .map((s) => [s.subject, s.grade as Grade])
    )
    try {
      const res = await fetch("/api/checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track,
          grades: { core: coreRecord, electives: electivesRecord },
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
    <div className="space-y-5">
      {/* Section 1 — Track */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Step 1 — Select your programme track
        </p>
        <TrackSelector value={track} onChange={setTrack} />
      </div>

      {/* Section 2 — Grades: two-panel grid */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Step 2 — Enter your WASSCE grades
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SubjectSlotPicker
            title="Core Subjects"
            subtitle="Select your 3 best core subjects"
            subjects={CORE_SUBJECTS[track]}
            slots={grades.coreSlots}
            onChange={(idx, field, val) => setSlot("coreSlots", idx, field, val)}
          />
          <SubjectSlotPicker
            title="Elective Subjects"
            subtitle="Select your 3 elective subjects"
            subjects={ELECTIVE_SUBJECTS[track]}
            slots={grades.electiveSlots}
            onChange={(idx, field, val) => setSlot("electiveSlots", idx, field, val)}
          />
        </div>
      </div>

      {/* Section 3 — Career interest (optional) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Step 3 — Career interest{" "}
          <span className="text-slate-300 font-normal normal-case">(optional)</span>
        </p>
        <CareerInterestPicker value={careerInterest} onChange={setCareerInterest} />
      </div>

      {/* Footer */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-5 py-4">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Aggregate / progress indicator */}
          {isComplete ? (
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-brand-500 text-white font-black text-xl shadow-sm">
                {aggregate}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-700">Your Aggregate</p>
                <p className="text-xs text-slate-400">Lower is better · ready to check</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{totalFilledGrades}</span>
                <span className="text-slate-400"> / 6</span> subjects filled
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Fill all 6 to unlock results
              </p>
            </div>
          )}

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

        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700 leading-relaxed">
          <span className="font-semibold text-amber-800">How we calculate:</span>{" "}
          Aggregate = best 6 from your 3 core + 3 elective grades (lower is better).
          Probability uses 4-year cut-off history, competition data, and trend direction.
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          Free preview · GHS {process.env.NEXT_PUBLIC_PRICE_GHS ?? "15"} to unlock full results via MoMo
        </p>
      </div>
    </div>
  )
}
