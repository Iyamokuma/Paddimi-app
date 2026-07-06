import { useCallback, useState } from 'react'
import { Upload, X, FileText, Image } from 'lucide-react'
import { cn } from '../../lib/utils'

interface FileUploadProps {
  label?: string
  files: File[]
  onChange: (files: File[]) => void
  accept?: string
  maxFiles?: number
  hint?: string
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return Image
  return FileText
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({
  label,
  files,
  onChange,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  maxFiles = 5,
  hint,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return
      const newFiles = Array.from(incoming).slice(0, maxFiles - files.length)
      onChange([...files, ...newFiles])
    },
    [files, maxFiles, onChange],
  )

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-sm font-medium text-foreground">
          {label}
          <span className="ml-0.5 text-red-500">*</span>
        </p>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors',
          dragOver ? 'border-brand-500 bg-brand-50' : 'border-border bg-brand-50/30',
          files.length >= maxFiles && 'pointer-events-none opacity-50',
        )}
      >
        <Upload className="mb-3 h-8 w-8 text-muted" />
        <p className="text-sm font-medium text-foreground">
          Drag & drop files here, or{' '}
          <label className="cursor-pointer text-brand-600 hover:underline">
            browse
            <input
              type="file"
              className="hidden"
              accept={accept}
              multiple
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </p>
        <p className="mt-1 text-xs text-muted">
          {hint || `PDF, JPG, PNG up to 10MB · Max ${maxFiles} files`}
        </p>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => {
            const Icon = getFileIcon(file.type)
            return (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3"
              >
                <Icon className="h-5 w-5 shrink-0 text-brand-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="rounded-lg p-1 text-muted hover:bg-gray-100 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
