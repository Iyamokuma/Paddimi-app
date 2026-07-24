import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Mail, MessageSquare, ArrowRight, Download, Clock, Home } from 'lucide-react'
import { Button } from './ui/Button'
import { PageHeader } from './layout/PageHeader'
import { formatNaira, CODE_VALIDITY } from '../data/services'
import type { NotifyChannel } from '../lib/customer'
import type { ServiceCategory } from '../types'

interface PaymentSuccessProps {
  code: string
  serviceName: string
  contactPhone: string
  contactEmail: string
  notifyChannels: NotifyChannel[]
  total: number
  category: ServiceCategory
  turnaround?: string
}

const AUTO_REDIRECT_SECONDS = 10

export function PaymentSuccess({
  serviceName, contactPhone, contactEmail, notifyChannels, total, category, turnaround,
}: PaymentSuccessProps) {
  const docKind = category === 'newspaper' ? 'publication' : 'affidavit'
  const navigate = useNavigate()
  const [secondsLeft, setSecondsLeft] = useState(AUTO_REDIRECT_SECONDS)

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigate('/', { replace: true })
      return
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft, navigate])

  return (
    <>
      <PageHeader
        title="Success"
        description="Payment confirmed. Your request has been received."
        icon={<CheckCircle2 className="h-7 w-7" />}
      />

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-4 text-2xl font-bold text-foreground">Payment successful</h2>
          <p className="mt-2 text-sm text-muted">
            Your {docKind} request for <strong className="text-foreground">{serviceName}</strong> is confirmed.
          </p>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-5 text-left">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
          <div>
            <p className="font-semibold text-foreground">Your redemption code has been emailed</p>
            <p className="mt-1 text-sm text-muted">
              We sent your download code to <strong className="text-foreground">{contactEmail}</strong>.
              Check your inbox (and spam folder). Use that code when your {docKind} is ready — valid for {CODE_VALIDITY}.
            </p>
            {notifyChannels.includes('sms') && contactPhone && (
              <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                <MessageSquare className="h-4 w-4 text-brand-500" />
                Also sent by SMS to <strong className="text-foreground">{contactPhone}</strong>
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-gold-200 bg-gold-50 p-5 text-left">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />
          <div>
            <p className="font-semibold text-foreground">Your request would be ready soon</p>
            <p className="mt-1 text-sm text-muted">
              We are preparing your {docKind}
              {turnaround ? ` — expected within ${turnaround}` : ''}.
              You will get another email when it is ready to download.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h3 className="font-semibold">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Service</span>
              <span className="font-medium">{serviceName}</span>
            </div>
            {turnaround && (
              <div className="flex justify-between">
                <span className="text-muted">Expected turnaround</span>
                <span className="font-medium text-green-600">{turnaround}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Amount Paid</span>
              <span className="font-bold text-brand-600">{formatNaira(total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-brand-50/50 p-5 text-sm text-muted ring-1 ring-brand-100">
          <p className="font-medium text-foreground">What happens next?</p>
          <ol className="mt-3 list-inside list-decimal space-y-2">
            <li>Check your email for your redemption code</li>
            <li>We prepare your {docKind}{turnaround ? ` — expected within ${turnaround}` : ''}</li>
            <li>You&apos;ll receive another email when it is ready to download</li>
            <li>Enter the code from your email on the homepage download section</li>
          </ol>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/track">
            <Button variant="gold" size="lg" className="w-full sm:w-auto">
              Track My Request
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/#download">
            <Button size="lg" className="w-full sm:w-auto">
              <Download className="h-4 w-4" />
              Go to Download
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => navigate('/', { replace: true })}
          >
            <Home className="h-4 w-4" />
            Back to Home now
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          Returning to the homepage automatically in {secondsLeft}s…
        </p>
      </div>
    </>
  )
}
