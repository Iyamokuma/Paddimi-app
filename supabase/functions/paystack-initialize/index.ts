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

    const coveredState = typeof formData?.coveredState === 'string' ? formData.coveredState : undefined
    const price = getServicePrice(serviceId, category, coveredState)
    if (!price) return jsonResponse({ error: 'Invalid service' }, 400)
    if (!category || !serviceId || !serviceName) {
      return jsonResponse({ error: 'Missing required fields' }, 400)
    }
    if (!contactEmail || !/\S+@\S+\.\S+/.test(String(contactEmail).trim())) {
      return jsonResponse({ error: 'A valid email address is required' }, 400)
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
        contact_phone: contactPhone || null,
        contact_email: contactEmail || null,
        referral_code: referralCode || null,
        form_data: formData ?? {},
        payment_method: paymentMethod ?? 'paystack',
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

    const secretKey = Deno.env.get('PAYSTACK_SECRET_KEY') ?? ''
    const publicKey = Deno.env.get('PAYSTACK_PUBLIC_KEY') ?? ''

    let accessCode: string | undefined
    let authorizationUrl: string | undefined

    if (secretKey) {
      const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: String(contactEmail).trim(),
          amount: Math.round(row.amount_paid * 100),
          reference,
          currency: 'NGN',
        }),
      })
      const paystackData = await paystackRes.json()
      if (!paystackData.status) {
        return jsonResponse(
          { error: paystackData.message ?? 'Paystack could not start payment' },
          502,
        )
      }
      accessCode = paystackData.data?.access_code
      authorizationUrl = paystackData.data?.authorization_url
    }

    return jsonResponse({
      requestId: row.id,
      reference,
      amount: row.amount_paid,
      publicKey,
      accessCode,
      authorizationUrl,
      paystackEnabled: Boolean(secretKey && (accessCode || publicKey)),
    })
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Server error' }, 500)
  }
})
