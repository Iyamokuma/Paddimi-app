import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getAdminClient } from '../_shared/supabase-admin.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const ADMIN_EMAILS = ['paddimi.mc@gmail.com', 'paddimi.mc@yahoo.com']

async function isAuthorized(req: Request): Promise<boolean> {
  const authHeader = req.headers.get('Authorization') ?? ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) return false

  // Internal calls (e.g. from paystack-verify) use the service role key
  if (token === (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')) return true

  // Otherwise require a logged-in admin/staff user
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

  const from = Deno.env.get('RESEND_FROM_EMAIL') ?? 'Paddimi <notifications@paddimi.com>'
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

function buildMessage(type: string, payload: Record<string, string>): { subject: string; html: string; sms: string } {
  const code = payload.code ?? ''
  const service = payload.serviceName ?? 'your document'

  switch (type) {
    case 'new_order':
      return {
        subject: `New order: ${service} (${code})`,
        html: `<p>New request received.</p><p><strong>Customer:</strong> ${payload.customerName ?? 'Customer'}</p><p><strong>Service:</strong> ${service}</p><p><strong>Code:</strong> ${code}</p><p><strong>Phone:</strong> ${payload.phone ?? '—'}</p>`,
        sms: `New Paddimi order: ${service}. Code ${code}. Customer ${payload.customerName ?? ''}`,
      }
    case 'order_confirmed':
      return {
        subject: `Order confirmed — your code is ${code}`,
        html: `<p>Thank you! Your <strong>${service}</strong> order has been received.</p><p><strong>Your download code:</strong> ${code}</p><p>We will notify you when your document is ready. Your code is valid for 1 year.</p>`,
        sms: `Paddimi: Order confirmed for ${service}. Your download code: ${code}. We'll notify you when it's ready.`,
      }
    case 'document_approved':
      return {
        subject: `Your ${service} is ready — code ${code}`,
        html: `<p>Your document has been approved and is ready for download.</p><p><strong>Redemption code:</strong> ${code}</p><p>Visit paddimi.com and enter your code to download. Valid for 1 year.</p>`,
        sms: `Paddimi: Your ${service} is ready. Download code: ${code}. Visit paddimi.com to download.`,
      }
    default:
      return {
        subject: 'Paddimi notification',
        html: `<p>${type}</p>`,
        sms: `Paddimi notification: ${type}`,
      }
  }
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

    // Fan out new-order alerts to both admin inboxes
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
