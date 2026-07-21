declare global {
  interface Window {
    FlutterwaveCheckout?: (options: FlutterwaveCheckoutOptions) => void
  }
}

interface FlutterwaveCheckoutOptions {
  public_key: string
  tx_ref: string
  amount: number
  currency: string
  payment_options: string
  customer: {
    email: string
    phone_number: string
    name: string
  }
  customizations: {
    title: string
    description: string
  }
  callback: (response: { status: string; tx_ref: string; transaction_id?: number }) => void
  onclose: () => void
}

let scriptPromise: Promise<void> | null = null

function loadFlutterwaveScript(): Promise<void> {
  if (window.FlutterwaveCheckout) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.flutterwave.com/v3.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Flutterwave'))
    document.body.appendChild(script)
  })

  return scriptPromise
}

export function isFlutterwaveConfigured(): boolean {
  return Boolean(import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY)
}

export async function openFlutterwaveCheckout(options: {
  email: string
  phone: string
  name: string
  amountNaira: number
  reference: string
  publicKey: string
  description: string
}): Promise<string> {
  await loadFlutterwaveScript()

  if (!window.FlutterwaveCheckout) {
    throw new Error('Flutterwave failed to initialize')
  }

  return new Promise((resolve, reject) => {
    let settled = false

    window.FlutterwaveCheckout!({
      public_key: options.publicKey,
      tx_ref: options.reference,
      amount: Math.round(options.amountNaira),
      currency: 'NGN',
      payment_options: 'card, banktransfer, ussd',
      customer: {
        email: options.email,
        phone_number: options.phone || '08000000000',
        name: options.name || 'Paddimi Customer',
      },
      customizations: {
        title: 'Paddimi Multi Concept',
        description: options.description,
      },
      callback: (response) => {
        if (settled) return
        settled = true
        if (response.status === 'successful') {
          resolve(response.tx_ref)
        } else {
          reject(new Error('Payment was not completed'))
        }
      },
      onclose: () => {
        if (settled) return
        settled = true
        reject(new Error('Payment cancelled'))
      },
    })
  })
}
