// app/api/chat/route.ts
// POST — streaming AI Counsellor endpoint (claude-haiku-4-5)
// Rate-limited to MAX_CHAT_MESSAGES_PER_CHECK messages per checkId

import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { anthropic, COUNSELLOR_MODEL, buildCounsellorPrompt } from "@/lib/claude"
import { ChatMessageSchema } from "@/lib/validations"
import { MAX_CHAT_MESSAGES_PER_CHECK } from "@/constants"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = ChatMessageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { checkId, userMessage, messages } = parsed.data
    const supabase = createServerClient()

    // 1. Verify check exists and is paid
    const { data: check, error: checkError } = await supabase
      .from("checks")
      .select("id, paid, track, aggregate, grades, career_interest")
      .eq("id", checkId)
      .single()

    if (checkError || !check) {
      return NextResponse.json({ error: "Check not found" }, { status: 404 })
    }

    if (!check.paid) {
      return NextResponse.json({ error: "Payment required to use AI Counsellor" }, { status: 402 })
    }

    // 2. Rate limit: count messages already sent for this check
    const { count } = await supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("check_id", checkId)
      .eq("role", "user")

    if ((count ?? 0) >= MAX_CHAT_MESSAGES_PER_CHECK) {
      return NextResponse.json(
        { error: `Message limit of ${MAX_CHAT_MESSAGES_PER_CHECK} reached for this check` },
        { status: 429 }
      )
    }

    // 3. Save user message
    await supabase.from("chat_messages").insert({
      check_id: checkId,
      role: "user",
      content: userMessage,
    })

    // 4. Fetch results to build counsellor system prompt
    const { data: programmes } = await supabase
      .from("programmes")
      .select(`id, name, slug, level, track, category, seats, institutions(name, short_name, region)`)
      .eq("active", true)
      .eq("track", check.track)

    // Build a lightweight results summary for the prompt
    type InstitutionJoin = { name: string; short_name: string; region: string }
    const resultsForPrompt = (programmes ?? []).map((p) => {
      const raw = p.institutions as unknown
      const inst: InstitutionJoin | null = Array.isArray(raw)
        ? ((raw[0] as InstitutionJoin) ?? null)
        : ((raw as InstitutionJoin) ?? null)
      return {
      programme_name: p.name,
      institution_name: inst?.name ?? "",
      institution_short_name: inst?.short_name ?? "",
      institution_region: inst?.region ?? "",
      slug: p.slug,
      level: p.level,
      track: p.track,
      category: p.category,
      seats: p.seats,
      ai_summary: null,
      confidence: "reported" as const,
      tier: "match" as const, // simplified for prompt context
      probability: { p: 0.5, low: 0.3, high: 0.7, margin: 0, aps: 1, tightening: 0, cutoff: 15, drift: [] },
      programme_id: p.id,
    }
    })

    const systemPrompt = buildCounsellorPrompt(check, resultsForPrompt)

    // 5. Stream from Claude
    const stream = anthropic.messages.stream({
      model: COUNSELLOR_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        ...(messages ?? []),
        { role: "user", content: userMessage },
      ],
    })

    // 6. Return SSE stream
    let assistantContent = ""

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              const text = chunk.delta.text
              assistantContent += text
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ text })}\n\n`
                )
              )
            }
          }

          // Save assistant response after stream completes
          if (assistantContent) {
            await supabase.from("chat_messages").insert({
              check_id: checkId,
              role: "assistant",
              content: assistantContent,
            })
          }

          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
          controller.close()
        } catch (err) {
          console.error("Stream error:", err)
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("POST /api/chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
