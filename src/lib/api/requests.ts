import { getSecureDownloadUrl } from './notifications'
import { getSupabase, isSupabaseConfigured } from '../supabase'
import { generateRedemptionCode, mockTrackedRequests } from '../../data/services'
import type { ServiceCategory, RequestStatus, TrackedRequest } from '../../types'
import type { ServiceRequestRow, Database } from '../database.types'

type TimelineRow = Database['public']['Tables']['request_timeline']['Row']
type DocumentRow = Database['public']['Tables']['request_documents']['Row']

export interface CreateRequestInput {
  category: ServiceCategory
  serviceId: string
  serviceName: string
  contactPhone: string
  contactEmail?: string
  referralCode?: string
  formData: Record<string, string>
  paymentMethod: string
  amountPaid: number
  turnaroundMinutes?: number
  files?: Record<string, File[]>
}

export interface AdminStats {
  total: number
  submitted: number
  processing: number
  approved: number
  affidavits: number
  newspapers: number
  todayCount: number
  revenue: number
}

function addYears(date: Date, years: number) {
  const d = new Date(date)
  d.setFullYear(d.getFullYear() + years)
  return d
}

function addMinutes(date: Date, mins: number) {
  return new Date(date.getTime() + mins * 60_000)
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 3_600_000)
}

/** Storage keys reject many special characters — keep only safe ones. */
function safeFileName(name: string): string {
  const sanitized = name.replace(/[^a-zA-Z0-9._-]+/g, '_')
  return sanitized.length > 0 && sanitized !== '_' ? sanitized : 'file'
}

async function generateUniqueCode(): Promise<string> {
  const sb = getSupabase()
  if (!sb) return generateRedemptionCode()

  for (let i = 0; i < 20; i++) {
    const code = generateRedemptionCode()
    const { data } = await sb
      .from('service_requests')
      .select('id')
      .eq('redemption_code', code)
      .maybeSingle()
    if (!data) return code
  }
  throw new Error('Unable to generate unique redemption code')
}

export async function uploadRequestFiles(
  requestId: string,
  files: Record<string, File[]>,
  labels: Record<string, string>,
) {
  const sb = getSupabase()
  if (!sb) return

  for (const [fieldId, fileList] of Object.entries(files)) {
    for (const file of fileList) {
      const path = `${requestId}/${fieldId}/${Date.now()}-${safeFileName(file.name)}`
      const { error: uploadError } = await sb.storage
        .from('customer-uploads')
        .upload(path, file, { upsert: false })

      if (uploadError) {
        console.warn('Upload failed:', uploadError.message)
        continue
      }

      await sb.from('request_documents').insert({
        request_id: requestId,
        field_id: fieldId,
        field_label: labels[fieldId] ?? fieldId,
        storage_path: path,
        file_name: file.name,
        mime_type: file.type,
      } as never)
    }
  }
}

function normalizeStatus(status: unknown): RequestStatus {
  if (status === 'ready') return 'approved'
  return status as RequestStatus
}

function rpcToTracked(data: Record<string, unknown> | null): TrackedRequest | null {
  if (!data || !data.code) return null
  return {
    code: String(data.code),
    serviceName: String(data.serviceName ?? ''),
    category: data.category as ServiceCategory,
    status: normalizeStatus(data.status),
    submittedAt: String(data.submittedAt ?? ''),
    estimatedReady: String(data.estimatedReady ?? ''),
    expiresAt: String(data.expiresAt ?? ''),
    downloadAvailable: Boolean(data.downloadAvailable),
    customerName: String(data.customerName ?? '').trim() || 'Customer',
    timeline: Array.isArray(data.timeline)
      ? data.timeline.map((t: Record<string, unknown>) => ({
          status: normalizeStatus(t.status),
          label: String(t.label),
          date: String(t.date),
          completed: Boolean(t.completed),
        }))
      : [],
  }
}

export async function trackRequestByCode(code: string): Promise<TrackedRequest | null> {
  const normalized = code.toUpperCase().trim()

  if (!isSupabaseConfigured) {
    return mockTrackedRequests[normalized] ?? null
  }

  const sb = getSupabase()!
  const { data, error } = await sb.rpc('get_request_by_code', { p_code: normalized } as never)

  if (error) {
    console.error('trackRequestByCode:', error.message)
    return mockTrackedRequests[normalized] ?? null
  }

  return rpcToTracked(data as Record<string, unknown>)
}

export async function createServiceRequest(input: CreateRequestInput): Promise<{ code: string; id?: string }> {
  const code = await generateUniqueCode()
  const now = new Date()
  const expiresAt = addYears(now, 1)
  const estimatedReady = input.category === 'affidavit'
    ? addMinutes(now, input.turnaroundMinutes ?? 15)
    : addHours(now, 24)

  if (!isSupabaseConfigured) {
    return { code }
  }

  const sb = getSupabase()!

  const { data: row, error } = await sb
    .from('service_requests')
    .insert({
      redemption_code: code,
      category: input.category,
      service_id: input.serviceId,
      service_name: input.serviceName,
      status: 'submitted',
      contact_phone: input.contactPhone,
      contact_email: input.contactEmail || null,
      referral_code: input.referralCode || null,
      form_data: input.formData,
      payment_method: input.paymentMethod,
      amount_paid: input.amountPaid,
      expires_at: expiresAt.toISOString(),
      estimated_ready_at: estimatedReady.toISOString(),
      download_available: false,
    } as never)
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  const requestId = (row as { id: string }).id

  const timeline = [
    { request_id: requestId, status: 'submitted', label: 'Request Submitted', completed: true },
    { request_id: requestId, status: 'processing', label: 'Document Processing', completed: false },
    { request_id: requestId, status: 'approved', label: 'Approved — Ready for Download', completed: false },
  ]

  await sb.from('request_timeline').insert(timeline as never)

  if (input.files && Object.keys(input.files).length > 0) {
    await uploadRequestFiles(requestId, input.files, {})
  }

  return { code, id: requestId }
}

export async function getDocumentDownloadUrl(code: string): Promise<string | null> {
  const request = await trackRequestByCode(code)
  if (!request?.downloadAvailable) return null

  if (!isSupabaseConfigured) {
    return '#demo-download'
  }

  return getSecureDownloadUrl(code)
}

// ─── Admin API ────────────────────────────────────────────────

export async function fetchAdminStats(options?: { fromDate?: string; toDate?: string }): Promise<AdminStats> {
  if (!isSupabaseConfigured) {
    const mock = Object.values(mockTrackedRequests)
    return {
      total: mock.length,
      submitted: mock.filter((r) => r.status === 'submitted').length,
      processing: mock.filter((r) => r.status === 'processing').length,
      approved: mock.filter((r) => r.downloadAvailable).length,
      affidavits: mock.filter((r) => r.category === 'affidavit').length,
      newspapers: mock.filter((r) => r.category === 'newspaper').length,
      todayCount: mock.length,
      revenue: 45000,
    }
  }

  const sb = getSupabase()!
  const { data, error } = await sb.from('service_requests').select('*')

  if (error || !data) {
    return { total: 0, submitted: 0, processing: 0, approved: 0, affidavits: 0, newspapers: 0, todayCount: 0, revenue: 0 }
  }

  const today = new Date().toDateString()
  let rows = (data ?? []) as ServiceRequestRow[]

  if (options?.fromDate) {
    const from = new Date(options.fromDate)
    rows = rows.filter((r) => new Date(r.submitted_at) >= from)
  }
  if (options?.toDate) {
    const to = new Date(options.toDate)
    to.setHours(23, 59, 59, 999)
    rows = rows.filter((r) => new Date(r.submitted_at) <= to)
  }

  const paidRows = rows.filter((r) => r.payment_status !== 'pending')

  return {
    total: paidRows.length,
    submitted: paidRows.filter((r) => r.status === 'submitted').length,
    processing: paidRows.filter((r) => r.status === 'processing').length,
    approved: paidRows.filter((r) => r.status === 'approved' || r.download_available).length,
    affidavits: paidRows.filter((r) => r.category === 'affidavit').length,
    newspapers: paidRows.filter((r) => r.category === 'newspaper').length,
    todayCount: paidRows.filter((r) => new Date(r.submitted_at).toDateString() === today).length,
    revenue: paidRows
      .filter((r) => r.payment_status === 'paid')
      .reduce((sum, r) => sum + (r.amount_paid ?? 0), 0),
  }
}

export function filterOverdueRequests(rows: ServiceRequestRow[]): ServiceRequestRow[] {
  const now = Date.now()

  return rows.filter((r) => {
    if (!['submitted', 'processing'].includes(r.status)) return false
    if (r.payment_status === 'pending') return false

    const submitted = new Date(r.submitted_at).getTime()
    const limitMs = r.category === 'affidavit' ? 15 * 60_000 : 24 * 3_600_000
    return now - submitted > limitMs
  })
}

export function filterAwaitingProcessing(rows: ServiceRequestRow[]): ServiceRequestRow[] {
  return rows
    .filter((r) => r.status === 'submitted' && r.payment_status === 'paid')
    .sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime())
}

export async function fetchAllRequests(filters?: {
  status?: string
  category?: string
  search?: string
}): Promise<ServiceRequestRow[]> {
  if (!isSupabaseConfigured) {
    return Object.values(mockTrackedRequests).map((m) => ({
      id: m.code,
      redemption_code: m.code,
      category: m.category,
      service_id: '',
      service_name: m.serviceName,
      status: m.status as ServiceRequestRow['status'],
      contact_phone: '',
      contact_email: null,
      referral_code: null,
      form_data: { customerName: m.customerName },
      payment_method: null,
      amount_paid: 0,
      payment_reference: null,
      payment_status: 'paid' as const,
      paid_at: m.submittedAt,
      document_url: null,
      download_available: m.downloadAvailable,
      expires_at: m.expiresAt,
      submitted_at: m.submittedAt,
      estimated_ready_at: m.estimatedReady,
      ready_at: null,
      created_at: m.submittedAt,
      updated_at: m.submittedAt,
    }))
  }

  const sb = getSupabase()!
  let query = sb.from('service_requests').select('*').order('submitted_at', { ascending: false })

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  const rows = (data ?? []) as ServiceRequestRow[]
  if (filters?.search) {
    const q = filters.search.toUpperCase()
    return rows.filter(
      (r) =>
        r.redemption_code.includes(q) ||
        r.service_name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        r.contact_phone.includes(filters.search!),
    )
  }
  return rows
}

export async function fetchRequestById(id: string): Promise<ServiceRequestRow | null> {
  if (!isSupabaseConfigured) {
    const all = await fetchAllRequests()
    return all.find((r) => r.id === id) ?? null
  }

  const sb = getSupabase()!
  const { data, error } = await sb.from('service_requests').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data as ServiceRequestRow | null
}

export async function fetchRequestTimeline(requestId: string): Promise<TimelineRow[]> {
  if (!isSupabaseConfigured) return []

  const sb = getSupabase()!
  const { data } = await sb
    .from('request_timeline')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: true })

  return (data ?? []) as TimelineRow[]
}

export async function fetchRequestDocuments(requestId: string): Promise<DocumentRow[]> {
  if (!isSupabaseConfigured) return []

  const sb = getSupabase()!
  const { data } = await sb
    .from('request_documents')
    .select('*')
    .eq('request_id', requestId)

  return (data ?? []) as DocumentRow[]
}

export async function updateRequestStatus(
  id: string,
  status: ServiceRequestRow['status'],
  options?: { downloadAvailable?: boolean; documentPath?: string },
) {
  if (!isSupabaseConfigured) return

  const sb = getSupabase()!
  const updates: Record<string, unknown> = { status }

  if (options?.downloadAvailable !== undefined) {
    updates.download_available = options.downloadAvailable
  }
  if (options?.documentPath) {
    updates.document_url = options.documentPath
    updates.ready_at = new Date().toISOString()
    updates.download_available = true
    updates.status = status === 'published' ? 'published' : 'approved'
  } else if (
    options?.downloadAvailable &&
    (status === 'approved' || status === 'published')
  ) {
    updates.ready_at = new Date().toISOString()
    updates.download_available = true
  }

  if (status === 'cancelled') {
    updates.download_available = false
  }

  const { error } = await sb.from('service_requests').update(updates as never).eq('id', id)
  if (error) throw new Error(error.message)

  const effectiveStatus = (updates.status as string) ?? status

  // Marks an existing timeline entry completed; inserts one only if none exists,
  // so seeded entries aren't duplicated and repeat updates stay idempotent.
  const completeOrInsertTimeline = async (timelineStatus: string, label?: string) => {
    const { data: existing } = await sb
      .from('request_timeline')
      .update({ completed: true, event_date: new Date().toISOString() } as never)
      .eq('request_id', id)
      .eq('status', timelineStatus)
      .select('id')

    if ((!existing || existing.length === 0) && label) {
      await sb.from('request_timeline').insert({
        request_id: id,
        status: timelineStatus,
        label,
        completed: true,
      } as never)
    }
  }

  if (effectiveStatus === 'processing') {
    await completeOrInsertTimeline('processing', 'Document Processing')
    return
  }

  const labelMap: Record<string, string> = {
    approved: 'Approved — Ready for Download',
    published: 'Published — Ready for Download',
    cancelled: 'Cancelled',
  }

  if (labelMap[effectiveStatus]) {
    if (effectiveStatus === 'approved' || effectiveStatus === 'published') {
      await completeOrInsertTimeline('processing')
      await completeOrInsertTimeline('approved', labelMap.approved)
      if (effectiveStatus === 'published') {
        await completeOrInsertTimeline('published', labelMap.published)
      }
    } else {
      await completeOrInsertTimeline(effectiveStatus, labelMap[effectiveStatus])
    }
  }
}

export async function markRequestProcessing(id: string) {
  await updateRequestStatus(id, 'processing')
}

export async function approveRequest(id: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const sb = getSupabase()!
  const { data, error } = await sb
    .from('service_requests')
    .select('document_url')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  const row = data as { document_url: string | null } | null
  if (!row?.document_url) {
    throw new Error('Upload the customer PDF before approving')
  }

  await updateRequestStatus(id, 'approved', { downloadAvailable: true })
}

export async function uploadCompletedDocument(requestId: string, file: File): Promise<string> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const sb = getSupabase()!
  const path = `${requestId}/${Date.now()}-${safeFileName(file.name)}`

  const { error } = await sb.storage.from('completed-documents').upload(path, file, { upsert: true })
  if (error) throw new Error(error.message)

  const { error: updateError } = await sb
    .from('service_requests')
    .update({ document_url: path } as never)
    .eq('id', requestId)

  if (updateError) throw new Error(updateError.message)
  return path
}

