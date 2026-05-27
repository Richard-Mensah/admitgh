// app/api/checks/route.ts
// POST — save a grade check, run the probability model, return checkId

import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { estimateProbability, tierOf, calculateAggregate } from "@/lib/probability"
import { GradeInputSchema } from "@/lib/validations"
import { GRADE_VALUE } from "@/constants"
import type { CutoffHistory, ProgrammeCompetitiveness } from "@/types/db"
import type { ProgrammeWithProbability } from "@/types/probability"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const parsed = GradeInputSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid grade input", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { track, grades, career_interest, aggregate } = parsed.data
    const supabase = createServerClient()

    // 1. Save the check to the database
    const { data: check, error: checkError } = await supabase
      .from("checks")
      .insert({
        track,
        grades,
        career_interest: career_interest ?? null,
        aggregate,
        paid: false,
      })
      .select("id")
      .single()

    if (checkError || !check) {
      console.error("Failed to save check:", checkError)
      return NextResponse.json({ error: "Failed to save check" }, { status: 500 })
    }

    // 2. Fetch all active programmes for this track
    const { data: programmes, error: progError } = await supabase
      .from("programmes")
      .select(`
        id, name, slug, level, track, category, seats, ai_summary, active,
        institutions ( id, name, short_name, region, slug )
      `)
      .eq("active", true)
      .eq("track", track)

    if (progError) {
      console.error("Failed to fetch programmes:", progError)
      return NextResponse.json({ error: "Failed to fetch programmes" }, { status: 500 })
    }

    if (!programmes || programmes.length === 0) {
      return NextResponse.json({
        checkId: check.id,
        aggregate,
        track,
        results: [],
        counts: { safe: 0, match: 0, reach: 0, total: 0 },
      })
    }

    // 3. Fetch cut-off history and competitiveness for all these programmes
    const programmeIds = programmes.map((p) => p.id)

    const [{ data: cutoffs }, { data: competitiveness }] = await Promise.all([
      supabase
        .from("cutoff_history")
        .select("*")
        .in("programme_id", programmeIds),
      supabase
        .from("programme_competitiveness")
        .select("*")
        .in("programme_id", programmeIds)
        .order("year", { ascending: false }),
    ])

    // 4. Build lookup maps
    const cutoffsByProgramme = new Map<string, CutoffHistory[]>()
    for (const c of cutoffs ?? []) {
      const list = cutoffsByProgramme.get(c.programme_id) ?? []
      list.push(c as CutoffHistory)
      cutoffsByProgramme.set(c.programme_id, list)
    }

    const latestCompByProgramme = new Map<string, ProgrammeCompetitiveness>()
    for (const c of competitiveness ?? []) {
      if (!latestCompByProgramme.has(c.programme_id)) {
        latestCompByProgramme.set(c.programme_id, c as ProgrammeCompetitiveness)
      }
    }

    // 5. Run the probability model for each programme
    const results: ProgrammeWithProbability[] = []

    for (const prog of programmes) {
      const institution = Array.isArray(prog.institutions)
        ? prog.institutions[0]
        : prog.institutions
      if (!institution) continue

      const history = cutoffsByProgramme.get(prog.id) ?? []
      const comp = latestCompByProgramme.get(prog.id) ?? null
      const dominantConfidence = getDominantConfidence(history)

      const probability = estimateProbability(
        aggregate,
        { seats: prog.seats },
        history,
        comp ? { applicants_per_seat: comp.applicants_per_seat ?? 1 } : null
      )

      const tier = tierOf(probability.p, probability.margin)

      results.push({
        programme_id: prog.id,
        programme_name: prog.name,
        institution_name: institution.name,
        institution_short_name: institution.short_name,
        institution_region: institution.region,
        slug: prog.slug,
        level: prog.level,
        track: prog.track,
        category: prog.category,
        seats: prog.seats,
        ai_summary: prog.ai_summary,
        confidence: dominantConfidence,
        tier,
        probability,
      })
    }

    // 6. Sort: by tier priority (safe → match → reach), then by probability desc
    const tierOrder = { safe: 0, match: 1, reach: 2 }
    results.sort((a, b) => {
      const tierDiff = tierOrder[a.tier] - tierOrder[b.tier]
      if (tierDiff !== 0) return tierDiff
      return b.probability.p - a.probability.p
    })

    const counts = {
      safe: results.filter((r) => r.tier === "safe").length,
      match: results.filter((r) => r.tier === "match").length,
      reach: results.filter((r) => r.tier === "reach").length,
      total: results.length,
    }

    return NextResponse.json({
      checkId: check.id,
      aggregate,
      track,
      results,
      counts,
    })
  } catch (error) {
    console.error("POST /api/checks error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getDominantConfidence(
  history: CutoffHistory[]
): "official" | "reported" | "inferred" {
  if (history.length === 0) return "inferred"
  if (history.some((h) => h.confidence === "official")) return "official"
  if (history.some((h) => h.confidence === "reported")) return "reported"
  return "inferred"
}
