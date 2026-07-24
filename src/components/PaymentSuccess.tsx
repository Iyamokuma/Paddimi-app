import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Copy, Check, Mail, MessageSquare, ArrowRight, Download, Clock } from 'lucide-react'
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

export function PaymentSuccess({
  code, serviceName, contactPhone, contactEmail, notifyChannels, total, category, turnaround,
}: PaymentSuccessProps) {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const docKind = category === 'newspaper' ? 'publication' : 'affidavit'

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

        <div className="mt-6 rounded-2xl border-2 border-brand-200 bg-brand-50 p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Your Redemption Code</p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="font-mono text-5xl font-bold tracking-[0.35em] text-brand-800">
              {code}
            </span>
            <button
              onClick={copyCode}
              className="rounded-xl border border-brand-200 bg-white p-2.5 text-brand-600 transition-colors hover:bg-brand-100"
              aria-label="Copy code"
              type="button"
            >
              {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
          <p className="mt-4 text-sm text-brand-700">
            Save this code. Use it on the homepage download section when your {docKind} is ready.
            Valid for {CODE_VALIDITY}.
          </p>
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

        <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h3 className="font-semibold">Code sent to your email</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-5 w-5 text-brand-500" />
              <span>
                Your redemption code has been emailed to <strong>{contactEmail}</strong>
              </span>
            </div>
            {notifyChannels.includes('sms') && contactPhone && (
              <div className="flex items-center gap-3 text-sm">
                <MessageSquare className="h-5 w-5 text-brand-500" />
                <span>SMS also sent to <strong>{contactPhone}</strong></span>
              </div>
            )}
            <p className="text-xs text-muted">
              Check your inbox (and spam folder). We will email you again when your {docKind} is ready.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-brand-50/50 p-5 text-sm text-muted ring-1 ring-brand-100">
          <p className="font-medium text-foreground">What happens next?</p>
          <ol className="mt-3 list-inside list-decimal space-y-2">
            <li>We prepare your {docKind}{turnaround ? ` — expected within ${turnaround}` : ''}</li>
            <li>You&apos;ll receive an email when it is ready to download</li>
            <li>Enter your code on the homepage download section to get your {docKind}</li>
            <li>Documents are shared electronically only — no physical collection</li>
          </ol>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to={`/track?code=${code}`}>
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
        </div>
      </div>
    </>
  )
}
