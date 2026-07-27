import { fetchPaymentConfig } from './api/paymentConfig'

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

export async function getAvailablePaymentProviders(): Promise<PaymentProviderOption[]> {
  const config = await fetchPaymentConfig()
  return PROVIDER_OPTIONS.filter((option) => {
    if (option.id === 'flutterwave') return config.flutterwaveEnabled
    if (option.id === 'paystack') return config.paystackEnabled
    return false
  })
}

export async function getDefaultPaymentProvider(): Promise<PaymentProvider | null> {
  const available = await getAvailablePaymentProviders()
  if (available.some((option) => option.id === 'paystack')) return 'paystack'
  return available[0]?.id ?? null
}

export async function isAnyPaymentProviderConfigured(): Promise<boolean> {
  const available = await getAvailablePaymentProviders()
  return available.length > 0
}
