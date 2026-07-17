import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getAdminClient } from '../_shared/supabase-admin.ts'

const DEFAULT_EMAIL = 'admin@paddimi.com'
const DEFAULT_PASSWORD = 'Paddimi@2026!'

function getBootstrapCredentials() {
  return {
    email: (Deno.env.get('ADMIN_BOOTSTRAP_EMAIL') ?? DEFAULT_EMAIL).toLowerCase(),
    password: Deno.env.get('ADMIN_BOOTSTRAP_PASSWORD') ?? DEFAULT_PASSWORD,
  }
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
    const bootstrap = getBootstrapCredentials()

    if (!email || typeof password !== 'string') {
      return jsonResponse({ error: 'Email and password are required' }, 400)
    }

    if (email !== bootstrap.email || password !== bootstrap.password) {
      return jsonResponse({ error: 'Invalid bootstrap credentials' }, 401)
    }

    const admin = getAdminClient()
    const metadata = { role: 'admin', full_name: 'Paddimi Admin' }
    const existing = await findUserByEmail(admin, email)

    if (existing) {
      const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
        password: bootstrap.password,
        email_confirm: true,
        user_metadata: metadata,
      })
      if (updateError) throw updateError
    } else {
      const { error: createError } = await admin.auth.admin.createUser({
        email: bootstrap.email,
        password: bootstrap.password,
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
          email: bootstrap.email,
          full_name: 'Paddimi Admin',
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
