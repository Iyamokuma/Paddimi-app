import { useEffect, useState } from 'react'
import { Loader2, Shield, User } from 'lucide-react'
import { fetchStaffProfiles } from '../../lib/api/notifications'
import { Card } from '../../components/ui/Card'

type ProfileRow = Awaited<ReturnType<typeof fetchStaffProfiles>>[number]

export function AdminStaffPage() {
  const [staff, setStaff] = useState<ProfileRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStaffProfiles()
      .then(setStaff)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Staff</h2>
        <p className="mt-1 text-sm text-muted">
          Admin and staff accounts with backoffice access. Add new users in Supabase Dashboard → Authentication.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <Card key={member.id} className="!p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                {member.role === 'admin' ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{member.full_name ?? 'Staff member'}</p>
                <p className="text-sm text-muted truncate">{member.email}</p>
                <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                  member.role === 'admin'
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-gold-50 text-gold-700'
                }`}>
                  {member.role}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">
              Joined {new Date(member.created_at).toLocaleDateString('en-NG', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </Card>
        ))}
      </div>

      {staff.length === 0 && (
        <Card className="!p-8 text-center text-muted">
          No staff profiles found. Create a user in Supabase Authentication.
        </Card>
      )}
    </div>
  )
}
