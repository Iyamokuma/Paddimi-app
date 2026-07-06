export const SERVICE_PRICES: Record<string, number> = {
  'change-of-name': 15000,
  'rearrangement-of-name': 15000,
  'correction-of-name': 15000,
  'correction-of-dob': 15000,
  'confirmation-of-name': 15000,
  'age-declaration': 12000,
  'declaration-of-marriage': 18000,
  death: 15000,
  'loss-of-sim': 10000,
  'change-vehicle-plate': 15000,
  'change-engine-number': 15000,
  'name-change-publication': 25000,
  'name-correction-publication': 22000,
  'loss-of-documents-publication': 20000,
  'public-announcements': 18000,
  'congratulatory-messages': 15000,
}

export function getServicePrice(serviceId: string): number | null {
  return SERVICE_PRICES[serviceId] ?? null
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
