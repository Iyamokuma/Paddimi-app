import type { ServiceItem } from '../types'

export const NOTIFICATION_EMAILS = [
  'paddimi.mc@gmail.com',
  'paddimi.mc@yahoo.com',
] as const

export const AFFIDAVIT_TURNAROUND = '15 minutes'
export const NEWSPAPER_TURNAROUND = '24 hours'
export const CODE_VALIDITY = '1 year'

/** States currently served for affidavit requests */
export const COVERED_STATES = ['Rivers', 'Abia'] as const

/** Affidavit pricing by state (Port Harcourt = Rivers) */
export const AFFIDAVIT_STATE_PRICES: Record<string, number> = {
  Rivers: 3500,
  Abia: 3000,
}

export const affidavitServices: ServiceItem[] = [
  {
    id: 'change-of-name',
    category: 'affidavit',
    name: 'Affidavit of Change of Name',
    description: 'Sworn declaration for official change of name, including marriage-related changes.',
    price: AFFIDAVIT_STATE_PRICES.Rivers,
    icon: 'UserPen',
  },
  {
    id: 'rearrangement-of-name',
    category: 'affidavit',
    name: 'Affidavit of Rearrangement of Name',
    description: 'Correct the order of your surname, first name, and middle name on official records.',
    price: AFFIDAVIT_STATE_PRICES.Rivers,
    icon: 'ArrowLeftRight',
  },
  {
    id: 'correction-of-name',
    category: 'affidavit',
    name: 'Affidavit of Correction of Name',
    description: 'Fix wrong spelling, omission, or addition of name on official documents.',
    price: AFFIDAVIT_STATE_PRICES.Rivers,
    icon: 'PenLine',
  },
  {
    id: 'correction-of-dob',
    category: 'affidavit',
    name: 'Affidavit of Correction of Date of Birth',
    description: 'Sworn correction of wrong date of birth on official documents.',
    price: AFFIDAVIT_STATE_PRICES.Rivers,
    icon: 'Calendar',
  },
  {
    id: 'confirmation-of-name',
    category: 'affidavit',
    name: 'Affidavit of Confirmation of Name',
    description: 'Confirm your legal name and any alternate names for official purposes.',
    price: AFFIDAVIT_STATE_PRICES.Rivers,
    icon: 'BadgeCheck',
  },
  {
    id: 'age-declaration',
    category: 'affidavit',
    name: 'Affidavit of Age Declaration',
    description: 'Declare age for a beneficiary when birth certificate is unavailable or missing.',
    price: AFFIDAVIT_STATE_PRICES.Rivers,
    icon: 'CalendarDays',
  },
  {
    id: 'declaration-of-marriage',
    category: 'affidavit',
    name: 'Affidavit of Declaration of Marriage',
    description: 'Statutory declaration of marriage under customary or Islamic law.',
    price: AFFIDAVIT_STATE_PRICES.Rivers,
    icon: 'Heart',
  },
  {
    id: 'death',
    category: 'affidavit',
    name: 'Affidavit of Death',
    description: 'Sworn declaration of death for legal and administrative purposes.',
    price: AFFIDAVIT_STATE_PRICES.Rivers,
    icon: 'Flower2',
  },
  {
    id: 'loss-of-sim',
    category: 'affidavit',
    name: 'Affidavit of Loss of SIM Card',
    description: 'Declaration of lost SIM card for network provider and recovery processes.',
    price: AFFIDAVIT_STATE_PRICES.Rivers,
    icon: 'Smartphone',
  },
  {
    id: 'change-vehicle-plate',
    category: 'affidavit',
    name: 'Affidavit for Change of Vehicle Plate Number',
    description: 'Sworn statement for change of vehicle registration plate number.',
    price: AFFIDAVIT_STATE_PRICES.Rivers,
    icon: 'Car',
  },
  {
    id: 'change-engine-number',
    category: 'affidavit',
    name: 'Affidavit of Change of Engine Number',
    description: 'Declaration for change of vehicle engine number after replacement or purchase.',
    price: AFFIDAVIT_STATE_PRICES.Rivers,
    icon: 'Cog',
  },
]

export const newspaperServices: ServiceItem[] = [
  {
    id: 'name-change-publication',
    category: 'newspaper',
    name: 'Name Change Publication',
    description: 'Newspaper publication for official name change — requires affidavit and marriage certificate.',
    price: 10000,
    turnaround: NEWSPAPER_TURNAROUND,
    icon: 'Newspaper',
    requiredDocuments: ['Affidavit', 'Marriage Certificate'],
  },
  {
    id: 'name-correction-publication',
    category: 'newspaper',
    name: 'Name Correction Publication',
    description: 'Publication for name correction — requires affidavit and NIN.',
    price: 10000,
    turnaround: NEWSPAPER_TURNAROUND,
    icon: 'PenLine',
    requiredDocuments: ['Affidavit', 'NIN'],
  },
  {
    id: 'loss-of-documents-publication',
    category: 'newspaper',
    name: 'Loss of Documents Publication',
    description: 'Public notice for lost documents such as certificates, NIN, or licences.',
    price: 60000,
    turnaround: NEWSPAPER_TURNAROUND,
    icon: 'AlertCircle',
    requiredDocuments: ['Affidavit of Loss'],
  },
  {
    id: 'public-announcements',
    category: 'newspaper',
    name: 'Public Announcements',
    description: 'General public notices for legal, community, or personal matters.',
    price: 60000,
    turnaround: NEWSPAPER_TURNAROUND,
    icon: 'Megaphone',
  },
  {
    id: 'congratulatory-messages',
    category: 'newspaper',
    name: 'Congratulatory Messages',
    description: 'Celebrate graduations, weddings, promotions, anniversaries, childbirth, and more.',
    price: 60000,
    turnaround: NEWSPAPER_TURNAROUND,
    icon: 'PartyPopper',
  },
]

export const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function getAffidavitPriceForState(state: string): number | null {
  return AFFIDAVIT_STATE_PRICES[state] ?? null
}

const NEWSPAPER_PRICES: Record<string, number> = {
  'name-change-publication': 10000,
  'name-correction-publication': 10000,
  'loss-of-documents-publication': 60000,
  'public-announcements': 60000,
  'congratulatory-messages': 60000,
}

export function getNewspaperPrice(serviceId: string): number | null {
  return NEWSPAPER_PRICES[serviceId] ?? null
}

export function getCheckoutPrice(
  category: 'affidavit' | 'newspaper',
  serviceId: string,
  options?: { coveredState?: string },
): number {
  if (category === 'affidavit') {
    const state = options?.coveredState ?? ''
    return getAffidavitPriceForState(state) ?? 0
  }
  return getNewspaperPrice(serviceId) ?? 0
}

/** 4-character alphanumeric redemption code */
export function generateRedemptionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}
