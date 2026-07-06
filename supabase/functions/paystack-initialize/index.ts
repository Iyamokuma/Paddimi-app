import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getAdminClient } from '../_shared/supabase-admin.ts'
import {
  getServicePrice,
  generateUniqueCode,
  addYears,
  addMinutes,
  addHours,
} from '../_shared/service-prices.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const {
      category,
      serviceId,
      serviceName,
      contactPhone,
      contactEmail,
      referralCode,
      formData,
      paymentMethod,
    } = body

    const price = getServicePrice(serviceId)
    if (!price) return jsonResponse({ error: 'Invalid service' }, 400)
    if (!contactPhone || !category || !serviceId || !serviceName) {
      return jsonResponse({ error: 'Missing required fields' }, 400)
    }

    const sb = getAdminClient()
    const code = await generateUniqueCode(sb)
    const now = new Date()
    const reference = `PDM-${crypto.randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()}`
    const estimatedReady = category === 'affidavit'
      ? addMinutes(now, 15)
      : addHours(now, 24)

    const { data: row, error } = await sb
      .from('service_requests')
      .insert({
        redemption_code: code,
        category,
        service_id: serviceId,
        service_name: serviceName,
        status: 'pending_payment',
        payment_status: 'pending',
        payment_reference: reference,
        contact_phone: contactPhone,
        contact_email: contactEmail || null,
        referral_code: referralCode || null,
        form_data: formData ?? {},
        payment_method: paymentMethod ?? 'card',
        amount_paid: price,
        expires_at: addYears(now, 1).toISOString(),
        estimated_ready_at: estimatedReady.toISOString(),
        download_available: false,
      })
      .select('id, redemption_code, amount_paid')
      .single()

    if (error) return jsonResponse({ error: error.message }, 500)

    await sb.from('request_timeline').insert([
      { request_id: row.id, status: 'submitted', label: 'Payment Pending', completed: false },
      { request_id: row.id, status: 'processing', label: 'Document Processing', completed: false },
      { request_id: row.id, status: 'approved', label: 'Approved — Ready for Download', completed: false },
    ])

    const publicKey = Deno.env.get('PAYSTACK_PUBLIC_KEY') ?? ''

    return jsonResponse({
      requestId: row.id,
      reference,
      amount: row.amount_paid,
      publicKey,
      paystackEnabled: Boolean(publicKey && Deno.env.get('PAYSTACK_SECRET_KEY')),
    })
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Server error' }, 500)
  }
})
