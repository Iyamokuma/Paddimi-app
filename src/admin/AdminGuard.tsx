import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

export function AdminGuard({ children }: { children?: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()

  if (!isSupabaseConfigured) {
    return <Navigate to="/admin/login" replace />
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f2f8]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
