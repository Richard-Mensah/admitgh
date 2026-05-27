// components/ui/TrendMiniChart.tsx
// SVG sparkline for cut-off aggregate trend — lower value = harder to get in
// Green = cut-off rising (getting easier), Red = cut-off falling (getting harder)

type Props = {
  values: number[]    // cut-off aggregates, oldest → newest
  width?: number
  height?: number
  className?: string
}

export default function TrendMiniChart({ values, width = 88, height = 32, className }: Props) {
  if (values.length < 2) {
    return (
      <span className="text-xs text-[var(--muted)]" title="Not enough history for trend">
        no trend
      </span>
    )
  }

  const PAD = 3
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  // Invert Y: higher aggregate = easier = higher on the chart
  const toX = (i: number) => PAD + (i / (values.length - 1)) * (width  - PAD * 2)
  const toY = (v: number) => height - PAD - ((v - min) / range) * (height - PAD * 2)

  const pts = values.map((v, i) => ({ x: toX(i), y: toY(v) }))
  const linePath = `M ${pts.map((p) => `${p.x},${p.y}`).join(" L ")}`

  // Closed area path: line + down to bottom + back to start
  const areaPath = [
    `M ${pts[0].x},${pts[0].y}`,
    ...pts.slice(1).map((p) => `L ${p.x},${p.y}`),
    `L ${pts[pts.length - 1].x},${height - PAD}`,
    `L ${pts[0].x},${height - PAD}`,
    "Z",
  ].join(" ")

  const latest = values[values.length - 1]
  const oldest = values[0]
  // Lower cut-off now than before = harder (red), higher = easier (green)
  const isHardening = latest < oldest

  const stroke = isHardening ? "#dc2626" : "#16a34a"
  const fill   = isHardening ? "#dc262620" : "#16a34a20"
  const dotFill = isHardening ? "#ef4444" : "#22c55e"

  const tip = isHardening
    ? `Cut-off falling: ${oldest} → ${latest} (harder)`
    : `Cut-off rising: ${oldest} → ${latest} (easier)`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-label={tip}
      role="img"
    >
      <title>{tip}</title>

      {/* Filled area under the line */}
      <path d={areaPath} fill={fill} />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data-point dots */}
      {pts.map((pt, i) => (
        <circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={i === pts.length - 1 ? 2.5 : 1.5}   // end dot slightly larger
          fill={i === pts.length - 1 ? dotFill : stroke}
          opacity={i === pts.length - 1 ? 1 : 0.5}
        />
      ))}
    </svg>
  )
}
