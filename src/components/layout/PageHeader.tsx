import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  className?: string
}

export function PageHeader({ title, description, icon, className }: PageHeaderProps) {
  return (
    <div className={cn('gradient-hero relative overflow-hidden -mx-4 px-4 py-12 sm:-mx-6 sm:px-6 sm:py-14 lg:-mx-8 lg:px-8', className)}>
      <div className="absolute inset-0 pattern-dots opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(197,160,89,0.1),transparent_50%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        {icon && (
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-gold-400 ring-1 ring-white/10 backdrop-blur-sm">
            {icon}
          </div>
        )}
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        <div className="gold-line mx-auto mt-4 w-20 opacity-50" />
        {description && (
          <p className="mx-auto mt-4 max-w-lg text-brand-100/75">{description}</p>
        )}
      </div>
    </div>
  )
}
