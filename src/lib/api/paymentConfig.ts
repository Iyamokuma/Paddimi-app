import { invokeEdge } from './edge'

export interface PaymentConfig {
  paystackEnabled: boolean
  paystackPublicKey?: string
  flutterwaveEnabled: boolean
  flutterwavePublicKey?: string
}

function frontendEnvFallback(): PaymentConfig {
  // Used only if the backend config check itself can't be reached at all
  // (e.g. offline). Normally the backend is authoritative so a missing
  // Vercel VITE_* var can never hide checkout the way it used to.
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || undefined
  const flutterwavePublicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || undefined
  return {
    paystackEnabled: Boolean(paystackPublicKey),
    paystackPublicKey,
    flutterwaveEnabled: Boolean(flutterwavePublicKey),
    flutterwavePublicKey,
  }
}

let cachedConfig: Promise<PaymentConfig> | null = null

/**
 * Which payment providers are actually usable, as reported by the backend
 * (which holds the real secret keys) rather than the frontend's own build-time
 * env vars. Cached for the lifetime of the page load.
 */
export function fetchPaymentConfig(): Promise<PaymentConfig> {
  if (!cachedConfig) {
    cachedConfig = invokeEdge<PaymentConfig>('payment-config', {}).catch(() => frontendEnvFallback())
  }
  return cachedConfig
}
