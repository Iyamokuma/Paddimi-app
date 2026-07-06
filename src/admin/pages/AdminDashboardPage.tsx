import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Newspaper, Clock, CheckCircle2, TrendingUp, ArrowRight, Loader2,
  RefreshCw, AlertTriangle, Inbox,
} from 'lucide-react'
import {
  fetchAdminStats, fetchAllRequests, filterAwaitingProcessing, filterOverdueRequests,
} from '../../lib/api/requests'
import type { AdminStats } from '../../lib/api/requests'
import type { ServiceRequestRow } from '../../lib/database.types'
import { formatNaira } from '../../data/services'
import { AdminStatusBadge } from '../components/AdminStatusBadge'
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'

function StatCard({
  label, value, icon: Icon, accent = 'brand',
}: {
  label: string
  value: string | number
  icon: typeof FileText
  accent?: 'brand' | 'gold' | 'green' | 'red'
}) {
  const colors = {
    brand: 'bg-brand-50 text-brand-600 ring-brand-100',
    gold: 'bg-gold-50 text-gold-600 ring-gold-100',
    green: 'bg-green-50 text-green-600 ring-green-100',
    red: 'bg-red-50 text-red-600 ring-red-100',
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${colors[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recent, setRecent] = useState<ServiceRequestRow[]>([])
  const [awaiting, setAwaiting] = useState<ServiceRequestRow[]>([])
  const [overdue, setOverdue] = useState<ServiceRequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [recentFilter, setRecentFilter] = useState<'all' | 'submitted' | 'processing' | 'approved'>('all')
  const [revenueFrom, setRevenueFrom] = useState('')
  const [revenueTo, setRevenueTo] = useState('')

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
      setRecent(r.filter((row) => row.payment_status !== 'pending').slice(0, 8))
      setAwaiting(filterAwaitingProcessing(r).slice(0, 10))
      setOverdue(filterOverdueRequests(r).slice(0, 5))
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

  const filteredRecent = recentFilter === 'all'
    ? recent
    : recent.filter((r) => r.status === recentFilter)

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="mt-1 text-sm text-muted">Overview of all affidavit and publication requests</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => load(true)} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Requests" value={stats?.total ?? 0} icon={FileText} />
        <StatCard label="New / Submitted" value={stats?.submitted ?? 0} icon={Inbox} accent="brand" />
        <StatCard label="Processing" value={stats?.processing ?? 0} icon={Clock} accent="gold" />
        <StatCard label="Approved" value={stats?.approved ?? 0} icon={CheckCircle2} accent="green" />
        <StatCard label="Revenue" value={formatNaira(stats?.revenue ?? 0)} icon={TrendingUp} accent="gold" />
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm">
        <div>
          <label className="text-xs font-medium text-muted">Revenue from</label>
          <input
            type="date"
            value={revenueFrom}
            onChange={(e) => setRevenueFrom(e.target.value)}
            className="mt-1 block rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Revenue to</label>
          <input
            type="date"
            value={revenueTo}
            onChange={(e) => setRevenueTo(e.target.value)}
            className="mt-1 block rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => load(true)}>Apply</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Affidavits" value={stats?.affidavits ?? 0} icon={FileText} />
        <StatCard label="Publications" value={stats?.newspapers ?? 0} icon={Newspaper} />
        <StatCard label="Today" value={stats?.todayCount ?? 0} icon={Clock} accent="green" />
      </div>

      {awaiting.length > 0 && (
        <div className="rounded-2xl border-2 border-brand-200 bg-brand-50/30 shadow-sm">
          <div className="flex items-center justify-between border-b border-brand-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-brand-600" />
              <h3 className="font-semibold">Awaiting Processing ({awaiting.length})</h3>
            </div>
            <Link to="/admin/requests?status=submitted" className="text-sm text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-brand-100">
                {awaiting.map((row) => (
                  <tr key={row.id} className="hover:bg-white/60">
                    <td className="px-6 py-3">
                      <Link to={`/admin/requests/${row.id}`} className="font-mono font-bold text-brand-600 hover:underline">
                        {row.redemption_code}
                      </Link>
                    </td>
                    <td className="px-6 py-3 font-medium">{row.service_name}</td>
                    <td className="px-6 py-3 text-muted">{row.contact_phone}</td>
                    <td className="px-6 py-3 font-medium">{formatNaira(row.amount_paid)}</td>
                    <td className="px-6 py-3 text-muted">
                      {new Date(row.submitted_at).toLocaleString('en-NG', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {overdue.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50/50 shadow-sm">
          <div className="flex items-center gap-2 border-b border-red-100 px-6 py-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Overdue ({overdue.length})</h3>
          </div>
          <ul className="divide-y divide-red-100 px-6 py-2">
            {overdue.map((row) => (
              <li key={row.id} className="flex items-center justify-between py-3 text-sm">
                <Link to={`/admin/requests/${row.id}`} className="font-mono font-bold text-red-700 hover:underline">
                  {row.redemption_code}
                </Link>
                <span className="text-red-700">{row.service_name}</span>
                <AdminStatusBadge status={row.status} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          <h3 className="font-semibold">Recent Requests</h3>
          <div className="flex items-center gap-2">
            {(['all', 'submitted', 'processing', 'approved'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setRecentFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  recentFilter === f
                    ? 'bg-brand-600 text-white'
                    : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
                }`}
              >
                {f}
              </button>
            ))}
            <Link to="/admin/requests" className="ml-2 flex items-center gap-1 text-sm text-brand-600 hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-brand-50/50 text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3 font-medium">Code</th>
                <th className="px-6 py-3 font-medium">Service</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted">
                    No requests yet. They will appear here when customers submit orders.
                  </td>
                </tr>
              ) : (
                filteredRecent.map((row) => (
                  <tr key={row.id} className="hover:bg-brand-50/30">
                    <td className="px-6 py-3">
                      <Link to={`/admin/requests/${row.id}`} className="font-mono font-bold text-brand-600 hover:underline">
                        {row.redemption_code}
                      </Link>
                    </td>
                    <td className="px-6 py-3 font-medium">{row.service_name}</td>
                    <td className="px-6 py-3 capitalize text-muted">{row.category}</td>
                    <td className="px-6 py-3"><AdminStatusBadge status={row.status} /></td>
                    <td className="px-6 py-3 text-muted">
                      {new Date(row.submitted_at).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
