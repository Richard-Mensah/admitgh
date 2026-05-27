"use client"
// components/features/admin/ProgrammeTable.tsx
// Searchable list of all programmes — opens ProgrammeForm for add/edit

import { useState, useEffect, useCallback } from "react"
import { createBrowserClient } from "@/lib/supabase"
import ProgrammeForm from "./ProgrammeForm"

type Row = {
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

export default function ProgrammeTable() {
  const [rows, setRows] = useState<Row[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Row | "new" | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createBrowserClient()
    const { data } = await supabase
      .from("programmes")
      .select("id, name, slug, level, track, category, seats, active, institutions(name, short_name, region)")
      .order("name")
    setRows((data ?? []) as unknown as Row[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = rows.filter((r) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      r.name.toLowerCase().includes(q) ||
      r.institutions?.name.toLowerCase().includes(q) ||
      r.institutions?.short_name.toLowerCase().includes(q) ||
      r.track.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search programmes or institution…"
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          onClick={() => setEditing("new")}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          + Add programme
        </button>
      </div>

      {/* Count */}
      <p className="text-xs text-[var(--muted)]">
        {loading ? "Loading…" : `${filtered.length} of ${rows.length} programmes`}
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--card-bg)] text-left text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
              <th className="px-4 py-3">Programme</th>
              <th className="px-4 py-3">Institution</th>
              <th className="px-4 py-3">Track</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3 text-center">Seats</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded bg-[var(--border)] animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : filtered.length === 0
              ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[var(--muted)]">
                    {search ? "No programmes match your search." : "No programmes yet — add one above."}
                  </td>
                </tr>
              )
              : filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-[var(--background)] hover:bg-[var(--card-bg)] transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {row.institutions?.short_name ?? "—"}
                      {row.institutions?.region && (
                        <span className="ml-1 text-xs opacity-60">({row.institutions.region})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize">{row.track}</td>
                    <td className="px-4 py-3 uppercase text-xs">{row.level}</td>
                    <td className="px-4 py-3 text-center">{row.seats ?? "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.active
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {row.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditing(row)}
                        className="text-xs text-brand-600 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {editing !== null && (
        <ProgrammeForm
          programme={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load() }}
        />
      )}
    </div>
  )
}
