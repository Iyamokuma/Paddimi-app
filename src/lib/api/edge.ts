import { getSupabase, isSupabaseConfigured } from '../supabase'

export async function invokeEdge<T>(
  functionName: string,
  body: Record<string, unknown>,
  options?: { authToken?: string },
): Promise<T> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured')
  }

  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const token = options?.authToken ?? anonKey

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  let data: Record<string, unknown>
  try {
    data = JSON.parse(text)
  } catch {
    data = { error: text.slice(0, 200) || `Edge function ${functionName} returned an invalid response` }
  }

  if (!res.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : `Edge function ${functionName} failed`)
  }
  return data as T
}

export async function invokeEdgeAsUser<T>(
  functionName: string,
  body: Record<string, unknown>,
): Promise<T> {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase not configured')

  const { data: { session } } = await sb.auth.getSession()
  if (!session?.access_token) throw new Error('Not authenticated')

  return invokeEdge<T>(functionName, body, { authToken: session.access_token })
}
