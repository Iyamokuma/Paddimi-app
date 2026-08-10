const ORDINAL_SUFFIXES: Record<number, string> = {
  1: 'st', 2: 'nd', 3: 'rd',
}

function ordinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th'
  return ORDINAL_SUFFIXES[day % 10] ?? 'th'
}

/** e.g. 1st Jan 1983 */
export function formatOrdinalDate(date: Date): string {
  const day = date.getDate()
  const month = date.toLocaleString('en-GB', { month: 'short' })
  const year = date.getFullYear()
  return `${day}${ordinalSuffix(day)} ${month} ${year}`
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

const SELECT_VALUE_LABELS: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  christian: 'Christian',
  muslim: 'Muslim',
  other: 'Other',
  omission: 'Omission',
  addition: 'Addition',
  'wrong-spelling': 'Wrong Spelling',
  'first-name': 'First Name',
  'middle-name': 'Middle Name',
  'last-name': 'Last Name',
  nin: 'National Identity',
  passport: 'International Passport',
  'drivers-licence': "Driver's Licence",
  bvn: 'BVN',
  'voters-card': 'Voters Card',
  marriage: 'Marriage',
  'the-guardian': 'The Guardian',
  'the-sun': 'The Sun',
}

/** Format stored form values for admin display (dates → 1st Jan 1983). */
export function formatFormFieldValue(key: string, value: string): string {
  if (!value) return value

  if (SELECT_VALUE_LABELS[value]) {
    return SELECT_VALUE_LABELS[value]
  }

  if (ISO_DATE.test(value) || /date/i.test(key)) {
    const parsed = ISO_DATE.test(value)
      ? new Date(`${value}T12:00:00`)
      : new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return formatOrdinalDate(parsed)
    }
  }

  return value
}

export function formatFieldLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}
