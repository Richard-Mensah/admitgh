// lib/validations.ts
// Zod schemas for all incoming request bodies

import { z } from "zod"
import { GRADES, TRACKS } from "@/constants"

const GradeEnum = z.enum(GRADES)

// ─── Grade Input (from /check form) ─────────────────────────────────────────

export const GradeInputSchema = z.object({
  track: z.enum(TRACKS),
  grades: z.object({
    english: GradeEnum,
    maths: GradeEnum,
    core3: GradeEnum,
    elective1: GradeEnum,
    elective2: GradeEnum,
    elective3: GradeEnum,
  }),
  career_interest: z.string().optional(),
  aggregate: z.number().int().min(6).max(36),
})

export type GradeInput = z.infer<typeof GradeInputSchema>

// ─── Payment Initiation ──────────────────────────────────────────────────────

export const PaymentInitiateSchema = z.object({
  checkId: z.string().uuid(),
  email: z.string().email(),
})

export type PaymentInitiate = z.infer<typeof PaymentInitiateSchema>

// ─── Chat Message ────────────────────────────────────────────────────────────

export const ChatMessageSchema = z.object({
  checkId: z.string().uuid(),
  userMessage: z.string().min(1).max(1000),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ).max(40), // never send more than 40 prior messages
})

export type ChatMessage = z.infer<typeof ChatMessageSchema>

// ─── Outcome Submission ──────────────────────────────────────────────────────

export const OutcomeSubmitSchema = z.object({
  checkId: z.string().uuid(),
  programmeId: z.string().uuid(),
  applied: z.boolean(),
  admitted: z.boolean(),
})

export type OutcomeSubmit = z.infer<typeof OutcomeSubmitSchema>
