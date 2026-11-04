import { MessageCircle } from 'lucide-react'
import { getWhatsAppLink } from '../config/contact'

/** Floating "Chat on WhatsApp" button shown on every public page. */
export function WhatsAppButton() {
  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Paddimi on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] p-4 font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#1EBE5A] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E] sm:px-5 sm:py-3.5 print:hidden"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  )
}
