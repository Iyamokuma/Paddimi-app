import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getAdminClient } from '../_shared/supabase-admin.ts'
import { notifyNewOrder } from '../_shared/notify-new-order.ts'

async function verifyWithPaystack(reference: string): Promise<{ ok: boolean; amount?: number }> {
  const secret = Deno.env.get('PAYSTACK_SECRET_KEY')
  if (!secret) {
    return { ok: Deno.env.get('PAYMENT_DEV_MODE') === 'true' }
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${secret}` },
  })
  const data = await res.json()
  if (!data.status || data.data.status !== 'success') return { ok: false }
  return { ok: true, amount: data.data.amount / 100 }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { reference } = await req.json()
    if (!reference) return jsonResponse({ error: 'Reference is required' }, 400)

    const sb = getAdminClient()
    const { data: request, error } = await sb
      .from('service_requests')
      .select('*')
      .eq('payment_reference', reference)
      .maybeSingle()

    if (error) return jsonResponse({ error: error.message }, 500)
    if (!request) return jsonResponse({ error: 'Order not found' }, 404)
    if (request.payment_status === 'paid') {
      return jsonResponse({ code: request.redemption_code, requestId: request.id })
    }

    const verification = await verifyWithPaystack(reference)
    if (!verification.ok) {
      await sb.from('service_requests').update({ payment_status: 'failed' }).eq('id', request.id)
      return jsonResponse({ error: 'Payment verification failed' }, 402)
    }

    if (verification.amount && verification.amount < request.amount_paid) {
      return jsonResponse({ error: 'Payment amount mismatch' }, 402)
    }

    const now = new Date().toISOString()
    await sb.from('service_requests').update({
      payment_status: 'paid',
      status: 'submitted',
      paid_at: now,
      submitted_at: now,
    }).eq('id', request.id)

    await sb.from('request_timeline')
      .update({ completed: true, label: 'Request Submitted' })
      .eq('request_id', request.id)
      .eq('status', 'submitted')
      .eq('completed', false)

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    await notifyNewOrder(request, supabaseUrl, serviceKey)

    return jsonResponse({
      code: request.redemption_code,
      requestId: request.id,
    })
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Server error' }, 500)
  }
})
