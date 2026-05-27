// types/index.ts
// Re-export all types from a single entry point

export type {
  Institution,
  Programme,
  ProgrammeRequirement,
  CutoffHistory,
  ProgrammeCompetitiveness,
  User,
  Check,
  GradesJson,
  Outcome,
  ChatMessage,
} from "@/types/db"

export type {
  Tier,
  ProbabilityResult,
  ProgrammeWithProbability,
} from "@/types/probability"

export type {
  CheckPayload,
  CheckResponse,
  ResultsResponse,
  PaymentInitiatePayload,
  PaymentInitiateResponse,
  PaystackWebhookEvent,
  ChatPayload,
  OutcomePayload,
} from "@/types/api"
