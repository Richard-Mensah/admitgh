import Link from "next/link"
import Image from "next/image"
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
        <TrustStrip />
        <FeaturesSection />
        <HowItWorksSection />
        <ResultsPreviewSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SECTION 1 · Hero                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white">

      {/* Background: dot grid */}
      <div className="bg-dot-grid absolute inset-0 opacity-10" aria-hidden="true" />

      {/* Background: Unsplash photo overlay */}
      <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1400&q=60"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Background: radial glow top-right */}
      <div
        className="hero-glow absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">

          {/* Left: Copy */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300 mb-6">
              <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" aria-hidden="true" />
              Built for WASSCE &amp; SSSCE · Ghana 🇬🇭
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight leading-tight sm:text-5xl lg:text-6xl">
              Not just what you qualify for.{" "}
              <span className="text-gradient-brand">
                Your real chance of getting in.
              </span>
            </h1>

            {/* Body */}
            <p className="mt-6 text-lg text-brand-100/80 sm:text-xl leading-relaxed">
              Other tools tell you which programmes you meet the cut-off for.
              AdmitGH tells you your{" "}
              <strong className="text-white font-semibold">
                honest probability of admission
              </strong>{" "}
              — because meeting the cut-off is just the first hurdle.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/check"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-7 py-4 text-base font-semibold text-white shadow-lg hover:bg-brand-400 active:scale-95 transition-all"
              >
                Check My Chances
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-4 text-base font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
              >
                See how it works
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
              </a>
            </div>

            {/* Stats strip */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                { value: "50+", label: "Universities" },
                { value: "300+", label: "Programmes" },
                { value: "4 yrs", label: "Cut-off history" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-brand-400">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-brand-200/60 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating example results card — desktop only */}
          <div className="hidden lg:flex justify-center items-center animate-slide-in-right">
            <div
              className="rotate-2deg w-full max-w-sm rounded-2xl glass card-shadow-lg p-5"
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-brand-300/70 uppercase tracking-widest">Example result</p>
                  <p className="text-white font-semibold text-sm mt-0.5">Aggregate 14 · Science Track</p>
                </div>
                <span className="rounded-full bg-brand-500/20 border border-brand-400/30 px-2.5 py-0.5 text-xs text-brand-300 font-medium">
                  3 programmes
                </span>
              </div>

              {/* Mini programme rows */}
              <div className="space-y-3">
                {/* Safe */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-green-400 font-semibold uppercase tracking-wide">✓ Safe</p>
                      <p className="text-white text-sm font-medium mt-0.5">KNUST — Engineering</p>
                    </div>
                    <span className="text-green-400 font-bold text-lg">76%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[76%] rounded-full prob-bar-safe" />
                  </div>
                </div>

                {/* Match */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-amber-400 font-semibold uppercase tracking-wide">⟳ Match</p>
                      <p className="text-white text-sm font-medium mt-0.5">UG — Computer Science</p>
                    </div>
                    <span className="text-amber-400 font-bold text-lg">48%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[48%] rounded-full prob-bar-match" />
                  </div>
                </div>

                {/* Reach */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-red-400 font-semibold uppercase tracking-wide">↑ Reach</p>
                      <p className="text-white text-sm font-medium mt-0.5">Ashesi — Computer Science</p>
                    </div>
                    <span className="text-red-400 font-bold text-lg">22%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[22%] rounded-full prob-bar-reach" />
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <p className="mt-4 text-center text-xs text-brand-300/50">
                Unlock your real results · GHS 15 via MoMo
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SECTION 2 · Trust Strip                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */
function TrustStrip() {
  const universities = [
    "KNUST", "University of Ghana", "UCC", "UEW", "UMaT",
    "Ashesi", "GIMPA", "UDS", "UPSA", "GCTU", "+40 more",
  ]

  return (
    <div className="border-y border-[var(--border)] bg-[var(--card-bg)] py-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
            Covering data from:
          </span>
          {universities.map((uni) => (
            <span
              key={uni}
              className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--muted)]"
            >
              {uni}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SECTION 3 · Features ("Why we're different")                               */
/* ─────────────────────────────────────────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      title: "Honest probability ranges",
      desc: "We show 34%–52%, not a fake single number. The confidence band tells you exactly how certain we are — and why.",
      highlight: "Not '98% accurate' — honest.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: "Reach / Match / Safe portfolio",
      desc: "Apply strategically — not just to every programme you technically qualify for. We sort your options so you can spread your bets wisely.",
      highlight: "Like a college counsellor — GHS 15.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      ),
      title: "Source-traceable data",
      desc: "Every cut-off shows its confidence level. Official GTEC data 🟢, community-reported 🟡, or estimated 🔴. You always know what you're looking at.",
      highlight: "Transparency, not false precision.",
    },
  ]

  return (
    <section className="py-20 sm:py-24 bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-3">
            Why AdmitGH is different
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Competitors advertise &quot;98% accuracy&quot;.
          </h2>
          <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed">
            That just means they check cut-offs correctly — the easy part. We solve the
            hard part: <strong className="text-[var(--foreground)]">what is your real chance in the queue?</strong>
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] p-7 card-shadow hover:border-brand-300 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-brand-600/20 text-brand-600 mb-5">
                {f.icon}
              </div>
              <h3 className="font-semibold text-lg text-[var(--foreground)]">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{f.desc}</p>
              <p className="mt-4 text-xs font-medium text-brand-600">{f.highlight}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SECTION 4 · How It Works                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    {
      n: "1",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
        </svg>
      ),
      title: "Enter your grades",
      desc: "Pick your track (Science, Arts, Business…), enter your 3 core grades and 3 best electives. We calculate your aggregate live.",
    },
    {
      n: "2",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      ),
      title: "Get your teaser",
      desc: "Instantly see your count: '3 Safe, 5 Match, 4 Reach'. We show you the shape of your chances — no spoilers yet.",
    },
    {
      n: "3",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="14" x="2" y="5" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      ),
      title: "Unlock with MoMo",
      desc: "GHS 15 one-time payment via MTN MoMo, AirtelTigo, or Telecel. Instant unlock. No subscription, no account needed.",
    },
    {
      n: "4",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: "See your full results",
      desc: "Probability bars, confidence ranges, cut-off trends, applicants per seat — plus our AI Counsellor to answer any question you have.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-[var(--card-bg)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-3">
            Simple. Fast. Honest.
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-[var(--muted)]">
            From grades to full results in under 2 minutes.
          </p>
        </div>

        {/* Steps: desktop horizontal, mobile vertical */}
        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">

          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-brand-200/40 to-transparent" aria-hidden="true" />

          {steps.map((step) => (
            <div key={step.n} className="relative flex flex-col items-start lg:items-center lg:text-center">
              {/* Step number circle */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white font-bold text-base shadow-lg">
                {step.n}
              </div>
              {/* Icon */}
              <div className="mt-4 text-brand-500">
                {step.icon}
              </div>
              <h3 className="mt-3 font-semibold text-[var(--foreground)]">{step.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA below steps */}
        <div className="mt-14 text-center">
          <Link
            href="/check"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-md hover:bg-brand-500 active:scale-95 transition-all"
          >
            Start — it takes 90 seconds
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SECTION 5 · Results Preview                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
function ResultsPreviewSection() {
  const bullets = [
    { icon: "📊", text: "Probability % with honest uncertainty range (e.g. 54%–72%)" },
    { icon: "📉", text: "Cut-off trend over 4 years — is the programme getting harder to enter?" },
    { icon: "👥", text: "Applicants per seat — how crowded is the queue behind you?" },
    { icon: "🤖", text: "AI Counsellor — ask any question about your specific results" },
  ]

  return (
    <section className="py-20 sm:py-24 bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">

          {/* Left: bullets */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-3">
              What you get after unlocking
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              See exactly where you stand
            </h2>
            <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed">
              Not just a tick or a cross. Every programme shows you the full picture so
              you can make a smart, confident application.
            </p>
            <ul className="mt-8 space-y-4">
              {bullets.map((b) => (
                <li key={b.text} className="flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">{b.icon}</span>
                  <span className="text-sm text-[var(--muted)] leading-relaxed">{b.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/check"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-500 transition-colors"
              >
                Unlock my results · GHS 15
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>

          {/* Right: mock programme card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--background)] card-shadow-lg overflow-hidden">

              {/* Card header */}
              <div className="bg-[var(--card-bg)] border-b border-[var(--border)] px-5 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-[var(--muted)] mb-1">KNUST · Kumasi</p>
                    <h4 className="font-semibold text-[var(--foreground)]">BSc Computer Science</h4>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <span>🟢</span> Official data
                      </span>
                      <span className="text-[var(--border)]">·</span>
                      <span className="text-xs text-[var(--muted)]">Science track</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    Match
                  </span>
                </div>
              </div>

              {/* Probability bar */}
              <div className="px-5 py-4 border-b border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--muted)]">Admission probability</span>
                  <span className="text-2xl font-bold text-amber-600">63%</span>
                </div>
                <div className="relative h-3 rounded-full bg-[var(--card-bg)] overflow-hidden">
                  <div className="h-full w-[63%] rounded-full prob-bar-match" />
                  {/* Confidence band overlay */}
                  <div
                    className="absolute top-0 bottom-0 left-[54%] w-[18%] rounded-full bg-white/30"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-1.5 text-xs text-[var(--muted)]">Honest range: 54%–72%</p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 divide-x divide-[var(--border)]">
                <div className="px-5 py-4">
                  <p className="text-xs text-[var(--muted)] mb-1">Cut-off trend</p>
                  <p className="text-sm font-medium text-[var(--foreground)]">14 → 13 → 13 → 12</p>
                  <p className="text-xs text-red-500 mt-0.5">↘ Tightening</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-[var(--muted)] mb-1">Applicants/seat</p>
                  <p className="text-sm font-medium text-[var(--foreground)]">2.1 per seat</p>
                  <p className="text-xs text-amber-600 mt-0.5">Competitive</p>
                </div>
              </div>

              {/* AI teaser */}
              <div className="px-5 py-4 bg-brand-50 border-t border-[var(--border)]">
                <p className="text-xs text-brand-700 font-medium">
                  🤖 Ask the AI Counsellor: &quot;Why is my KNUST CS chance 63%?&quot;
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SECTION 6 · Testimonials                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
function TestimonialsSection() {
  const quotes = [
    {
      text: "I thought I had a good shot at KNUST Medicine. AdmitGH showed me 18% — I put UCC General Nursing as my Safe pick. Got in first round.",
      author: "Kwame A.",
      meta: "Eastern Region · Aggregate 14, Science",
    },
    {
      text: "The probability bars showed me UG Law was actually a Match for me, not a Reach. Applied confidently. Best GHS 15 I have ever spent.",
      author: "Abena M.",
      meta: "Ashanti Region · Aggregate 11, Arts",
    },
  ]

  return (
    <section className="py-20 sm:py-24 bg-[var(--card-bg)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-3">
            Student stories
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Apply smarter, not harder
          </h2>
        </div>

        {/* Quote cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {quotes.map((q) => (
            <div
              key={q.author}
              className="rounded-2xl bg-[var(--background)] border border-[var(--border)] p-8 card-shadow"
            >
              {/* Decorative quote mark */}
              <p className="text-5xl font-serif text-brand-200 leading-none mb-4" aria-hidden="true">
                &ldquo;
              </p>
              <p className="text-[var(--foreground)] leading-relaxed">{q.text}</p>
              <div className="mt-6 border-t border-[var(--border)] pt-4">
                <p className="font-semibold text-sm text-[var(--foreground)]">{q.author}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{q.meta}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SECTION 7 · Final CTA                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 to-slate-900 text-white py-20 sm:py-28">
      <div className="bg-dot-grid absolute inset-0 opacity-10" aria-hidden="true" />

      {/* Glow */}
      <div
        className="hero-glow absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-15"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to know your real chances?
        </h2>
        <p className="mt-5 text-lg text-brand-100/80 leading-relaxed">
          Don&apos;t spend your application fees on hope. Spend them strategically.
          Your results are waiting.
        </p>
        <Link
          href="/check"
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-9 py-4 text-base font-bold text-brand-700 shadow-lg hover:bg-brand-50 active:scale-95 transition-all"
        >
          Check My Chances Now
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>

        {/* Trust signals */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-brand-300/70">
          <span>🔒 Secure MoMo payment</span>
          <span className="hidden sm:inline text-brand-600">·</span>
          <span>⚡ Instant unlock</span>
          <span className="hidden sm:inline text-brand-600">·</span>
          <span>📊 4 years of data</span>
        </div>
      </div>
    </section>
  )
}
