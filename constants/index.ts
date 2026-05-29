// constants/index.ts
// App-wide constants — import from here, never hardcode elsewhere

// ─── WASSCE Grade Scale ───────────────────────────────────────────────────────

export const GRADES = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"] as const
export type Grade = (typeof GRADES)[number]

/** Numeric value of each grade (lower = better, mirrors the aggregate system) */
export const GRADE_VALUE: Record<Grade, number> = {
  A1: 1,
  B2: 2,
  B3: 3,
  C4: 4,
  C5: 5,
  C6: 6,
  D7: 7,
  E8: 8,
  F9: 9,
}

/** Minimum passing grade for most WASSCE requirements */
export const MIN_PASS_GRADE: Grade = "C6"
export const MIN_PASS_VALUE = GRADE_VALUE[MIN_PASS_GRADE] // 6

// ─── Tracks ──────────────────────────────────────────────────────────────────

export const TRACKS = [
  "science",
  "general_arts",
  "business",
  "home_economics",
  "technical",
  "visual_arts",
] as const
export type Track = (typeof TRACKS)[number]

export const TRACK_LABEL: Record<Track, string> = {
  science:        "Science",
  general_arts:   "General Arts",
  business:       "Business",
  home_economics: "Home Economics",
  technical:      "Technical",
  visual_arts:    "Visual Arts",
}

// Core subjects per track — all 4 are compulsory for every track in WASSCE Ghana
export const CORE_SUBJECTS: Record<Track, [string, string, string, string]> = {
  science:        ["English Language", "Core Mathematics", "Social Studies", "Integrated Science"],
  general_arts:   ["English Language", "Core Mathematics", "Social Studies", "Integrated Science"],
  business:       ["English Language", "Core Mathematics", "Social Studies", "Integrated Science"],
  home_economics: ["English Language", "Core Mathematics", "Social Studies", "Integrated Science"],
  technical:      ["English Language", "Core Mathematics", "Social Studies", "Integrated Science"],
  visual_arts:    ["English Language", "Core Mathematics", "Social Studies", "Integrated Science"],
}

// Named elective subjects per track — used to render grade cards in ElectiveGrid
export const ELECTIVE_SUBJECTS: Record<Track, readonly string[]> = {
  science: [
    "Physics",
    "Chemistry",
    "Biology",
    "Elective Mathematics",
    "Elective ICT",
    "Geography",
  ],
  general_arts: [
    "Literature in English",
    "History",
    "Geography",
    "Government",
    "Economics",
    "French",
    "Christian Religious Studies",
    "Islamic Religious Studies",
    "Elective Mathematics",
    "General Knowledge in Art",
    "Elective ICT",
    "Twi (Asante)",
    "Twi (Akuapem)",
    "Fante",
    "Ga",
    "Ewe",
    "Dagbani",
    "Nzema",
    "Dangme",
    "Dagaare",
    "Gonja",
    "Kasem",
  ],
  business: [
    "Financial Accounting",
    "Cost Accounting",
    "Business Management",
    "Economics",
    "Elective Mathematics",
  ],
  home_economics: [
    "Food and Nutrition",
    "Management in Living",
    "Clothing and Textiles",
  ],
  technical: [
    "Technical Drawing",
    "Building Construction",
    "Auto Mechanics",
    "Applied Electricity",
    "Woodwork",
    "Elective Mathematics",
    "Physics",
  ],
  visual_arts: [
    "General Knowledge in Art",
    "Picture Making & Graphic Design",
    "Textiles",
    "Sculpture",
    "Leatherwork",
  ],
}

// ─── Institution Types ────────────────────────────────────────────────────────

export const INSTITUTION_TYPES = [
  "public_university",
  "technical_university",
  "nursing",
  "college_of_ed",
  "private",
] as const
export type InstitutionType = (typeof INSTITUTION_TYPES)[number]

export const INSTITUTION_TYPE_LABEL: Record<InstitutionType, string> = {
  public_university: "Public University",
  technical_university: "Technical University",
  nursing: "Nursing / Allied Health",
  college_of_ed: "College of Education",
  private: "Private University",
}

// ─── Ghana Regions (all 16) ──────────────────────────────────────────────────

export const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Central",
  "Eastern",
  "Western",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
  "Savannah",
  "North East",
  "Oti",
  "Western North",
] as const
export type GhanaRegion = (typeof GHANA_REGIONS)[number]

// ─── Programme Categories ─────────────────────────────────────────────────────

export const PROGRAMME_CATEGORIES = [
  "computing",
  "health",
  "engineering",
  "law",
  "business",
  "education",
  "science",
  "agriculture",
  "arts_humanities",
  "social_sciences",
  "built_environment",
  "other",
] as const
export type ProgrammeCategory = (typeof PROGRAMME_CATEGORIES)[number]

export const CATEGORY_LABEL: Record<ProgrammeCategory, string> = {
  computing: "Computing & IT",
  health: "Medicine & Health",
  engineering: "Engineering",
  law: "Law",
  business: "Business & Management",
  education: "Education",
  science: "Natural Sciences",
  agriculture: "Agriculture",
  arts_humanities: "Arts & Humanities",
  social_sciences: "Social Sciences",
  built_environment: "Architecture & Built Environment",
  other: "Other",
}

// Career interest → categories mapping (for AI Smart Match)
export const CAREER_INTEREST_CATEGORIES: Record<string, ProgrammeCategory[]> = {
  "Medicine & Health": ["health"],
  "Engineering & Tech": ["engineering", "computing"],
  "Law & Social Sciences": ["law", "social_sciences"],
  Business: ["business"],
  Education: ["education"],
}

// ─── Tier Metadata ────────────────────────────────────────────────────────────

export type Tier = "safe" | "match" | "reach"

export const TIER_META: Record<
  Tier,
  { label: string; description: string; colorClass: string; bgClass: string; borderClass: string }
> = {
  safe: {
    label: "Safe",
    description: "Strong chance — your aggregate is well above the cut-off",
    colorClass: "text-emerald-700 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
    borderClass: "border-emerald-200 dark:border-emerald-800",
  },
  match: {
    label: "Match",
    description: "Solid chance — competitive but realistic",
    colorClass: "text-amber-700 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/40",
    borderClass: "border-amber-200 dark:border-amber-800",
  },
  reach: {
    label: "Reach",
    description: "Low chance — below the cut-off or highly competitive",
    colorClass: "text-red-700 dark:text-red-400",
    bgClass: "bg-red-50 dark:bg-red-950/40",
    borderClass: "border-red-200 dark:border-red-800",
  },
}

// ─── Confidence Levels ────────────────────────────────────────────────────────

export type ConfidenceLevel = "official" | "reported" | "inferred"

export const CONFIDENCE_META: Record<
  ConfidenceLevel,
  { label: string; emoji: string; description: string }
> = {
  official: {
    label: "Official",
    emoji: "🟢",
    description: "Sourced from university or GTEC official publication",
  },
  reported: {
    label: "Reported",
    emoji: "🟡",
    description: "Sourced from credible news report or verified forum post",
  },
  inferred: {
    label: "Estimated",
    emoji: "🔴",
    description: "Estimated — we don't have confirmed data for this programme yet",
  },
}

// ─── Aggregate Range ─────────────────────────────────────────────────────────

/** Min and max possible WASSCE aggregate (6 best = best, 36 worst = worst passing) */
export const AGGREGATE_MIN = 6
export const AGGREGATE_MAX = 36

// ─── Payment ─────────────────────────────────────────────────────────────────

export const PRICE_GHS = 15
export const MAX_CHAT_MESSAGES_PER_CHECK = 20
