/** Default admin credentials — must match a user in Supabase Authentication. */
export const DEFAULT_ADMIN_EMAIL = 'admin@paddimi.com'
export const DEFAULT_ADMIN_PASSWORD = 'Paddimi@2026!'

/** Secondary admin account (also provisioned via bootstrap-admin). */
export const SECONDARY_ADMIN_EMAIL = 'paddimi.mc@yahoo.com'
export const SECONDARY_ADMIN_PASSWORD = 'Sopuruchi@1'

/** Emails allowed to auto-provision on first login through bootstrap-admin. */
export const BOOTSTRAP_ADMIN_EMAILS = [
  DEFAULT_ADMIN_EMAIL,
  SECONDARY_ADMIN_EMAIL,
] as const

export function isBootstrapAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  return BOOTSTRAP_ADMIN_EMAILS.some((e) => e.toLowerCase() === normalized)
}
