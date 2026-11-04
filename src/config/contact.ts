/** Customer support WhatsApp line: 0703 805 6560 */
export const WHATSAPP_NUMBER = '2347038056560'
export const WHATSAPP_DISPLAY = '0703 805 6560'

const DEFAULT_WHATSAPP_MESSAGE = 'Hello Paddimi, I need help with an affidavit or newspaper publication.'

/** wa.me link that opens a chat with the support line and a pre-filled message. */
export function getWhatsAppLink(message: string = DEFAULT_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
