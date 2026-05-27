"use client"
// hooks/useGradeInput.ts
// Grade state + live aggregate calculation

import { useState, useCallback } from "react"
import { GRADE_VALUE, GRADES, TRACKS, CORE_SUBJECTS } from "@/constants"
import { calculateAggregate } from "@/lib/probability"
import type { Track, Grade } from "@/constants"

export type GradeState = {
  english: Grade | ""
  maths: Grade | ""
  core3: Grade | ""
  elective1: Grade | ""
  elective2: Grade | ""
  elective3: Grade | ""
}

const EMPTY_GRADES: GradeState = {
  english: "",
  maths: "",
  core3: "",
  elective1: "",
  elective2: "",
  elective3: "",
}

export function useGradeInput() {
  const [track, setTrack] = useState<Track>("science")
  const [grades, setGrades] = useState<GradeState>(EMPTY_GRADES)
  const [careerInterest, setCareerInterest] = useState<string>("")

  const setGrade = useCallback((field: keyof GradeState, grade: Grade | "") => {
    setGrades((prev) => ({ ...prev, [field]: grade }))
  }, [])

  const resetGrades = useCallback(() => {
    setGrades(EMPTY_GRADES)
  }, [])

  // Compute aggregate from filled grades (only count filled slots)
  const gradeValues = Object.values(grades)
    .filter((g): g is Grade => g !== "")
    .map((g) => GRADE_VALUE[g])

  const aggregate = gradeValues.length === 6 ? calculateAggregate(gradeValues) : null

  const isComplete =
    grades.english !== "" &&
    grades.maths !== "" &&
    grades.core3 !== "" &&
    grades.elective1 !== "" &&
    grades.elective2 !== "" &&
    grades.elective3 !== ""

  const core3Label = CORE_SUBJECTS[track][2] // "Integrated Science" or "Social Studies"

  return {
    track,
    setTrack: (t: Track) => {
      setTrack(t)
      resetGrades()
    },
    grades,
    setGrade,
    careerInterest,
    setCareerInterest,
    aggregate,
    isComplete,
    core3Label,
  }
}
