import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileStack, LogOut, ExternalLink, Bell, Users,
  Settings, HelpCircle, Smartphone,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth } from '../contexts/AuthContext'
import { Logo } from '../components/Logo'
import { isSupabaseConfigured } from '../lib/supabase'

const menuNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/requests', label: 'Requests', icon: FileStack },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/staff', label: 'Team', icon: Users },
]

const generalNav = [
  { to: '/admin/requests', label: 'Settings', icon: Settings },
  { to: '/', label: 'Help', icon: HelpCircle, external: true },
]

export function AdminLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7f4]">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-green-100/80 bg-white px-4 py-6 shadow-sm">
        <div className="px-2">
          <Logo variant="compact" linkToHome={false} />
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-green-600">
            Backoffice
          </p>
        </div>

        <nav className="mt-8 flex-1 space-y-6 overflow-y-auto">
          <div>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Menu</p>
            <div className="space-y-1">
              {menuNav.map((item) => (
                <NavLink
                  key={item.to + item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-green-50 text-green-800'
                        : 'text-muted hover:bg-gray-50 hover:text-foreground',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-green-600" />
                      )}
                      <item.icon className={cn('h-4 w-4', isActive ? 'text-green-700' : '')} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">General</p>
            <div className="space-y-1">
              {generalNav.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.to}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-gray-50 hover:text-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                ) : (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive ? 'bg-green-50 text-green-800' : 'text-muted hover:bg-gray-50 hover:text-foreground',
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ),
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 to-green-900 p-5 text-white shadow-lg">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-4 left-4 h-16 w-16 rounded-full bg-white/5" />
          <Smartphone className="relative h-6 w-6 text-green-200" />
          <p className="relative mt-3 text-sm font-semibold leading-snug">
            Process requests faster on desktop
          </p>
          <p className="relative mt-1 text-xs text-green-100/90">
            Customers submit via the public site — you fulfil here.
          </p>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="relative mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-green-800 hover:bg-green-50"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View public site
          </a>
        </div>

        {!isSupabaseConfigured && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Demo mode — connect Supabase for live data
          </p>
        )}

        <div className="mt-4 px-2">
          <p className="truncate text-sm font-medium text-foreground">{profile?.full_name ?? 'Admin'}</p>
          <p className="truncate text-xs text-muted">{profile?.email}</p>
        </div>
      </aside>

      <div className="ml-[260px] flex min-h-screen flex-1 flex-col">
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
