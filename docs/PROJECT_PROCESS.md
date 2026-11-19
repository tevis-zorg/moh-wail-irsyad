# Project Process and Phase Record

This document tracks the Moh. Wail Irsyad portfolio from the initial repository
audit through the planned launch. Status reflects the repository and checks
recorded so far; planned work is not marked complete until implemented and
verified.

## Project rules that apply in every phase

- Use Next.js App Router, TypeScript, Tailwind CSS, Supabase, Google Drive, and
  Vercel.
- Preserve the dark, minimalist, theatrical/editorial direction of the supplied
  portfolio reference.
- Read `PLAN.md` and the relevant `docs/` guidance before each task. Inspect
  first, work only on the approved phase, and preserve supplied assets.
- Make changes one file or component at a time unless the owner authorizes a
  larger task. Report checks honestly and stop after the requested task.
- Never put Google credentials or Supabase service-role credentials in client
  code or Git. Do not read or print `.env.local` values in reports.
- Supabase stores photo and research-paper metadata; Google Drive stores their
  originals. Public media must be gated by an exact registered, published row
  and served through controlled server routes.
- Do not list, crawl, or search Drive folders. The admin manually registers
  File IDs. Never fetch an arbitrary caller-provided Drive URL.
- `performances` is photo-only. This release has no video table, category, URL,
  CRUD, or proxy route.
- Do not invent biography, awards, credits, projects, dates, paper details, or
  contact information. Publish only owner-approved content and files.

## Before Phase 1 — Audit and project decisions

### Recorded

- The repository and supplied `assets/` were reviewed. The asset set includes
  `Portfolio M.Wail Irsyad.pdf`, `SHORT BIO WAIL.pdf`, photographs, and supplied
  document files. Asset contents must be checked directly before publishing;
  filenames alone do not establish portfolio facts or permissions.
- The owner identified `SHORT BIO WAIL.pdf` as the biography source and supplied
  Instagram `@Muhammadwail` and the YouTube name `Moh Wail Irsyad`.
- Credits and TikTok are to remain empty for now, with a mockup/update planned
  later. Do not fabricate their values or URLs.
- The project name was changed to `personal-web-moh-wail-irsyad`; pnpm is the
  selected package manager. The existing `pnpm-lock.yaml` is retained.
- `.gitignore` was created to exclude local secrets, dependencies, build
  output, and the local assets folder while allowing `.env.example` to remain
  trackable.

### Still to confirm before publishing

- Final biography and professional description against the supplied PDF.
- Approved portrait and photo selections, event/project names, dates, captions,
  and credits.
- Research paper metadata and explicit permission to display/download each
  paper.
- Final Instagram URL, YouTube URL, TikTok URL, WhatsApp number, and footer
  wording. Hide unavailable social links rather than making up URLs.

## Phase 1 — Project foundation and Supabase schema

**Status: incomplete.** The database and environment pieces exist, but the
Next.js foundation is not currently in place and the Phase 1 checks recorded in
`PHASE_1_IMPLEMENTATION.md` failed.

### Task 1 — Project foundation

**Recorded:** `package.json` uses the required project name and pnpm; Next.js,
React, TypeScript, Tailwind CSS, PostCSS, and ESLint dependencies are declared.

**Remaining:** the current repository inventory has no `src/app/` (or root
`app/`) routes, `tsconfig.json`, Tailwind/PostCSS configuration, or ESLint flat
configuration. The recorded `lint`, TypeScript, and production build checks
failed for these missing foundation files. Complete the foundation before
starting application pages or routes.

### Task 2 — Supabase SQL schema

**Recorded:** `supabase/schema.sql` defines exactly `public.performances` and
`public.research_papers`. Performances permits only the approved image MIME
types; papers require PDF MIME. Both tables have RLS, published-row reads, and
admin management checks against trusted `app_metadata.role = 'admin'`. There
are no video fields, extra application tables, or storage buckets.

**Remaining:** apply the schema to the intended Supabase project and verify
anonymous, authenticated non-admin, and admin behavior. The schema has not been
confirmed as applied to a live database.

### Task 3 — Environment template

**Recorded:** `.env.example` contains placeholders for the Supabase URL and anon
key, Google Service Account email and private key, and app URL. It contains no
real credentials. `.env.local` must remain uncommitted and must not be printed.

### Task 4 — Supabase helper

**Recorded:** `src/lib/supabase/server.ts` provides a server-side
`@supabase/ssr` client using Next.js cookies and public URL/anon-key variables.
It does not expose or use a service-role key.

**Remaining:** create a browser helper only if/when an approved feature needs
it. No auth pages or CRUD are part of Phase 1.

### Phase 1 completion gate

- Configure a working App Router, TypeScript, Tailwind, and lint foundation.
- Run lint, TypeScript, and production build successfully.
- Apply and test the schema/RLS in Supabase.
- Confirm no secrets or prohibited video schema were introduced.

## Phase 2 — Google Drive authentication

**Status: client implemented; metadata access partially verified.** Setup steps
are also recorded in `GOOGLE_DRIVE_SETUP.md`.

### Tasks 1–4 — Google Cloud and environment setup

The documented owner setup is: select a Google Cloud project, enable Drive API,
create a Service Account and protect its key, share only intended Drive content
with the Service Account as Viewer, use the read-only Drive scope, and set
server-only environment variables locally and in Vercel. Keep Drive files
private. Do not paste keys into chat or commit credential files.

### Task 5 — Server-only Drive client

**Complete:** `src/lib/google-drive/client.ts` uses `googleapis`, the
`https://www.googleapis.com/auth/drive.readonly` scope, and a `server-only`
marker. It reads `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY`,
normalizes escaped newlines, and reports missing configuration without logging
credentials. The installed `googleapis` version recorded during review was
`189.0.0`.

### Task 6 — Drive access verification

**Partially complete:** a one-time local metadata check authenticated as the
Service Account. It retrieved metadata for an accessible Word document
(`application/vnd.openxmlformats-officedocument.wordprocessingml.document`). A
separately supplied ID was identified by Drive as a folder
(`application/vnd.google-apps.folder`). These checks did not download file
contents or enumerate folder children.

**Remaining:** verify an actual image and an actual PDF by their exact File IDs.
The currently verified document is not a PDF, and the folder ID is not an image.
Drive returned 404 for another supplied ID; Drive's response does not
distinguish a wrong ID from an inaccessible file. Earlier sandboxed attempts
also encountered DNS resolution errors, while a network-enabled check reached
Drive successfully.

### Phase 2 completion gate

- Verify metadata for one actual approved image and one actual PDF, including
  expected MIME types.
- Keep credentials server-only and Drive access read-only.
- Confirm no folder listing, indexing, or public Drive endpoint exists.

## Phase 3 — Gatekeeper proxy API

**Status: not started.** Read `docs/DRIVE_PROXY.md` before implementation.
Complete the Phase 1 foundation first.

### Task 1 — Image route

Create `src/app/api/image/[fileId]/route.ts` using Node.js runtime. Validate the
route parameter, query the exact `performances.drive_file_id` with
`is_published = true`, enforce the photo MIME allowlist, then request only the
registered Drive File ID. Verify upstream status and actual MIME type, check
size where practical, and stream the response.

### Task 2 — PDF route

Create `src/app/api/paper/[fileId]/route.ts` with the same database gate against
`research_papers`, requiring a published row and `application/pdf`. Confirm
owner rights before publishing or exposing any paper.

### Task 3 — Response and cache behavior

Use safe errors, `X-Content-Type-Options: nosniff`, and cache only successful
published content. Document that CDN caching can delay revocation after
unpublishing. Never accept arbitrary URLs or serve unregistered/unpublished
files.

### Phase 3 completion gate

Verify registered/published files succeed; missing, unregistered, unpublished,
wrong-MIME, and missing-upstream files fail safely. Confirm streaming and
success-only cache behavior. Do not create a video route.

## Phase 4 — Admin authentication and dashboard

**Status: not started.** Read `docs/DATABASE.md` and the relevant security
guidance before each task.

1. Implement admin login without public registration.
2. Protect admin pages and every server mutation; verify the trusted
   `app_metadata.role = 'admin'` claim and enforce matching RLS.
3. Build the dashboard overview.
4. Add photo/performance record CRUD and publish/unpublish controls.
5. Add research-paper record CRUD and publish/unpublish controls.
6. Have the admin manually enter Drive File IDs; do not build Drive browsing.
7. Reject duplicate IDs and validate all fields server-side.
8. Confirm deleting a database record never deletes its Drive original.

### Phase 4 completion gate

Test an admin, authenticated non-admin, and anonymous visitor. Only the admin
may manage rows; public reads remain limited to published rows. Verify duplicate
ID rejection, publication controls, and safe database-only deletion.

## Phase 5 — Public portfolio frontend

**Status: not started.** Use `docs/DESIGN_GUIDELINES.md`,
`docs/CONTENT_INVENTORY.md`, and the owner-approved portfolio assets.

Build these sections:

1. Home/hero.
2. About Me.
3. My Works — Photos.
4. My Works — Research Papers.
5. Contact.
6. Thank-you and copyright footer.

Load only published Supabase records. Group works by verified event/project
where relevant. Render images through `/api/image/{fileId}` and papers through
`/api/paper/{fileId}`; never link directly to Drive originals. Use verified
contact/social URLs only. Leave unavailable TikTok and credits empty until the
owner supplies approved values and requests the mockup/update. Do not invent
content.

### Phase 5 completion gate

Verify content accuracy and permissions, responsive mobile/tablet/desktop
layouts, keyboard navigation, visible focus, descriptive alt text, and reduced
motion. Confirm public data is database-driven, unpublished items stay hidden,
and the production build succeeds.

## Final deployment and handover

After Phases 1–5 pass:

1. Push the approved repository to GitHub and import it into Vercel.
2. Configure production environment variables without exposing secrets.
3. Apply the schema and RLS policies to the production Supabase project.
4. Confirm the Service Account has Viewer access only to intended Drive content.
5. Deploy and test public routes, admin authorization, image/PDF proxies, and
   unpublish/cache behavior.
6. Configure a custom domain if supplied by the owner.
7. Hand over the owner workflow for registering records, publishing content,
   managing credentials, and understanding cache-based revocation delays.

The final launch check must include lint, TypeScript, production build, RLS and
role tests, registered/unregistered and published/unpublished media checks,
MIME validation, responsive layout review, content/rights approval, and a
secret-free Git review. Provider quotas and current Vercel/Supabase terms should
be checked at deployment time.

## Related records

- Overall roadmap: `../PLAN.md`
- Phase 1 details and failed checks: `PHASE_1_IMPLEMENTATION.md`
- Database and RLS requirements: `DATABASE.md`
- Google Drive setup and variables: `GOOGLE_DRIVE_SETUP.md`
- Proxy requirements and cache behavior: `DRIVE_PROXY.md`
- Content verification: `CONTENT_INVENTORY.md`
- Design direction: `DESIGN_GUIDELINES.md`
- Deployment checklist: `DEPLOYMENT.md`
