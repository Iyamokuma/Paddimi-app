import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  UserPen, PenLine, Calendar, Heart, Flower2, Smartphone, Car, Cog,
  ArrowLeftRight, BadgeCheck, CalendarDays, Check, ArrowLeft, ArrowRight,
  FileText, ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Select'
import { StepIndicator } from '../components/ui/StepIndicator'
import { DynamicFormFields } from '../components/forms/DynamicFormFields'
import {
  affidavitServices, formatNaira, COVERED_STATES, AFFIDAVIT_TURNAROUND,
} from '../data/services'
import {
  getAffidavitFields, getTextFields, getFileFields, validateFields, CONTACT_FIELDS,
} from '../data/affidavitFields'
import { PaymentSuccess } from '../components/PaymentSuccess'
import { PageHeader } from '../components/layout/PageHeader'
import { checkoutService } from '../lib/api/payments'
import { getDefaultPaymentProvider, getAvailablePaymentProviders, type PaymentProvider } from '../lib/paymentProviders'
import { PaymentProviderPicker } from '../components/PaymentProviderPicker'
import { getNotifyChannels, hasContactInfo } from '../lib/customer'

const iconMap: Record<string, LucideIcon> = {
  UserPen, PenLine, Calendar, Heart, Flower2, Smartphone, Car, Cog,
  ArrowLeftRight, BadgeCheck, CalendarDays, FileText,
}

const steps = [
  { id: 1, label: 'Your State' },
  { id: 2, label: 'Select Type' },
  { id: 3, label: 'Your Details' },
  { id: 4, label: 'Photo' },
  { id: 5, label: 'Review & Pay' },
]

export function AffidavitRequestPage() {
  const [step, setStep] = useState(1)
  const [coveredState, setCoveredState] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [values, setValues] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<Record<string, File[]>>({})
  const [completed, setCompleted] = useState(false)
  const [redemptionCode, setRedemptionCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const paymentOptions = useMemo(() => getAvailablePaymentProviders(), [])
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider | null>(null)

  useEffect(() => {
    setPaymentProvider(getDefaultPaymentProvider())
  }, [paymentOptions.length])

  const service = affidavitServices.find((s) => s.id === selectedService)
  const allFields = useMemo(
    () => (selectedService ? getAffidavitFields(selectedService) : []),
    [selectedService],
  )
  const deponentFields = useMemo(() => getTextFields(allFields), [allFields])
  const fileFields = useMemo(() => getFileFields(allFields), [allFields])
  const total = service?.price ?? 0
  const notifyChannels = getNotifyChannels(values.phone, values.email)

  const updateValue = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }))
  }

  const updateFiles = (id: string, f: File[]) => {
    setFiles((prev) => ({ ...prev, [id]: f }))
  }

  const selectState = (state: string) => {
    setCoveredState(state)
  }

  const selectService = (serviceId: string) => {
    setSelectedService(serviceId)
    setValues({})
    setFiles({})
    setStep(3)
  }

  const canProceed = () => {
    switch (step) {
      case 1: return !!coveredState
      case 2: return !!selectedService
      case 3:
        return validateFields(deponentFields, values, files)
          && validateFields(CONTACT_FIELDS, values, files)
          && hasContactInfo(values.phone, values.email)
      case 4: return fileFields.length === 0 || validateFields(fileFields, values, files)
      case 5: return hasContactInfo(values.phone, values.email)
      default: return false
    }
  }

  const handlePayment = async () => {
    if (!service || !paymentProvider) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const fileLabels = Object.fromEntries(fileFields.map((f) => [f.id, f.label]))
      const { code } = await checkoutService({
        category: 'affidavit',
        serviceId: selectedService,
        serviceName: service.name,
        contactPhone: values.phone ?? '',
        contactEmail: values.email,
        referralCode: values.referralCode,
        formData: { ...values, coveredState },
        paymentMethod: paymentProvider,
        amountPaid: total,
        turnaroundMinutes: 15,
        files,
      }, fileLabels, paymentProvider)
      setRedemptionCode(code)
      setCompleted(true)
    } catch (e) {
      if (e instanceof Error && e.message === 'Payment cancelled') {
        setSubmitError('Payment was cancelled. Your order was not completed.')
      } else {
        setSubmitError(
          e instanceof Error
            ? `Order could not be completed: ${e.message}. You have not been charged — please try again.`
            : 'Order could not be completed. Please try again.',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  const deponentName = [values.firstName, values.middleName, values.lastName].filter(Boolean).join(' ')

  if (completed && service) {
    return (
      <PaymentSuccess
        code={redemptionCode}
        serviceName={service.name}
        contactPhone={values.phone ?? ''}
        contactEmail={values.email ?? ''}
        notifyChannels={notifyChannels}
        total={total}
        category="affidavit"
        turnaround={AFFIDAVIT_TURNAROUND}
      />
    )
  }

  return (
    <>
      <PageHeader
        title="Request an Affidavit"
        description={`Genuine affidavits in ${AFFIDAVIT_TURNAROUND} — currently available in Rivers and Abia State.`}
        icon={<FileText className="h-7 w-7" />}
      />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/" className="mb-8 inline-flex items-center gap-1 text-sm text-muted hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="mb-10">
          <StepIndicator steps={steps} currentStep={step} />
        </div>

        {step === 1 && (
          <div className="mx-auto max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Select your state</h2>
            <p className="text-sm text-muted">
              Choose the state where you need this affidavit. More states are added over time.
            </p>
            <Select
              label="State"
              required
              placeholder="Select your state"
              value={coveredState}
              onChange={(e) => selectState(e.target.value)}
              options={COVERED_STATES.map((state) => ({
                value: state,
                label: `${state} State`,
              }))}
            />
            <p className="text-xs text-muted">
              Currently serving: {COVERED_STATES.map((s) => `${s} State`).join(', ')}
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">Choose affidavit type</h2>
                <p className="text-sm text-muted">{coveredState} State · tap a type to continue</p>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                {AFFIDAVIT_TURNAROUND}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {affidavitServices.map((svc) => {
                const Icon = iconMap[svc.icon] || FileText
                return (
                  <Card
                    key={svc.id}
                    hover
                    selected={selectedService === svc.id}
                    onClick={() => selectService(svc.id)}
                    className="!p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold">{svc.name}</h3>
                          {selectedService === svc.id && (
                            <Check className="h-5 w-5 shrink-0 text-brand-500" />
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted line-clamp-2">{svc.description}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold">Your details</h2>
              <p className="mt-1 text-sm text-muted">Complete all fields for {service?.name}.</p>
              <div className="mt-6 space-y-6">
                <DynamicFormFields
                  fields={deponentFields}
                  values={values}
                  files={files}
                  onChange={updateValue}
                  onFileChange={updateFiles}
                />
                <DynamicFormFields
                  fields={CONTACT_FIELDS}
                  values={values}
                  files={files}
                  onChange={updateValue}
                  onFileChange={updateFiles}
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Passport photo</h2>
              <p className="mt-1 text-sm text-muted">
                {fileFields.length > 0
                  ? 'Upload a photo from your device or take one instantly with your camera.'
                  : 'No photo required for this affidavit type.'}
              </p>
            </div>
            {fileFields.length > 0 ? (
              <DynamicFormFields
                fields={fileFields}
                values={values}
                files={files}
                onChange={updateValue}
                onFileChange={updateFiles}
              />
            ) : (
              <div className="rounded-xl bg-brand-50 p-5 text-sm text-brand-700">
                You can proceed to review — no photo needed for this affidavit.
              </div>
            )}
          </div>
        )}

        {step === 5 && service && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold">Review your order</h2>
              <Card className="mt-4 !p-5">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">State</span>
                    <span className="font-medium">{coveredState} State</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Service</span>
                    <span className="font-medium text-right">{service.name}</span>
                  </div>
                  {deponentName && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted">Deponent</span>
                      <span className="font-medium text-right">{deponentName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted">Turnaround</span>
                    <span className="font-medium text-green-600">{AFFIDAVIT_TURNAROUND}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Delivery</span>
                    <span className="font-medium">Electronic download</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Notifications</span>
                    <span className="font-medium text-right">
                      Email to {values.email}
                      {values.phone ? ` + SMS to ${values.phone}` : ''}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-brand-600">{formatNaira(total)}</span>
                  </div>
                </div>
              </Card>
            </div>

            <PaymentProviderPicker
              options={paymentOptions}
              value={paymentProvider}
              onChange={setPaymentProvider}
            />

            <div className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-700">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-medium">Secure payment at checkout</p>
                  <p className="mt-1 text-brand-600">
                    Pay with debit/credit card, bank transfer, or USSD. Your redemption code will be emailed to{' '}
                    <strong>{values.email}</strong>
                    {values.phone ? ` and SMS to ${values.phone}` : ''} immediately after payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          {step < 5 ? (
            step === 2 ? (
              <p className="text-xs text-muted">Tap an affidavit type above to continue</p>
            ) : (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            )
          ) : (
            <Button variant="gold" onClick={handlePayment} disabled={!canProceed() || submitting || !paymentProvider}>
              {submitting ? 'Processing…' : `Pay ${formatNaira(total)}`}
            </Button>
          )}
        </div>
        {submitError && (
          <p className="mt-3 text-center text-xs font-medium text-red-600">
            {submitError}
          </p>
        )}
      </div>
    </>
  )
}
