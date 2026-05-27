// components/layout/Footer.tsx
import Link from "next/link"

function GradCapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--card-bg)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

        {/* 4-column grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {/* Col 1: Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
                <GradCapIcon />
              </div>
              <span className="text-lg font-bold">
                <span className="text-brand-600">Admit</span>
                <span className="text-[var(--foreground)]">GH</span>
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed max-w-xs">
              Ghana&apos;s honest admission probability engine. We tell you your real
              chance — not just whether you qualify.
            </p>
            <a
              href="mailto:hello@admitgh.com"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-brand-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              hello@admitgh.com
            </a>
          </div>

          {/* Col 2: Explore */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
              Explore
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/check" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  Enter my grades
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/aggregate/science/12" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  Aggregate 12 Science
                </Link>
              </li>
              <li>
                <Link href="/aggregate/arts/10" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  Aggregate 10 Arts
                </Link>
              </li>
              <li>
                <Link href="/aggregate/business/11" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  Aggregate 11 Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Universities */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
              Universities
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/universities/knust" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  KNUST
                </Link>
              </li>
              <li>
                <Link href="/universities/university-of-ghana" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  University of Ghana
                </Link>
              </li>
              <li>
                <Link href="/universities/region/greater-accra" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  Greater Accra Region
                </Link>
              </li>
              <li>
                <Link href="/universities/region/ashanti" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  Ashanti Region
                </Link>
              </li>
              <li>
                <Link href="/universities/region/central" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  Central Region
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: About */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
              About
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="text-[var(--muted)] leading-relaxed">
                  Cut-off data from GTEC, university publications &amp; community reports.
                </span>
              </li>
              <li>
                <span className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--muted)]">
                  <span>🟢 Official</span>
                  <span>🟡 Reported</span>
                  <span>🔴 Estimated</span>
                </span>
              </li>
              <li className="text-xs text-[var(--muted)]">
                Not affiliated with any university, WAEC, or GTEC.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted)]">
          <p>© {currentYear} AdmitGH. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Probabilities are estimates, not guarantees. Verify cut-offs with your target institution.
          </p>
        </div>

      </div>
    </footer>
  )
}
