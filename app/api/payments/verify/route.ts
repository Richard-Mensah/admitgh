// app/api/payments/verify/route.ts
// POST — Paystack webhook handler. Marks check as paid when charge succeeds.
// Must be idempotent — Paystack retries webhooks on failure.

import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { verifyWebhookSignature, verifyPayment } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get("x-paystack-signature") ?? ""

    // 1. Verify the webhook is genuinely from Paystack
    const isValid = await verifyWebhookSignature(rawBody, signature)
    if (!isValid) {
      console.warn("Invalid Paystack webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(rawBody)

    // 2. Only handle successful charges
    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const reference = event.data?.reference as string | undefined
    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 })
    }

    // 3. Double-verify with Paystack API (prevents replay attacks)
    const { success, checkId } = await verifyPayment(reference)
    if (!success || !checkId) {
      console.error("Payment verification failed for reference:", reference)
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    const supabase = createServerClient()

    // 4. Idempotent update — safe to run multiple times
    const { error } = await supabase
      .from("checks")
      .update({
        paid: true,
        paid_at: new Date().toISOString(),
        paystack_ref: reference,
      })
      .eq("id", checkId)
      .eq("paid", false) // only update if not already paid

    if (error) {
      console.error("Failed to mark check as paid:", error)
      return NextResponse.json({ error: "Database update failed" }, { status: 500 })
    }

    console.log(`Check ${checkId} marked as paid (ref: ${reference})`)
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("POST /api/payments/verify error:", error)
    // Return 200 to prevent Paystack from retrying on our internal errors
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
