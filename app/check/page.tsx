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
      <main className="flex-1 min-h-screen">

        {/* ── Hero ── SHS photo + dark overlay + catch text ─────────────── */}
        <div className="check-hero-img relative">
          <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:py-20 text-center">

            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-300" aria-hidden="true" />
              WASSCE Admission Intelligence
            </span>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Know Where You Stand
            </h1>
            <p className="mt-3 text-lg sm:text-xl font-semibold text-white/70">
              Before Results Day
            </p>

            {/* Sub-copy */}
            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-white/60 leading-relaxed">
              Enter your WASSCE grades and discover your real admission probability
              at every Ghanaian university — powered by years of official cut-off data.
            </p>

            {/* Step pills */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-7 text-xs">
              <span className="rounded-full bg-brand-500 px-3 py-1.5 text-white font-semibold shadow">
                1 · Enter grades
              </span>
              <span className="text-white/40" aria-hidden="true">→</span>
              <span className="rounded-full px-3 py-1.5 text-white/60 bg-white/10 border border-white/15 backdrop-blur-sm">
                2 · See teaser (free)
              </span>
              <span className="text-white/40" aria-hidden="true">→</span>
              <span className="rounded-full px-3 py-1.5 text-white/60 bg-white/10 border border-white/15 backdrop-blur-sm">
                3 · Unlock · GHS 15
              </span>
            </div>
          </div>
        </div>

        {/* ── Form area ────────────────────────────────────────────────── */}
        <div className="check-page-bg">
          <div className="mx-auto max-w-3xl px-4 py-10 pb-20 sm:px-6">
            <GradeInputForm />
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
