// types/probability.ts
// Types for the probability model output

import type { Tier } from "@/constants"

export type { Tier }

export type ProbabilityResult = {
  /** Point estimate: probability of admission (0.02 – 0.97) */
  p: number
  /** Lower bound of confidence range */
  low: number
  /** Upper bound of confidence range */
  high: number
  /** margin = latestCutoff - aggregate (positive = student is above cut-off) */
  margin: number
  /** applicants per seat */
  aps: number
  /** tightening = oldestCutoff - latestCutoff (positive = got harder over time) */
  tightening: number
  /** latest cut-off aggregate used in calculation */
  cutoff: number
  /** historical cut-off values ordered oldest → newest (for sparkline) */
  drift: number[]
}

export type ProgrammeWithProbability = {
  programme_id: string
  programme_name: string
  institution_name: string
  institution_short_name: string
  institution_region: string
  slug: string
  level: string
  track: string
  category: string
  seats: number | null
  ai_summary: string | null
  confidence: "official" | "reported" | "inferred"
  tier: Tier
  probability: ProbabilityResult
}
