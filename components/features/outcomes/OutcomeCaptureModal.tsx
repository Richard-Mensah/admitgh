"use client"
// components/features/outcomes/OutcomeCaptureModal.tsx
// "Did you get admitted?" modal — lets students report their real outcome.
// This data feeds the model each cycle (The Moat).

import { useState } from "react"
import type { ProgrammeWithProbability } from "@/types/probability"

type Props = {
  checkId: string
  results: ProgrammeWithProbability[]
  onClose: () => void
}

type Status = "idle" | "submitting" | "done" | "error"

export default function OutcomeCaptureModal({ checkId, results, onClose }: Props) {
  const [selectedProgrammeId, setSelectedProgrammeId] = useState(results[0]?.programme_id ?? "")
  const [admitted, setAdmitted] = useState<boolean | null>(null)
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit() {
    if (admitted === null || !selectedProgrammeId) return
    setStatus("submitting")

    try {
      const res = await fetch("/api/outcomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkId,
          programmeId: selectedProgrammeId,
          applied: true,
          admitted,
        }),
      })

      if (res.ok) {
        setStatus("done")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl p-6 space-y-5"
        role="dialog"
        aria-modal="true"
        aria-label="Report admission outcome"
      >
        {status === "done" ? (
          /* ── Success state ── */
          <div className="text-center space-y-3 py-2">
            <p className="text-3xl">🎉</p>
            <p className="font-semibold text-lg">Thank you for reporting!</p>
            <p className="text-sm text-[var(--muted)]">
              Your outcome helps improve admission predictions for future students.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-lg text-[var(--foreground)]">
                  Did you get admitted? 🎓
                </h2>
                <p className="text-sm text-[var(--muted)] mt-0.5">
                  Your answer helps us improve for future students.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--card-bg)] transition-colors"
                aria-label="Close"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Programme picker */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Which programme did you apply to?
              </label>
              <select
                value={selectedProgrammeId}
                onChange={(e) => setSelectedProgrammeId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {results.map((r) => (
                  <option key={r.programme_id} value={r.programme_id}>
                    {r.programme_name} — {r.institution_short_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Yes / No */}
            <div>
              <p className="text-sm font-medium text-[var(--foreground)] mb-2">Were you admitted?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdmitted(true)}
                  className={`rounded-xl border-2 py-3 text-sm font-semibold transition-all ${
                    admitted === true
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      : "border-[var(--border)] text-[var(--foreground)] hover:border-emerald-400"
                  }`}
                >
                  ✅ Yes, I got in!
                </button>
                <button
                  type="button"
                  onClick={() => setAdmitted(false)}
                  className={`rounded-xl border-2 py-3 text-sm font-semibold transition-all ${
                    admitted === false
                      ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                      : "border-[var(--border)] text-[var(--foreground)] hover:border-red-400"
                  }`}
                >
                  ❌ No, I didn&apos;t
                </button>
              </div>
            </div>

            {/* Error state */}
            {status === "error" && (
              <p className="text-xs text-red-600 dark:text-red-400 text-center">
                Something went wrong — please try again.
              </p>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={admitted === null || status === "submitting"}
              className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === "submitting" ? "Saving…" : "Submit my result"}
            </button>

            <p className="text-xs text-center text-[var(--muted)]">
              Anonymous · no personal data stored
            </p>
          </>
        )}
      </div>
    </div>
  )
}
