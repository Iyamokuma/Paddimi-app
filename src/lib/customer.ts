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

export function getNotifyChannel(formData: Record<string, unknown> | null | undefined): NotifyChannel {
  return formData?.notifyChannel === 'email' ? 'email' : 'sms'
}

export function contactChannelValid(
  channel: NotifyChannel,
  phone?: string,
  email?: string,
): boolean {
  if (channel === 'email') {
    const trimmed = email?.trim() ?? ''
    return trimmed.length > 0 && /\S+@\S+\.\S+/.test(trimmed)
  }
  return Boolean(phone?.trim())
}
