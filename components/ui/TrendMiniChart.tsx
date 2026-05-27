// components/ui/TrendMiniChart.tsx
// SVG sparkline showing cut-off aggregate trend over years (lower = harder)

type Props = {
  values: number[]
  width?: number
  height?: number
  className?: string
}

export default function TrendMiniChart({ values, width = 80, height = 28, className }: Props) {
  if (values.length < 2) {
    return (
      <span className="text-xs text-[var(--muted)]" title="Not enough data for trend">
        — no trend
      </span>
    )
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  // Map value to Y (SVG: 0 = top, so invert — lower aggregate = higher on chart = better)
  const toY = (v: number) => height - ((v - min) / range) * (height - 4) - 2

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - 4) + 2
    const y = toY(v)
    return `${x},${y}`
  })

  const pathD = `M ${points.join(" L ")}`
  const latest = values[values.length - 1]
  const oldest = values[0]
  const isHardening = latest < oldest // cut-off dropped = harder

  const strokeColor = isHardening ? "#dc2626" : "#16a34a" // red if hardening, green if easing

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-label={`Cut-off trend: ${values.join(", ")}`}
      role="img"
    >
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      <circle
        cx={width - 2}
        cy={toY(values[values.length - 1])}
        r="2"
        fill={strokeColor}
      />
    </svg>
  )
}
