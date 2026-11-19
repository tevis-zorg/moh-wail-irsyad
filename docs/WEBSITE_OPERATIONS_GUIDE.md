# Website Operations Guide

This guide explains how to configure and operate the current Moh. Wail Irsyad
portfolio repository. It separates available functionality from work that is
still missing so setup steps do not imply the site is complete.

## Current state at a glance

The repository currently includes:

- A Next.js public homepage with Home/Hero, About Me, Contact, and Footer.
- A server-side Supabase client and published-row query helpers for photos and
  research papers.
- A server-only Google Drive API client using the read-only scope.
- `/api/image/{fileId}` and `/api/paper/{fileId}` proxy routes. They require a
  matching published database row and supported MIME type before fetching the
  registered Drive file.
- Supabase schema for `performances` (photos only) and `research_papers`.
- An `/admin/login` page and a research-paper creation server action.

The repository does **not** yet include a working admin dashboard or photo
CRUD interface, nor public Photos and Research Papers sections. The login page
redirects successful admins to `/admin`, but that dashboard route is not
implemented. Public navigation links to photo and research anchors that are
not yet present. Therefore, the site can be run and the API routes can be
tested, but ordinary content management and public galleries are not ready.

## 1. Prepare the external services

### Supabase

1. Create or select the Supabase project for this site.
2. Open the SQL Editor and apply `supabase/schema.sql`.
3. Confirm the two tables exist: `public.performances` and
   `public.research_papers`.
4. Confirm RLS is enabled and the published-read and trusted-admin policies
   from the schema are active.
5. In Supabase Auth, create/invite the owner account. There is no public
   registration flow.
6. Set the trusted Auth claim `app_metadata.role` to `admin` using a trusted
   Supabase administrative method. Never put `role: admin` in user-editable
   `user_metadata`, and never expose an admin/service-role credential in
   browser code.

### Google Drive

1. Select/create the Google Cloud project and enable Google Drive API.
2. Create a Service Account and keep its key private.
3. Share only the intended Drive folder or individual files with the Service
   Account email as Viewer. Files do not need to be shared publicly.
4. Keep photos as JPEG, PNG, WebP, or GIF. Keep research documents as PDF.
5. Copy each file's ID from its Drive URL. For
   `https://drive.google.com/file/d/FILE_ID/view`, the ID is the part between
   `/d/` and `/view`. Do not use a folder ID or store a Drive URL in the
   application record.

The application does not browse Drive folders. Each file is registered
manually by its exact File ID.

## 2. Configure the local environment

1. Install the repository dependencies with `pnpm install`.
2. Create `.env.local` from the names and placeholders in `.env.example`.
3. Set the following values locally:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `NEXT_PUBLIC_APP_URL=http://localhost:3000`

4. Keep `.env.local`, downloaded Google credential files, and all private keys
   out of Git. The Drive client accepts a private key with literal `\\n`
   sequences and converts them to newlines. Do not paste credentials into chat
   or terminal commands that may be saved in shell history.
5. Start the development server with `pnpm dev` and open
   `http://localhost:3000`.

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
`NEXT_PUBLIC_APP_URL` are public configuration. The Google Service Account
email/private key are server configuration; the private key is secret. The
optional `SUPABASE_SERVICE_ROLE_KEY` is not needed for ordinary public reads or
Drive access and must remain server-only if a future trusted operation needs
it.

## 3. Register content while the admin UI is unfinished

There is no usable dashboard workflow for registering photo records. There is
also no complete research-paper CRUD page. Until those pages are implemented,
an authorized owner can use Supabase's trusted Table Editor or another trusted
administrative method to add records. Do not expose database credentials or
perform admin operations from browser code.

For a photo row in `performances`, enter:

- `title` and `event_name` (required and verified by the owner)
- `description` and `year` when known; otherwise leave them null
- `drive_file_id` as the exact Drive File ID
- `mime_type` as the actual approved image MIME type
- `is_published` as `false` while checking the record

For a paper row in `research_papers`, enter:

- `title` (required)
- `authors`, `abstract`, `publication_name`, and `year` only when known
- `drive_file_id` as the exact Drive File ID
- `mime_type` as `application/pdf`
- `is_published` as `false` until public access rights are confirmed

Before publishing a paper, the owner must confirm public viewing and download
rights for that exact PDF. The schema has no separate approval column; setting
`is_published` to true is the public release decision. Do not publish invented
or unverified titles, dates, authors, captions, or credits. The database
constraints reject duplicate File IDs within each table and unsupported MIME
types.

## 4. Test the Drive proxy routes

The routes are gates for registered published content, not general Drive
viewers. A private Drive file should remain private and should be retrievable
only through the application's proxy after its row is published.

1. Confirm the Service Account can access one exact test image or PDF. Check
   only its metadata (`id` and `mimeType`); do not list the Drive folder or
   download file contents for this metadata check.
2. Add a corresponding row with `is_published = false`.
3. Request the local proxy URL, replacing `FILE_ID` with that exact ID:

   - `http://localhost:3000/api/image/FILE_ID`
   - `http://localhost:3000/api/paper/FILE_ID`

4. While unpublished, the request should return 404 and must not return the
   file. Publish only approved test content and repeat the request; the
   matching route should return the file with its proper MIME type and
   `X-Content-Type-Options: nosniff`.
5. Try an unregistered ID and confirm it does not return Drive content. Try a
   photo ID against the paper route or a PDF ID against the image route; the
   wrong route must not deliver it.
6. Unpublish the row after testing if it should not remain public.

The image route supports JPEG, PNG, WebP, and GIF. The paper route supports
PDF only. Invalid, missing, unregistered, unpublished, and wrong-MIME requests
must not be treated as successful public content.

## 5. Sign in and production configuration

The login page is at `/admin/login`. It uses Supabase password sign-in and
rejects users without the trusted `app_metadata.role = 'admin'` claim. At
present, a successful login redirects to `/admin`, which is not implemented;
do not treat this as a usable admin management workflow yet.

For Vercel, configure the same environment variables in the project's
Environment Variables settings. Set `NEXT_PUBLIC_APP_URL` to the deployed site
origin. Store the Google private key as a secret, then redeploy after changing
configuration. Apply the schema to the intended production Supabase project
and verify RLS there before publishing any records.

## 6. Verify the code before deployment

Run:

```sh
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

At the last recorded check, TypeScript and production build passed. Lint failed
because ESLint 9 could not find an `eslint.config.js`, `.mjs`, or `.cjs` file.
Resolve the lint configuration before treating the checks as all green.

## 7. Publishing and revocation notes

Only published rows are visible to public Supabase reads and the matching
proxy route. Public page galleries still need implementation before published
records appear as portfolio sections.

Successful image responses currently use browser caching for up to one hour,
shared-cache freshness for one day, plus a seven-day stale-while-revalidate
window. Successful PDF responses use one-minute browser caching and five
minutes of shared-cache freshness. Errors use `no-store`. Unpublishing blocks
new uncached lookups but may not immediately remove a previously cached
response; purge supported caches when faster revocation is required.

## Before calling the website operational

- Complete a real public photo gallery using published rows and
  `/api/image/{fileId}`.
- Complete a public research-paper section using published rows and
  `/api/paper/{fileId}` and show only owner-approved PDFs.
- Complete the `/admin` dashboard and photo/research CRUD flows.
- Add loading, empty, and error states to the public data sections.
- Confirm the selected media, biography, metadata, and publication rights.
- Supply TikTok and WhatsApp details if those links are wanted; currently only
  the supplied Instagram handle is shown.
- Fix ESLint configuration and rerun lint, typecheck, and production build.
- Test the deployed site at mobile, tablet, and desktop sizes and verify RLS,
  admin claims, and proxy behavior against production services.
