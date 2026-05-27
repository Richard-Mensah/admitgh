// app/api/outcomes/route.ts
// POST — store a student's reported admission outcome (the data moat)

import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { OutcomeSubmitSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = OutcomeSubmitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { checkId, programmeId, applied, admitted } = parsed.data
    const supabase = createServerClient()

    // Verify the check exists
    const { data: check, error: checkError } = await supabase
      .from("checks")
      .select("id, aggregate, user_id")
      .eq("id", checkId)
      .single()

    if (checkError || !check) {
      return NextResponse.json({ error: "Check not found" }, { status: 404 })
    }

    // Upsert outcome — prevent duplicate reports for the same check+programme
    const { error } = await supabase
      .from("outcomes")
      .upsert(
        {
          user_id: check.user_id,
          programme_id: programmeId,
          aggregate: check.aggregate,
          applied,
          admitted,
          reported_at: new Date().toISOString(),
          verified: false,
        },
        {
          onConflict: "user_id,programme_id",
          ignoreDuplicates: false,
        }
      )

    if (error) {
      console.error("Failed to save outcome:", error)
      return NextResponse.json({ error: "Failed to save outcome" }, { status: 500 })
    }

    return NextResponse.json({ saved: true }, { status: 201 })
  } catch (error) {
    console.error("POST /api/outcomes error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
