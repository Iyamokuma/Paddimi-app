import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search, CheckCircle2, Clock, Copy, Check, Download, Loader2,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { PageHeader } from '../components/layout/PageHeader'
import { CODE_VALIDITY } from '../data/services'
import { trackRequestByCode } from '../lib/api/requests'
import type { RequestStatus, TrackedRequest } from '../types'

const statusConfig: Record<RequestStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'info' }> = {
  pending_payment: { label: 'Awaiting Payment', variant: 'default' },
  submitted: { label: 'Submitted', variant: 'info' },
  processing: { label: 'Processing', variant: 'warning' },
  approved: { label: 'Approved — Ready for Download', variant: 'success' },
  published: { label: 'Published', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'default' },
}

export function TrackRequestPage() {
  const [searchParams] = useSearchParams()
  const [code, setCode] = useState('')
  const [searched, setSearched] = useState(false)
  const [copied, setCopied] = useState(false)

  const [request, setRequest] = useState<TrackedRequest | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const paramCode = searchParams.get('code')
    if (paramCode) {
      setCode(paramCode.toUpperCase().slice(0, 4))
      setSearched(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (!searched || code.length < 4) {
      setRequest(null)
      return
    }
    setLoading(true)
    trackRequestByCode(code)
      .then(setRequest)
      .finally(() => setLoading(false))
  }, [searched, code])

  const found = searched && !!request && !loading

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearched(true)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code.toUpperCase())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <PageHeader
        title="Track Your Request"
        description="Enter your 4-character redemption code to check processing status."
        icon={<Search className="h-7 w-7" />}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="mx-auto max-w-md">
          <div className="flex gap-3">
            <Input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4))
                setSearched(false)
              }}
              placeholder="e.g. K7M2"
              maxLength={4}
              className="font-mono text-xl tracking-[0.3em] uppercase text-center"
            />
            <Button type="submit" variant="gold" disabled={code.length < 4}>
              Track
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted">
            Demo:{' '}
            <button type="button" onClick={() => { setCode('K7M2'); setSearched(true) }} className="font-mono text-brand-600 hover:underline">K7M2</button>
            {' '}·{' '}
            <button type="button" onClick={() => { setCode('R3W8'); setSearched(true) }} className="font-mono text-brand-600 hover:underline">R3W8</button>
          </p>
        </form>

        {searched && !loading && !request && (
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-800">No request found</p>
            <p className="mt-1 text-sm text-red-600">Codes are 4 alphanumeric characters.</p>
          </div>
        )}

        {loading && (
          <div className="mx-auto mt-10 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        )}

        {found && request && (
          <div className="mt-10 space-y-6">
            <Card>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted">Redemption Code</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-3xl font-bold tracking-widest text-brand-700">
                      {request.code}
                    </span>
                    <button
                      onClick={copyCode}
                      className="rounded-lg p-1.5 text-muted hover:bg-brand-50 hover:text-brand-600"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Badge variant={(statusConfig[request.status] ?? statusConfig.submitted).variant}>
                  {(statusConfig[request.status] ?? statusConfig.submitted).label}
                </Badge>
              </div>

              <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted">Service</p>
                  <p className="mt-0.5 text-sm font-medium">{request.serviceName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Submitted</p>
                  <p className="mt-0.5 text-sm font-medium">
                    {new Date(request.submittedAt).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Code valid until</p>
                  <p className="mt-0.5 text-sm font-medium">
                    {new Date(request.expiresAt).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold">Progress Timeline</h3>
              <div className="mt-6 space-y-0">
                {request.timeline.map((item, index) => (
                  <div key={item.status + item.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          item.completed
                            ? 'bg-brand-500 text-white'
                            : 'border-2 border-brand-100 bg-white text-brand-200'
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      {index < request.timeline.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[32px] ${item.completed ? 'bg-brand-500' : 'bg-brand-100'}`} />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className={`text-sm font-medium ${item.completed ? 'text-foreground' : 'text-muted'}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-muted">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {request.downloadAvailable ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
                <p className="mt-3 font-semibold text-green-800">Your document is ready!</p>
                <p className="mt-1 text-sm text-green-700">
                  Enter code <strong className="font-mono">{request.code}</strong> on the homepage to download.
                  Reusable for {CODE_VALIDITY}.
                </p>
                <Link to={`/?code=${request.code}#download`} className="mt-4 inline-block">
                  <Button variant="gold">
                    <Download className="h-4 w-4" />
                    Download Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-gold-200 bg-gold-50 p-6 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-gold-600" />
                <p className="mt-3 font-semibold text-gold-800">Still processing</p>
                <p className="mt-1 text-sm text-gold-700">
                  You&apos;ll receive SMS and email notification when your document is ready for download.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-muted">
            Need help?{' '}
            <a href="mailto:paddimi.mc@gmail.com" className="text-brand-600 hover:underline">paddimi.mc@gmail.com</a>
          </p>
        </div>
      </div>
    </>
  )
}
