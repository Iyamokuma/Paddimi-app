import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Loader2, Upload, Phone, Mail, Clock, FileText, CheckCircle2, Download, ExternalLink,
} from 'lucide-react'
import {
  fetchRequestById, fetchRequestTimeline, fetchRequestDocuments,
  updateRequestStatus, uploadCompletedDocument,
  markRequestProcessing, approveRequest,
} from '../../lib/api/requests'
import { sendNotification, getAdminFileUrl } from '../../lib/api/notifications'
import type { ServiceRequestRow } from '../../lib/database.types'
import { formatNaira, NOTIFICATION_EMAILS } from '../../data/services'
import { AdminStatusBadge } from '../components/AdminStatusBadge'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { Card } from '../../components/ui/Card'

export function AdminRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [request, setRequest] = useState<ServiceRequestRow | null>(null)
  const [timeline, setTimeline] = useState<Awaited<ReturnType<typeof fetchRequestTimeline>>>([])
  const [documents, setDocuments] = useState<Awaited<ReturnType<typeof fetchRequestDocuments>>>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [message, setMessage] = useState('')
  const [completedDocUrl, setCompletedDocUrl] = useState<string | null>(null)

  const load = async () => {
    if (!id) return
    setLoading(true)
    const [req, tl, docs] = await Promise.all([
      fetchRequestById(id),
      fetchRequestTimeline(id),
      fetchRequestDocuments(id),
    ])
    setRequest(req)
    setTimeline(tl)
    setDocuments(docs)
    if (req) {
      setNewStatus(req.status)
      if (req.document_url) {
        const url = await getAdminFileUrl('completed-documents', req.document_url)
        setCompletedDocUrl(url)
      } else {
        setCompletedDocUrl(null)
      }
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const notifyCustomer = async (
    req: ServiceRequestRow,
  ) => {
    const payload = {
      code: req.redemption_code,
      serviceName: req.service_name,
      phone: req.contact_phone,
    }
    if (req.contact_phone) {
      await sendNotification(req.id, 'sms', req.contact_phone, 'document_approved', payload)
    }
    if (req.contact_email) {
      await sendNotification(req.id, 'email', req.contact_email, 'document_approved', payload)
    }
  }

  const handleDownloadCustomerFile = async (storagePath: string) => {
    const url = await getAdminFileUrl('customer-uploads', storagePath)
    if (url) window.open(url, '_blank')
    else setMessage('Could not generate download link')
  }

  const handleMarkProcessing = async () => {
    if (!request) return
    setUpdating(true)
    setMessage('')
    try {
      await markRequestProcessing(request.id)
      setMessage('Request marked as processing')
      await load()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Update failed')
    }
    setUpdating(false)
  }

  const handleApprove = async () => {
    if (!request) return
    setUpdating(true)
    setMessage('')
    try {
      await approveRequest(request.id)
      await notifyCustomer(request)
      setMessage('Request approved — customer can download with their code')
      await load()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Approval failed')
    }
    setUpdating(false)
  }

  const handleStatusUpdate = async () => {
    if (!request || !newStatus) return

    const enablesDownload = newStatus === 'approved' || newStatus === 'published'
    if (enablesDownload && !request.document_url) {
      setMessage('Upload the customer PDF before setting this status')
      return
    }

    setUpdating(true)
    setMessage('')
    try {
      await updateRequestStatus(
        request.id,
        newStatus as ServiceRequestRow['status'],
        enablesDownload ? { downloadAvailable: true } : undefined,
      )
      if (enablesDownload) {
        await notifyCustomer(request)
      }
      setMessage('Status updated successfully')
      await load()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Update failed')
    }
    setUpdating(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !request) return
    setUploading(true)
    setMessage('')
    try {
      await uploadCompletedDocument(request.id, file)
      setMessage('PDF uploaded — click Approve when ready to enable customer download')
      await load()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed')
    }
    setUploading(false)
    e.target.value = ''
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  if (!request) {
    return (
      <div className="text-center">
        <p className="text-muted">Request not found</p>
        <Link to="/admin/requests" className="mt-4 inline-block text-brand-600 hover:underline">
          Back to requests
        </Link>
      </div>
    )
  }

  const formData = (request.form_data ?? {}) as Record<string, string>
  const isApproved = request.status === 'approved' || request.status === 'published'
  const hasDocument = Boolean(request.document_url)

  return (
    <div className="space-y-6">
      <Link to="/admin/requests" className="inline-flex items-center gap-1 text-sm text-muted hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> All requests
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-3xl font-bold tracking-widest text-brand-700">
              {request.redemption_code}
            </span>
            <AdminStatusBadge status={request.status} />
          </div>
          <h2 className="mt-2 text-xl font-semibold">{request.service_name}</h2>
          <p className="text-sm capitalize text-muted">{request.category} · {formatNaira(request.amount_paid)}</p>
        </div>
        <div className="text-right text-sm text-muted">
          <p>Submitted {new Date(request.submitted_at).toLocaleString('en-NG')}</p>
          <p>Expires {new Date(request.expires_at).toLocaleDateString('en-NG')}</p>
        </div>
      </div>

      {message && (
        <div className={`rounded-xl px-4 py-3 text-sm ${
          message.toLowerCase().includes('fail') || message.toLowerCase().includes('before')
            ? 'bg-red-50 text-red-700'
            : 'bg-brand-50 text-brand-700'
        }`}>
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="!p-5">
            <h3 className="font-semibold">Form Data</h3>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(formData).map(([key, value]) => (
                value ? (
                  <div key={key}>
                    <dt className="text-xs capitalize text-muted">{key.replace(/([A-Z])/g, ' $1')}</dt>
                    <dd className="mt-0.5 text-sm font-medium">{value}</dd>
                  </div>
                ) : null
              ))}
            </dl>
          </Card>

          {documents.length > 0 && (
            <Card className="!p-5">
              <h3 className="font-semibold">Customer Uploads</h3>
              <ul className="mt-3 space-y-2">
                {documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 shrink-0 text-brand-500" />
                      <span className="font-medium truncate">{doc.field_label ?? doc.field_id}</span>
                      <span className="text-muted truncate">— {doc.file_name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadCustomerFile(doc.storage_path)}
                      className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-100"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card className="!p-5">
            <h3 className="font-semibold">Timeline</h3>
            <div className="mt-4 space-y-3">
              {timeline.length === 0 ? (
                <p className="text-sm text-muted">No timeline events</p>
              ) : (
                timeline.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 ${item.completed ? 'text-green-600' : 'text-muted'}`} />
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted">
                        {new Date(item.event_date).toLocaleString('en-NG')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="!p-5">
            <h3 className="font-semibold">Contact</h3>
            <div className="mt-3 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-500" />
                {request.contact_phone}
              </p>
              {request.contact_email && (
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-brand-500" />
                  {request.contact_email}
                </p>
              )}
              {request.referral_code && (
                <p className="text-muted">Referral: {request.referral_code}</p>
              )}
            </div>
          </Card>

          <Card className="!p-5 ring-2 ring-brand-100">
            <h3 className="font-semibold">Prepare &amp; Approve</h3>
            <p className="mt-1 text-xs text-muted">
              Admin prepares the document, uploads the finished PDF, then approves so the customer can download.
            </p>

            <ol className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  request.status !== 'submitted' ? 'bg-green-100 text-green-700' : 'bg-brand-100 text-brand-700'
                }`}>
                  1
                </span>
                <div className="flex-1">
                  <p className="font-medium">Mark as processing</p>
                  <p className="text-xs text-muted">Start work on this request</p>
                  {request.status === 'submitted' && (
                    <Button
                      size="sm"
                      className="mt-2 w-full"
                      onClick={handleMarkProcessing}
                      disabled={updating}
                    >
                      {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start Processing'}
                    </Button>
                  )}
                  {request.status === 'processing' && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-gold-700">
                      <Clock className="h-3.5 w-3.5" /> In progress
                    </p>
                  )}
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  hasDocument ? 'bg-green-100 text-green-700' : 'bg-brand-100 text-brand-700'
                }`}>
                  2
                </span>
                <div className="flex-1">
                  <p className="font-medium">Upload customer PDF</p>
                  <p className="text-xs text-muted">The finished affidavit or publication document</p>
                  <label className="mt-2 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-4 transition-colors hover:border-brand-400 hover:bg-brand-50">
                    <Upload className="h-6 w-6 text-brand-500" />
                    <span className="mt-1.5 text-xs font-medium text-brand-600">
                      {uploading ? 'Uploading…' : hasDocument ? 'Replace PDF' : 'Choose PDF file'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={handleUpload}
                      disabled={uploading}
                    />
                  </label>
                  {hasDocument && (
                    <div className="mt-2 space-y-2">
                      <p className="flex items-center gap-1 text-xs font-medium text-green-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        PDF on file
                      </p>
                      {completedDocUrl && (
                        <div className="flex gap-2">
                          <a
                            href={completedDocUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-100"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> Preview PDF
                          </a>
                          <a
                            href={completedDocUrl}
                            download
                            className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-100"
                          >
                            <Download className="h-3.5 w-3.5" /> Download
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isApproved ? 'bg-green-100 text-green-700' : 'bg-brand-100 text-brand-700'
                }`}>
                  3
                </span>
                <div className="flex-1">
                  <p className="font-medium">Approve for download</p>
                  <p className="text-xs text-muted">
                    Customer uses code <span className="font-mono font-semibold">{request.redemption_code}</span> on the homepage
                  </p>
                  {!isApproved && (
                    <Button
                      size="sm"
                      variant="gold"
                      className="mt-2 w-full"
                      onClick={handleApprove}
                      disabled={updating || !hasDocument}
                    >
                      {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve Request'}
                    </Button>
                  )}
                  {isApproved && request.download_available && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approved — download enabled
                    </p>
                  )}
                </div>
              </li>
            </ol>
          </Card>

          <Card className="!p-5">
            <h3 className="font-semibold">Manual Status</h3>
            <div className="mt-3 space-y-3">
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={[
                  { value: 'submitted', label: 'Submitted' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'approved', label: 'Approved' },
                  ...(request.category === 'newspaper'
                    ? [{ value: 'published', label: 'Published' }]
                    : []),
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
              />
              <Button className="w-full" variant="outline" onClick={handleStatusUpdate} disabled={updating}>
                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Status'}
              </Button>
            </div>
          </Card>

          <Card className="!p-5">
            <h3 className="font-semibold">Notifications</h3>
            <p className="mt-1 text-xs text-muted">System emails for job alerts:</p>
            <ul className="mt-2 space-y-1 text-xs text-muted">
              {NOTIFICATION_EMAILS.map((e) => (
                <li key={e} className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {e}
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-center gap-1 text-xs text-muted">
              <Clock className="h-3 w-3" />
              SMS sent to customer when request is approved
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
