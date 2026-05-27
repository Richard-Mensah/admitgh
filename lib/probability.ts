// lib/probability.ts
// Pure probability model — no React, no Supabase. Fully testable.
// Ported verbatim from AdmissionEngine.jsx prototype.

import type { CutoffHistory, ProgrammeCompetitiveness } from "@/types/db"
import type { ProbabilityResult, Tier } from "@/types/probability"
import { clamp } from "@/lib/utils"

type ProgrammeInput = {
  seats: number | null
}

/**
 * Estimate admission probability for a student at a given programme.
 *
 * Inputs:
 *   aggregate         — student's WASSCE aggregate (lower = better)
 *   programme         — programme record (for fallback seat count)
 *   cutoffHistory     — array of cut-off rows for this programme
 *   competitiveness   — latest applicants-per-seat estimate (nullable)
 *
 * Returns a ProbabilityResult with point estimate, confidence range,
 * and the raw factors used (for the honesty panel).
 */
export function estimateProbability(
  aggregate: number,
  programme: ProgrammeInput,
  cutoffHistory: CutoffHistory[],
  competitiveness: Pick<ProgrammeCompetitiveness, "applicants_per_seat"> | null
): ProbabilityResult {
  // Sort history oldest → newest
  const sorted = [...cutoffHistory].sort((a, b) => a.year - b.year)

  // Use latest cut-off; fall back to a conservative estimate if no data
  const latestCutoff = sorted.at(-1)?.cutoff_aggregate ?? (programme.seats ? 20 : 24)
  const oldestCutoff = sorted.at(0)?.cutoff_aggregate ?? latestCutoff

  // margin > 0 means student is above cut-off (good)
  const margin = latestCutoff - aggregate

  // applicants per seat — default 1 if no competition data
  const aps = competitiveness?.applicants_per_seat ?? 1

  // ── Base probability: sigmoid on margin ──────────────────────────────────
  const base = 1 / (1 + Math.exp(-0.9 * margin))

  // ── Competition penalty ──────────────────────────────────────────────────
  const compFactor = 1 / (1 + 0.16 * Math.max(0, aps - 1))

  // ── Trend penalty (programme getting harder over time) ───────────────────
  // tightening > 0 means cut-off has risen (harder) — penalty applies
  const tightening = oldestCutoff - latestCutoff
  const driftFactor = 1 - Math.min(0.18, Math.max(0, tightening) * 0.04)

  // ── Combine factors ──────────────────────────────────────────────────────
  let p = base * compFactor * driftFactor

  // Hard cap: below cut-off = very unlikely regardless of other factors
  if (margin < 0) p = Math.min(p, 0.08)

  // Clamp to avoid false certainty
  p = clamp(p, 0.02, 0.97)

  // ── Uncertainty band (wider when more competition) ───────────────────────
  const band = Math.min(0.18, 0.06 + 0.03 * Math.max(0, aps - 1))

  return {
    p,
    low: Math.max(0.01, p - band),
    high: Math.min(0.99, p + band),
    margin,
    aps,
    tightening,
    cutoff: latestCutoff,
    drift: sorted.map((r) => r.cutoff_aggregate),
  }
}

/**
 * Assign a Reach / Match / Safe tier based on probability and margin.
 * Tiering rules (from build spec):
 *   margin < 0         → Reach (below cut-off)
 *   p >= 0.72          → Safe
 *   p >= 0.40          → Match
 *   else               → Reach
 */
export function tierOf(p: number, margin: number): Tier {
  if (margin < 0) return "reach"
  if (p >= 0.72) return "safe"
  if (p >= 0.40) return "match"
  return "reach"
}

/**
 * Calculate the WASSCE aggregate from 6 grades.
 * Best 6 subjects (3 core + 3 electives). Lower aggregate = better.
 * Minimum possible: 6 (all A1). Maximum passing: 36 (all C6).
 */
export function calculateAggregate(gradeValues: number[]): number {
  if (gradeValues.length < 6) return 0
  // Sort ascending (best grades first), take top 6
  const best6 = [...gradeValues].sort((a, b) => a - b).slice(0, 6)
  return best6.reduce((sum, v) => sum + v, 0)
}

/**
 * Check basic eligibility: student has passed all required subjects
 * at the minimum grade. Returns true if eligible.
 */
export function isEligible(
  studentGrades: Record<string, number>,
  requirements: Array<{ subject: string; min_grade: string; is_core: boolean }>
): boolean {
  const GRADE_VALUE: Record<string, number> = {
    A1: 1, B2: 2, B3: 3, C4: 4, C5: 5, C6: 6, D7: 7, E8: 8, F9: 9,
  }

  for (const req of requirements) {
    const studentValue = studentGrades[req.subject]
    const minValue = GRADE_VALUE[req.min_grade]
    if (studentValue === undefined) return false
    if (studentValue > minValue) return false // worse than required
  }
  return true
}
