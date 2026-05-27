"use client"
// components/features/payment/TeaserSummary.tsx
// Shows counts only ("3 Safe, 5 Match, 4 Reach") then prompts MoMo payment

import { useState } from "react"
import Button from "@/components/ui/Button"
import { PRICE_GHS } from "@/constants"

type Props = {
  checkId: string
  counts: { safe: number; match: number; reach: number; total: number }
  aggregate: number
}

export default function TeaserSummary({ checkId, counts, aggregate }: Props) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUnlock() {
    if (!email) {
      setError("Enter your email to receive a receipt")
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkId, email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? "Payment initiation failed")
      }

      // Redirect to Paystack hosted checkout
      window.location.href = data.authorization_url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white dark:border-brand-800 dark:from-brand-950/40 dark:to-transparent p-6 sm:p-8">
      {/* Teaser counts */}
      <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
        Your results are ready — aggregate <span className="text-brand-600">{aggregate}</span>
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Safe", count: counts.safe, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" },
          { label: "Match", count: counts.match, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800" },
          { label: "Reach", count: counts.reach, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`rounded-xl border ${bg} px-4 py-3 text-center`}>
            <p className={`text-3xl font-bold ${color}`}>{count}</p>
            <p className="text-sm text-[var(--muted)]">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-[var(--muted)] mb-5">
        Unlock to see every programme with its exact probability, confidence range, cut-off
        history, and competition data. Ask the AI Counsellor anything.
      </p>

      {/* Payment form */}
      <div className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email for receipt (e.g. you@gmail.com)"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          aria-label="Email address for payment receipt"
        />

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <Button
          onClick={handleUnlock}
          loading={loading}
          size="lg"
          className="w-full"
        >
          Unlock Full Results — GHS {PRICE_GHS} via MoMo 🔓
        </Button>

        <p className="text-center text-xs text-[var(--muted)]">
          MTN MoMo · AirtelTigo · Telecel · One-time payment · No subscription
        </p>
      </div>
    </div>
  )
}
