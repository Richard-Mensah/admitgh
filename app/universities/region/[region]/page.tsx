// app/universities/region/[region]/page.tsx
// SEO page: all institutions in a Ghana region.
// [region] param is kebab-case e.g. "greater-accra", "ashanti"
// ISR — revalidates every 24 hours.

import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { createServerClient } from "@/lib/supabase"
import { GHANA_REGIONS, INSTITUTION_TYPE_LABEL } from "@/constants"
import type { GhanaRegion, InstitutionType } from "@/constants"

export const revalidate = 86400

type PageProps = { params: Promise<{ region: string }> }

/** Convert kebab-case URL slug → proper region name */
function slugToRegion(slug: string): GhanaRegion | undefined {
  return GHANA_REGIONS.find(
    (r) => r.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region } = await params
  const regionName = slugToRegion(region)
  if (!regionName) return { title: "Region Not Found | AdmitGH" }
  return {
    title: `Universities in ${regionName} Region — Programmes & Chances | AdmitGH`,
    description: `All accredited universities and colleges in ${regionName}, Ghana — with admission probability estimates for WASSCE students.`,
  }
}

export default async function RegionPage({ params }: PageProps) {
  const { region } = await params
  const regionName = slugToRegion(region)
  if (!regionName) notFound()

  const supabase = createServerClient()

  const { data: institutions } = await supabase
    .from("institutions")
    .select("id, name, short_name, type, slug, website_url")
    .eq("region", regionName)
    .order("type")
    .order("name")

  if (!institutions || institutions.length === 0) notFound()

  // Count programmes per institution
  const instIds = institutions.map((i) => i.id)
  const { data: progCounts } = await supabase
    .from("programmes")
    .select("institution_id")
    .in("institution_id", instIds)
    .eq("active", true)

  const countMap = new Map<string, number>()
  for (const p of progCounts ?? []) {
    countMap.set(p.institution_id, (countMap.get(p.institution_id) ?? 0) + 1)
  }

  // Group by type
  const byType = new Map<string, typeof institutions>()
  for (const inst of institutions) {
    const list = byType.get(inst.type) ?? []
    list.push(inst)
    byType.set(inst.type, list)
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[var(--card-bg)]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-[var(--muted)] flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>›</span>
            <span className="text-[var(--foreground)]">{regionName}</span>
          </nav>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl text-[var(--foreground)]">
              Universities in {regionName} Region
            </h1>
            <p className="mt-1 text-[var(--muted)] text-sm">
              {institutions.length} institution{institutions.length !== 1 ? "s" : ""} · Ghana
            </p>
          </div>

          {/* Institutions by type */}
          {Array.from(byType.entries()).map(([type, insts]) => (
            <section key={type}>
              <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wide mb-3">
                {INSTITUTION_TYPE_LABEL[type as InstitutionType] ?? type}
              </h2>
              <div className="rounded-xl border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]">
                {insts.map((inst) => {
                  const count = countMap.get(inst.id) ?? 0
                  return (
                    <Link
                      key={inst.id}
                      href={`/universities/${inst.slug}`}
                      className="flex items-center justify-between px-4 py-3 bg-[var(--background)] hover:bg-[var(--card-bg)] transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{inst.name}</p>
                        <p className="text-xs text-[var(--muted)]">{inst.short_name}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-sm font-semibold text-brand-600">{count}</p>
                        <p className="text-xs text-[var(--muted)]">programmes</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}

          {/* Other regions */}
          <section>
            <h2 className="text-sm font-semibold text-[var(--muted)] mb-3">Browse other regions</h2>
            <div className="flex flex-wrap gap-2">
              {GHANA_REGIONS.filter((r) => r !== regionName).map((r) => {
                const rSlug = r.toLowerCase().replace(/\s+/g, "-")
                return (
                  <Link
                    key={r}
                    href={`/universities/region/${rSlug}`}
                    className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] hover:border-brand-400 hover:text-brand-600 transition-colors"
                  >
                    {r}
                  </Link>
                )
              })}
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="font-semibold text-brand-800 dark:text-brand-300">
              Check your admission chances at any of these universities
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
