import { DEFAULT_ADMIN_EMAIL } from '../../config/adminAuth'
import { invokeEdge } from './edge'

export async function bootstrapDefaultAdmin(email: string, password: string): Promise<boolean> {
  if (email.trim().toLowerCase() !== DEFAULT_ADMIN_EMAIL.toLowerCase()) {
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
