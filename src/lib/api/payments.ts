import { invokeEdge } from './edge'
import { isSupabaseConfigured } from '../supabase'
import { generateRedemptionCode } from '../../data/services'
import { openPaystackPopup, isPaystackConfigured } from '../paystack'
import type { CreateRequestInput } from './requests'
import { uploadRequestFiles } from './requests'

interface InitializeResponse {
  requestId: string
  reference: string
  amount: number
  publicKey: string
  paystackEnabled: boolean
}

interface VerifyResponse {
  code: string
  requestId: string
}

export async function checkoutService(
  input: CreateRequestInput,
  fileLabels: Record<string, string> = {},
): Promise<{ code: string; requestId?: string }> {
  if (!isSupabaseConfigured) {
    return { code: generateRedemptionCode() }
  }

  const init = await invokeEdge<InitializeResponse>('paystack-initialize', {
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

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || init.publicKey
  const shouldUsePaystack = init.paystackEnabled && Boolean(publicKey)

  if (shouldUsePaystack) {
    const email = input.contactEmail?.trim()
      || `${input.contactPhone.replace(/\D/g, '')}@customer.paddimi.com`

    await openPaystackPopup({
      email,
      amountNaira: init.amount,
      reference: init.reference,
      publicKey,
    })
  }

  const result = await invokeEdge<VerifyResponse>('paystack-verify', {
    reference: init.reference,
  })

  return { code: result.code, requestId: result.requestId }
}

export function isLivePaymentEnabled(): boolean {
  return isSupabaseConfigured && isPaystackConfigured()
}
