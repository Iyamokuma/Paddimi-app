import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import type { ProfileRow } from '../lib/database.types'

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: ProfileRow | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) {
      setLoading(false)
      return
    }

    sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user) {
        void loadProfile(data.session.user)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        void loadProfile(newSession.user)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(user: User) {
    const sb = getSupabase()
    if (!sb) return

    setLoading(true)
    const { data, error } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle()

    if (error) {
      console.error('Profile load error:', error.message)
      setProfile(null)
    } else if (data) {
      setProfile(data as ProfileRow)
    } else {
      // Profile row missing: only trust an explicit role from auth metadata.
      // Users without a staff/admin role get no backoffice access.
      const role = user.user_metadata?.role as string | undefined
      if (role === 'admin' || role === 'staff') {
        setProfile({
          id: user.id,
          email: user.email ?? '',
          full_name: (user.user_metadata?.full_name as string) ?? null,
          role,
          created_at: new Date().toISOString(),
        })
      } else {
        setProfile(null)
      }
    }
    setLoading(false)
  }

  async function signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env' }
    }

    const sb = getSupabase()!
    const { data, error } = await sb.auth.signInWithPassword({ email, password })

    if (error) return { error: error.message }

    if (data.user) {
      await loadProfile(data.user)
    }

    return {}
  }

  async function signOut() {
    const sb = getSupabase()
    if (sb) await sb.auth.signOut()
    setProfile(null)
    setSession(null)
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'staff'

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        isAdmin,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
