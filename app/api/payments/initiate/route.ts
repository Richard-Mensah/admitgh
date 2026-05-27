// app/api/payments/initiate/route.ts
// POST — initiate a Paystack MoMo payment for a check

import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { initiatePayment } from "@/lib/paystack"
import { PaymentInitiateSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = PaymentInitiateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { checkId, email } = parsed.data
    const supabase = createServerClient()

    // Verify the check exists and isn't already paid
    const { data: check, error } = await supabase
      .from("checks")
      .select("id, paid, aggregate, track")
      .eq("id", checkId)
      .single()

    if (error || !check) {
      return NextResponse.json({ error: "Check not found" }, { status: 404 })
    }

    if (check.paid) {
      return NextResponse.json({ error: "Already paid" }, { status: 409 })
    }

    // Build callback URL pointing back to the results page
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://admitgh.com"
    const callbackUrl = `${appUrl}/results/${checkId}?payment=success`

    // Initiate payment with Paystack
    const { authorization_url, reference } = await initiatePayment({
      email,
      checkId,
      callbackUrl,
    })

    // Save the reference so we can match it in the webhook
    await supabase
      .from("checks")
      .update({ paystack_ref: reference })
      .eq("id", checkId)

    return NextResponse.json({ authorization_url, reference }, { status: 200 })
  } catch (error) {
    console.error("POST /api/payments/initiate error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
