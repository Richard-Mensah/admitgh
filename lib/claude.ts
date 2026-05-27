// lib/claude.ts
// Anthropic SDK client and AI Counsellor system prompt builder

import Anthropic from "@anthropic-ai/sdk"
import type { ProgrammeWithProbability } from "@/types/probability"
import type { Check } from "@/types/db"
import { formatPercent } from "@/lib/utils"

/** Singleton Anthropic client — initialised server-side only */
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

/** Model for the AI Counsellor — haiku is cost-efficient at ~$0.04/session */
export const COUNSELLOR_MODEL = "claude-haiku-4-5"

/**
 * Build the system prompt for the AI Counsellor.
 * Pre-loads the student's full check context so Claude can answer
 * specific questions about their results without extra API calls.
 */
export function buildCounsellorPrompt(
  check: Pick<Check, "track" | "aggregate" | "grades" | "career_interest">,
  results: ProgrammeWithProbability[]
): string {
  const safeList = results.filter((r) => r.tier === "safe")
  const matchList = results.filter((r) => r.tier === "match")
  const reachList = results.filter((r) => r.tier === "reach")

  const formatProgramme = (r: ProgrammeWithProbability) =>
    `  • ${r.programme_name} @ ${r.institution_name} — ${formatPercent(r.probability.p)} chance ` +
    `(${formatPercent(r.probability.low)}–${formatPercent(r.probability.high)} range), ` +
    `cut-off ${r.probability.cutoff}, margin ${r.probability.margin > 0 ? "+" : ""}${r.probability.margin}, ` +
    `${r.probability.aps.toFixed(1)} applicants/seat, confidence: ${r.confidence}`

  return `You are AdmitGH's AI admission counsellor. You help Ghanaian WASSCE students understand their honest admission chances. You are warm, direct, and never make promises.

## Student Profile
- Track: ${check.track}
- Aggregate: ${check.aggregate} (lower is better; 6 = perfect, 36 = lowest pass)
- Grades: ${JSON.stringify(check.grades)}
${check.career_interest ? `- Career interest: ${check.career_interest}` : ""}

## Their Results

**SAFE (${safeList.length} programmes — strong chance):**
${safeList.length > 0 ? safeList.map(formatProgramme).join("\n") : "  None"}

**MATCH (${matchList.length} programmes — competitive but realistic):**
${matchList.length > 0 ? matchList.map(formatProgramme).join("\n") : "  None"}

**REACH (${reachList.length} programmes — low chance, below cut-off or highly competitive):**
${reachList.length > 0 ? reachList.map(formatProgramme).join("\n") : "  None"}

## How the Probability Model Works
- Base probability uses a sigmoid curve on the margin (aggregate vs cut-off)
- Competition penalty: more applicants per seat = lower probability
- Trend penalty: programmes with rising cut-offs get a small penalty
- Below cut-off → hard cap at 8% (very unlikely but not impossible)
- All probabilities are ranges, not certainties — the width reflects data quality

## Your Rules
1. Be honest — never promise admission or say something is impossible
2. Always acknowledge uncertainty: "our model estimates..." not "you will get in"
3. Explain in plain English — avoid jargon; this student may be 17 years old
4. When asked what-if scenarios (resitting, grade changes), reason from the margin concept
5. Keep responses concise — 2–4 short paragraphs maximum
6. If you don't have data for something, say so clearly
7. Be encouraging but realistic — help the student make a *decision*, not just feel good`
}
