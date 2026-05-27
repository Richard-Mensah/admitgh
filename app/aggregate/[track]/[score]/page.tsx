// app/aggregate/[track]/[score]/page.tsx
// SEO page: all programmes a student with this aggregate & track can apply to.
// ISR — revalidates every 24 hours.

import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { createServerClient } from "@/lib/supabase"
import { estimateProbability, tierOf } from "@/lib/probability"
import { TRACKS, TRACK_LABEL, TIER_META } from "@/constants"
import type { CutoffHistory, ProgrammeCompetitiveness } from "@/types/db"
import type { ConfidenceLevel } from "@/constants"

export const revalidate = 86400 // 24 hours

type PageProps = { params: Promise<{ track: string; score: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { track, score } = await params
  const trackLabel = TRACK_LABEL[track as keyof typeof TRACK_LABEL] ?? track
  return {
    title: `Aggregate ${score} ${trackLabel} — What Can I Study in Ghana? | AdmitGH`,
    description: `See which Ghanaian universities & programmes a ${trackLabel} student with aggregate ${score} qualifies for — with real admission probability estimates.`,
  }
}

export default async function AggregatePage({ params }: PageProps) {
  const { track, score } = await params
  const aggregate = parseInt(score, 10)

  // Validate inputs
  if (!TRACKS.includes(track as never) || isNaN(aggregate) || aggregate < 6 || aggregate > 36) {
    notFound()
  }

  const supabase = createServerClient()

  const { data: programmes } = await supabase
    .from("programmes")
    .select(`id, name, slug, level, track, category, seats, institutions(id, name, short_name, region, slug)`)
    .eq("active", true)
    .eq("track", track)

  if (!programmes || programmes.length === 0) notFound()

  const programmeIds = programmes.map((p) => p.id)
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

  // Run model
  const results = programmes
    .map((prog) => {
      const institution = Array.isArray(prog.institutions) ? prog.institutions[0] : prog.institutions
      if (!institution) return null
      const history = cutoffsByProgramme.get(prog.id) ?? []
      const comp = latestCompByProgramme.get(prog.id) ?? null
      const confidence: ConfidenceLevel = history.some((h) => h.confidence === "official")
        ? "official" : history.some((h) => h.confidence === "reported") ? "reported" : "inferred"
      const probability = estimateProbability(aggregate, { seats: prog.seats }, history, comp ? { applicants_per_seat: comp.applicants_per_seat ?? 1 } : null)
      const tier = tierOf(probability.p, probability.margin)
      return { prog, institution, probability, tier, confidence }
    })
    .filter(Boolean) as NonNullable<ReturnType<typeof results[0]>>[]

  const tierOrder = { safe: 0, match: 1, reach: 2 } as const
  results.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier] || b.probability.p - a.probability.p)

  const safe = results.filter((r) => r.tier === "safe")
  const match = results.filter((r) => r.tier === "match")
  const reach = results.filter((r) => r.tier === "reach")

  const trackLabel = TRACK_LABEL[track as keyof typeof TRACK_LABEL]

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[var(--card-bg)]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center rounded-full bg-brand-100 dark:bg-brand-900/40 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-300">
                {trackLabel}
              </span>
              <span className="inline-flex items-center rounded-full bg-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                Aggregate {aggregate}
              </span>
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl text-[var(--foreground)]">
              Aggregate <span className="text-brand-600">{aggregate}</span> — {trackLabel}
            </h1>
            <p className="mt-2 text-[var(--muted)] text-sm">
              {safe.length} Safe · {match.length} Match · {reach.length} Reach across {results.length} programmes.
              Probabilities are model estimates — not guarantees.
            </p>
          </div>

          {/* CTA */}
          <div className="mb-8 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-brand-800 dark:text-brand-300">See your personalised chances</p>
              <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5">Enter your exact grades for a more accurate prediction</p>
            </div>
            <Link
              href="/check"
              className="shrink-0 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors text-center"
            >
              Check my grades →
            </Link>
          </div>

          {/* Results by tier */}
          {([["safe", safe], ["match", match], ["reach", reach]] as const).map(([tier, list]) => {
            if (list.length === 0) return null
            const meta = TIER_META[tier]
            return (
              <section key={tier} className="mb-8">
                <div className={`rounded-t-xl border ${meta.borderClass} ${meta.bgClass} px-4 py-3`}>
                  <h2 className={`text-sm font-semibold ${meta.colorClass}`}>
                    {meta.label} — {list.length} programme{list.length !== 1 ? "s" : ""}
                  </h2>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{meta.description}</p>
                </div>
                <div className="divide-y divide-[var(--border)] border border-t-0 border-[var(--border)] rounded-b-xl overflow-hidden">
                  {list.map(({ prog, institution, probability, confidence }) => (
                    <Link
                      key={prog.id}
                      href={`/programmes/${prog.slug}`}
                      className="flex items-center justify-between px-4 py-3 bg-[var(--background)] hover:bg-[var(--card-bg)] transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--foreground)] truncate">{prog.name}</p>
                        <p className="text-xs text-[var(--muted)]">
                          {(institution as { short_name: string }).short_name} · {(institution as { region: string }).region}
                          {confidence === "inferred" && " · 🔴 Estimated"}
                        </p>
                      </div>
                      <div className="ml-4 text-right shrink-0">
                        <p className="text-sm font-bold text-[var(--foreground)]">
                          {Math.round(probability.p * 100)}%
                        </p>
                        <p className="text-xs text-[var(--muted)]">chance</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}

          {/* Other aggregates nav */}
          <div className="mt-8">
            <p className="text-xs font-medium text-[var(--muted)] mb-2">Explore nearby aggregates</p>
            <div className="flex flex-wrap gap-2">
              {[-3, -2, -1, 1, 2, 3]
                .map((d) => aggregate + d)
                .filter((s) => s >= 6 && s <= 36)
                .map((s) => (
                  <Link
                    key={s}
                    href={`/aggregate/${track}/${s}`}
                    className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] hover:border-brand-400 hover:text-brand-600 transition-colors"
                  >
                    Aggregate {s}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
