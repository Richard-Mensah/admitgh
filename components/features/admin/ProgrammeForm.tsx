"use client"
// components/features/admin/ProgrammeForm.tsx
// Add new programme or edit existing one, plus cut-off history management

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase"
import { TRACKS, PROGRAMME_CATEGORIES } from "@/constants"
import { slugify } from "@/lib/utils"

const CONFIDENCE_OPTIONS = ["official", "reported", "inferred"] as const
const LEVELS = ["degree", "diploma", "hnd", "certificate"] as const

type ProgrammeRow = {
  id: string
  name: string
  slug: string
  level: string
  track: string
  category: string
  seats: number | null
  active: boolean
  institutions: { name: string; short_name: string; region: string } | null
}

type Props = {
  programme: ProgrammeRow | null  // null = new programme
  onClose: () => void
  onSaved: () => void
}

type Institution = { id: string; name: string; short_name: string }

type CutoffRow = {
  year: number
  cutoff_aggregate: number
  confidence: string
  source_url: string
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProgrammeForm({ programme, onClose, onSaved }: Props) {
  const supabase = createBrowserClient()
  const isNew = programme === null

  // Programme fields
  const [name, setName] = useState(programme?.name ?? "")
  const [slug, setSlug] = useState(programme?.slug ?? "")
  const [level, setLevel] = useState(programme?.level ?? "degree")
  const [track, setTrack] = useState(programme?.track ?? "science")
  const [category, setCategory] = useState(programme?.category ?? "computing")
  const [seats, setSeats] = useState<string>(programme?.seats?.toString() ?? "")
  const [active, setActive] = useState(programme?.active ?? true)
  const [institutionId, setInstitutionId] = useState("")
  const [institutions, setInstitutions] = useState<Institution[]>([])

  // Cut-off state
  const [cutoffYear, setCutoffYear] = useState(new Date().getFullYear() - 1)
  const [cutoffAggregate, setCutoffAggregate] = useState("")
  const [cutoffConfidence, setCutoffConfidence] = useState("reported")
  const [cutoffSourceUrl, setCutoffSourceUrl] = useState("")
  const [existingCutoffs, setExistingCutoffs] = useState<CutoffRow[]>([])

  // UI state
  const [tab, setTab] = useState<"details" | "cutoffs">("details")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-slug from name for new programmes
  useEffect(() => {
    if (isNew && name) setSlug(slugify(name))
  }, [name, isNew])

  // Load institutions list
  useEffect(() => {
    supabase.from("institutions").select("id, name, short_name").order("name").then(({ data }) => {
      setInstitutions(data ?? [])
    })
  }, [])

  // Load existing cut-offs in edit mode
  useEffect(() => {
    if (!isNew && programme?.id) {
      supabase
        .from("cutoff_history")
        .select("year, cutoff_aggregate, confidence, source_url")
        .eq("programme_id", programme.id)
        .order("year", { ascending: false })
        .then(({ data }) => setExistingCutoffs((data ?? []) as CutoffRow[]))
    }
  }, [isNew, programme?.id])

  async function reloadCutoffs(progId: string) {
    const { data } = await supabase
      .from("cutoff_history")
      .select("year, cutoff_aggregate, confidence, source_url")
      .eq("programme_id", progId)
      .order("year", { ascending: false })
    setExistingCutoffs((data ?? []) as CutoffRow[])
  }

  async function saveProgramme() {
    setSaving(true)
    setError(null)
    try {
      if (isNew) {
        const { data, error: err } = await supabase
          .from("programmes")
          .insert({
            name,
            slug,
            level,
            track,
            category,
            seats: seats ? parseInt(seats) : null,
            active,
            institution_id: institutionId,
          })
          .select("id")
          .single()
        if (err) throw err
        // Optionally attach an initial cut-off row
        if (cutoffAggregate && data?.id) {
          await insertCutoff(data.id)
        }
      } else {
        const { error: err } = await supabase
          .from("programmes")
          .update({ name, slug, level, track, category, seats: seats ? parseInt(seats) : null, active })
          .eq("id", programme!.id)
        if (err) throw err
      }
      onSaved()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed — check your inputs.")
    } finally {
      setSaving(false)
    }
  }

  async function insertCutoff(progId: string) {
    const { error: err } = await supabase.from("cutoff_history").insert({
      programme_id: progId,
      year: cutoffYear,
      cutoff_aggregate: parseInt(cutoffAggregate),
      confidence: cutoffConfidence,
      source_url: cutoffSourceUrl || "manual",
      entered_by: "admin",
    })
    if (err) throw err
    setCutoffAggregate("")
    setCutoffSourceUrl("")
  }

  async function handleAddCutoff() {
    if (!cutoffAggregate || !programme?.id) return
    setSaving(true)
    setError(null)
    try {
      await insertCutoff(programme.id)
      await reloadCutoffs(programme.id)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add cut-off row.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <h2 className="text-lg font-bold">{isNew ? "Add programme" : "Edit programme"}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ×
          </button>
        </div>

        {/* Tabs (edit mode only) */}
        {!isNew && (
          <div className="flex border-b border-[var(--border)]">
            {(["details", "cutoffs"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors ${
                  tab === t
                    ? "border-b-2 border-brand-500 text-brand-600"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {t === "cutoffs" ? "Cut-off history" : "Details"}
              </button>
            ))}
          </div>
        )}

        <div className="p-6 space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </p>
          )}

          {/* ── Details tab ── */}
          {(tab === "details" || isNew) && (
            <>
              <Field label="Programme name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className={inputCls}
                />
              </Field>

              <Field label="Slug (auto-generated)">
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. knust-computer-science"
                  className={inputCls}
                />
              </Field>

              {isNew && (
                <Field label="Institution">
                  <select
                    value={institutionId}
                    onChange={(e) => setInstitutionId(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select institution…</option>
                    {institutions.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} ({i.short_name})
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Field label="Track">
                  <select value={track} onChange={(e) => setTrack(e.target.value)} className={inputCls}>
                    {TRACKS.map((t) => (
                      <option key={t} value={t} className="capitalize">
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Level">
                  <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputCls}>
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Category">
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                    {PROGRAMME_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Seats (optional)">
                  <input
                    type="number"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    placeholder="e.g. 60"
                    min={1}
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="active-toggle"
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="active-toggle" className="text-sm">
                  Active (visible to students)
                </label>
              </div>

              {/* Initial cut-off when creating a new programme */}
              {isNew && (
                <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
                  <p className="text-sm font-medium">Add initial cut-off row (optional)</p>
                  <CutoffFields
                    year={cutoffYear} onYear={setCutoffYear}
                    aggregate={cutoffAggregate} onAggregate={setCutoffAggregate}
                    confidence={cutoffConfidence} onConfidence={setCutoffConfidence}
                    sourceUrl={cutoffSourceUrl} onSourceUrl={setCutoffSourceUrl}
                  />
                </div>
              )}
            </>
          )}

          {/* ── Cut-offs tab (edit mode) ── */}
          {tab === "cutoffs" && !isNew && (
            <>
              {existingCutoffs.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-[var(--border)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--card-bg)] text-left text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                        <th className="px-4 py-2">Year</th>
                        <th className="px-4 py-2">Cut-off</th>
                        <th className="px-4 py-2">Confidence</th>
                        <th className="px-4 py-2">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {existingCutoffs.map((c) => (
                        <tr key={`${c.year}-${c.cutoff_aggregate}`} className="bg-[var(--background)]">
                          <td className="px-4 py-2 font-mono">{c.year}</td>
                          <td className="px-4 py-2 font-mono font-semibold">{c.cutoff_aggregate}</td>
                          <td className="px-4 py-2 capitalize">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              c.confidence === "official"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                : c.confidence === "reported"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                            }`}>
                              {c.confidence}
                            </span>
                          </td>
                          <td className="px-4 py-2 max-w-[160px] truncate text-xs text-[var(--muted)]" title={c.source_url}>
                            {c.source_url === "manual" ? "—" : c.source_url}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)]">No cut-off history yet — add the first row below.</p>
              )}

              <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
                <p className="text-sm font-medium">Add cut-off row</p>
                <CutoffFields
                  year={cutoffYear} onYear={setCutoffYear}
                  aggregate={cutoffAggregate} onAggregate={setCutoffAggregate}
                  confidence={cutoffConfidence} onConfidence={setCutoffConfidence}
                  sourceUrl={cutoffSourceUrl} onSourceUrl={setCutoffSourceUrl}
                />
                <button
                  onClick={handleAddCutoff}
                  disabled={!cutoffAggregate || saving}
                  className="w-full rounded-lg border border-brand-500 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/20 disabled:opacity-40 transition-colors"
                >
                  {saving ? "Saving…" : "Add row"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer — save / cancel for details tab */}
        {(tab === "details" || isNew) && (
          <div className="flex justify-end gap-3 border-t border-[var(--border)] px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveProgramme}
              disabled={saving || !name || !slug || (isNew && !institutionId)}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition-colors"
            >
              {saving ? "Saving…" : isNew ? "Create programme" : "Save changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
        {label}
      </label>
      {children}
    </div>
  )
}

function CutoffFields({
  year, onYear,
  aggregate, onAggregate,
  confidence, onConfidence,
  sourceUrl, onSourceUrl,
}: {
  year: number; onYear: (v: number) => void
  aggregate: string; onAggregate: (v: string) => void
  confidence: string; onConfidence: (v: string) => void
  sourceUrl: string; onSourceUrl: (v: string) => void
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Year">
          <input
            type="number"
            value={year}
            onChange={(e) => onYear(parseInt(e.target.value))}
            min={2015}
            max={2030}
            className={inputCls}
          />
        </Field>
        <Field label="Aggregate">
          <input
            type="number"
            value={aggregate}
            onChange={(e) => onAggregate(e.target.value)}
            placeholder="e.g. 8"
            min={6}
            max={36}
            className={inputCls}
          />
        </Field>
        <Field label="Confidence">
          <select value={confidence} onChange={(e) => onConfidence(e.target.value)} className={inputCls}>
            {CONFIDENCE_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Source URL (optional)">
        <input
          value={sourceUrl}
          onChange={(e) => onSourceUrl(e.target.value)}
          placeholder="https://university.edu.gh/admissions/cutoff-2024"
          className={inputCls}
        />
      </Field>
    </div>
  )
}

const inputCls =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
