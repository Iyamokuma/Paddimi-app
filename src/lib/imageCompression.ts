/** Passport-style photos: enough detail for affidavits, small enough for fast upload */
const PASSPORT_MAX_WIDTH = 800
const PASSPORT_MAX_HEIGHT = 800
const PASSPORT_JPEG_QUALITY = 0.78
const PASSPORT_MAX_BYTES = 800 * 1024 // ~800 KB

export interface CompressImageOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxBytes?: number
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image'))
    }
    img.src = url
  })
}

function scaleDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height }
  }
  const ratio = Math.min(maxWidth / width, maxHeight / height)
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  }
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality)
  })
}

function drawToCanvas(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  maxWidth: number,
  maxHeight: number,
): HTMLCanvasElement {
  const { width, height } = scaleDimensions(sourceWidth, sourceHeight, maxWidth, maxHeight)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not prepare image')
  ctx.drawImage(source, 0, 0, width, height)
  return canvas
}

async function canvasToCompressedFile(
  canvas: HTMLCanvasElement,
  fileName: string,
  quality: number,
  maxBytes: number,
): Promise<File> {
  let currentQuality = quality
  let blob = await canvasToJpegBlob(canvas, currentQuality)
  if (!blob) throw new Error('Could not compress image')

  while (blob.size > maxBytes && currentQuality > 0.5) {
    currentQuality -= 0.08
    blob = (await canvasToJpegBlob(canvas, currentQuality)) ?? blob
  }

  const baseName = fileName.replace(/\.[^.]+$/, '') || 'photo'
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
}

/**
 * Resize and re-encode an image file as JPEG so passport photos upload quickly
 * without losing the detail needed for affidavit processing.
 */
export async function compressImageFile(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  const maxWidth = options.maxWidth ?? PASSPORT_MAX_WIDTH
  const maxHeight = options.maxHeight ?? PASSPORT_MAX_HEIGHT
  const maxBytes = options.maxBytes ?? PASSPORT_MAX_BYTES
  const quality = options.quality ?? PASSPORT_JPEG_QUALITY

  const img = await loadImageFromFile(file)
  const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight, maxWidth, maxHeight)
  return canvasToCompressedFile(canvas, file.name, quality, maxBytes)
}

/**
 * Capture frame from a live camera video element and return a compressed JPEG file.
 */
export async function compressVideoFrame(
  video: HTMLVideoElement,
  fileName = `camera-photo-${Date.now()}.jpg`,
  options: CompressImageOptions = {},
): Promise<File> {
  const maxWidth = options.maxWidth ?? PASSPORT_MAX_WIDTH
  const maxHeight = options.maxHeight ?? PASSPORT_MAX_HEIGHT
  const maxBytes = options.maxBytes ?? PASSPORT_MAX_BYTES
  const quality = options.quality ?? PASSPORT_JPEG_QUALITY

  if (!video.videoWidth || !video.videoHeight) {
    throw new Error('Camera is not ready yet')
  }

  const canvas = drawToCanvas(video, video.videoWidth, video.videoHeight, maxWidth, maxHeight)
  return canvasToCompressedFile(canvas, fileName, quality, maxBytes)
}

export function formatPhotoSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
