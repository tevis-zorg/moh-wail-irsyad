# Deployment Guide

## Services
- Vercel: Next.js hosting.
- Supabase: PostgreSQL and Auth.
- Google Drive: original photo and research-paper files.
- Google Cloud Service Account: server-side read access to the designated Drive content.

Provider free-tier limits, quotas, and terms can change. Verify database, bandwidth, storage, function duration, and API limits before launch.

## Environment variables
Configure `.env.example` locally and in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `NEXT_PUBLIC_APP_URL`

Only configure `SUPABASE_SERVICE_ROLE_KEY` if a specific trusted server-side task requires it. Never expose it to client code.

## Google Drive setup
1. Create/select a Google Cloud project.
2. Enable Google Drive API.
3. Create a Service Account.
4. Use read-only Drive scope.
5. Share only the intended Drive folder/files with the Service Account email.
6. Store credentials only in server environment variables.
7. Do not make the Drive folder public just to make the proxy work.

## Vercel deployment
1. Push the project repository to GitHub.
2. Import the repository into Vercel.
3. Configure environment variables.
4. Apply the SQL schema and RLS policies to the production Supabase project.
5. Deploy and test both public and admin flows.
6. Configure a custom domain if available.

## Launch checklist
- [ ] RLS enabled on both tables.
- [ ] Public users can read only published rows.
- [ ] Authenticated non-admin cannot mutate rows.
- [ ] Admin role assigned through trusted process.
- [ ] Public signup disabled.
- [ ] Service Account has access only to intended Drive content.
- [ ] No secrets in Git or browser bundle.
- [ ] Image proxy rejects unregistered/unpublished IDs.
- [ ] Image proxy rejects non-image MIME types.
- [ ] PDF proxy rejects non-PDF MIME types.
- [ ] Cache invalidation/revocation behavior documented.
- [ ] Biography, credits, and contact links verified.
- [ ] Mobile/tablet/desktop layouts tested.
- [ ] Production build and lint pass.
