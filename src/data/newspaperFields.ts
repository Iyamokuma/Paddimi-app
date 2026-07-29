import type { FormFieldDef } from '../types'

/** Newspapers available for publication, selected before choosing a publication type */
export const NEWSPAPER_OPTIONS = [
  { value: 'the-guardian', label: 'The Guardian' },
  { value: 'the-punch', label: 'The Punch' },
  { value: 'the-vanguard', label: 'The Vanguard' },
  { value: 'the-sun', label: 'The Sun' },
  { value: 'the-nation', label: 'The Nation' },
]

export const RELIGION_OPTIONS = [
  { value: 'christian', label: 'Christian' },
  { value: 'muslim', label: 'Muslim' },
  { value: 'other', label: 'Other' },
]

export const NEWSPAPER_SPECIFIC_FIELDS: Record<string, FormFieldDef[]> = {
  'name-change-publication': [
    { id: 'oldName', label: 'Old Name', type: 'text', required: true },
    { id: 'newName', label: 'New Name', type: 'text', required: true },
    {
      id: 'reasonForChange', label: 'Reason for Change', type: 'select', required: true,
      options: [{ value: 'marriage', label: 'Marriage' }],
    },
    { id: 'marriageCertificate', label: 'Marriage Certificate', type: 'file', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
  ],
  'name-correction-publication': [
    { id: 'wrongName', label: 'Wrong Name', type: 'text', required: true },
    { id: 'correctName', label: 'Correct Name', type: 'text', required: true },
    { id: 'affectedDocument', label: 'Affected Document', type: 'text', required: true, placeholder: 'e.g. NIN, International Passport, WAEC Certificate' },
    {
      id: 'whoToTakeNote', label: 'Who Should Take Note', type: 'select', required: true,
      options: [
        { value: 'general-public-relevant-authorities', label: 'General Public and Relevant Authorities' },
        { value: 'other', label: 'Others' },
      ],
    },
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
  { id: 'religion', label: 'Religion', type: 'select', required: true, options: RELIGION_OPTIONS },
  { id: 'email', label: 'Email Address', type: 'text', required: true, placeholder: 'you@email.com', hint: 'Required — your code and download link are sent here' },
  { id: 'phone', label: 'Phone Number (optional)', type: 'text', required: false, placeholder: '+234 801 234 5678', hint: 'Optional — for SMS updates if provided' },
  { id: 'referralCode', label: 'Referral Code', type: 'text', required: false, placeholder: 'Optional' },
  { id: 'state', label: 'State', type: 'text', required: true },
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
