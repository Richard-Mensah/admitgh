// app/check/page.tsx
import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import GradeInputForm from "@/components/features/gradeInput/GradeInputForm"

export const metadata: Metadata = {
  title: "Check Your Admission Chances — Enter WASSCE Grades",
  description:
    "Enter your WASSCE track and grades to get your honest admission probability for every Ghanaian university — sorted Reach, Match & Safe.",
}

export default function CheckPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* ── Mini hero header ───────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white px-4 py-10 text-center">
          {/* Dot grid */}
          <div className="bg-dot-grid absolute inset-0 opacity-10" aria-hidden="true" />
          {/* Radial glow */}
          <div className="hero-glow absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20" aria-hidden="true" />

          <div className="relative mx-auto max-w-2xl">
            {/* 3-step journey pills */}
            <div className="flex flex-wrap justify-center items-center gap-2 mb-5 text-xs">
              <span className="rounded-full bg-brand-500/25 border border-brand-400/40 px-3 py-1 text-brand-200 font-medium">
                1 · Enter grades
              </span>
              <span className="text-brand-600" aria-hidden="true">→</span>
              <span className="rounded-full bg-white/8 border border-white/15 px-3 py-1 text-brand-300/70">
                2 · See teaser (free)
              </span>
              <span className="text-brand-600" aria-hidden="true">→</span>
              <span className="rounded-full bg-white/8 border border-white/15 px-3 py-1 text-brand-300/70">
                3 · Unlock · GHS 15
              </span>
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl tracking-tight">
              Check Your Admission Chances
            </h1>
            <p className="mt-2 text-brand-200/70 text-sm">
              Your track + 6 grades = honest probability at every Ghanaian university
            </p>
          </div>
        </div>

        {/* ── Form area ─────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-b from-brand-50/40 to-[var(--card-bg)] dark:from-brand-950/10 dark:to-[var(--card-bg)]">
          <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-md overflow-hidden">
              <GradeInputForm />
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
