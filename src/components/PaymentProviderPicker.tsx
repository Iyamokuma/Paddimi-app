import { CreditCard } from 'lucide-react'
import type { PaymentProvider, PaymentProviderOption } from '../lib/paymentProviders'

interface PaymentProviderPickerProps {
  options: PaymentProviderOption[]
  value: PaymentProvider | null
  onChange: (provider: PaymentProvider) => void
}

export function PaymentProviderPicker({ options, value, onChange }: PaymentProviderPickerProps) {
  if (options.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Payment is not configured yet. Add Flutterwave or Paystack public keys to enable checkout.
      </div>
    )
  }

  if (options.length === 1) {
    return (
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-700">
        <p className="font-medium">Payment via {options[0].label}</p>
        <p className="mt-1 text-brand-600">{options[0].description}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-foreground">Choose payment method</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                selected
                  ? 'border-brand-400 bg-brand-50 ring-2 ring-brand-200'
                  : 'border-border bg-white hover:border-brand-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{option.label}</p>
                  <p className="mt-1 text-xs text-muted">{option.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
