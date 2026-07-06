# Supabase Setup for Paddimi Multi Concepts

Follow these steps to connect the frontend and backoffice to your Supabase project.

## What I need from you

Copy `.env.example` to `.env` and fill in:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxx
```

**Where to find Supabase keys:** Dashboard → **Project Settings** → **API**

> Never commit `.env` to git.

---

## Step 1 — Run database migrations

Run all files in `supabase/migrations/` in order (001 → 006), or:

```bash
npx supabase db push
```

Key migrations:
- **001** — Core schema (requests, timeline, profiles, notifications)
- **002** — Storage buckets
- **003–004** — RLS fixes for admin login
- **005** — `approved` status
- **006** — Payment fields, realtime, secure download RPC

---

## Step 2 — Storage buckets

Create two **private** buckets if not already created:

| Bucket | Purpose |
|--------|---------|
| `customer-uploads` | Customer files during request |
| `completed-documents` | Admin-uploaded finished PDFs |

Policies are in `supabase/migrations/002_storage_buckets.sql`.

---

## Step 3 — Deploy Edge Functions

```bash
npx supabase functions deploy get-download-url
npx supabase functions deploy get-admin-file-url
npx supabase functions deploy send-notification
npx supabase functions deploy paystack-initialize
npx supabase functions deploy paystack-verify
```

Set secrets in **Dashboard → Edge Functions → Secrets**:

| Secret | Purpose |
|--------|---------|
| `PAYSTACK_SECRET_KEY` | Verify payments server-side |
| `PAYSTACK_PUBLIC_KEY` | Returned to client if needed |
| `RESEND_API_KEY` | Send emails (Resend.com) |
| `RESEND_FROM_EMAIL` | e.g. `Paddimi <notify@yourdomain.com>` |
| `TERMII_API_KEY` | SMS via Termii |
| `TERMII_SENDER_ID` | SMS sender name |

Without Paystack secrets, orders auto-verify in dev mode (no popup).
Without Resend/Termii, notifications are logged as `pending`.

---

## Step 4 — Create admin account

1. **Authentication → Users → Add user**
2. Profile auto-created with role `admin`

---

## Step 5 — Start the app

```bash
npm run dev
```

- **Public site:** http://localhost:5173
- **Backoffice:** http://localhost:5173/admin/login

---

## Backoffice pages

| Page | URL |
|------|-----|
| Dashboard | `/admin` — stats, awaiting queue, overdue, auto-refresh |
| All Requests | `/admin/requests` |
| Request Detail | `/admin/requests/:id` — process, upload PDF, approve |
| Notifications | `/admin/notifications` — SMS/email log |
| Staff | `/admin/staff` — admin/staff accounts |

---

## How data flows

```
Customer pays (Paystack) → pending order created → payment verified
                        → request submitted + admin notified
                        → 4-char code shown to customer

Admin: Start Processing → Upload PDF → Approve
                        → Customer notified (SMS/email)

Customer: Enter code on homepage → secure download URL
```

Admin alert emails: `paddimi.mc@gmail.com`, `paddimi.mc@yahoo.com`

---

## Fallback mode (no Supabase)

Demo codes: **S4B1** (submitted), **K7M2** (processing), **R3W8** (approved/downloadable).
