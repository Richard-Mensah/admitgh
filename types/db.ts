// types/db.ts
// Supabase table row types — mirrors the database schema exactly

import type { GhanaRegion, InstitutionType, Track, ConfidenceLevel, ProgrammeCategory } from "@/constants"

export type Institution = {
  id: string
  name: string
  short_name: string
  type: InstitutionType
  region: GhanaRegion
  slug: string
  website_url: string | null
  created_at: string
}

export type Programme = {
  id: string
  institution_id: string
  name: string
  slug: string
  level: "degree" | "diploma" | "hnd" | "certificate"
  track: Track
  category: ProgrammeCategory
  seats: number | null
  ai_summary: string | null
  active: boolean
  created_at: string
  // joined
  institutions?: Institution
}

export type ProgrammeRequirement = {
  id: string
  programme_id: string
  subject: string
  min_grade: string
  is_core: boolean
  notes: string | null
}

export type CutoffHistory = {
  id: string
  programme_id: string
  year: number
  cutoff_aggregate: number
  gender: "male" | "female" | null
  source_url: string
  confidence: ConfidenceLevel
  entered_by: string
  created_at: string
}

export type ProgrammeCompetitiveness = {
  id: string
  programme_id: string
  year: number
  est_applicants: number | null
  applicants_per_seat: number | null
  source: string | null
}

export type User = {
  id: string
  phone: string | null
  email: string | null
  created_at: string
}

export type Check = {
  id: string
  user_id: string | null
  track: Track
  grades: GradesJson
  career_interest: string | null
  aggregate: number
  paid: boolean
  paid_at: string | null
  paystack_ref: string | null
  created_at: string
}

export type GradesJson = {
  core: Record<string, string>
  electives: Record<string, string>
}

export type Outcome = {
  id: string
  user_id: string | null
  programme_id: string
  aggregate: number
  applied: boolean | null
  admitted: boolean | null
  reported_at: string
  verified: boolean
}

export type ChatMessage = {
  id: string
  check_id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}
