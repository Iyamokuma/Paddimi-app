import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Logo } from '../../components/Logo'
import { isSupabaseConfigured } from '../../lib/supabase'

export function AdminLoginPage() {
  const { signIn, user, isAdmin, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await signIn(email, password)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
    }
  }

  // Show access denied if signed in but not admin
  if (!loading && user && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#180d26] via-[#331a4d] to-[#2a1640] p-4">
        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 text-center shadow-2xl">
          <p className="font-semibold text-red-700">Access denied</p>
          <p className="mt-2 text-sm text-muted">Your account does not have admin privileges.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#180d26] via-[#331a4d] to-[#2a1640] p-4">
      <div className="absolute inset-0 pattern-dots opacity-20" />
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
          <div className="mb-6 flex justify-center">
            <Logo variant="full" linkToHome={false} className="max-h-14" />
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-xl font-bold text-foreground">Admin Sign In</h1>
            <p className="mt-1 text-sm text-muted">Paddimi Multi Concepts backoffice</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-medium">Supabase not connected</p>
              <p className="mt-1 text-xs">
                Create a <code className="rounded bg-amber-100 px-1">.env</code> file with{' '}
                <code className="rounded bg-amber-100 px-1">VITE_SUPABASE_URL</code> and{' '}
                <code className="rounded bg-amber-100 px-1">VITE_SUPABASE_ANON_KEY</code>.
                See <code className="rounded bg-amber-100 px-1">SUPABASE_SETUP.md</code>.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={submitting || !isSupabaseConfigured}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
