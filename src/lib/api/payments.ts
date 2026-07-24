import { invokeEdge } from './edge'
import { isSupabaseConfigured } from '../supabase'
import { generateRedemptionCode } from '../../data/services'
import { openFlutterwaveCheckout, isFlutterwaveConfigured } from '../flutterwave'
import { openPaystackPopup, isPaystackConfigured } from '../paystack'
import type { PaymentProvider } from '../paymentProviders'
import type { CreateRequestInput } from './requests'
import { uploadRequestFiles } from './requests'

interface InitializeResponse {
  requestId: string
  reference: string
  amount: number
  publicKey: string
  accessCode?: string
  authorizationUrl?: string
  flutterwaveEnabled?: boolean
  paystackEnabled?: boolean
}

interface VerifyResponse {
  code: string
  requestId: string
}

function getCustomerEmail(input: CreateRequestInput): string {
  if (input.contactEmail?.trim()) return input.contactEmail.trim()
  if (input.contactPhone) {
    return `${input.contactPhone.replace(/\D/g, '')}@customer.paddimi.com`
  }
  return 'customer@paddimi.com'
}

function getCustomerName(input: CreateRequestInput): string {
  const form = input.formData ?? {}
  const parts = [form.firstName, form.middleName, form.lastName]
    .filter((p) => p && String(p).trim())
    .map(String)
  if (parts.length > 0) return parts.join(' ')
  if (form.fullName && String(form.fullName).trim()) return String(form.fullName).trim()
  return 'Paddimi Customer'
}

function getInitializeFunction(provider: PaymentProvider): string {
  return provider === 'paystack' ? 'paystack-initialize' : 'flutterwave-initialize'
}

function getVerifyFunction(provider: PaymentProvider): string {
  return provider === 'paystack' ? 'paystack-verify' : 'flutterwave-verify'
}

async function runPaymentPopup(
  provider: PaymentProvider,
  input: CreateRequestInput,
  init: InitializeResponse,
): Promise<void> {
  const email = getCustomerEmail(input)

  if (provider === 'paystack') {
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || init.publicKey

    if (!init.paystackEnabled) {
      throw new Error('Paystack is not configured. Add PAYSTACK_SECRET_KEY to Supabase secrets.')
    }

    if (init.accessCode) {
      await openPaystackPopup({ accessCode: init.accessCode })
      return
    }

    if (!publicKey) {
      throw new Error('Paystack could not start. Check PAYSTACK_SECRET_KEY in Supabase secrets.')
    }

    await openPaystackPopup({
      email,
      amountNaira: init.amount,
      reference: init.reference,
      publicKey,
    })
    return
  }

  const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || init.publicKey
  if (!init.flutterwaveEnabled || !publicKey) {
    throw new Error('Flutterwave is not fully configured. Add FLUTTERWAVE_PUBLIC_KEY to Supabase secrets.')
  }

  await openFlutterwaveCheckout({
    email,
    phone: input.contactPhone ?? '',
    name: getCustomerName(input),
    amountNaira: init.amount,
    reference: init.reference,
    publicKey,
    description: input.serviceName,
  })
}

export async function checkoutService(
  input: CreateRequestInput,
  fileLabels: Record<string, string> = {},
  provider: PaymentProvider = 'flutterwave',
): Promise<{ code: string; requestId?: string }> {
  if (!isSupabaseConfigured) {
    return { code: generateRedemptionCode() }
  }

  const init = await invokeEdge<InitializeResponse>(getInitializeFunction(provider), {
    category: input.category,
    serviceId: input.serviceId,
    serviceName: input.serviceName,
    contactPhone: input.contactPhone,
    contactEmail: input.contactEmail,
    referralCode: input.referralCode,
    formData: input.formData,
    paymentMethod: provider,
  })

  if (input.files && Object.keys(input.files).length > 0) {
    await uploadRequestFiles(init.requestId, input.files, fileLabels)
  }

  await runPaymentPopup(provider, input, init)

  const result = await invokeEdge<VerifyResponse>(getVerifyFunction(provider), {
    reference: init.reference,
  })

  return { code: result.code, requestId: result.requestId }
}

export function isLivePaymentEnabled(): boolean {
  return isSupabaseConfigured && (isFlutterwaveConfigured() || isPaystackConfigured())
}
