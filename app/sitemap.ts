// app/sitemap.ts
// Auto-generated XML sitemap from Supabase data.
// Next.js reads this file and serves it at /sitemap.xml.
// Covers: all aggregate×track pages, all programme slugs, all institution slugs, all regions.

import type { MetadataRoute } from "next"
import { createServerClient } from "@/lib/supabase"
import { TRACKS, GHANA_REGIONS } from "@/constants"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://admitgh.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient()

  // Fetch slugs in parallel
  const [{ data: programmes }, { data: institutions }] = await Promise.all([
    supabase.from("programmes").select("slug, created_at").eq("active", true),
    supabase.from("institutions").select("slug, created_at"),
  ])

  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  // ── Static pages ────────────────────────────────────────────────────────────
  entries.push(
    { url: BASE_URL, lastModified: now, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/check`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
  )

  // ── Aggregate × track pages (~5 tracks × 31 scores = 155 pages) ─────────────
  for (const track of TRACKS) {
    for (let score = 6; score <= 36; score++) {
      entries.push({
        url: `${BASE_URL}/aggregate/${track}/${score}`,
        lastModified: now,
        priority: 0.8,
        changeFrequency: "yearly",
      })
    }
  }

  // ── Programme pages ─────────────────────────────────────────────────────────
  for (const prog of programmes ?? []) {
    entries.push({
      url: `${BASE_URL}/programmes/${prog.slug}`,
      lastModified: prog.created_at ? new Date(prog.created_at) : now,
      priority: 0.7,
      changeFrequency: "yearly",
    })
  }

  // ── Institution pages ───────────────────────────────────────────────────────
  for (const inst of institutions ?? []) {
    entries.push({
      url: `${BASE_URL}/universities/${inst.slug}`,
      lastModified: inst.created_at ? new Date(inst.created_at) : now,
      priority: 0.7,
      changeFrequency: "yearly",
    })
  }

  // ── Region pages (16 regions) ───────────────────────────────────────────────
  for (const region of GHANA_REGIONS) {
    const regionSlug = region.toLowerCase().replace(/\s+/g, "-")
    entries.push({
      url: `${BASE_URL}/universities/region/${regionSlug}`,
      lastModified: now,
      priority: 0.6,
      changeFrequency: "yearly",
    })
  }

  return entries
}
