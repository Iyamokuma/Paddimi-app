import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getAdminClient } from '../_shared/supabase-admin.ts'

const DEFAULT_ACCOUNTS = [
  { email: 'admin@paddimi.com', password: 'Paddimi@2026!', fullName: 'Paddimi Admin' },
  { email: 'paddimi.mc@yahoo.com', password: 'Sopuruchi@1', fullName: 'Paddimi Admin' },
]

type BootstrapAccount = { email: string; password: string; fullName: string }

function getBootstrapAccounts(): BootstrapAccount[] {
  const accounts = [...DEFAULT_ACCOUNTS]
  const envEmail = Deno.env.get('ADMIN_BOOTSTRAP_EMAIL')?.trim().toLowerCase()
  const envPassword = Deno.env.get('ADMIN_BOOTSTRAP_PASSWORD')
  if (envEmail && envPassword) {
    const idx = accounts.findIndex((a) => a.email === envEmail)
    if (idx >= 0) accounts[idx] = { ...accounts[idx], password: envPassword }
    else accounts.push({ email: envEmail, password: envPassword, fullName: 'Paddimi Admin' })
  }
  return accounts
}

async function findUserByEmail(admin: ReturnType<typeof getAdminClient>, email: string) {
  let page = 1
  const perPage = 200

  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) throw error

    const match = data.users.find((user) => user.email?.toLowerCase() === email)
    if (match) return match

    if (data.users.length < perPage) break
    page += 1
  }

  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { email: rawEmail, password } = await req.json()
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''

    if (!email || typeof password !== 'string') {
      return jsonResponse({ error: 'Email and password are required' }, 400)
    }

    const account = getBootstrapAccounts().find(
      (entry) => entry.email === email && entry.password === password,
    )
    if (!account) {
      return jsonResponse({ error: 'Invalid bootstrap credentials' }, 401)
    }

    const admin = getAdminClient()
    const metadata = { role: 'admin', full_name: account.fullName }
    const existing = await findUserByEmail(admin, email)

    if (existing) {
      const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
        password: account.password,
        email_confirm: true,
        user_metadata: metadata,
      })
      if (updateError) throw updateError
    } else {
      const { error: createError } = await admin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: metadata,
      })
      if (createError) throw createError
    }

    const user = existing ?? (await findUserByEmail(admin, email))
    if (user) {
      await admin.from('profiles').upsert(
        {
          id: user.id,
          email: account.email,
          full_name: account.fullName,
          role: 'admin',
        },
        { onConflict: 'id' },
      )
    }

    return jsonResponse({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bootstrap failed'
    console.error('bootstrap-admin error:', message)
    return jsonResponse({ error: message }, 500)
  }
})
