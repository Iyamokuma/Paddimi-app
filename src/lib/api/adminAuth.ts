import { isBootstrapAdminEmail } from '../../config/adminAuth'
import { invokeEdge } from './edge'

export async function bootstrapDefaultAdmin(email: string, password: string): Promise<boolean> {
  if (!isBootstrapAdminEmail(email)) {
    return false
  }

  try {
    await invokeEdge<{ ok: boolean }>('bootstrap-admin', { email, password })
    return true
  } catch (err) {
    console.error('Admin bootstrap failed:', err)
    return false
  }
}
