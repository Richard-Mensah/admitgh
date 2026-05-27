// app/results/[checkId]/page.tsx
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import ResultsGrid from "@/components/features/results/ResultsGrid"
import TeaserSummary from "@/components/features/payment/TeaserSummary"
import HonestyPanel from "@/components/features/results/HonestyPanel"
import { createServerClient } from "@/lib/supabase"
import { estimateProbability, tierOf } from "@/lib/probability"
import { verifyPayment } from "@/lib/paystack"
import CounsellorPanel from "@/components/features/aiCounsellor/CounsellorPanel"
import type { CutoffHistory, ProgrammeCompetitiveness } from "@/types/db"
import type { ProgrammeWithProbability } from "@/types/probability"
import type { ConfidenceLevel } from "@/constants"

type PageProps = {
  params: Promise<{ checkId: string }>
  searchParams: Promise<{ payment?: string }>
}

export async function generateMetadata(_: PageProps): Promise<Metadata> {
  return {
    title: `Your Admission Results — Aggregate Check | AdmitGH`,
    description: `See your honest admission probability across Ghana's universities — sorted Reach, Match & Safe.`,
  }
}

export default async function ResultsPage({ params, searchParams }: PageProps) {
  const { checkId } = await params
  const { payment } = await searchParams
  const supabase = createServerClient()

  // 1. Fetch the check (include paystack_ref for callback verification)
  const { data: check, error: checkError } = await supabase
    .from("checks")
    .select("id, aggregate, track, grades, career_interest, paid, paystack_ref")
    .eq("id", checkId)
    .single()

  if (checkError || !check) notFound()

  // 2. If returning from Paystack and still unpaid, verify directly with Paystack
  //    (handles the race condition where the webhook hasn't fired yet)
  if (payment === "success" && !check.paid && check.paystack_ref) {
    try {
      const { success } = await verifyPayment(check.paystack_ref)
      if (success) {
        await supabase
          .from("checks")
          .update({ paid: true, paid_at: new Date().toISOString() })
          .eq("id", checkId)
        check.paid = true
      }
    } catch {
      // Webhook will handle it — proceed with current state
    }
  }

  // 3. Fetch programmes + probability data
  const { data: programmes } = await supabase
    .from("programmes")
    .select(`id, name, slug, level, track, category, seats, ai_summary, active, institutions(id, name, short_name, region, slug)`)
    .eq("active", true)
    .eq("track", check.track)

  const programmeIds = (programmes ?? []).map((p) => p.id)

  const [{ data: cutoffs }, { data: competitiveness }] = await Promise.all([
    supabase.from("cutoff_history").select("*").in("programme_id", programmeIds),
    supabase.from("programme_competitiveness").select("*").in("programme_id", programmeIds).order("year", { ascending: false }),
  ])

  // Build lookup maps
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

  // 4. Run probability model
  const results: ProgrammeWithProbability[] = []

  for (const prog of programmes ?? []) {
    const institution = Array.isArray(prog.institutions) ? prog.institutions[0] : prog.institutions
    if (!institution) continue

    const history = cutoffsByProgramme.get(prog.id) ?? []
    const comp = latestCompByProgramme.get(prog.id) ?? null
    const confidence: ConfidenceLevel = history.some((h) => h.confidence === "official")
      ? "official"
      : history.some((h) => h.confidence === "reported")
      ? "reported"
      : "inferred"

    const probability = estimateProbability(
      check.aggregate,
      { seats: prog.seats },
      history,
      comp ? { applicants_per_seat: comp.applicants_per_seat ?? 1 } : null
    )

    results.push({
      programme_id: prog.id,
      programme_name: prog.name,
      institution_name: (institution as { name: string }).name,
      institution_short_name: (institution as { short_name: string }).short_name,
      institution_region: (institution as { region: string }).region,
      slug: prog.slug,
      level: prog.level,
      track: prog.track,
      category: prog.category,
      seats: prog.seats,
      ai_summary: prog.ai_summary,
      confidence,
      tier: tierOf(probability.p, probability.margin),
      probability,
    })
  }

  const tierOrder = { safe: 0, match: 1, reach: 2 } as const
  results.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier] || b.probability.p - a.probability.p)

  const safe = results.filter((r) => r.tier === "safe")
  const match = results.filter((r) => r.tier === "match")
  const reach = results.filter((r) => r.tier === "reach")
  const counts = { safe: safe.length, match: match.length, reach: reach.length, total: results.length }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[var(--card-bg)]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Your results — Aggregate{" "}
              <span className="text-brand-600">{check.aggregate}</span>
            </h1>
            <p className="mt-1 text-[var(--muted)] text-sm capitalize">
              Track: {check.track} · {results.length} programmes matched
            </p>
          </div>

          {!check.paid ? (
            /* ── PAYWALL: show teaser only ── */
            <div className="space-y-8">
              <TeaserSummary checkId={check.id} counts={counts} aggregate={check.aggregate} />

              {/* Blurred preview of first 3 results */}
              <div>
                <p className="text-sm font-medium text-[var(--muted)] mb-3">Preview (unlock to reveal):</p>
                <div className="space-y-3 blur-sm pointer-events-none select-none">
                  {results.slice(0, 3).map((r) => (
                    <div
                      key={r.programme_id}
                      className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 h-24"
                    />
                  ))}
                </div>
              </div>

              <HonestyPanel />
            </div>
          ) : (
            /* ── FULL RESULTS ── */
            <ResultsGrid
              results={results}
              careerInterest={check.career_interest ?? null}
              counts={counts}
              checkId={check.id}
              aggregate={check.aggregate}
            />
          )}
        </div>
      </main>
      <Footer />
      {/* AI Counsellor — floating chat, paid users only */}
      {check.paid && <CounsellorPanel checkId={check.id} />}
    </>
  )
}
