// app/pay/[checkId]/page.tsx
// Redirect page — kicks off Paystack MoMo checkout

import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { createServerClient } from "@/lib/supabase"
import { initiatePayment } from "@/lib/paystack"

export const metadata: Metadata = { title: "Unlock Results — AdmitGH" }

type PageProps = { params: Promise<{ checkId: string }>; searchParams: Promise<{ email?: string }> }

export default async function PayPage({ params, searchParams }: PageProps) {
  const { checkId } = await params
  const { email } = await searchParams

  const supabase = createServerClient()

  const { data: check, error } = await supabase
    .from("checks")
    .select("id, paid")
    .eq("id", checkId)
    .single()

  if (error || !check) notFound()
  if (check.paid) redirect(`/results/${checkId}`)

  // If email provided as query param, initiate directly (from SMS / USSD link)
  if (email) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://admitgh.com"
    const { authorization_url } = await initiatePayment({
      email,
      checkId,
      callbackUrl: `${appUrl}/results/${checkId}?payment=success`,
    })
    redirect(authorization_url)
  }

  // Otherwise show a simple email capture form
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8 text-center">
        <h1 className="text-xl font-bold">Unlock your results</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Redirecting to the payment page…
        </p>
        <p className="mt-4 text-xs text-[var(--muted)]">
          If you&apos;re not redirected, go back to your results and click &quot;Unlock Full Results&quot;.
        </p>
        <a
          href={`/results/${checkId}`}
          className="mt-4 inline-block text-sm text-brand-600 hover:underline"
        >
          ← Back to results
        </a>
      </div>
    </div>
  )
}
