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
      <main className="check-page flex-1 min-h-screen">

        {/* Ambient teal glow — fixed, behind everything */}
        <div className="hero-glow pointer-events-none fixed inset-x-0 top-0 h-80 opacity-10" aria-hidden="true" />

        {/* Page header */}
        <div className="relative px-4 pt-12 pb-6 text-center">
          <div className="flex flex-wrap justify-center items-center gap-2 mb-5 text-xs">
            <span className="rounded-full bg-brand-500/25 border border-brand-400/40 px-3 py-1 text-brand-200 font-medium">
              1 · Enter grades
            </span>
            <span className="text-brand-600" aria-hidden="true">→</span>
            <span className="rounded-full px-3 py-1 text-[var(--muted)] glass-dark">
              2 · See teaser (free)
            </span>
            <span className="text-brand-600" aria-hidden="true">→</span>
            <span className="rounded-full px-3 py-1 text-[var(--muted)] glass-dark">
              3 · Unlock · GHS 15
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gradient-brand">
            Check Your Admission Chances
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Your track + WASSCE grades = honest probability at every Ghanaian university
          </p>
        </div>

        {/* Glass card + form */}
        <div className="relative mx-auto max-w-2xl px-4 pb-20 sm:px-6">
          <div className="glass-card-check">
            <GradeInputForm />
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
