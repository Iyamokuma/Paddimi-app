import { invokeEdge } from './edge'
import { isSupabaseConfigured } from '../supabase'
import { generateRedemptionCode } from '../../data/services'
import { openFlutterwaveCheckout, isFlutterwaveConfigured } from '../flutterwave'
import type { CreateRequestInput } from './requests'
import { uploadRequestFiles } from './requests'

interface InitializeResponse {
  requestId: string
  reference: string
  amount: number
  publicKey: string
  flutterwaveEnabled: boolean
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

export async function checkoutService(
  input: CreateRequestInput,
  fileLabels: Record<string, string> = {},
): Promise<{ code: string; requestId?: string }> {
  if (!isSupabaseConfigured) {
    return { code: generateRedemptionCode() }
  }

  const init = await invokeEdge<InitializeResponse>('flutterwave-initialize', {
    category: input.category,
    serviceId: input.serviceId,
    serviceName: input.serviceName,
    contactPhone: input.contactPhone,
    contactEmail: input.contactEmail,
    referralCode: input.referralCode,
    formData: input.formData,
    paymentMethod: input.paymentMethod,
  })

  if (input.files && Object.keys(input.files).length > 0) {
    await uploadRequestFiles(init.requestId, input.files, fileLabels)
  }

  const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || init.publicKey
  const shouldUseFlutterwave = init.flutterwaveEnabled && Boolean(publicKey)

  if (shouldUseFlutterwave) {
    await openFlutterwaveCheckout({
      email: getCustomerEmail(input),
      phone: input.contactPhone ?? '',
      name: getCustomerName(input),
      amountNaira: init.amount,
      reference: init.reference,
      publicKey,
      description: input.serviceName,
    })
  }

  const result = await invokeEdge<VerifyResponse>('flutterwave-verify', {
    reference: init.reference,
  })

  return { code: result.code, requestId: result.requestId }
}

export function isLivePaymentEnabled(): boolean {
  return isSupabaseConfigured && isFlutterwaveConfigured()
}
