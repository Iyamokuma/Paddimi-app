import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Newspaper, CheckCircle2, TrendingUp, ArrowUpRight,
  Loader2, RefreshCw, AlertTriangle, Inbox, Wallet, Plus, Download,
  Video, Pause, Square,
} from 'lucide-react'
import {
  fetchAdminStats, fetchAllRequests, filterAwaitingProcessing, filterOverdueRequests,
  getCustomerName,
} from '../../lib/api/requests'
import type { AdminStats } from '../../lib/api/requests'
import type { ServiceRequestRow } from '../../lib/database.types'
import { formatNaira } from '../../data/services'
import { AdminStatusBadge } from '../components/AdminStatusBadge'
import { DashboardWeeklyChart } from '../components/DashboardWeeklyChart'
import { DashboardProgressGauge } from '../components/DashboardProgressGauge'
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'

function HeroStatCard({
  label,
  value,
  note,
  dark = false,
}: {
  label: string
  value: string | number
  note?: string
  dark?: boolean
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 shadow-sm ${
        dark
          ? 'bg-gradient-to-br from-green-700 to-green-900 text-white'
          : 'border border-green-100/80 bg-white text-foreground'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wider ${dark ? 'text-green-100' : 'text-muted'}`}>
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {note && (
            <p className={`mt-2 text-xs ${dark ? 'text-green-100/90' : 'text-muted'}`}>{note}</p>
          )}
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            dark ? 'bg-white/15 text-white' : 'bg-green-50 text-green-700'
          }`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
      {dark && (
        <>
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-6 left-8 h-20 w-20 rounded-full bg-white/5" />
        </>
      )}
    </div>
  )
}

function statusPillClass(status: string): string {
  if (['approved', 'ready', 'published'].includes(status)) {
    return 'bg-green-100 text-green-800'
  }
  if (status === 'processing') return 'bg-amber-100 text-amber-800'
  return 'bg-red-100 text-red-700'
}

function statusPillLabel(status: string): string {
  if (['approved', 'ready', 'published'].includes(status)) return 'Completed'
  if (status === 'processing') return 'In Progress'
  return 'Pending'
}

function serviceEmoji(category: string): string {
  return category === 'newspaper' ? '📰' : '📄'
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [allRequests, setAllRequests] = useState<ServiceRequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [revenueFrom, setRevenueFrom] = useState('')
  const [revenueTo, setRevenueTo] = useState('')
  const [now, setNow] = useState(() => new Date())

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)

    try {
      const [s, r] = await Promise.all([
        fetchAdminStats({
          fromDate: revenueFrom || undefined,
          toDate: revenueTo || undefined,
        }),
        fetchAllRequests(),
      ])
      setStats(s)
      setAllRequests(r)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [revenueFrom, revenueTo])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const interval = setInterval(() => load(true), 30_000)
    return () => clearInterval(interval)
  }, [load])

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const sb = getSupabase()
    if (!sb) return

    const channel = sb
      .channel('admin-dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_requests' },
        () => load(true),
      )
      .subscribe()

    return () => { sb.removeChannel(channel) }
  }, [load])

  const awaiting = useMemo(
    () => filterAwaitingProcessing(allRequests).slice(0, 5),
    [allRequests],
  )
  const overdue = useMemo(
    () => filterOverdueRequests(allRequests).slice(0, 3),
    [allRequests],
  )
  const recent = useMemo(() => allRequests.slice(0, 6), [allRequests])
  const activeList = useMemo(
    () => allRequests.filter((r) => r.status !== 'approved' && !r.download_available).slice(0, 4),
    [allRequests],
  )

  const weeklyTimestamps = useMemo(
    () => allRequests.map((r) => r.submitted_at),
    [allRequests],
  )

  const completionRate = stats?.total
    ? Math.round(((stats.approved ?? 0) / stats.total) * 100)
    : 0

  const priorityRequest = awaiting[0] ?? overdue[0]

  const lagosTime = now.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Africa/Lagos',
  })

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-700" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Plan, prioritise, and fulfil affidavit &amp; newspaper publication requests with ease.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => load(true)} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link
            to="/admin/requests"
            className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800"
          >
            <Plus className="h-4 w-4" />
            View Requests
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-50"
          >
            <Download className="h-4 w-4" />
            Public Site
          </a>
        </div>
      </div>

      {/* Top stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <HeroStatCard
          dark
          label="Total Requests"
          value={stats?.total ?? 0}
          note={`${stats?.todayCount ?? 0} submitted today`}
        />
        <HeroStatCard label="Processing" value={stats?.processing ?? 0} />
        <HeroStatCard label="Approved" value={stats?.approved ?? 0} />
        <HeroStatCard label="Awaiting Action" value={stats?.submitted ?? 0} />
      </div>

      {/* Middle row */}
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-3xl border border-green-100/80 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Request Analytics</h3>
            <span className="text-xs text-muted">Last 7 days</span>
          </div>
          <DashboardWeeklyChart timestamps={weeklyTimestamps} />
        </div>

        <div className="rounded-3xl border border-green-100/80 bg-white p-6 shadow-sm lg:col-span-4">
          <h3 className="font-semibold text-foreground">Priority Queue</h3>
          {priorityRequest ? (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                {awaiting.includes(priorityRequest) ? 'Next to process' : 'Overdue'}
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">{priorityRequest.service_name}</p>
              <p className="text-sm text-muted">
                {getCustomerName(priorityRequest.form_data as Record<string, unknown>)}
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-green-700">
                {priorityRequest.redemption_code}
              </p>
              <p className="mt-2 text-xs text-muted">
                {new Date(priorityRequest.submitted_at).toLocaleString('en-NG', {
                  weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </p>
              <Link
                to={`/admin/requests/${priorityRequest.id}`}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                <Video className="h-4 w-4" />
                Open Request
              </Link>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
              <p className="mt-3 text-sm font-medium text-foreground">All caught up</p>
              <p className="text-xs text-muted">No urgent requests in the queue</p>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-green-100/80 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Active</h3>
            <Link to="/admin/requests?status=submitted" className="text-xs font-semibold text-green-700 hover:underline">
              + New
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {activeList.length === 0 ? (
              <li className="py-6 text-center text-xs text-muted">No active requests</li>
            ) : (
              activeList.map((row) => (
                <li key={row.id}>
                  <Link
                    to={`/admin/requests/${row.id}`}
                    className="flex items-start gap-3 rounded-2xl p-2 transition-colors hover:bg-green-50/60"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-base">
                      {serviceEmoji(row.category)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{row.service_name}</p>
                      <p className="text-[11px] text-muted">
                        Due{' '}
                        {new Date(row.submitted_at).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short',
                        })}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-3xl border border-green-100/80 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Recent Submissions</h3>
            <Link to="/admin/requests" className="text-xs font-semibold text-green-700 hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-4">
            {recent.length === 0 ? (
              <li className="py-8 text-center text-sm text-muted">
                No requests yet — they appear here when customers pay.
              </li>
            ) : (
              recent.map((row) => (
                <li key={row.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 text-sm font-bold text-green-800">
                    {getCustomerName(row.form_data as Record<string, unknown>).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/admin/requests/${row.id}`}
                      className="truncate text-sm font-semibold hover:text-green-700"
                    >
                      {getCustomerName(row.form_data as Record<string, unknown>)}
                    </Link>
                    <p className="truncate text-xs text-muted">{row.service_name}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusPillClass(row.status)}`}>
                    {statusPillLabel(row.status)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl border border-green-100/80 bg-white p-6 shadow-sm lg:col-span-3">
          <h3 className="mb-2 self-start font-semibold text-foreground">Completion Rate</h3>
          <DashboardProgressGauge percent={completionRate} label="Requests completed" />
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 to-green-900 p-6 text-white shadow-lg lg:col-span-4">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <svg className="h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <path d="M0,120 Q100,40 200,100 T400,80 L400,200 L0,200 Z" fill="rgba(255,255,255,0.15)" />
              <path d="M0,160 Q150,80 300,140 T400,120 L400,200 L0,200 Z" fill="rgba(255,255,255,0.08)" />
            </svg>
          </div>
          <p className="relative text-xs font-medium uppercase tracking-wider text-green-100">Revenue Tracker</p>
          <p className="relative mt-4 font-mono text-4xl font-bold tracking-wider">{lagosTime}</p>
          <p className="relative mt-1 text-xs text-green-100/80">West Africa Time</p>
          <div className="relative mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase text-green-100/80">Today</p>
              <p className="text-lg font-bold">{formatNaira(stats?.todayRevenue ?? 0)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-green-100/80">This week</p>
              <p className="text-lg font-bold">{formatNaira(stats?.weekRevenue ?? 0)}</p>
            </div>
          </div>
          <div className="relative mt-5 flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Pause className="h-4 w-4" />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Square className="h-4 w-4" />
            </div>
            <div className="ml-auto flex items-center gap-1 text-xs text-green-100">
              <Wallet className="h-3.5 w-3.5" />
              {stats?.paidCount ?? 0} paid orders
            </div>
          </div>
        </div>
      </div>

      {/* Financial breakdown */}
      <div className="rounded-3xl border border-green-100/80 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-700" />
            <h3 className="font-semibold">Financial Overview</h3>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <input
              type="date"
              value={revenueFrom}
              onChange={(e) => setRevenueFrom(e.target.value)}
              className="rounded-xl border border-green-100 px-3 py-1.5 text-xs"
              aria-label="Revenue from date"
            />
            <input
              type="date"
              value={revenueTo}
              onChange={(e) => setRevenueTo(e.target.value)}
              className="rounded-xl border border-green-100 px-3 py-1.5 text-xs"
              aria-label="Revenue to date"
            />
            <Button variant="outline" size="sm" onClick={() => load(true)}>Apply</Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Revenue', value: formatNaira(stats?.revenue ?? 0), icon: Wallet },
            { label: 'Avg. Order', value: formatNaira(stats?.avgOrderValue ?? 0), icon: TrendingUp },
            { label: 'Affidavits', value: formatNaira(stats?.affidavitRevenue ?? 0), icon: FileText },
            { label: 'Publications', value: formatNaira(stats?.newspaperRevenue ?? 0), icon: Newspaper },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl bg-[#f5f7f4] p-4">
              <div className="flex items-center gap-2 text-muted">
                <Icon className="h-4 w-4 text-green-700" />
                <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
              </div>
              <p className="mt-2 text-xl font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Awaiting & overdue tables (compact) */}
      {awaiting.length > 0 && (
        <div className="rounded-3xl border-2 border-green-200 bg-green-50/40 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-green-700" />
              <h3 className="font-semibold">Awaiting Processing ({awaiting.length})</h3>
            </div>
            <Link to="/admin/requests?status=submitted" className="text-sm font-medium text-green-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto rounded-2xl bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-green-100 text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-50">
                {awaiting.map((row) => (
                  <tr key={row.id} className="hover:bg-green-50/50">
                    <td className="px-4 py-3">
                      <Link to={`/admin/requests/${row.id}`} className="font-mono font-bold text-green-700 hover:underline">
                        {row.redemption_code}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {getCustomerName(row.form_data as Record<string, unknown>)}
                    </td>
                    <td className="px-4 py-3">{row.service_name}</td>
                    <td className="px-4 py-3 font-medium">{formatNaira(row.amount_paid)}</td>
                    <td className="px-4 py-3"><AdminStatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {overdue.length > 0 && (
        <div className="rounded-3xl border border-red-200 bg-red-50/50 p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Overdue ({overdue.length})</h3>
          </div>
          <ul className="space-y-2">
            {overdue.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 text-sm">
                <Link to={`/admin/requests/${row.id}`} className="font-mono font-bold text-red-700 hover:underline">
                  {row.redemption_code}
                </Link>
                <span>{row.service_name}</span>
                <AdminStatusBadge status={row.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
