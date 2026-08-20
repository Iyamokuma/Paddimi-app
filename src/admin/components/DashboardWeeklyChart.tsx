import { useMemo } from 'react'

interface DashboardWeeklyChartProps {
  /** ISO timestamps of paid request submissions */
  timestamps: string[]
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

export function DashboardWeeklyChart({ timestamps }: DashboardWeeklyChartProps) {
  const { counts, max, peakDay } = useMemo(() => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - 6)
    start.setHours(0, 0, 0, 0)

    const dayCounts = Array.from({ length: 7 }, () => 0)
    for (const ts of timestamps) {
      const d = new Date(ts)
      if (d < start) continue
      const diff = Math.floor((d.getTime() - start.getTime()) / 86_400_000)
      if (diff >= 0 && diff < 7) dayCounts[diff] += 1
    }

    const maxCount = Math.max(...dayCounts, 1)
    const peak = dayCounts.indexOf(Math.max(...dayCounts))
    return { counts: dayCounts, max: maxCount, peakDay: peak }
  }, [timestamps])

  return (
    <div className="flex h-44 items-end justify-between gap-2 pt-4">
      {counts.map((count, i) => {
        const height = count === 0 ? 12 : Math.max(24, (count / max) * 100)
        const isPeak = i === peakDay && count > 0
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex h-28 w-full items-end justify-center">
              {isPeak && (
                <span className="absolute -top-1 rounded-md bg-green-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {Math.round((count / max) * 100)}%
                </span>
              )}
              {count === 0 ? (
                <div
                  className="w-full max-w-[2rem] rounded-full opacity-40"
                  style={{
                    height: 12,
                    backgroundImage: 'repeating-linear-gradient(135deg, #d1d5db 0 2px, transparent 2px 6px)',
                    backgroundColor: '#f3f4f6',
                  }}
                />
              ) : (
                <div
                  className={`w-full max-w-[2rem] rounded-full transition-all ${
                    isPeak ? 'bg-green-400' : 'bg-green-700'
                  }`}
                  style={{ height: `${height}%` }}
                />
              )}
            </div>
            <span className="text-xs font-medium text-muted">{DAYS[i]}</span>
          </div>
        )
      })}
    </div>
  )
}
