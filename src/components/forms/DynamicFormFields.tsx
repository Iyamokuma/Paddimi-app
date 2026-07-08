import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { SingleFileUpload } from '../ui/SingleFileUpload'
import { LivePhotoCapture } from '../ui/LivePhotoCapture'
import { nigerianStates } from '../../data/services'
import type { FormFieldDef } from '../../types'
import { isFieldVisible } from '../../data/affidavitFields'

interface DynamicFormFieldsProps {
  fields: FormFieldDef[]
  values: Record<string, string>
  files: Record<string, File[]>
  onChange: (id: string, value: string) => void
  onFileChange: (id: string, files: File[]) => void
}

export function DynamicFormFields({
  fields, values, files, onChange, onFileChange,
}: DynamicFormFieldsProps) {
  const visible = fields.filter((f) => isFieldVisible(f, values))

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {visible.map((field) => {
        const colSpan = field.fullWidth ? 'sm:col-span-2' : ''

        if (field.type === 'livePhoto') {
          return (
            <div key={field.id} className={colSpan}>
              <LivePhotoCapture
                label={field.label}
                required={field.required}
                files={files[field.id] ?? []}
                onChange={(f) => onFileChange(field.id, f)}
                hint={field.hint}
              />
            </div>
          )
        }

        if (field.type === 'file') {
          return (
            <div key={field.id} className={colSpan}>
              <SingleFileUpload
                label={field.label}
                required={field.required}
                accept={field.accept}
                files={files[field.id] ?? []}
                onChange={(f) => onFileChange(field.id, f)}
                hint={field.hint}
              />
            </div>
          )
        }

        if (field.type === 'textarea') {
          return (
            <div key={field.id} className={colSpan}>
              <Textarea
                label={field.label}
                required={field.required}
                value={values[field.id] ?? ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder}
              />
              {field.hint && <p className="mt-1 text-xs text-muted">{field.hint}</p>}
            </div>
          )
        }

        if (field.type === 'select' || field.id === 'state') {
          const options = field.id === 'state'
            ? nigerianStates.map((s) => ({ value: s, label: s }))
            : (field.options ?? [])

          return (
            <div key={field.id} className={colSpan}>
              <Select
                label={field.label}
                required={field.required}
                placeholder={`Select ${field.label.toLowerCase()}`}
                value={values[field.id] ?? ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                options={options}
              />
              {field.hint && <p className="mt-1 text-xs text-muted">{field.hint}</p>}
            </div>
          )
        }

        return (
          <div key={field.id} className={colSpan}>
            <Input
              label={field.label}
              required={field.required}
              type={field.type === 'date' ? 'date' : field.id === 'phone' ? 'tel' : field.id === 'email' ? 'email' : 'text'}
              value={values[field.id] ?? ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              placeholder={field.placeholder}
            />
            {field.hint && <p className="mt-1 text-xs text-muted">{field.hint}</p>}
          </div>
        )
      })}
    </div>
  )
}
