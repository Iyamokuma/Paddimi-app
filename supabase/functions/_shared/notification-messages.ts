function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function getDocumentKind(category: string): { noun: string; label: string } {
  if (category === 'newspaper') {
    return { noun: 'publication', label: 'Newspaper publication' }
  }
  return { noun: 'affidavit', label: 'Affidavit' }
}

export function buildMessage(
  type: string,
  payload: Record<string, string>,
): { subject: string; html: string; sms: string } {
  const code = payload.code ?? ''
  const service = payload.serviceName ?? 'your document'
  const customerName = payload.customerName ?? 'Customer'
  const category = payload.category ?? 'affidavit'
  const { noun, label } = getDocumentKind(category)
  const safeName = escapeHtml(customerName)
  const safeService = escapeHtml(service)
  const safeCode = escapeHtml(code)

  switch (type) {
    case 'new_order':
      return {
        subject: `New ${label.toLowerCase()} order: ${service} (${code})`,
        html: `
          <p>A new ${noun} request has been received on Paddimi.</p>
          <p><strong>Customer:</strong> ${safeName}</p>
          <p><strong>Service:</strong> ${safeService}</p>
          <p><strong>Redemption code:</strong> ${safeCode}</p>
          <p><strong>Phone:</strong> ${escapeHtml(payload.phone ?? '—')}</p>
          <p>Please review the request in the admin dashboard and prepare the document.</p>
        `,
        sms: `New Paddimi order: ${service}. Code ${code}. Customer ${customerName}`,
      }
    case 'order_confirmed':
      return {
        subject: `Payment confirmed — your ${noun} code is ${code}`,
        html: `
          <p>Hello ${safeName},</p>
          <p>Thank you for your payment. We have received your <strong>${safeService}</strong> ${noun} request.</p>
          <p style="font-size:18px;"><strong>Your redemption code:</strong> <span style="letter-spacing:0.2em;">${safeCode}</span></p>
          <p>Keep this code safe. When your ${noun} is ready, we will email you again. You will then enter this same code on our website to download your document.</p>
          <p>Your code is valid for 1 year.</p>
        `,
        sms: `Paddimi: Payment confirmed for ${service}. Your download code: ${code}. We'll email you when it's ready.`,
      }
    case 'document_approved':
      return {
        subject: `Your ${service} is ready — download with code ${code}`,
        html: `
          <p>Hello ${safeName},</p>
          <p>Good news! Your <strong>${safeService}</strong> ${noun} is ready for download.</p>
          <p style="font-size:18px;"><strong>Your redemption code:</strong> <span style="letter-spacing:0.2em;">${safeCode}</span></p>
          <p>Visit <a href="https://paddimi.mc.com/#download">paddimi.mc.com</a>, enter your code in the Download section, and get your completed ${noun}.</p>
          <p>This is the same code you received after payment. Your code remains valid for 1 year and can be reused.</p>
        `,
        sms: `Paddimi: Your ${service} is ready. Use code ${code} at paddimi.mc.com to download.`,
      }
    default:
      return {
        subject: 'Paddimi notification',
        html: `<p>${escapeHtml(type)}</p>`,
        sms: `Paddimi notification: ${type}`,
      }
  }
}
