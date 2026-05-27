// components/layout/Footer.tsx
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--card-bg)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold text-brand-600 dark:text-brand-400">AdmitGH</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Ghana&apos;s honest admission probability engine. We tell you your real
              chance — not just whether you qualify.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Check Chances
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/check" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  Enter Grades
                </Link>
              </li>
              <li>
                <Link href="/universities/region/greater-accra" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  Greater Accra Universities
                </Link>
              </li>
              <li>
                <Link href="/universities/region/ashanti" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  Ashanti Universities
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              About
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <span className="text-[var(--muted)]">
                  Probabilities are estimates, not guarantees. We show honest ranges.
                </span>
              </li>
              <li>
                <a
                  href="mailto:hello@admitgh.com"
                  className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  hello@admitgh.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
          © {currentYear} AdmitGH. Cut-off data sourced from GTEC, university publications, and
          reported community data. Confidence levels shown on each card. Not affiliated with any
          university or WAEC.
        </div>
      </div>
    </footer>
  )
}
