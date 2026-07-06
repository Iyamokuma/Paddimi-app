import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getAdminClient } from '../_shared/supabase-admin.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return jsonResponse({ error: 'Unauthorized' }, 401)

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return jsonResponse({ error: 'Unauthorized' }, 401)

    const admin = getAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile || !['admin', 'staff'].includes(profile.role)) {
      return jsonResponse({ error: 'Forbidden' }, 403)
    }

    const { bucket, path } = await req.json()
    if (!bucket || !path) return jsonResponse({ error: 'bucket and path required' }, 400)

    if (!['customer-uploads', 'completed-documents'].includes(bucket)) {
      return jsonResponse({ error: 'Invalid bucket' }, 400)
    }

    const { data: signed, error: signError } = await admin.storage
      .from(bucket)
      .createSignedUrl(path, 3600)

    if (signError || !signed?.signedUrl) {
      return jsonResponse({ error: signError?.message ?? 'Could not generate URL' }, 500)
    }

    return jsonResponse({ url: signed.signedUrl })
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Server error' }, 500)
  }
})
