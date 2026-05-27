// types/api.ts
// API request and response types

import type { Track } from "@/constants"
import type { GradesJson } from "@/types/db"
import type { ProgrammeWithProbability } from "@/types/probability"

// POST /api/checks
export type CheckPayload = {
  track: Track
  grades: GradesJson
  career_interest?: string
  aggregate: number
}

export type CheckResponse = {
  checkId: string
  aggregate: number
  track: Track
}

// GET /api/results/[checkId]
export type ResultsResponse = {
  checkId: string
  aggregate: number
  track: Track
  grades: GradesJson
  career_interest: string | null
  paid: boolean
  results: ProgrammeWithProbability[]
  counts: {
    safe: number
    match: number
    reach: number
    total: number
  }
}

// POST /api/payments/initiate
export type PaymentInitiatePayload = {
  checkId: string
  email: string
}

export type PaymentInitiateResponse = {
  authorization_url: string
  reference: string
}

// POST /api/payments/verify (Paystack webhook)
export type PaystackWebhookEvent = {
  event: "charge.success" | string
  data: {
    reference: string
    status: "success" | string
    metadata?: {
      checkId?: string
    }
  }
}

// POST /api/chat
export type ChatPayload = {
  checkId: string
  userMessage: string
  messages: Array<{ role: "user" | "assistant"; content: string }>
}

// POST /api/outcomes
export type OutcomePayload = {
  checkId: string
  programmeId: string
  applied: boolean
  admitted: boolean
}
