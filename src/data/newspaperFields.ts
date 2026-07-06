import type { FormFieldDef } from '../types'

export const NEWSPAPER_SPECIFIC_FIELDS: Record<string, FormFieldDef[]> = {
  'name-change-publication': [
    { id: 'affidavitDoc', label: 'Affidavit', type: 'file', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
    { id: 'marriageCertificate', label: 'Marriage Certificate', type: 'file', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
    { id: 'publicationText', label: 'Publication Text (optional draft)', type: 'textarea', fullWidth: true },
  ],
  'name-correction-publication': [
    { id: 'affidavitDoc', label: 'Affidavit', type: 'file', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
    { id: 'ninDoc', label: 'NIN', type: 'file', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
    { id: 'publicationText', label: 'Publication Text (optional draft)', type: 'textarea', fullWidth: true },
  ],
  'loss-of-documents-publication': [
    { id: 'affidavitDoc', label: 'Affidavit of Loss', type: 'file', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
    { id: 'publicationText', label: 'Publication Text', type: 'textarea', required: true, fullWidth: true },
  ],
  'public-announcements': [
    { id: 'publicationText', label: 'Announcement Text', type: 'textarea', required: true, fullWidth: true },
    { id: 'supportingDoc', label: 'Supporting Document (optional)', type: 'file', required: false, accept: '.pdf,.jpg,.jpeg,.png' },
  ],
  'congratulatory-messages': [
    {
      id: 'occasion', label: 'Occasion', type: 'select', required: true,
      options: [
        { value: 'graduation', label: 'Graduation' },
        { value: 'wedding', label: 'Wedding' },
        { value: 'promotion', label: 'Promotion' },
        { value: 'anniversary', label: 'Anniversary Celebration' },
        { value: 'childbirth', label: 'Childbirth' },
        { value: 'other', label: 'Other' },
      ],
    },
    { id: 'publicationText', label: 'Congratulatory Message', type: 'textarea', required: true, fullWidth: true },
    { id: 'photo', label: 'Photo (optional)', type: 'file', required: false, accept: '.jpg,.jpeg,.png' },
  ],
}

export const NEWSPAPER_CONTACT_FIELDS: FormFieldDef[] = [
  { id: 'fullName', label: 'Full Name / Organisation', type: 'text', required: true },
  { id: 'phone', label: 'Phone Number', type: 'text', required: false, placeholder: '+234 801 234 5678', hint: 'Required if you choose SMS delivery' },
  { id: 'email', label: 'Email Address', type: 'text', required: false, placeholder: 'you@email.com', hint: 'Required if you choose email delivery' },
  { id: 'referralCode', label: 'Referral Code', type: 'text', required: false, placeholder: 'Optional' },
  { id: 'state', label: 'State', type: 'text', required: true },
  { id: 'preferredNewspaper', label: 'Preferred Newspaper', type: 'text', required: false, placeholder: 'e.g. The Punch, Vanguard' },
]

export function getNewspaperFields(serviceId: string): FormFieldDef[] {
  return [...NEWSPAPER_CONTACT_FIELDS, ...(NEWSPAPER_SPECIFIC_FIELDS[serviceId] ?? [])]
}

export function getNewspaperTextFields(serviceId: string): FormFieldDef[] {
  return getNewspaperFields(serviceId).filter((f) => f.type !== 'file')
}

export function getNewspaperFileFields(serviceId: string): FormFieldDef[] {
  return getNewspaperFields(serviceId).filter((f) => f.type === 'file')
}
