export type NotifyChannel = 'sms' | 'email'

export function getCustomerName(formData: Record<string, unknown> | null | undefined): string {
  if (!formData) return 'Customer'
  if (formData.fullName && String(formData.fullName).trim()) {
    return String(formData.fullName).trim()
  }
  const parts = [formData.firstName, formData.middleName, formData.lastName]
    .filter((p) => p && String(p).trim())
    .map(String)
  if (parts.length > 0) return parts.join(' ')
  return 'Customer'
}

export function hasContactInfo(phone?: string, email?: string): boolean {
  const phoneOk = Boolean(phone?.trim())
  const trimmedEmail = email?.trim() ?? ''
  const emailOk = trimmedEmail.length > 0 && /\S+@\S+\.\S+/.test(trimmedEmail)
  return phoneOk || emailOk
}

export function getNotifyChannels(phone?: string, email?: string): NotifyChannel[] {
  const channels: NotifyChannel[] = []
  if (phone?.trim()) channels.push('sms')
  const trimmedEmail = email?.trim() ?? ''
  if (trimmedEmail && /\S+@\S+\.\S+/.test(trimmedEmail)) channels.push('email')
  return channels
}

/** @deprecated use getNotifyChannels */
export function getNotifyChannel(formData: Record<string, unknown> | null | undefined): NotifyChannel {
  const channels = getNotifyChannels(
    formData?.phone as string | undefined,
    formData?.email as string | undefined,
  )
  if (channels.includes('email') && !channels.includes('sms')) return 'email'
  return 'sms'
}
