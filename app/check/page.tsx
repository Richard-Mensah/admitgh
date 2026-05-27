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
      <main className="flex-1 bg-[var(--card-bg)]">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">Enter your grades</h1>
            <p className="mt-2 text-[var(--muted)]">
              Fill in your track and 6 grades. We calculate your aggregate and run the probability
              model against every programme in our database.
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm sm:p-8">
            <GradeInputForm />
          </div>

          {/* Honesty note */}
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/20 dark:text-amber-300">
            <span className="font-medium">How we calculate:</span> Your aggregate = best 6 grades
            combined. Probability = a formula trained on cut-off history, competition, and trend.
            We always show a range — never a fake single number.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
