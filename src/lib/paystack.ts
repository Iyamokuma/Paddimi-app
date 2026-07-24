declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackOptions) => { openIframe: () => void }
    }
  }
}

interface PaystackOptions {
  key?: string
  access_code?: string
  email?: string
  amount?: number
  ref?: string
  currency?: string
  callback: (response: { reference: string; status: string }) => void
  onClose?: () => void
}

let scriptPromise: Promise<void> | null = null

function loadPaystackScript(): Promise<void> {
  if (window.PaystackPop) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Paystack'))
    document.body.appendChild(script)
  })

  return scriptPromise
}

export function isPaystackConfigured(): boolean {
  return Boolean(import.meta.env.VITE_PAYSTACK_PUBLIC_KEY)
}

export async function openPaystackPopup(options: {
  email?: string
  amountNaira?: number
  reference?: string
  publicKey?: string
  accessCode?: string
}): Promise<string> {
  await loadPaystackScript()

  if (!window.PaystackPop) {
    throw new Error('Paystack failed to initialize')
  }

  const publicKey = options.publicKey?.trim()
  if (!publicKey) {
    throw new Error(
      'Paystack public key is missing. Add VITE_PAYSTACK_PUBLIC_KEY (pk_live_...) to your frontend env and PAYSTACK_PUBLIC_KEY to Supabase secrets.',
    )
  }

  if (!options.accessCode && (!options.email || !options.reference || !options.amountNaira)) {
    throw new Error('Paystack payment could not be started')
  }

  return new Promise((resolve, reject) => {
    // Paystack Inline requires the public key even when using an access_code
    const setupOptions: PaystackOptions = options.accessCode
      ? {
          key: publicKey,
          access_code: options.accessCode,
          callback: (response) => resolve(response.reference),
          onClose: () => reject(new Error('Payment cancelled')),
        }
      : {
          key: publicKey,
          email: options.email!,
          amount: Math.round(options.amountNaira! * 100),
          ref: options.reference!,
          currency: 'NGN',
          callback: (response) => resolve(response.reference),
          onClose: () => reject(new Error('Payment cancelled')),
        }

    const handler = window.PaystackPop!.setup(setupOptions)
    handler.openIframe()
  })
}
