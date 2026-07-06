import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info'
  className?: string
}

const variants = {
  default: 'bg-brand-50 text-brand-700 border border-brand-100',
  success: 'bg-green-50 text-green-700 border border-green-200',
  warning: 'bg-gold-50 text-gold-600 border border-gold-200',
  info: 'bg-brand-100 text-brand-600 border border-brand-200',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
