function getCustomerNameFromForm(formData: Record<string, unknown> | null): string {
  if (!formData) return 'Customer'
  if (formData.fullName && String(formData.fullName).trim()) return String(formData.fullName).trim()
  const parts = [formData.firstName, formData.middleName, formData.lastName]
    .filter((p) => p && String(p).trim())
    .map(String)
  return parts.length > 0 ? parts.join(' ') : 'Customer'
}

export async function notifyNewOrder(
  request: {
    id: string
    redemption_code: string
    service_name: string
    contact_phone: string | null
    contact_email: string | null
    form_data: Record<string, unknown> | null
  },
  supabaseUrl: string,
  serviceKey: string,
) {
  const notify = async (channel: 'email' | 'sms', recipient: string, notificationType: string) => {
    await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId: request.id,
        channel,
        recipient,
        notificationType,
        payload: {
          code: request.redemption_code,
          serviceName: request.service_name,
          phone: request.contact_phone ?? '',
          customerName: getCustomerNameFromForm(request.form_data),
        },
      }),
    })
  }

  await notify('email', 'paddimi.mc@gmail.com', 'new_order')

  if (request.contact_email) {
    await notify('email', request.contact_email, 'order_confirmed')
  }
  if (request.contact_phone) {
    await notify('sms', request.contact_phone, 'order_confirmed')
  }
}
