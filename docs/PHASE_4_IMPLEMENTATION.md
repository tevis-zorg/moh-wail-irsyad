# Phase 4 — Admin Authentication and Dashboard

**Status: in progress; acceptance not passed.** This record covers Phase 4
work from its initial objective through the latest acceptance review. It does
not claim that unfinished CRUD or live account checks are complete.

## Scope and security rules

- Admin access uses Supabase Auth and the trusted JWT claim
  `app_metadata.role = 'admin'`.
- No public registration flow is part of the application.
- Every server mutation must independently verify the admin user and remain
  subject to Supabase RLS.
- Google Drive File IDs are entered manually. The application does not browse
  Drive folders, upload files to Supabase Storage, or delete original Drive
  files when database records are deleted.
- `performances` remains photo-only. No video table, field, CRUD, or navigation
  is included.
- Work is performed one file or action at a time, with review before the next
  implementation step.

## Repository and implementation sequence

### Initial Phase 4 inspection

The Phase 4 objective was to build private admin authentication and metadata
management. At the start, the repository had a cookie-aware Supabase server
client and RLS policies, but no admin routes or login implementation. The
installed stack was Next.js 16.4.6 with `@supabase/ssr` 0.12.7 and
`@supabase/supabase-js` 2.119.0. Next.js 16 uses the `proxy.ts` convention.

### Prompt 4.1 — Authentication design and guard

Created `src/proxy.ts` as the request gate for `/admin/*`:

- Refreshes Supabase SSR cookies and forwards the associated cache headers.
- Uses `auth.getClaims()` and allows protected admin paths only when the
  verified `app_metadata.role` claim is `admin`.
- Leaves `/admin/login` accessible and redirects unauthenticated or
  non-admin requests there.
- Uses the public Supabase URL and anon key; it does not use a service-role key.
- Sets private, non-cacheable response headers for admin requests.

The Proxy is an early route gate. It does not replace a fresh server-side check
inside each mutation action.

### Prompt 4.2 — Admin login page

Created `src/app/admin/login/page.tsx`:

- Signs in with Supabase Auth using email and password.
- Checks claims after sign-in; non-admin users are signed out locally.
- Uses generic credential errors, basic input validation, and a loading state.
- Contains no signup link, form, or registration action.
- Redirects an admin to `/admin`.

The login flow compiled but has not been tested with an owner-provided admin
account or a live Supabase project.

### Prompt 4.3 — Protected admin layout and dashboard shell

Created `src/app/layout.tsx` as the minimal App Router document because no root
layout existed when the login page was introduced. It wraps routes in `<html>`
and `<body>` without adding authentication or changing page content.

The protected admin layout and dashboard shell were **not** implemented. The
login route must remain outside the protected route group to avoid redirecting
the login page back to itself.

### Prompt 4.4 — Performance/photo CRUD

Created `src/lib/supabase/admin.ts` as a server-only mutation guard:

- Calls `auth.getUser()` through the cookie-aware server client.
- Returns a Supabase client only when the verified user has
  `app_metadata.role === 'admin'`.
- Uses the anon key and preserves RLS enforcement.

No performance/photo CRUD page or mutation actions were implemented. The
performance table remains photo-only and its SQL RLS policies remain in
`supabase/schema.sql`.

### Prompt 4.5 — Research-paper CRUD

Created `src/app/admin/research-papers/actions.ts` with one action:
`createResearchPaper`.

The action checks the server-side admin guard before processing input,
normalizes and validates text fields, checks the year and Drive File ID,
enforces `application/pdf`, and maps the unique-constraint error to a clear
duplicate-ID message. It inserts metadata only, relies on RLS, and requires an
explicit confirmation before creating a published paper.

The following remain unimplemented: research-paper list UI, edit, publish /
unpublish, delete, loading/success/empty/error UI states, and delete
confirmation. No Drive file is uploaded or deleted by the implemented action.

### Prompt 4.6 — Admin security review

Reviewed the login page, Proxy, server-side admin guard, research-paper create
action, RLS policies, environment template, and API route inventory. No code
changes were made during that review.

Findings:

- The implemented login and create action use the trusted
  `app_metadata.role` claim; no user-editable `user_metadata` authorization
  was found.
- The schema enables RLS on both application tables. Published reads are
  allowed, while record management policies require the trusted admin claim.
- No application signup route, service-role usage in browser code, Drive
  folder-browsing call, or video management code was found.
- Only the research-paper create action independently guards a mutation because
  it is the only mutation action currently implemented.
- Supabase's deployed RLS state and project-level public-signup setting are
  external configuration and were not verified.
- Database uniqueness is per table. Cross-table global uniqueness for Drive
  File IDs is not enforced by the schema.

### Phase 4 acceptance review

The acceptance review inspected the repository and ran these commands:

| Command | Result |
| --- | --- |
| `pnpm lint` | Failed (exit 2): ESLint 9 could not find an `eslint.config.js`, `.mjs`, or `.cjs` file. |
| `pnpm exec tsc --noEmit` | Passed (exit 0). |
| `pnpm build` | Passed (exit 0); `/admin/login` is present, but `/admin` is not. |

Anonymous, authenticated non-admin, and admin behavior was reviewed from code,
but not exercised with three live Supabase identities. No test runner or Phase
4 automated tests are configured. Therefore login success, live RLS behavior,
and live mutation authorization remain unverified.

## Current acceptance status

| Requirement | Status |
| --- | --- |
| No app signup page or registration route | Implemented / none found; Supabase project-level signup setting unverified. |
| Server-side session and trusted-role checks | Proxy and create-paper action implemented; live identities not tested. |
| Protected dashboard | Missing; `/admin` currently has no page. |
| Photo/performance management | Missing. |
| Research-paper management | Create action only; list, edit, publish controls, delete, and UI missing. |
| Duplicate Drive IDs | Research create rejects duplicates within `research_papers`; global cross-table uniqueness is not enforced. |
| Public APIs reject unpublished records | Code filters for published records; no live API test performed. |
| Database deletion leaves Drive original intact | No delete action exists; no deletion tested. |
| No video management | Satisfied; no video table, fields, CRUD, route, or navigation found. |
| Lint, typecheck, build | Lint blocked by missing ESLint config; typecheck and build pass. |

## Remaining work before Phase 4 completion

1. Add the protected admin route-group layout with fresh server-side session and
   trusted-role checks, plus the dashboard shell.
2. Implement photo/performance list and CRUD, with an independent admin check
   for every mutation.
3. Implement research-paper list, edit, publish/unpublish, and delete, each
   with an independent admin check and owner-rights confirmation before
   publication.
4. Add the required loading, success, empty, error, and delete-confirmation UI.
5. Test with anonymous, authenticated non-admin, and admin identities against
   a Supabase project. Confirm RLS is applied and public signup is disabled in
   Supabase settings.
6. Test duplicate IDs, public access to unpublished rows, and metadata deletion
   without deleting Drive originals.
7. Configure ESLint 9 and rerun lint, typecheck, and production build.

Phase 5 has not started.
