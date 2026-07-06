import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Search, Download } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Logo } from '../Logo'

const navLinks = [
  { to: '/affidavit', label: 'Request Affidavit' },
  { to: '/newspaper', label: 'Newspaper Publication' },
  { to: '/track', label: 'Track Request' },
  { to: '/#download', label: 'Download', external: true },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100/80 bg-surface-elevated/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo variant="compact" />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.to}
                href={link.to}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-brand-50/60 hover:text-brand-600"
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-muted hover:bg-brand-50/60 hover:text-brand-600',
                  )
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/track">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4" />
              Track
            </Button>
          </Link>
          <a href="/#download">
            <Button variant="gold" size="sm">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </a>
        </div>

        <button
          className="rounded-lg p-2 text-muted hover:bg-brand-50 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-muted"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-4 py-3 text-sm font-medium',
                      isActive ? 'bg-brand-50 text-brand-600' : 'text-muted',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ),
            )}
            <Link to="/affidavit" onClick={() => setMobileOpen(false)} className="mt-2">
              <Button variant="gold" className="w-full">Get Started</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
