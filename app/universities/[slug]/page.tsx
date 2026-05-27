// app/universities/[slug]/page.tsx
// SEO page: per-institution — all programmes with admission probabilities.
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

export const revalidate = 86400

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServerClient()
  const { data: inst } = await supabase.from("institutions").select("name, region").eq("slug", slug).single()
  if (!inst) return { title: "University Not Found | AdmitGH" }
  return {
    title: `${inst.name} — Programmes & Admission Chances | AdmitGH`,
    description: `All programmes at ${inst.name} in ${inst.region}, with admission probability estimates and cut-off aggregate history for Ghanaian WASSCE students.`,
  }
}

// A representative aggregate to show "typical" chances
const DEMO_AGGREGATE = 18

export default async function UniversityPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = createServerClient()

  const { data: inst } = await supabase
    .from("institutions")
    .select("id, name, short_name, type, region, slug, website_url")
    .eq("slug", slug)
    .single()

  if (!inst) notFound()

  const { data: programmes } = await supabase
    .from("programmes")
    .select("id, name, slug, level, track, category, seats")
    .eq("institution_id", inst.id)
    .eq("active", true)
    .order("track")
    .order("name")

  if (!programmes || programmes.length === 0) notFound()

  const programmeIds = programmes.map((p) => p.id)
  const [{ data: cutoffs }, { data: competitiveness }] = await Promise.all([
    supabase.from("cutoff_history").select("*").in("programme_id", programmeIds),
    supabase.from("programme_competitiveness").select("*").in("programme_id", programmeIds).order("year", { ascending: false }),
  ])

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

  const results = programmes.map((prog) => {
    const history = cutoffsByProgramme.get(prog.id) ?? []
    const comp = latestCompByProgramme.get(prog.id) ?? null
    const prob = estimateProbability(DEMO_AGGREGATE, { seats: prog.seats }, history, comp ? { applicants_per_seat: comp.applicants_per_seat ?? 1 } : null)
    const tier = tierOf(prob.p, prob.margin)
    const latestCutoff = history.sort((a, b) => b.year - a.year)[0]
    return { prog, prob, tier, latestCutoff }
  })

  const tierOrder = { safe: 0, match: 1, reach: 2 } as const
  results.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier] || b.prob.p - a.prob.p)

  const regionSlug = inst.region.toLowerCase().replace(/\s+/g, "-")

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[var(--card-bg)]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-[var(--muted)] flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>›</span>
            <Link href={`/universities/region/${regionSlug}`} className="hover:text-brand-600">{inst.region}</Link>
            <span>›</span>
            <span className="text-[var(--foreground)]">{inst.short_name}</span>
          </nav>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl text-[var(--foreground)]">{inst.name}</h1>
            <p className="mt-1 text-[var(--muted)] text-sm">{inst.region} · {programmes.length} programmes</p>
            {inst.website_url && (
              <a href={inst.website_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-brand-600 hover:underline">
                Official website ↗
              </a>
            )}
          </div>

          {/* Note on demo aggregate */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-xs text-[var(--muted)]">
            Chances shown for aggregate <strong className="text-[var(--foreground)]">{DEMO_AGGREGATE}</strong>.{" "}
            <Link href="/check" className="text-brand-600 hover:underline">Enter your grades</Link>{" "}
            for your personalised prediction.
          </div>

          {/* Programmes table */}
          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">All Programmes</h2>
            <div className="rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="divide-y divide-[var(--border)]">
                {results.map(({ prog, prob, tier, latestCutoff }) => {
                  const meta = TIER_META[tier]
                  return (
                    <Link
                      key={prog.id}
                      href={`/programmes/${prog.slug}`}
                      className="flex items-center gap-4 px-4 py-3 bg-[var(--background)] hover:bg-[var(--card-bg)] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--foreground)] truncate">{prog.name}</p>
                        <p className="text-xs text-[var(--muted)] capitalize">
                          {prog.track} · {prog.level}
                          {latestCutoff && ` · Cut-off ${latestCutoff.cutoff_aggregate}`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-xs font-medium ${meta.colorClass}`}>{meta.label}</p>
                        <p className="text-sm font-bold text-[var(--foreground)]">{Math.round(prob.p * 100)}%</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="font-semibold text-brand-800 dark:text-brand-300">
              Get your personalised results for {inst.short_name}
            </p>
            <Link
              href="/check"
              className="shrink-0 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors text-center"
            >
              Check my grades →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
