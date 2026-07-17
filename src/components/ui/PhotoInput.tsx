import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, RefreshCw, Upload, X } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../lib/utils'

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
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
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

  const capturePhoto = () => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
      setFile(file)
      stopCamera()
    }, 'image/jpeg', 0.92)
  }

  const handleUpload = (incoming: FileList | null) => {
    if (!incoming?.[0]) return
    setFile(incoming[0])
  }

  const clearPhoto = () => {
    setFile(null)
    stopCamera()
  }

  const hasPhoto = files.length > 0

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </p>
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
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

      {!hasPhoto && mode === 'upload' && (
        <div
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-brand-50/30 p-6"
        >
          <Upload className="mb-2 h-7 w-7 text-muted" />
          <p className="text-sm font-medium text-foreground">Upload from your device</p>
          <p className="mt-1 text-xs text-muted">JPG or PNG</p>
          <label className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Upload className="h-4 w-4" />
            Browse files
            <input
              type="file"
              className="hidden"
              accept={accept}
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
          <Button type="button" size="sm" className="mt-4" onClick={startCamera}>
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
            <Button type="button" variant="gold" className="flex-1" onClick={capturePhoto}>
              <Camera className="h-4 w-4" />
              Capture
            </Button>
            <Button type="button" variant="outline" onClick={stopCamera}>
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
            <p className="text-xs font-medium text-green-700">Photo ready</p>
            <Button type="button" variant="outline" size="sm" onClick={clearPhoto}>
              <RefreshCw className="h-3.5 w-3.5" />
              Change photo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
