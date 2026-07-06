import type { ServiceRequestRow } from '../../lib/database.types'

const config: Record<string, { label: string; className: string }> = {
  submitted: { label: 'Submitted', className: 'bg-blue-50 text-blue-700 ring-blue-200' },
  pending_payment: { label: 'Awaiting Payment', className: 'bg-gray-50 text-gray-700 ring-gray-200' },
  processing: { label: 'Processing', className: 'bg-gold-50 text-gold-700 ring-gold-200' },
  approved: { label: 'Approved', className: 'bg-green-50 text-green-700 ring-green-200' },
  ready: { label: 'Approved', className: 'bg-green-50 text-green-700 ring-green-200' },
  published: { label: 'Published', className: 'bg-green-50 text-green-700 ring-green-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700 ring-red-200' },
}

export function AdminStatusBadge({ status }: { status: ServiceRequestRow['status'] | string }) {
  const c = config[status] ?? { label: status, className: 'bg-gray-50 text-gray-700 ring-gray-200' }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${c.className}`}>
      {c.label}
    </span>
  )
}
