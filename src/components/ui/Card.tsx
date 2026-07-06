import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  selected?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover, selected, onClick }: CardProps) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-border bg-surface-elevated p-6 text-left transition-all duration-200 shadow-sm shadow-brand-900/[0.03]',
        hover && 'hover:border-brand-300 hover:shadow-md hover:shadow-brand-500/8 cursor-pointer',
        selected && 'border-brand-500 ring-2 ring-brand-500/20 shadow-md shadow-brand-500/10',
        onClick && 'w-full',
        className,
      )}
    >
      {children}
    </Component>
  )
}
