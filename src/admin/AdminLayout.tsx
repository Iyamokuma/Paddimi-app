import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, FileStack, LogOut, ExternalLink, Bell, Users,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth } from '../contexts/AuthContext'
import { Logo } from '../components/Logo'
import { isSupabaseConfigured } from '../lib/supabase'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/requests', label: 'All Requests', icon: FileStack },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/staff', label: 'Staff', icon: Users },
]

export function AdminLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-[#f4f2f8]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-brand-100/80 bg-white shadow-sm">
        <div className="border-b border-border px-5 py-5">
          <Logo variant="compact" linkToHome={false} />
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-500">
            Backoffice
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                    : 'text-muted hover:bg-brand-50 hover:text-brand-700',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          {!isSupabaseConfigured && (
            <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Demo mode — connect Supabase for live data
            </p>
          )}
          <div className="mb-3 px-1">
            <p className="truncate text-sm font-medium text-foreground">{profile?.full_name ?? 'Admin'}</p>
            <p className="truncate text-xs text-muted">{profile?.email}</p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="mb-2 flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-muted hover:bg-brand-50 hover:text-brand-600"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View public site
          </a>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-64 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/80 px-8 backdrop-blur-md">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Paddimi Multi Concepts</h1>
            <p className="text-xs text-muted">Operations backoffice</p>
          </div>
          <Link to="/admin/notifications" className="flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs text-brand-600 hover:bg-brand-100">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </Link>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
