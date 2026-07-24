import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getAdminClient } from '../_shared/supabase-admin.ts'
import { buildMessage } from '../_shared/notification-messages.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const ADMIN_EMAILS = ['paddimi.mc@gmail.com', 'paddimi.mc@yahoo.com']

async function isAuthorized(req: Request): Promise<boolean> {
  const authHeader = req.headers.get('Authorization') ?? ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) return false

  if (token === (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')) return true

  const userClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  )
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return false

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  return Boolean(profile && ['admin', 'staff'].includes(profile.role))
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) return false

  const from = Deno.env.get('RESEND_FROM_EMAIL') ?? 'Paddimi <notify@paddimi.com>'
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  })
  return res.ok
}

async function sendSms(to: string, message: string): Promise<boolean> {
  const apiKey = Deno.env.get('TERMII_API_KEY')
  const senderId = Deno.env.get('TERMII_SENDER_ID') ?? 'Paddimi'
  if (!apiKey) return false

  const phone = to.replace(/\D/g, '')
  const formatted = phone.startsWith('234') ? phone : `234${phone.replace(/^0/, '')}`

  const res = await fetch('https://api.ng.termii.com/api/sms/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      to: formatted,
      from: senderId,
      sms: message,
      type: 'plain',
      channel: 'generic',
    }),
  })
  return res.ok
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    if (!(await isAuthorized(req))) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    const body = await req.json()
    const { requestId, channel, recipient, notificationType, payload = {} } = body

    if (!requestId || !channel || !recipient || !notificationType) {
      return jsonResponse({ error: 'Missing required fields' }, 400)
    }

    const sb = getAdminClient()
    const { data: logRow, error: logError } = await sb
      .from('notification_logs')
      .insert({
        request_id: requestId,
        channel,
        recipient,
        notification_type: notificationType,
        status: 'pending',
      })
      .select('id')
      .single()

    if (logError) return jsonResponse({ error: logError.message }, 500)

    const { subject, html, sms } = buildMessage(notificationType, payload)
    let sent = false

    if (channel === 'email') {
      sent = await sendEmail(recipient, subject, html)
    } else if (channel === 'sms') {
      sent = await sendSms(recipient, sms)
    }

    if (notificationType === 'new_order' && channel === 'email') {
      for (const adminEmail of ADMIN_EMAILS) {
        if (adminEmail !== recipient) {
          await sendEmail(adminEmail, subject, html)
        }
      }
    }

    const finalStatus = sent ? 'sent' : 'pending'
    await sb.from('notification_logs').update({ status: finalStatus }).eq('id', logRow.id)

    return jsonResponse({ success: true, status: finalStatus, simulated: !sent })
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Server error' }, 500)
  }
})
