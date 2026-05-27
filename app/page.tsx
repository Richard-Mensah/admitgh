import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AdmitGH — Know Your Real Admission Chance | Ghana WASSCE",
  description:
    "Enter your WASSCE aggregate and get your honest probability of admission at every Ghanaian university — sorted Reach, Match & Safe. Not just eligibility — your real chance.",
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HonestySection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white">
      <div className="bg-dot-grid absolute inset-0 opacity-10" />
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300 mb-8">
          <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
          Built for Ghana WASSCE &amp; SSSCE students
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Not just what you qualify for.{" "}
          <span className="text-brand-400">Your real chance of getting in.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-100/80 sm:text-xl">
          Other tools tell you which programmes you meet the cut-off for. AdmitGH tells you your{" "}
          <strong className="text-white">honest probability of admission</strong> — because meeting
          the cut-off is just the first hurdle.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/check"
            className="w-full rounded-xl bg-brand-500 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-brand-400 transition-colors sm:w-auto"
          >
            Check My Chances →
          </Link>
          <p className="text-sm text-brand-300">
            GHS 15 to unlock full results · Pay via MoMo
          </p>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-12">
          {[
            { value: "50+", label: "Universities covered" },
            { value: "300+", label: "Programmes tracked" },
            { value: "4 years", label: "Cut-off history" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-brand-400">{stat.value}</p>
              <p className="mt-1 text-sm text-brand-200/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HonestySection() {
  const cards = [
    {
      emoji: "📊",
      title: "Honest probability ranges",
      desc: "We show 34%–52%, not a fake single number. The width tells you how certain we are.",
    },
    {
      emoji: "🏆",
      title: "Reach / Match / Safe portfolio",
      desc: "Apply strategically — not just to every programme you technically qualify for.",
    },
    {
      emoji: "🔍",
      title: "Source-traceable data",
      desc: "Every cut-off shows its source. Official = 🟢, Reported = 🟡, Estimated = 🔴.",
    },
  ]

  return (
    <section className="bg-[var(--card-bg)] py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Why we&apos;re different</h2>
          <p className="mt-3 text-[var(--muted)]">
            Competitors advertise &quot;98% accuracy&quot; — but that just means they check
            cut-offs correctly. That&apos;s the easy part.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6"
            >
              <p className="text-3xl">{card.emoji}</p>
              <h3 className="mt-3 font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      n: "1",
      title: "Enter your grades",
      desc: "Pick your track, enter your 3 core grades and 3 best electives. We calculate your aggregate live.",
    },
    {
      n: "2",
      title: "Get your teaser",
      desc: "We show you the count: '3 Safe, 5 Match, 4 Reach'. No spoilers yet.",
    },
    {
      n: "3",
      title: "Unlock with MoMo",
      desc: "GHS 15 one-time payment via MTN MoMo, AirtelTigo, or Telecel. Instant unlock.",
    },
    {
      n: "4",
      title: "See your full results",
      desc: "Probability bar, confidence range, cut-off trend, applicants per seat. Ask the AI Counsellor anything.",
    },
  ]

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">How it works</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.n} className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white font-bold text-lg">
                {step.n}
              </div>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="bg-brand-600 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Ready to know your real chances?
        </h2>
        <p className="mt-4 text-brand-100">
          Don&apos;t spend your application fees hoping. Spend them strategically.
        </p>
        <Link
          href="/check"
          className="mt-8 inline-block rounded-xl bg-white px-8 py-4 text-lg font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
        >
          Check My Chances Now →
        </Link>
      </div>
    </section>
  )
}
