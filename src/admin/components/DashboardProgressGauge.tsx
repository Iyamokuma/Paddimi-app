interface DashboardProgressGaugeProps {
  percent: number
  label?: string
}

export function DashboardProgressGauge({ percent, label = 'Requests Completed' }: DashboardProgressGaugeProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  const r = 72
  const cx = 100
  const cy = 95
  const startX = cx - r
  const endX = cx + r
  const path = `M ${startX} ${cy} A ${r} ${r} 0 0 1 ${endX} ${cy}`
  const length = Math.PI * r
  const offset = length * (1 - clamped / 100)

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="h-36 w-full max-w-[220px]" aria-hidden>
        <path d={path} fill="none" stroke="#e8ece9" strokeWidth="14" strokeLinecap="round" />
        <path
          d={path}
          fill="none"
          stroke="#1b4d3e"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <p className="-mt-2 text-center text-2xl font-bold text-foreground">{clamped}%</p>
      <p className="text-center text-xs text-muted">{label}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-[10px] text-muted">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-700" /> Completed
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-300" /> In progress
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-200" /> Pending
        </span>
      </div>
    </div>
  )
}
