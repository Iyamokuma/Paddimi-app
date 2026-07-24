import { Link } from 'react-router-dom'
import { Logo } from '../Logo'

const affidavitTypes = [
  'Change of Name',
  'Rearrangement of Name',
  'Correction of Name',
  'Correction of Date of Birth',
  'Confirmation of Name',
  'Age Declaration',
  'Declaration of Marriage',
  'Affidavit of Death',
  'Loss of SIM Card',
  'Change of Vehicle Plate',
  'Change of Engine Number',
]

export function Footer() {
  return (
    <footer className="gradient-hero relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(197,160,89,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.03),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="inline-block rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
              <Logo variant="full" linkToHome={false} className="max-h-16" />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-brand-100/70">
              Digital affidavits and newspaper publications — delivered electronically across Nigeria.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-gold-400">Services</h4>
            <ul className="space-y-2.5 text-sm text-brand-100/70">
              <li><Link to="/affidavit" className="transition-colors hover:text-gold-300">Request Affidavit</Link></li>
              <li><Link to="/newspaper" className="transition-colors hover:text-gold-300">Newspaper Publication</Link></li>
              <li><Link to="/track" className="transition-colors hover:text-gold-300">Track Request</Link></li>
              <li><a href="/#download" className="transition-colors hover:text-gold-300">Download Document</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-gold-400">Affidavit Types</h4>
            <ul className="space-y-2 text-sm text-brand-100/70">
              {affidavitTypes.map((type) => (
                <li key={type}>{type}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gold-line mt-12 opacity-40" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <p className="text-xs text-brand-200/50">
              &copy; {new Date().getFullYear()} Paddimi Multi Concepts. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-start">
              <Link to="/privacy" className="text-xs text-brand-200/70 transition-colors hover:text-gold-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-brand-200/70 transition-colors hover:text-gold-300">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
          <p className="text-xs text-brand-200/50">
            Built by timzdigital
          </p>
        </div>
      </div>
    </footer>
  )
}
