export type ServiceCategory = 'affidavit' | 'newspaper'

export type RequestStatus =
  | 'pending_payment'
  | 'submitted'
  | 'processing'
  | 'approved'
  | 'published'
  | 'cancelled'

export type FieldType = 'text' | 'date' | 'select' | 'textarea' | 'file' | 'livePhoto'

export interface FieldOption {
  value: string
  label: string
}

export interface FormFieldDef {
  id: string
  label: string
  type: FieldType
  required?: boolean
  options?: FieldOption[]
  placeholder?: string
  hint?: string
  fullWidth?: boolean
  accept?: string
  dependsOn?: { field: string; value: string }
}

export interface ServiceItem {
  id: string
  category: ServiceCategory
  name: string
  description: string
  price: number
  turnaround?: string
  icon: string
  requiredDocuments?: string[]
}

export interface ContactInfo {
  phone: string
  email: string
  referralCode: string
}

export interface TrackedRequest {
  code: string
  serviceName: string
  category: ServiceCategory
  status: RequestStatus
  submittedAt: string
  estimatedReady: string
  customerName: string
  downloadAvailable: boolean
  expiresAt: string
  timeline: { status: RequestStatus; label: string; date: string; completed: boolean }[]
}

export type FormValues = Record<string, string>

export type FileValues = Record<string, File[]>
