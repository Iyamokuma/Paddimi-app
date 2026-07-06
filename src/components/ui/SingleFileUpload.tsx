import { useCallback, useState } from 'react'
import { Upload, X, FileText, Image } from 'lucide-react'
import { cn } from '../../lib/utils'

interface SingleFileUploadProps {
  label: string
  files: File[]
  onChange: (files: File[]) => void
  accept?: string
  required?: boolean
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

export function SingleFileUpload({
  label, files, onChange, accept = '.pdf,.jpg,.jpeg,.png', required, hint,
}: SingleFileUploadProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming?.[0]) return
      onChange([incoming[0]])
    },
    [onChange],
  )

  const file = files[0]

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </p>

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
          className={cn(
            'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 transition-colors',
            dragOver ? 'border-brand-500 bg-brand-50' : 'border-border bg-brand-50/30',
          )}
        >
          <Upload className="mb-2 h-6 w-6 text-muted" />
          <p className="text-xs font-medium text-foreground">
            Drag & drop or{' '}
            <label className="cursor-pointer text-brand-600 hover:underline">
              browse
              <input type="file" className="hidden" accept={accept} onChange={(e) => handleFiles(e.target.files)} />
            </label>
          </p>
          {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
          {(() => {
            const Icon = getFileIcon(file.type)
            return <Icon className="h-5 w-5 shrink-0 text-brand-500" />
          })()}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange([])}
            className="rounded-lg p-1 text-muted hover:bg-gray-100 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
