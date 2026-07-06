import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'

interface LogoProps {
  variant?: 'full' | 'icon' | 'compact'
  className?: string
  linkToHome?: boolean
}

export function Logo({ variant = 'full', className, linkToHome = true }: LogoProps) {
  const content = (
    <>
      {variant === 'icon' && (
        <img
          src="/logo-icon.png"
          alt="Paddimi Multi Concepts"
          className={cn('h-10 w-auto object-contain', className)}
        />
      )}

      {variant === 'compact' && (
        <div className={cn('flex items-center gap-2.5', className)}>
          <img
            src="/logo-icon.png"
            alt=""
            aria-hidden
            className="h-9 w-auto object-contain"
          />
          <div className="leading-tight">
            <span className="block text-sm font-bold tracking-wide text-brand-600">PADDIMI</span>
            <span className="block text-[10px] font-medium tracking-[0.15em] text-brand-400">MULTI CONCEPTS</span>
          </div>
        </div>
      )}

      {variant === 'full' && (
        <img
          src="/logo.png"
          alt="Paddimi Multi Concepts"
          className={cn('h-auto w-auto max-h-16 object-contain', className)}
        />
      )}
    </>
  )

  if (linkToHome) {
    return (
      <Link to="/" className="inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-lg">
        {content}
      </Link>
    )
  }

  return <div className={cn('inline-flex shrink-0 items-center', className)}>{content}</div>
}
