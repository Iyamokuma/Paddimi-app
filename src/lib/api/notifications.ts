import { invokeEdge, invokeEdgeAsUser } from './edge'
import { isSupabaseConfigured } from '../supabase'
import { getSupabase } from '../supabase'

interface NotificationPayload {
  code?: string
  serviceName?: string
  phone?: string
}

export async function sendNotification(
  requestId: string,
  channel: 'sms' | 'email',
  recipient: string,
  notificationType: string,
  payload: NotificationPayload = {},
): Promise<void> {
  if (!isSupabaseConfigured) return

  try {
    await invokeEdgeAsUser('send-notification', {
      requestId,
      channel,
      recipient,
      notificationType,
      payload,
    })
  } catch (e) {
    console.warn('sendNotification failed:', e)
    const sb = getSupabase()
    if (sb) {
      await sb.from('notification_logs').insert({
        request_id: requestId,
        channel,
        recipient,
        notification_type: notificationType,
        status: 'failed',
      } as never)
    }
  }
}

export async function getSecureDownloadUrl(code: string): Promise<string | null> {
  if (!isSupabaseConfigured) return '#demo-download'

  try {
    const data = await invokeEdge<{ url: string }>('get-download-url', { code })
    return data.url
  } catch {
    return null
  }
}

export async function getAdminFileUrl(bucket: string, path: string): Promise<string | null> {
  if (!isSupabaseConfigured) return null

  try {
    const data = await invokeEdgeAsUser<{ url: string }>('get-admin-file-url', { bucket, path })
    return data.url
  } catch {
    return null
  }
}

export async function fetchNotificationLogs(limit = 50) {
  if (!isSupabaseConfigured) return []

  const sb = getSupabase()!
  const { data, error } = await sb
    .from('notification_logs')
    .select('*, service_requests(redemption_code, service_name)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function fetchStaffProfiles() {
  if (!isSupabaseConfigured) return []

  const sb = getSupabase()!
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
