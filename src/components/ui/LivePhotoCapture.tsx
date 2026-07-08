import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, RefreshCw, X } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../lib/utils'

interface LivePhotoCaptureProps {
  label: string
  files: File[]
  onChange: (files: File[]) => void
  required?: boolean
  hint?: string
}

export function LivePhotoCapture({
  label, files, onChange, required, hint,
}: LivePhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [active, setActive] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setActive(false)
  }, [])

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
      setError('Camera access is required. Allow camera permission or use a device with a front camera.')
    }
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
      const file = new File([blob], `live-photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(file))
      onChange([file])
      stopCamera()
    }, 'image/jpeg', 0.92)
  }

  const retake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    onChange([])
    startCamera()
  }

  const captured = files.length > 0

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </p>
      <p className="text-xs text-muted">
        {hint ?? 'Take a live photo with your camera — file uploads are not accepted for passport photos.'}
      </p>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
      )}

      {!captured && !active && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-brand-50/30 p-6">
          <Camera className="mb-3 h-8 w-8 text-brand-500" />
          <p className="text-sm font-medium text-foreground">Instant camera capture</p>
          <p className="mt-1 text-xs text-muted">Position your face clearly in good lighting</p>
          <Button type="button" size="sm" className="mt-4" onClick={startCamera}>
            <Camera className="h-4 w-4" />
            Open Camera
          </Button>
        </div>
      )}

      {active && !captured && (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-border bg-black">
            <video ref={videoRef} className="aspect-[4/3] w-full object-cover" playsInline muted />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="gold" className="flex-1" onClick={capturePhoto}>
              <Camera className="h-4 w-4" />
              Capture Photo
            </Button>
            <Button type="button" variant="outline" onClick={stopCamera}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {captured && previewUrl && (
        <div className={cn('overflow-hidden rounded-xl border border-green-200 bg-green-50/30')}>
          <img src={previewUrl} alt="Captured passport" className="aspect-[4/3] w-full object-cover" />
          <div className="flex items-center justify-between gap-2 p-3">
            <p className="text-xs font-medium text-green-700">Photo captured</p>
            <Button type="button" variant="outline" size="sm" onClick={retake}>
              <RefreshCw className="h-3.5 w-3.5" />
              Retake
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
