import { isFlutterwaveConfigured } from './flutterwave'
import { isPaystackConfigured } from './paystack'

export type PaymentProvider = 'flutterwave' | 'paystack'

export interface PaymentProviderOption {
  id: PaymentProvider
  label: string
  description: string
}

const PROVIDER_OPTIONS: PaymentProviderOption[] = [
  {
    id: 'flutterwave',
    label: 'Flutterwave',
    description: 'Card, bank transfer, or USSD',
  },
  {
    id: 'paystack',
    label: 'Paystack',
    description: 'Card, bank transfer, or USSD',
  },
]

export function getAvailablePaymentProviders(): PaymentProviderOption[] {
  return PROVIDER_OPTIONS.filter((option) => {
    if (option.id === 'flutterwave') return isFlutterwaveConfigured()
    if (option.id === 'paystack') return isPaystackConfigured()
    return false
  })
}

export function getDefaultPaymentProvider(): PaymentProvider | null {
  const available = getAvailablePaymentProviders()
  if (available.some((option) => option.id === 'paystack')) return 'paystack'
  return available[0]?.id ?? null
}

export function isAnyPaymentProviderConfigured(): boolean {
  return getAvailablePaymentProviders().length > 0
}
