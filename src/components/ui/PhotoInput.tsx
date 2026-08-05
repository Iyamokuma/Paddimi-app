import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, Loader2, RefreshCw, Upload } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../lib/utils'
import { compressImageFile, formatPhotoSize } from '../../lib/imageCompression'

type PhotoMode = 'upload' | 'camera'

interface PhotoInputProps {
  label: string
  files: File[]
  onChange: (files: File[]) => void
  accept?: string
  required?: boolean
  hint?: string
}

export function PhotoInput({
  label, files, onChange, accept = '.jpg,.jpeg,.png', required, hint,
}: PhotoInputProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)
  const [mode, setMode] = useState<PhotoMode>('camera')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const setFile = useCallback((file: File | null) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    if (file) {
      const url = URL.createObjectURL(file)
      previewUrlRef.current = url
      setPreviewUrl(url)
      onChange([file])
    } else {
      setPreviewUrl(null)
      onChange([])
    }
  }, [onChange])

  useEffect(() => () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  const handlePhoto = async (incoming: FileList | null, input?: HTMLInputElement | null) => {
    if (!incoming?.[0]) return

    setProcessing(true)
    setError('')
    try {
      const file = await compressImageFile(incoming[0])
      setFile(file)
    } catch {
      setError('Could not process that image. Try again with a JPG or PNG photo.')
    } finally {
      setProcessing(false)
      if (input) input.value = ''
    }
  }

  const openPhoneCamera = () => {
    setError('')
    cameraInputRef.current?.click()
  }

  const clearPhoto = () => {
    setFile(null)
    setError('')
  }

  const hasPhoto = files.length > 0
  const photoSizeLabel = hasPhoto ? formatPhotoSize(files[0].size) : null
  const defaultHint = 'Take a photo with your phone camera — it will be resized automatically for upload'

  return (
    <div className="space-y-3">
      <input
        ref={cameraInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        capture="user"
        onChange={(e) => handlePhoto(e.target.files, e.target)}
      />

      <div>
        <p className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </p>
        <p className="mt-1 text-xs text-muted">{hint ?? defaultHint}</p>
      </div>

      {!hasPhoto && (
        <div className="flex rounded-xl border border-border bg-brand-50/40 p-1">
          {([
            { id: 'camera' as const, label: 'Take photo', icon: Camera },
            { id: 'upload' as const, label: 'Upload photo', icon: Upload },
          ]).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setMode(tab.id); setError('') }}
              disabled={processing}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                mode === tab.id
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-muted hover:text-foreground',
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
      )}

      {processing && (
        <div className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
          <Loader2 className="h-4 w-4 animate-spin" />
          Optimizing photo for upload…
        </div>
      )}

      {!hasPhoto && mode === 'camera' && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-brand-50/30 p-6">
          <Camera className="mb-2 h-7 w-7 text-brand-500" />
          <p className="text-sm font-medium text-foreground">Take a photo with your phone</p>
          <p className="mt-1 text-xs text-muted">Your phone camera will open — use the front camera in good lighting</p>
          <Button type="button" size="sm" className="mt-4" onClick={openPhoneCamera} disabled={processing}>
            <Camera className="h-4 w-4" />
            Open camera
          </Button>
        </div>
      )}

      {!hasPhoto && mode === 'upload' && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-brand-50/30 p-6">
          <Upload className="mb-2 h-7 w-7 text-muted" />
          <p className="text-sm font-medium text-foreground">Upload from your gallery</p>
          <p className="mt-1 text-xs text-muted">Choose an existing photo from your device</p>
          <label className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Upload className="h-4 w-4" />
            Browse files
            <input
              type="file"
              className="hidden"
              accept={accept}
              disabled={processing}
              onChange={(e) => handlePhoto(e.target.files, e.target)}
            />
          </label>
        </div>
      )}

      {hasPhoto && previewUrl && (
        <div className="overflow-hidden rounded-xl border border-green-200 bg-green-50/30">
          <img src={previewUrl} alt={label} className="aspect-[4/3] w-full object-cover" />
          <div className="flex items-center justify-between gap-2 p-3">
            <p className="text-xs font-medium text-green-700">
              Photo ready{photoSizeLabel ? ` · ${photoSizeLabel}` : ''}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={clearPhoto} disabled={processing}>
              <RefreshCw className="h-3.5 w-3.5" />
              Change photo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
