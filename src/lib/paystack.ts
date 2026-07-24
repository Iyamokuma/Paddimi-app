declare global {
  interface Window {
    PaystackPop?: new () => PaystackPopupInstance
  }
}

interface PaystackTransactionResult {
  reference: string
  trxref?: string
  status?: string
  message?: string
}

interface PaystackPopupInstance {
  resumeTransaction: (
    accessCode: string,
    callbacks: {
      onSuccess: (transaction: PaystackTransactionResult) => void
      onCancel: () => void
      onError?: (error: { message: string }) => void
    },
  ) => void
  newTransaction: (options: {
    key: string
    email: string
    amount: number
    currency?: string
    reference?: string
    onSuccess: (transaction: PaystackTransactionResult) => void
    onCancel: () => void
    onError?: (error: { message: string }) => void
  }) => void
}

let scriptPromise: Promise<void> | null = null

function loadPaystackScript(): Promise<void> {
  if (window.PaystackPop) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v2/inline.js'
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

  const popup = new window.PaystackPop()

  return new Promise((resolve, reject) => {
    // Resuming a backend-initialized transaction guarantees the reference the
    // customer pays for is the exact one our server will verify afterwards.
    if (options.accessCode) {
      popup.resumeTransaction(options.accessCode, {
        onSuccess: (transaction) => resolve(transaction.reference),
        onCancel: () => reject(new Error('Payment cancelled')),
        onError: (error) => reject(new Error(error.message || 'Paystack payment failed')),
      })
      return
    }

    if (!options.email || !options.reference || !options.amountNaira) {
      reject(new Error('Paystack payment could not be started'))
      return
    }

    popup.newTransaction({
      key: publicKey,
      email: options.email,
      amount: Math.round(options.amountNaira * 100),
      currency: 'NGN',
      reference: options.reference,
      onSuccess: (transaction) => resolve(transaction.reference),
      onCancel: () => reject(new Error('Payment cancelled')),
      onError: (error) => reject(new Error(error.message || 'Paystack payment failed')),
    })
  })
}
