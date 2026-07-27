import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

// Public, read-only: reports which payment providers are actually usable based
// on server-side secrets. The frontend uses this instead of trusting its own
// VITE_* build-time env vars, so a missing/forgotten Vercel env var can never
// silently hide checkout the way it did before — the backend is always the
// source of truth, since that's where the real secret keys live.
Deno.serve((req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const paystackPublicKey = Deno.env.get('PAYSTACK_PUBLIC_KEY') ?? ''
  const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY') ?? ''
  const flutterwavePublicKey = Deno.env.get('FLUTTERWAVE_PUBLIC_KEY') ?? ''
  const flutterwaveSecretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY') ?? ''

  return jsonResponse({
    paystackEnabled: Boolean(paystackPublicKey && paystackSecretKey),
    paystackPublicKey: paystackPublicKey || undefined,
    flutterwaveEnabled: Boolean(flutterwavePublicKey && flutterwaveSecretKey),
    flutterwavePublicKey: flutterwavePublicKey || undefined,
  })
})
