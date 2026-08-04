import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, Loader2, RefreshCw, Upload, X } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../lib/utils'
import { compressImageFile, compressVideoFrame, formatPhotoSize } from '../../lib/imageCompression'

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
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [mode, setMode] = useState<PhotoMode>('upload')
  const [active, setActive] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setActive(false)
  }, [])

  const setFile = useCallback((file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
      onChange([file])
    } else {
      setPreviewUrl(null)
      onChange([])
    }
  }, [onChange, previewUrl])

  useEffect(() => () => {
    stopCamera()
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [stopCamera, previewUrl])

  const startCamera = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // Lower preview resolution — the saved photo is resized/compressed separately.
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setActive(true)
    } catch {
      setError('Could not access camera. Try uploading a photo instead.')
    }
  }

  const switchMode = (next: PhotoMode) => {
    stopCamera()
    setMode(next)
    setError('')
  }

  const capturePhoto = async () => {
    const video = videoRef.current
    if (!video) return

    setProcessing(true)
    setError('')
    try {
      const file = await compressVideoFrame(video)
      setFile(file)
      stopCamera()
    } catch {
      setError('Could not capture photo. Try again or upload from your device.')
    } finally {
      setProcessing(false)
    }
  }

  const handleUpload = async (incoming: FileList | null) => {
    if (!incoming?.[0]) return

    setProcessing(true)
    setError('')
    try {
      const file = await compressImageFile(incoming[0])
      setFile(file)
    } catch {
      setError('Could not process that image. Try another JPG or PNG photo.')
    } finally {
      setProcessing(false)
    }
  }

  const clearPhoto = () => {
    setFile(null)
    stopCamera()
    setError('')
  }

  const hasPhoto = files.length > 0
  const photoSizeLabel = hasPhoto ? formatPhotoSize(files[0].size) : null
  const defaultHint = 'JPG or PNG — photos are automatically resized for faster upload'

  return (
    <div className="space-y-3">
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
            { id: 'upload' as const, label: 'Upload photo', icon: Upload },
            { id: 'camera' as const, label: 'Take photo', icon: Camera },
          ]).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchMode(tab.id)}
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

      {!hasPhoto && mode === 'upload' && (
        <div
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-brand-50/30 p-6"
        >
          <Upload className="mb-2 h-7 w-7 text-muted" />
          <p className="text-sm font-medium text-foreground">Upload from your device</p>
          <p className="mt-1 text-xs text-muted">Large photos are automatically compressed</p>
          <label className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Upload className="h-4 w-4" />
            Browse files
            <input
              type="file"
              className="hidden"
              accept={accept}
              disabled={processing}
              onChange={(e) => handleUpload(e.target.files)}
            />
          </label>
        </div>
      )}

      {!hasPhoto && mode === 'camera' && !active && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-brand-50/30 p-6">
          <Camera className="mb-2 h-7 w-7 text-brand-500" />
          <p className="text-sm font-medium text-foreground">Take an instant photo</p>
          <p className="mt-1 text-xs text-muted">Use your front camera in good lighting</p>
          <Button type="button" size="sm" className="mt-4" onClick={startCamera} disabled={processing}>
            <Camera className="h-4 w-4" />
            Open camera
          </Button>
        </div>
      )}

      {!hasPhoto && mode === 'camera' && active && (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-border bg-black">
            <video ref={videoRef} className="aspect-[4/3] w-full object-cover" playsInline muted />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="gold"
              className="flex-1"
              onClick={capturePhoto}
              disabled={processing}
            >
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              {processing ? 'Saving…' : 'Capture'}
            </Button>
            <Button type="button" variant="outline" onClick={stopCamera} disabled={processing}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
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
