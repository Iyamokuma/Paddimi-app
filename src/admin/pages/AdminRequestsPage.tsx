import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Loader2, Filter } from 'lucide-react'
import { fetchAllRequests, getCustomerName } from '../../lib/api/requests'
import type { ServiceRequestRow } from '../../lib/database.types'
import { formatNaira } from '../../data/services'
import { AdminStatusBadge } from '../components/AdminStatusBadge'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'

export function AdminRequestsPage() {
  const [searchParams] = useSearchParams()
  const [rows, setRows] = useState<ServiceRequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(searchParams.get('status') ?? 'all')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    fetchAllRequests({ status, category, search })
      .then(setRows)
      .finally(() => setLoading(false))
  }, [status, category, search])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">All Requests</h2>
        <p className="mt-1 text-sm text-muted">Manage affidavits and newspaper publications</p>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm">
        <div className="min-w-[200px] flex-1">
          <Input
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Code, name, service, phone, email…"
          />
        </div>
        <div className="w-40">
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'pending_payment', label: 'Awaiting Payment' },
              { value: 'submitted', label: 'Submitted' },
              { value: 'processing', label: 'Processing' },
              { value: 'approved', label: 'Approved' },
              { value: 'published', label: 'Published' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
        </div>
        <div className="w-40">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'all', label: 'All types' },
              { value: 'affidavit', label: 'Affidavit' },
              { value: 'newspaper', label: 'Newspaper' },
            ]}
          />
        </div>
        <div className="flex h-11 items-center gap-2 rounded-xl bg-brand-50 px-3 text-xs text-brand-600">
          <Filter className="h-4 w-4" />
          {rows.length} result{rows.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-brand-50/50 text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-muted">
                      <Search className="mx-auto mb-2 h-8 w-8 opacity-30" />
                      No requests match your filters
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-brand-50/30">
                      <td className="px-5 py-3">
                        <Link
                          to={`/admin/requests/${row.id}`}
                          className="font-mono text-base font-bold text-brand-600 hover:underline"
                        >
                          {row.redemption_code}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium">{getCustomerName(row.form_data as Record<string, unknown>)}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium">{row.service_name}</p>
                        <p className="text-xs capitalize text-muted">{row.category}</p>
                      </td>
                      <td className="px-5 py-3 text-muted">
                        <p>{row.contact_phone || '—'}</p>
                        {row.contact_email && <p className="text-xs">{row.contact_email}</p>}
                      </td>
                      <td className="px-5 py-3 font-medium">{formatNaira(row.amount_paid)}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium capitalize ${
                          row.payment_status === 'paid' ? 'text-green-600'
                            : row.payment_status === 'failed' ? 'text-red-600'
                              : 'text-gold-600'
                        }`}>
                          {row.payment_status}
                        </span>
                      </td>
                      <td className="px-5 py-3"><AdminStatusBadge status={row.status} /></td>
                      <td className="px-5 py-3 text-muted">
                        {row.submitted_at
                          ? new Date(row.submitted_at).toLocaleDateString('en-NG', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })
                          : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
