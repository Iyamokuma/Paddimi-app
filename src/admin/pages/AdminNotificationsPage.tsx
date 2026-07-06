import { useEffect, useState } from 'react'
import { Loader2, Mail, MessageSquare, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { fetchNotificationLogs } from '../../lib/api/notifications'
import { Card } from '../../components/ui/Card'

type LogRow = Awaited<ReturnType<typeof fetchNotificationLogs>>[number]

const statusIcon = {
  sent: CheckCircle2,
  pending: Clock,
  failed: XCircle,
}

const statusColor = {
  sent: 'text-green-600',
  pending: 'text-gold-600',
  failed: 'text-red-600',
}

export function AdminNotificationsPage() {
  const [logs, setLogs] = useState<LogRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotificationLogs(100)
      .then(setLogs)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
        <p className="mt-1 text-sm text-muted">SMS and email delivery log for orders and approvals</p>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-brand-50/50 text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Channel</th>
                <th className="px-5 py-3 font-medium">Recipient</th>
                <th className="px-5 py-3 font-medium">Request</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted">
                    No notifications logged yet
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const Icon = statusIcon[log.status as keyof typeof statusIcon] ?? Clock
                  const req = log.service_requests as { redemption_code?: string; service_name?: string } | null
                  return (
                    <tr key={log.id} className="hover:bg-brand-50/30">
                      <td className="px-5 py-3 capitalize">{log.notification_type.replace(/_/g, ' ')}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 capitalize">
                          {log.channel === 'email' ? <Mail className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
                          {log.channel}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted">{log.recipient}</td>
                      <td className="px-5 py-3">
                        {req?.redemption_code ? (
                          <span className="font-mono font-bold text-brand-600">{req.redemption_code}</span>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 capitalize ${statusColor[log.status as keyof typeof statusColor] ?? ''}`}>
                          <Icon className="h-3.5 w-3.5" />
                          {log.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted">
                        {new Date(log.created_at).toLocaleString('en-NG')}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
