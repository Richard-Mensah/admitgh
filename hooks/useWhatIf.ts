"use client"
// hooks/useWhatIf.ts
// What-if aggregate simulator — lets a student hypothetically improve one grade
// and see how their tier counts would change.

import { useState, useMemo } from "react"
import { GRADE_VALUE, GRADES } from "@/constants"
import { calculateAggregate } from "@/lib/probability"
import type { Grade } from "@/constants"

export type GradeChange = {
  subject: string
  fromGrade: Grade
  toGrade: Grade
}

/**
 * @param grades           The student's original grades (subject → grade string)
 * @param originalAggregate  The original computed aggregate
 */
export function useWhatIf(
  grades: Record<string, string>,
  originalAggregate: number
) {
  const [isOpen, setIsOpen] = useState(false)
  const [change, setChange] = useState<GradeChange | null>(null)

  /** Recompute aggregate with one grade changed */
  const newAggregate = useMemo(() => {
    if (!change) return originalAggregate
    const values = Object.entries(grades).map(([subject, g]) => {
      const grade = subject === change.subject ? change.toGrade : (g as Grade)
      return GRADE_VALUE[grade] ?? GRADE_VALUE[g as Grade] ?? 5
    })
    return calculateAggregate(values)
  }, [change, grades, originalAggregate])

  /** Negative delta = improvement (lower aggregate = better in WASSCE) */
  const delta = newAggregate - originalAggregate

  /** Grades that are strictly better than a given grade */
  function betterGrades(currentGrade: Grade): Grade[] {
    return GRADES.filter((g) => GRADE_VALUE[g] < GRADE_VALUE[currentGrade])
  }

  /** Pick a new subject — resets the toGrade to the next best grade */
  function pickSubject(subject: string) {
    const fromGrade = (grades[subject] ?? "C6") as Grade
    const better = betterGrades(fromGrade)
    if (better.length === 0) {
      setChange(null) // already at A1
    } else {
      setChange({ subject, fromGrade, toGrade: better[0] })
    }
  }

  /** Update just the target grade (subject already chosen) */
  function pickGrade(toGrade: Grade) {
    if (!change) return
    setChange({ ...change, toGrade })
  }

  function reset() {
    setChange(null)
  }

  return {
    isOpen,
    setIsOpen,
    change,
    setChange,
    pickSubject,
    pickGrade,
    reset,
    newAggregate,
    delta,
    isActive: change !== null && delta !== 0,
    betterGrades,
  }
}
