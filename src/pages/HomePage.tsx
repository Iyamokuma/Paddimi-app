import {
  ArrowRight,
  Clock,
  Shield,
  Smartphone,
  FileText,
  Newspaper,
  CheckCircle2,
  Download,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DownloadSection } from '../components/DownloadSection'
import {
  affidavitServices, newspaperServices, formatNaira,
  AFFIDAVIT_TURNAROUND, NEWSPAPER_TURNAROUND,
} from '../data/services'

const stats = [
  { value: '11', label: 'Affidavit Types' },
  { value: '5', label: 'Publication Types' },
  { value: AFFIDAVIT_TURNAROUND, label: 'Affidavit Turnaround' },
  { value: NEWSPAPER_TURNAROUND, label: 'Publication Turnaround' },
]

const steps = [
  { icon: FileText, title: 'Choose Service', desc: 'Select from 11 affidavit types or 5 newspaper publication options.' },
  { icon: Smartphone, title: 'Submit & Pay', desc: 'Complete the required fields, upload documents, and pay securely online.' },
  { icon: CheckCircle2, title: 'Get Your Code', desc: 'Receive a 4-character redemption code via SMS and email when ready.' },
  { icon: Download, title: 'Download Document', desc: 'Enter your code on this page to download — electronic delivery only.' },
]

export function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(197,160,89,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.04),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-6 flex flex-col gap-2 sm:inline-flex sm:flex-row sm:items-stretch sm:overflow-hidden sm:rounded-full sm:border sm:border-white/15 sm:bg-white/5 sm:backdrop-blur-md">
                <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-brand-100 backdrop-blur-sm sm:rounded-none sm:border-0 sm:bg-transparent sm:px-5">
                  <Shield className="h-4 w-4 shrink-0 text-gold-400" />
                  Paddimi Multi Concept
                </span>
                <span className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-4 py-2 text-sm font-semibold text-gold-100 backdrop-blur-sm sm:rounded-none sm:border-0 sm:border-l sm:border-white/10 sm:bg-gold-400/15 sm:px-5">
                  <Clock className="h-4 w-4 shrink-0 text-gold-400" />
                  Affidavit in 15 minutes
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-[3.25rem] text-balance">
                Genuine affidavits &amp; newspaper publications —{' '}
                <span className="text-gold-400">entirely online</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100/75">
                Genuine affidavits delivered fast. No account, no office visits — submit, pay, and download with your redemption code.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/affidavit">
                  <Button variant="gold" size="lg">
                    Request Affidavit
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/newspaper">
                  <Button variant="outline" size="lg" className="border-white/20 bg-white/5 text-white hover:border-gold-400/40 hover:bg-white/10">
                    <Newspaper className="h-5 w-5" />
                    Newspaper Publication
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-brand-200/60">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gold-400" />
                  Affidavits in {AFFIDAVIT_TURNAROUND}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gold-400" />
                  Publications in {NEWSPAPER_TURNAROUND}
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gold-400" />
                  Secure payment
                </span>
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-gold-400" />
                  Electronic download only
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none lg:justify-self-end">
              <div className="absolute -inset-3 rounded-[1.75rem] bg-gold-400/25 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border-2 border-white/20 bg-black shadow-2xl shadow-black/30 ring-1 ring-white/30">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/hero-image.jpg"
                  aria-label="Business professionals signing legal documents"
                  className="aspect-[4/3] w-full object-cover object-center"
                >
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-surface-elevated">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-6 py-8 text-center sm:py-10">
              <p className="text-2xl font-bold text-brand-600 sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Download */}
      <DownloadSection />

      {/* How it works */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">Simple Process</p>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">How it works</h2>
            <div className="gold-line mx-auto mt-4 w-24 opacity-60" />
            <p className="mx-auto mt-5 max-w-2xl text-muted">
              From request to download — fully digital, no physical office visits.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-gold-500">
                  Step {i + 1}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affidavit services */}
      <section className="gradient-purple-soft py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">Services</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Affidavit Services</h2>
              <p className="mt-3 max-w-xl text-muted">
                11 genuine affidavit types — ready in {AFFIDAVIT_TURNAROUND}. Each form captures the exact fields required.
              </p>
            </div>
            <Link to="/affidavit">
              <Button variant="secondary">
                Request Affidavit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {affidavitServices.map((service) => (
              <Card key={service.id} hover className="!p-5">
                <h3 className="font-semibold leading-snug">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
                  {service.description}
                </p>
                <p className="mt-3 text-xs font-medium text-green-600">
                  <Clock className="mr-1 inline h-3 w-3" />
                  {AFFIDAVIT_TURNAROUND}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newspaper services */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">Publications</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Newspaper Publications</h2>
              <p className="mt-3 max-w-xl text-muted">
                5 publication types — {NEWSPAPER_TURNAROUND} turnaround, or as scheduled by the newspaper.
              </p>
            </div>
            <Link to="/newspaper">
              <Button variant="secondary">
                Place Publication
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newspaperServices.map((service) => (
              <Card key={service.id} hover className="!p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-snug">{service.name}</h3>
                  <span className="shrink-0 rounded-lg bg-brand-50 px-2 py-0.5 text-sm font-bold text-brand-600">
                    {formatNaira(service.price)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
                  {service.description}
                </p>
                <p className="mt-3 text-xs font-medium text-green-600">
                  <Clock className="mr-1 inline h-3 w-3" />
                  {service.turnaround}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.1),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to get started?</h2>
          <div className="gold-line mx-auto mt-5 w-32 opacity-50" />
          <p className="mt-5 text-brand-100/70">
            No account needed. Enter phone, email, or both. Download documents electronically with your 4-character code.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/affidavit">
              <Button variant="gold" size="lg">Request Affidavit</Button>
            </Link>
            <a href="#download">
              <Button variant="outline" size="lg" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                <Download className="h-5 w-5" />
                Download Document
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
