const NEWSPAPER_PRICES: Record<string, number> = {
  'name-change-publication': 10000,
  'name-correction-publication': 10000,
  'loss-of-documents-publication': 60000,
  'public-announcements': 60000,
  'congratulatory-messages': 60000,
}

const AFFIDAVIT_STATE_PRICES: Record<string, number> = {
  Rivers: 3500,
  Abia: 3000,
}

export function getServicePrice(
  serviceId: string,
  category?: string,
  coveredState?: string,
): number | null {
  if (category === 'affidavit') {
    if (!coveredState) return null
    return AFFIDAVIT_STATE_PRICES[coveredState] ?? null
  }

  if (category === 'newspaper') {
    return NEWSPAPER_PRICES[serviceId] ?? null
  }

  // Fallback for legacy calls
  return NEWSPAPER_PRICES[serviceId] ?? AFFIDAVIT_STATE_PRICES.Rivers ?? null
}

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

interface CodeLookupClient {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        maybeSingle: () => Promise<{ data: unknown }>
      }
    }
  }
}

export async function generateUniqueCode(sb: CodeLookupClient): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const code = randomCode()
    const { data } = await sb.from('service_requests').select('id').eq('redemption_code', code).maybeSingle()
    if (!data) return code
  }
  throw new Error('Unable to generate unique redemption code')
}

export function addYears(date: Date, years: number) {
  const d = new Date(date)
  d.setFullYear(d.getFullYear() + years)
  return d
}

export function addMinutes(date: Date, mins: number) {
  return new Date(date.getTime() + mins * 60_000)
}

export function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 3_600_000)
}
