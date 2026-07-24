import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getAdminClient } from '../_shared/supabase-admin.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

async function isAuthorizedAdmin(req: Request): Promise<boolean> {
  const authHeader = req.headers.get('Authorization') ?? ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) return false

  if (token === (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')) return true

  const userClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  )
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return false

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  return Boolean(profile && profile.role === 'admin')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    if (!(await isAuthorizedAdmin(req))) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    const sb = getAdminClient()

    // Clear notification logs first (request_id may be SET NULL, but wipe clean)
    await sb.from('notification_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const { data: deleted, error } = await sb
      .from('service_requests')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select('id')

    if (error) return jsonResponse({ error: error.message }, 500)

    return jsonResponse({
      ok: true,
      deletedCount: deleted?.length ?? 0,
    })
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Server error' }, 500)
  }
})
