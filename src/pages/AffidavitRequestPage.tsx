import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  UserPen, PenLine, Calendar, Heart, Flower2, Smartphone, Car, Cog,
  ArrowLeftRight, BadgeCheck, CalendarDays, Clock, Check, ArrowLeft, ArrowRight,
  CreditCard, Building, FileText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StepIndicator } from '../components/ui/StepIndicator'
import { DynamicFormFields } from '../components/forms/DynamicFormFields'
import {
  affidavitServices, formatNaira,
} from '../data/services'
import {
  getAffidavitFields, getTextFields, getFileFields, validateFields, CONTACT_FIELDS,
} from '../data/affidavitFields'
import { PaymentSuccess } from '../components/PaymentSuccess'
import { PageHeader } from '../components/layout/PageHeader'
import { checkoutService } from '../lib/api/payments'

const iconMap: Record<string, LucideIcon> = {
  UserPen, PenLine, Calendar, Heart, Flower2, Smartphone, Car, Cog,
  ArrowLeftRight, BadgeCheck, CalendarDays, FileText,
}

const steps = [
  { id: 1, label: 'Select Type' },
  { id: 2, label: 'Your Details' },
  { id: 3, label: 'Documents' },
  { id: 4, label: 'Review & Pay' },
]

export function AffidavitRequestPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState('')
  const [values, setValues] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<Record<string, File[]>>({})
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'ussd'>('card')
  const [completed, setCompleted] = useState(false)
  const [redemptionCode, setRedemptionCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const service = affidavitServices.find((s) => s.id === selectedService)
  const allFields = useMemo(
    () => (selectedService ? getAffidavitFields(selectedService) : []),
    [selectedService],
  )
  const textFields = useMemo(() => [...getTextFields(allFields), ...CONTACT_FIELDS], [allFields])
  const fileFields = useMemo(() => getFileFields(allFields), [allFields])
  const total = service?.price ?? 0

  const updateValue = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }))
  }

  const updateFiles = (id: string, f: File[]) => {
    setFiles((prev) => ({ ...prev, [id]: f }))
  }

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedService
      case 2: return validateFields(textFields, values, files) && !!values.phone?.trim()
      case 3: return fileFields.length === 0 || validateFields(fileFields, values, files)
      case 4: return !!values.phone?.trim()
      default: return false
    }
  }

  const handlePayment = async () => {
    if (!service) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const fileLabels = Object.fromEntries(fileFields.map((f) => [f.id, f.label]))
      const { code } = await checkoutService({
        category: 'affidavit',
        serviceId: selectedService,
        serviceName: service.name,
        contactPhone: values.phone,
        contactEmail: values.email,
        referralCode: values.referralCode,
        formData: values,
        paymentMethod,
        amountPaid: total,
        turnaroundMinutes: 15,
        files,
      }, fileLabels)
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
        contactPhone={values.phone}
        contactEmail={values.email ?? ''}
        total={total}
        category="affidavit"
        turnaround={service.turnaround}
      />
    )
  }

  return (
    <>
      <PageHeader
        title="Request an Affidavit"
        description="Select your affidavit type, complete the required fields, and pay — ready in 15 minutes."
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
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Choose affidavit type</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {affidavitServices.map((svc) => {
                const Icon = iconMap[svc.icon] || FileText
                return (
                  <Card
                    key={svc.id}
                    hover
                    selected={selectedService === svc.id}
                    onClick={() => {
                      setSelectedService(svc.id)
                      setValues({})
                      setFiles({})
                    }}
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
                        <div className="mt-2 flex items-center gap-3 text-xs">
                          <span className="font-semibold text-brand-600">{formatNaira(svc.price)}</span>
                          <span className="text-muted">
                            <Clock className="mr-0.5 inline h-3 w-3" />
                            {svc.turnaround}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold">Deponent information</h2>
              <p className="mt-1 text-sm text-muted">Complete all fields for {service?.name}.</p>
              <div className="mt-6">
                <DynamicFormFields
                  fields={getTextFields(allFields)}
                  values={values}
                  files={files}
                  onChange={updateValue}
                  onFileChange={updateFiles}
                />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Contact information</h2>
              <p className="mt-1 text-sm text-muted">Phone is required. Email and referral code are optional.</p>
              <div className="mt-6">
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

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Upload documents &amp; photos</h2>
              <p className="mt-1 text-sm text-muted">
                {fileFields.length > 0
                  ? 'Upload the required files for your affidavit.'
                  : 'No additional uploads required for this affidavit type.'}
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
                You can proceed to review — no file uploads needed for this affidavit.
              </div>
            )}
          </div>
        )}

        {step === 4 && service && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold">Review your order</h2>
              <Card className="mt-4 !p-5">
                <div className="space-y-3 text-sm">
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
                    <span className="font-medium text-green-600">{service.turnaround}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Delivery</span>
                    <span className="font-medium">Electronic download</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-brand-600">{formatNaira(total)}</span>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Payment method</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {([
                  { value: 'card' as const, label: 'Debit/Credit Card', icon: CreditCard },
                  { value: 'transfer' as const, label: 'Bank Transfer', icon: Building },
                  { value: 'ussd' as const, label: 'USSD', icon: Smartphone },
                ]).map((opt) => (
                  <Card
                    key={opt.value}
                    hover
                    selected={paymentMethod === opt.value}
                    onClick={() => setPaymentMethod(opt.value)}
                    className="!p-4"
                  >
                    <opt.icon className="h-5 w-5 text-brand-500" />
                    <p className="mt-2 text-sm font-medium">{opt.label}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-700">
              A 4-character redemption code will be sent via SMS to <strong>{values.phone}</strong>
              {values.email && <> and email to <strong>{values.email}</strong></>}.
              Use it on the homepage to download your document when ready. Valid for 1 year.
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 1}>
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="gold" onClick={handlePayment} disabled={!canProceed() || submitting}>
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
