import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getAdminClient } from '../_shared/supabase-admin.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { code } = await req.json()
    if (!code || typeof code !== 'string') {
      return jsonResponse({ error: 'Code is required' }, 400)
    }

    const sb = getAdminClient()
    const { data, error } = await sb.rpc('get_download_request', { p_code: code.toUpperCase().trim() })

    if (error) return jsonResponse({ error: error.message }, 500)
    if (!data) return jsonResponse({ error: 'Document not found' }, 404)

    const row = data as {
      documentUrl: string | null
      downloadAvailable: boolean
      paymentStatus: string
      status: string
      expiresAt: string
    }

    if (!row.downloadAvailable || !row.documentUrl) {
      return jsonResponse({ error: 'Document not available for download yet' }, 403)
    }

    if (new Date(row.expiresAt) < new Date()) {
      return jsonResponse({ error: 'Redemption code has expired' }, 403)
    }

    const { data: signed, error: signError } = await sb.storage
      .from('completed-documents')
      .createSignedUrl(row.documentUrl, 3600)

    if (signError || !signed?.signedUrl) {
      return jsonResponse({ error: signError?.message ?? 'Could not generate download URL' }, 500)
    }

    return jsonResponse({ url: signed.signedUrl })
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Server error' }, 500)
  }
})
