// app/programmes/[slug]/page.tsx
// SEO page: per-programme detail — cut-off history, probabilities at different aggregates.
// ISR — revalidates every 24 hours.

import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { createServerClient } from "@/lib/supabase"
import { estimateProbability, tierOf } from "@/lib/probability"
import { TIER_META } from "@/constants"
import type { CutoffHistory, ProgrammeCompetitiveness } from "@/types/db"

export const revalidate = 86400 // 24 hours

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServerClient()
  const { data: prog } = await supabase
    .from("programmes")
    .select("name, institutions(name)")
    .eq("slug", slug)
    .single()
  if (!prog) return { title: "Programme Not Found | AdmitGH" }
  const instName = Array.isArray(prog.institutions) ? prog.institutions[0]?.name : (prog.institutions as { name: string } | null)?.name
  return {
    title: `${prog.name} at ${instName ?? "Ghana"} — Admission Chances & Cut-off History | AdmitGH`,
    description: `Real admission probability, cut-off aggregate history, and entry requirements for ${prog.name} at ${instName ?? "a Ghanaian university"}.`,
  }
}

// Sample aggregates to show probability at different scores
const SAMPLE_AGGREGATES = [9, 12, 15, 18, 21, 24]

export default async function ProgrammePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = createServerClient()

  const { data: prog } = await supabase
    .from("programmes")
    .select(`id, name, slug, level, track, category, seats, ai_summary, active, institutions(id, name, short_name, region, slug, website_url)`)
    .eq("slug", slug)
    .eq("active", true)
    .single()

  if (!prog) notFound()

  const institution = Array.isArray(prog.institutions) ? prog.institutions[0] : prog.institutions as { id: string; name: string; short_name: string; region: string; slug: string; website_url: string | null } | null
  if (!institution) notFound()

  const [{ data: cutoffs }, { data: competitiveness }] = await Promise.all([
    supabase.from("cutoff_history").select("*").eq("programme_id", prog.id).order("year", { ascending: false }),
    supabase.from("programme_competitiveness").select("*").eq("programme_id", prog.id).order("year", { ascending: false }),
  ])

  const latestComp = (competitiveness ?? [])[0] as ProgrammeCompetitiveness | null

  // Probability at sample aggregates
  const probabilities = SAMPLE_AGGREGATES.map((agg) => {
    const prob = estimateProbability(agg, { seats: prog.seats }, cutoffs as CutoffHistory[] ?? [], latestComp ? { applicants_per_seat: latestComp.applicants_per_seat ?? 1 } : null)
    return { aggregate: agg, prob, tier: tierOf(prob.p, prob.margin) }
  })

  const latestCutoff = (cutoffs ?? [])[0]

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[var(--card-bg)]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-[var(--muted)] flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>›</span>
            <Link href={`/universities/${(institution as {slug:string}).slug}`} className="hover:text-brand-600">
              {(institution as {short_name:string}).short_name}
            </Link>
            <span>›</span>
            <span className="text-[var(--foreground)]">{prog.name}</span>
          </nav>

          {/* Header */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center rounded-full bg-brand-100 dark:bg-brand-900/40 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-300 capitalize">
                {prog.track}
              </span>
              <span className="inline-flex items-center rounded-full bg-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)] capitalize">
                {prog.level}
              </span>
              {latestCutoff && (
                <span className="inline-flex items-center rounded-full bg-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                  Cut-off {latestCutoff.cutoff_aggregate} ({latestCutoff.year})
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl text-[var(--foreground)]">{prog.name}</h1>
            <p className="mt-1 text-[var(--muted)]">
              <Link href={`/universities/${(institution as {slug:string}).slug}`} className="hover:text-brand-600 hover:underline">
                {(institution as {name:string}).name}
              </Link>
              {" · "}{(institution as {region:string}).region}
            </p>
            {prog.ai_summary && (
              <p className="mt-3 text-sm text-[var(--foreground)] leading-relaxed">{prog.ai_summary}</p>
            )}
          </div>

          {/* Probability at various aggregates */}
          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">
              Admission chances by aggregate
            </h2>
            <div className="rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--card-bg)]">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--muted)]">Aggregate</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--muted)]">Tier</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-[var(--muted)]">Est. chance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] bg-[var(--background)]">
                  {probabilities.map(({ aggregate, prob, tier }) => {
                    const meta = TIER_META[tier]
                    return (
                      <tr key={aggregate}>
                        <td className="px-4 py-2.5 font-medium">
                          <Link href={`/aggregate/${prog.track}/${aggregate}`} className="hover:text-brand-600 hover:underline">
                            {aggregate}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs font-medium ${meta.colorClass}`}>{meta.label}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold">
                          {Math.round(prob.p * 100)}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Model estimates based on historical cut-offs. Not guarantees.
            </p>
          </section>

          {/* Cut-off history */}
          {(cutoffs ?? []).length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">
                Cut-off aggregate history
              </h2>
              <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--card-bg)]">
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--muted)]">Year</th>
                      <th className="px-4 py-2.5 text-right text-xs font-medium text-[var(--muted)]">Cut-off</th>
                      <th className="px-4 py-2.5 text-right text-xs font-medium text-[var(--muted)]">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] bg-[var(--background)]">
                    {(cutoffs as CutoffHistory[]).map((c) => (
                      <tr key={c.id}>
                        <td className="px-4 py-2.5 font-medium">{c.year}</td>
                        <td className="px-4 py-2.5 text-right font-semibold">{c.cutoff_aggregate}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={`text-xs ${c.confidence === "official" ? "text-emerald-600" : c.confidence === "reported" ? "text-amber-600" : "text-red-500"}`}>
                            {c.confidence === "official" ? "🟢" : c.confidence === "reported" ? "🟡" : "🔴"} {c.confidence}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-brand-800 dark:text-brand-300">Want your personalised chance?</p>
              <p className="text-sm text-brand-600 dark:text-brand-400 mt-0.5">
                Enter your actual WASSCE grades for an accurate prediction.
              </p>
            </div>
            <Link
              href="/check"
              className="shrink-0 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors text-center"
            >
              Check my chances →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
