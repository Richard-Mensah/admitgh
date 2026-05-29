"use client"
// hooks/useGradeInput.ts
// Grade state + live aggregate calculation

import { useState, useCallback } from "react"
import { GRADE_VALUE, CORE_SUBJECTS, ELECTIVE_SUBJECTS } from "@/constants"
import { calculateAggregate } from "@/lib/probability"
import type { Track, Grade } from "@/constants"

export type GradeState = {
  core: Record<string, Grade | "">
  electives: Record<string, Grade | "">
}

function initGradeState(track: Track): GradeState {
  return {
    core: Object.fromEntries(CORE_SUBJECTS[track].map((s) => [s, ""])),
    electives: Object.fromEntries(ELECTIVE_SUBJECTS[track].map((s) => [s, ""])),
  }
}

function gradeValues(map: Record<string, Grade | "">): number[] {
  return Object.values(map)
    .filter((g) => g !== "")
    .map((g) => GRADE_VALUE[g as Grade])
}

export function useGradeInput() {
  const [track, setTrackState] = useState<Track>("science")
  const [grades, setGrades] = useState<GradeState>(() => initGradeState("science"))
  const [careerInterest, setCareerInterest] = useState<string>("")

  const setGrade = useCallback(
    (section: "core" | "electives", subject: string, grade: Grade | "") => {
      setGrades((prev: GradeState): GradeState => {
        if (section === "core") {
          return { ...prev, core: { ...prev.core, [subject]: grade } }
        }
        return { ...prev, electives: { ...prev.electives, [subject]: grade } }
      })
    },
    []
  )

  const coreVals = gradeValues(grades.core)

  // Sort ascending (best grades first), take top 3
  const allElectiveVals = gradeValues(grades.electives).sort((a, b) => a - b)
  const best3Electives = allElectiveVals.slice(0, 3)
  const filledElectiveCount = allElectiveVals.length

  // All 4 cores required + at least 3 electives
  const isComplete = coreVals.length === 4 && filledElectiveCount >= 3

  // 4 cores + best 3 electives = 7 grades; calculateAggregate picks best 6
  const aggregate = isComplete
    ? calculateAggregate([...coreVals, ...best3Electives])
    : null

  // Progress counter: 4 cores + up to 3 electives = 7 total
  const totalFilledGrades = coreVals.length + Math.min(3, filledElectiveCount)

  return {
    track,
    setTrack: (t: Track) => {
      setTrackState(t)
      setGrades(initGradeState(t))
    },
    grades,
    setGrade,
    careerInterest,
    setCareerInterest,
    aggregate,
    isComplete,
    coreCount: coreVals.length,
    filledElectiveCount,
    totalFilledGrades,
  }
}
