import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { trackRequestByCode, getDocumentDownloadUrl } from '../lib/api/requests'
import type { TrackedRequest } from '../types'

export function DownloadSection() {
  const [searchParams] = useSearchParams()
  const [code, setCode] = useState('')
  const [searched, setSearched] = useState(false)
  const [request, setRequest] = useState<TrackedRequest | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

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

  const canDownload = request?.downloadAvailable ?? false

  const handleDownload = async () => {
    if (!canDownload) return
    setDownloading(true)
    try {
      const url = await getDocumentDownloadUrl(code)
      if (url && url !== '#demo-download') {
        window.open(url, '_blank')
      }
      setDownloaded(true)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section id="download" className="border-y border-border bg-surface-elevated py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
          <Download className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-foreground sm:text-3xl">Download Your Document</h2>
        <div className="gold-line mx-auto mt-4 w-20 opacity-60" />
        <p className="mt-4 text-muted">
          Enter your 4-character redemption code below to download your completed affidavit or publication.
          Documents are delivered electronically — no office visit required.
        </p>

        <div className="mt-8 flex gap-3">
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4))
              setSearched(false)
              setDownloaded(false)
            }}
            placeholder="XXXX"
            maxLength={4}
            className="font-mono text-xl tracking-[0.3em] uppercase text-center"
          />
          <Button
            variant="gold"
            onClick={() => setSearched(true)}
            disabled={code.length < 4}
          >
            Verify
          </Button>
        </div>

        {loading && (
          <div className="mt-6 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        )}

        {searched && !loading && !request && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Code not found</p>
                <p className="mt-1 text-sm text-red-600">Check your 4-character code and try again.</p>
              </div>
            </div>
          </div>
        )}

        {request && !request.downloadAvailable && (
          <div className="mt-6 rounded-2xl border border-gold-200 bg-gold-50 p-5 text-left">
            <div className="flex items-start gap-3">
              <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-gold-600" />
              <div>
                <p className="font-medium text-gold-800">Still processing</p>
                <p className="mt-1 text-sm font-medium text-gold-800">{request.serviceName}</p>
                <p className="mt-1 text-sm text-gold-700">
                  Your {request.category === 'newspaper' ? 'publication' : 'affidavit'} is not ready yet.
                  We will email you when it is done. Then return here and enter your redemption code{' '}
                  <span className="font-mono font-semibold">{request.code}</span> to download.
                </p>
              </div>
            </div>
          </div>
        )}

        {canDownload && !downloaded && request && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">
            <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
            <p className="mt-3 font-semibold text-green-800">{request.serviceName} is ready</p>
            <p className="mt-1 text-sm text-green-700">
              Code valid until {new Date(request.expiresAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}.
              You can download multiple times during this period.
            </p>
            <Button
              variant="gold"
              size="lg"
              className="mt-5"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Preparing download…</>
              ) : (
                <><Download className="h-5 w-5" /> Download Document</>
              )}
            </Button>
          </div>
        )}

        {downloaded && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
            <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
            <p className="mt-3 font-semibold text-green-800">Download started</p>
            <p className="mt-1 text-sm text-green-700">
              Your document has been downloaded. You can use the same code again anytime within 1 year.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
