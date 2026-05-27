// components/features/results/HonestyPanel.tsx
// Plain-language explanation of why these are estimates

export default function HonestyPanel() {
  return (
    <aside className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 text-sm">
      <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
        <span aria-hidden="true">📋</span>
        About these estimates
      </h3>
      <div className="space-y-2 text-[var(--muted)]">
        <p>
          <strong className="text-[var(--foreground)]">Why ranges, not a single number?</strong>{" "}
          We don&apos;t have perfect data, and admission depends on how many people apply in a given
          year — which we can&apos;t predict exactly. A range is honest; a single number would be
          false precision.
        </p>
        <p>
          <strong className="text-[var(--foreground)]">Data sources:</strong> Cut-off history comes
          from GTEC publications, university admission notices, and education news reports.{" "}
          🟢 = official source · 🟡 = reported · 🔴 = estimated
        </p>
        <p>
          <strong className="text-[var(--foreground)]">What the model uses:</strong> Your margin
          above/below the cut-off, the applicants-per-seat ratio, and whether cut-offs have been
          rising (hardening) over recent years.
        </p>
        <p>
          <strong className="text-[var(--foreground)]">This is not a guarantee.</strong> Meeting
          a cut-off is necessary but not sufficient — universities rank applicants against each other.
          AdmitGH helps you understand that competition; it does not decide your admission.
        </p>
        <p className="text-xs mt-3 pt-3 border-t border-[var(--border)]">
          Did you get your results? Tell us — every reported outcome makes next year&apos;s estimates
          sharper for future students.
        </p>
      </div>
    </aside>
  )
}
