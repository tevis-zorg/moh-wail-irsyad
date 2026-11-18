# PLAN.md — Current Five-Phase Development Roadmap

## Project
Dynamic personal portfolio for Moh. Wail Irsyad.

## Stack
Next.js App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL/Auth, Google Drive API via Service Account, and Vercel.

## Current data architecture
Supabase stores photo metadata and research-paper metadata. Google Drive stores the original photo and PDF files. Admin manually registers each Drive File ID in Supabase. The public proxy checks the exact database record and publication state before fetching the file.

**Video is deliberately excluded from this version:** no video table, no video category in `performances`, no video URL database field, no video CRUD, and no video proxy route.

## Coding protocol
Work only on the phase explicitly requested. Implement one file/component at a time. Inspect before editing. Preserve existing work. Stop and wait for approval after each requested task.

---

## Phase 1 — Project Setup & Database
Goal: establish the Next.js foundation and Supabase schema.

Tasks:
1. Inspect the repository and existing assets.
2. Initialize/configure Next.js App Router, TypeScript, Tailwind CSS, and ESLint only if needed.
3. Install only necessary dependencies.
4. Create `supabase/schema.sql` using `docs/DATABASE.md`.
5. Create the `performances` photo-only table and `research_papers` table.
6. Enable RLS and add published-read/admin-write policies.
7. Prepare `.env.example` and minimal Supabase helpers when needed.

Acceptance:
- App runs locally and production build succeeds.
- SQL creates the two required tables.
- `performances` contains photo records only.
- No video database objects or fields exist.
- RLS is enabled and documented.
- No secrets are committed.

Do not implement Drive integration, proxy APIs, admin UI, or public pages in this phase.

## Phase 2 — Google Drive Authentication
Goal: establish secure server-side read access to the designated Drive folder.

Tasks:
1. Enable Google Drive API in Google Cloud.
2. Create a Service Account.
3. Share only the intended folder with the Service Account email.
4. Configure environment variables locally and in Vercel.
5. Create a server-only Drive client using read-only scope.
6. Verify access to a known test image/PDF.

Acceptance:
- Server can read an authorized test file.
- Credentials never reach browser code.
- No public Drive listing/search endpoint exists.

## Phase 3 — Gatekeeper Proxy API
Goal: serve only registered, published photos and research PDFs.

Tasks:
1. Implement `src/app/api/image/[fileId]/route.ts`.
2. Validate the route parameter.
3. Query `performances` for the exact ID and published photo record.
4. Verify allowed image MIME type and upstream metadata.
5. Fetch the exact registered Drive file and stream it.
6. Implement `src/app/api/paper/[fileId]/route.ts`.
7. Validate `research_papers`, publication state, and PDF MIME.
8. Add success-only cache headers and safe error handling.
9. Document cache invalidation/revocation behavior.

Acceptance:
- Registered and published image/PDF returns successfully.
- Unregistered or unpublished ID returns 404.
- Unsupported MIME is rejected.
- Missing Drive file is handled safely.
- No arbitrary URL can be fetched.
- No video proxy route is created.

## Phase 4 — Admin Authentication & Dashboard
Goal: let the owner manage portfolio records.

Tasks:
1. Implement Supabase Auth login; no public signup.
2. Protect admin routes and server mutations.
3. Enforce trusted admin claim and RLS.
4. Build dashboard overview.
5. Build photo/performance CRUD.
6. Build research-paper CRUD.
7. Add publish/unpublish controls.
8. Admin manually enters Drive File IDs; do not build Drive folder browsing.
9. Deleting a row must not delete the original Drive file.

Acceptance:
- Only admins can manage records.
- Duplicate File IDs are rejected.
- Public routes cannot serve unpublished records.
- Admin has no video management in this version.

## Phase 5 — Public Frontend
Goal: build the finished responsive portfolio.

Sections:
1. Home / hero
2. About Me
3. My Works — Photos
4. My Works — Research Papers
5. Contact
6. Thank-you and copyright footer

Tasks:
- Follow `docs/DESIGN_GUIDELINES.md` and the supplied portfolio PDF.
- Group photos and papers by event/project where relevant.
- Load only published records.
- Display photos through `/api/image/{fileId}`.
- Display PDFs through `/api/paper/{fileId}`.
- Use verified social/contact links only.
- Do not add a video database or video CMS.

Acceptance:
- Public content is database-driven.
- Images and PDFs use controlled proxy routes, not direct Drive URLs.
- Unpublished records remain unavailable.
- Contact links work.
- Mobile, tablet, and desktop layouts work.
- Production build passes.

## Deployment and handover
After Phase 5:
- Deploy to Vercel.
- Configure production Supabase and Google credentials.
- Apply SQL and RLS policies.
- Verify Drive folder sharing.
- Test public/admin access and proxy routes.
- Explain cache behavior and unpublish limitations.
- Provide simple owner handover instructions.

## Initial instruction for Codex
Read `AGENTS.md`, `SKILLS.md`, `PLAN.md`, and `docs/DATABASE.md`. Inspect the repository. Implement Phase 1 only, one file at a time. Do not create any video database fields or tables. Stop and wait for approval.
