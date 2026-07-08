import type { FormFieldDef } from '../types'

export const COMMON_DEPONENT_FIELDS: FormFieldDef[] = [
  { id: 'firstName', label: 'First Name', type: 'text', required: true },
  { id: 'middleName', label: 'Middle Name', type: 'text', required: true },
  { id: 'lastName', label: 'Last Name', type: 'text', required: true },
  {
    id: 'sex', label: 'Sex', type: 'select', required: true,
    options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }],
  },
  { id: 'religion', label: 'Religion', type: 'text', required: true },
  { id: 'occupation', label: 'Occupation', type: 'text', required: true },
  { id: 'address', label: 'Address', type: 'text', required: true, fullWidth: true },
  { id: 'town', label: 'Town', type: 'text', required: true },
  { id: 'city', label: 'City', type: 'text', required: true },
  { id: 'state', label: 'State', type: 'text', required: true },
  { id: 'lga', label: 'LGA', type: 'text', required: true },
]

export const AFFIDAVIT_SPECIFIC_FIELDS: Record<string, FormFieldDef[]> = {
  'change-of-name': [
    { id: 'oldName', label: 'Old Name', type: 'text', required: true },
    { id: 'newName', label: 'New Name', type: 'text', required: true },
    {
      id: 'reason', label: 'Reason', type: 'select', required: true,
      options: [{ value: 'marriage', label: 'Marriage' }, { value: 'other', label: 'Other' }],
    },
    { id: 'spouseName', label: 'Spouse Name', type: 'text', required: true, dependsOn: { field: 'reason', value: 'marriage' } },
    { id: 'spouseAddress', label: 'Spouse Address', type: 'text', required: true, fullWidth: true, dependsOn: { field: 'reason', value: 'marriage' } },
    { id: 'dateOfMarriage', label: 'Date of Marriage', type: 'date', required: true, dependsOn: { field: 'reason', value: 'marriage' } },
    { id: 'passport', label: 'Passport Photo', type: 'livePhoto', required: true },
  ],
  'rearrangement-of-name': [
    { id: 'correctSurname', label: 'Correct Arrangement of Surname', type: 'text', required: true },
    { id: 'correctFirstName', label: 'Correct Arrangement of First Name', type: 'text', required: true },
    { id: 'correctMiddleName', label: 'Correct Arrangement of Middle Name', type: 'text', required: true },
    { id: 'documentAffected', label: 'Document Affected', type: 'text', required: true, fullWidth: true },
    { id: 'passportPhoto', label: 'Passport Photo', type: 'livePhoto', required: true },
  ],
  'correction-of-name': [
    { id: 'wrongName', label: 'Wrong Name', type: 'text', required: true },
    { id: 'correctName', label: 'Correct Name', type: 'text', required: true },
    {
      id: 'errorType', label: 'Error Type', type: 'select', required: true,
      options: [
        { value: 'omission', label: 'Omission' },
        { value: 'addition', label: 'Addition' },
        { value: 'wrong-spelling', label: 'Wrong Spelling' },
      ],
    },
    {
      id: 'nameContainingError', label: 'Name Containing Error', type: 'select', required: true,
      options: [
        { value: 'first-name', label: 'First Name' },
        { value: 'middle-name', label: 'Middle Name' },
        { value: 'last-name', label: 'Last Name' },
      ],
    },
    {
      id: 'document', label: 'Document', type: 'select', required: true,
      options: [
        { value: 'nin', label: 'National Identity' },
        { value: 'passport', label: 'International Passport' },
        { value: 'drivers-licence', label: "Driver's Licence" },
        { value: 'bvn', label: 'BVN' },
        { value: 'voters-card', label: 'Voters Card' },
      ],
    },
    { id: 'passportPhoto', label: 'Passport Photo', type: 'livePhoto', required: true },
  ],
  'correction-of-dob': [
    { id: 'wrongDateOfBirth', label: 'Wrong Date of Birth', type: 'date', required: true },
    { id: 'correctDateOfBirth', label: 'Correct Date of Birth', type: 'date', required: true },
    { id: 'errorDocument', label: 'Error Document', type: 'text', required: true, fullWidth: true },
    { id: 'passportPhoto', label: 'Passport Photo', type: 'livePhoto', required: true },
  ],
  'confirmation-of-name': [
    { id: 'nameForConfirmation', label: 'Name for Confirmation', type: 'text', required: true },
    { id: 'alternateNameForConfirmation', label: 'Alternate Name for Confirmation', type: 'text', required: true },
    { id: 'passportPhoto', label: 'Passport Photo', type: 'livePhoto', required: true },
  ],
  'age-declaration': [
    { id: 'beneficiaryName', label: "Beneficiary's Name", type: 'text', required: true },
    { id: 'placeOfBirth', label: 'Place of Birth', type: 'text', required: true },
    { id: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
    { id: 'stateOfBirth', label: 'State of Birth', type: 'text', required: true },
    { id: 'lgaOfBirth', label: 'LGA of Birth', type: 'text', required: true },
    { id: 'relationshipToBeneficiary', label: "Deponent's Relationship to Beneficiary", type: 'text', required: true, fullWidth: true },
    {
      id: 'reasonNoBirthCertificate', label: 'Reason No Birth Certificate', type: 'select', required: true,
      options: [
        { value: 'no-registry', label: 'No Birth Registry' },
        { value: 'missing', label: 'Birth Certificate is Missing' },
      ],
    },
  ],
  'declaration-of-marriage': [
    { id: 'groomsName', label: "Groom's Name", type: 'text', required: true },
    { id: 'bridesName', label: "Bride's Name", type: 'text', required: true },
    {
      id: 'relationshipWithBride', label: 'Relationship with Bride', type: 'select', required: true,
      options: [{ value: 'father', label: 'Father' }, { value: 'uncle', label: 'Uncle' }],
    },
    { id: 'dateOfMarriage', label: 'Date of Marriage', type: 'date', required: true },
    {
      id: 'customaryLaw', label: 'Customary Law', type: 'select', required: true,
      options: [
        { value: 'islamic', label: 'Islamic Law' },
        { value: 'igbo', label: 'Igbo' },
        { value: 'yoruba', label: 'Yoruba' },
      ],
    },
    { id: 'passportPhotoBride', label: 'Passport Photo of Bride', type: 'livePhoto', required: true },
    { id: 'passportPhotoGroom', label: 'Passport Photo of Groom', type: 'livePhoto', required: true },
  ],
  'death': [
    { id: 'nameOfDeceased', label: 'Name of Deceased', type: 'text', required: true },
    {
      id: 'relationshipWithDeceased', label: 'Relationship with Deceased', type: 'select', required: true,
      options: [
        { value: 'father', label: 'Father' }, { value: 'mother', label: 'Mother' },
        { value: 'son', label: 'Son' }, { value: 'daughter', label: 'Daughter' },
        { value: 'brother', label: 'Brother' }, { value: 'sister', label: 'Sister' },
        { value: 'husband', label: 'Husband' }, { value: 'wife', label: 'Wife' },
        { value: 'cousin', label: 'Cousin' }, { value: 'uncle', label: 'Uncle' },
        { value: 'aunty', label: 'Aunty' },
      ],
    },
    { id: 'dateOfDeath', label: 'Date of Death', type: 'date', required: true },
    { id: 'placeOfDeath', label: 'Place of Death', type: 'text', required: true },
    { id: 'ageOfDeceased', label: 'Age of Deceased', type: 'text', required: true },
    { id: 'causeOfDeath', label: 'Cause of Death', type: 'text', required: true, fullWidth: true },
    { id: 'beneficiaryPassport', label: "Beneficiary's Passport", type: 'file', required: true, accept: '.jpg,.jpeg,.png,.pdf' },
  ],
  'loss-of-sim': [
    { id: 'network', label: 'Network', type: 'text', required: true, placeholder: 'e.g. MTN, Airtel, Glo' },
    { id: 'simNumber', label: 'SIM Number', type: 'text', required: true },
    { id: 'dateOfLost', label: 'Date of Lost', type: 'date', required: true },
    { id: 'placeOfLost', label: 'Place of Lost', type: 'text', required: true, fullWidth: true },
    { id: 'passportPhoto', label: 'Passport Photo', type: 'livePhoto', required: true },
  ],
  'change-vehicle-plate': [
    { id: 'nameOfVehicle', label: 'Name of Vehicle', type: 'text', required: true },
    { id: 'registrationNumber', label: 'Registration Number', type: 'text', required: true },
    { id: 'chassisNo', label: 'Chassis No', type: 'text', required: true },
    { id: 'oldPlateNumber', label: 'Old Plate Number', type: 'text', required: true },
    { id: 'nameOfSeller', label: 'Name of Seller', type: 'text', required: true },
    { id: 'newPlateNumber', label: 'New Plate Number', type: 'text', required: true },
    { id: 'placeOfPurchase', label: 'Place of Purchase', type: 'text', required: true, fullWidth: true },
    { id: 'passportPhoto', label: 'Passport Photo', type: 'livePhoto', required: true },
  ],
  'change-engine-number': [
    { id: 'modelOfVehicle', label: 'Model of Vehicle', type: 'text', required: true },
    { id: 'regNoOfVehicle', label: 'Reg No of Vehicle', type: 'text', required: true },
    { id: 'chassisNo', label: 'Chassis No', type: 'text', required: true },
    { id: 'oldEngineNo', label: 'Old Engine No', type: 'text', required: true },
    { id: 'nameOfSeller', label: 'Name of Seller', type: 'text', required: true },
    { id: 'newEngineNo', label: 'New Engine No', type: 'text', required: true },
    { id: 'placeOfPurchase', label: 'Place of Purchase of Engine', type: 'text', required: true, fullWidth: true },
    { id: 'passportPhoto', label: 'Passport Photo', type: 'livePhoto', required: true },
  ],
}

export function getAffidavitFields(serviceId: string): FormFieldDef[] {
  return [...COMMON_DEPONENT_FIELDS, ...(AFFIDAVIT_SPECIFIC_FIELDS[serviceId] ?? [])]
}

export function getTextFields(fields: FormFieldDef[]): FormFieldDef[] {
  return fields.filter((f) => f.type !== 'file' && f.type !== 'livePhoto')
}

export function getFileFields(fields: FormFieldDef[]): FormFieldDef[] {
  return fields.filter((f) => f.type === 'file' || f.type === 'livePhoto')
}

export function isFieldVisible(field: FormFieldDef, values: Record<string, string>): boolean {
  if (!field.dependsOn) return true
  return values[field.dependsOn.field] === field.dependsOn.value
}

export function validateFields(
  fields: FormFieldDef[],
  values: Record<string, string>,
  files: Record<string, File[]>,
): boolean {
  return fields.every((field) => {
    if (!isFieldVisible(field, values)) return true
    if (!field.required) return true
    if (field.type === 'file' || field.type === 'livePhoto') return (files[field.id]?.length ?? 0) > 0
    return !!values[field.id]?.trim()
  })
}

export const CONTACT_FIELDS: FormFieldDef[] = [
  { id: 'phone', label: 'Phone Number', type: 'text', required: false, placeholder: '+234 801 234 5678', hint: 'Enter phone, email, or both' },
  { id: 'email', label: 'Email Address', type: 'text', required: false, placeholder: 'you@email.com', hint: 'Updates are sent to every contact you provide' },
  { id: 'referralCode', label: 'Referral Code', type: 'text', required: false, placeholder: 'Optional' },
]
