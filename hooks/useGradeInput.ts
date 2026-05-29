"use client"

import { useState, useCallback } from "react"
import { GRADE_VALUE } from "@/constants"
import { calculateAggregate } from "@/lib/probability"
import type { Track, Grade } from "@/constants"

export type SubjectSlot = { subject: string; grade: Grade | "" }
type SlotTriple = [SubjectSlot, SubjectSlot, SubjectSlot]

export type GradeState = {
  coreSlots: SlotTriple
  electiveSlots: SlotTriple
}

function emptyTriple(): SlotTriple {
  return [
    { subject: "", grade: "" },
    { subject: "", grade: "" },
    { subject: "", grade: "" },
  ]
}

function initGradeState(): GradeState {
  return { coreSlots: emptyTriple(), electiveSlots: emptyTriple() }
}

function filledSlots(slots: SlotTriple) {
  return slots.filter((s) => s.subject !== "" && s.grade !== "")
}

export function useGradeInput() {
  const [track, setTrackState] = useState<Track>("science")
  const [grades, setGrades] = useState<GradeState>(initGradeState)
  const [careerInterest, setCareerInterest] = useState<string>("")

  const setSlot = useCallback(
    (section: "coreSlots" | "electiveSlots", index: 0 | 1 | 2, field: "subject" | "grade", value: string) => {
      setGrades((prev): GradeState => {
        const slots = [...prev[section]] as SlotTriple
        // Subject change resets the grade for that slot to avoid stale grade
        slots[index] = field === "subject"
          ? { subject: value, grade: "" }
          : { ...slots[index], grade: value as Grade | "" }
        return { ...prev, [section]: slots }
      })
    },
    []
  )

  const coresFilled = filledSlots(grades.coreSlots)
  const electivesFilled = filledSlots(grades.electiveSlots)
  const totalFilledGrades = coresFilled.length + electivesFilled.length
  const isComplete = coresFilled.length === 3 && electivesFilled.length === 3

  const aggregate = isComplete
    ? calculateAggregate([
        ...coresFilled.map((s) => GRADE_VALUE[s.grade as Grade]),
        ...electivesFilled.map((s) => GRADE_VALUE[s.grade as Grade]),
      ])
    : null

  return {
    track,
    setTrack: (t: Track) => {
      setTrackState(t)
      setGrades(initGradeState())
    },
    grades,
    setSlot,
    careerInterest,
    setCareerInterest,
    aggregate,
    isComplete,
    totalFilledGrades,
    filledCoreCount: coresFilled.length,
    filledElectiveCount: electivesFilled.length,
  }
}
