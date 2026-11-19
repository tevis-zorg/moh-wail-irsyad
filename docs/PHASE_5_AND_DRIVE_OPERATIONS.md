# Phase 5 Work Record and Google Drive Operations

This guide records the public frontend work completed so far and explains how
the existing Google Drive integration is intended to operate. It describes the
repository state at the time of writing; it does not mark incomplete public
gallery or admin features as finished.

## Phase 5 work completed

| Prompt | Work recorded | Current limitation |
| --- | --- | --- |
| 5.1 Design and content audit | Reviewed the design/content guidance and supplied materials. The supplied portfolio and short-biography PDFs are the content references. | The owner must approve content and media for publication. |
| 5.2 Global layout and navigation | Added the dark public shell, desktop/mobile navigation, Photos and Research Papers links, and skip link. | The Photos and Research Papers page sections are not yet rendered. Their navigation anchors currently have no matching section. |
| 5.3 Home / Hero | Added the name, role description and a neutral portrait/performance placeholder. | The placeholder is not a real approved portrait or performance image. |
| 5.4 About Me | Added biography content sourced from the owner-supplied short biography. | Owner should complete final fact verification before launch. |
| 5.5 Photos / Performance Gallery | Added `getPublishedPerformances()` server query helper. It filters published records and approved image MIME types. | No public photo gallery UI, loading state, empty state, or error state is connected yet. |
| 5.6 Research Papers | Added `getPublishedResearchPapers()` server query helper. It filters published PDF records and selects the public display fields. | No public research-paper UI, proxy links in public markup, or display states are connected yet. The owner must approve public viewing/download rights before publishing each paper. |
| 5.7 Contact | Added the supplied Instagram handle as a link. | TikTok and WhatsApp links are omitted because their details were not supplied. |
| 5.8 Footer | Added a semantic responsive footer with a generic thank-you message, artist name, and dynamic year. | The owner has not supplied preferred thank-you/copyright wording. |
| 5.9 Responsive/accessibility pass | Inspected responsive utility classes, disclosure navigation, focus styles, heading order, and reduced-motion styling. Increased navigation touch target height. | This was a source review, not a full browser/assistive-technology test. Public gallery image alt text and states remain unreviewed because the sections are not present. |

### Last recorded checks

- `pnpm exec tsc --noEmit` — passed.
- `pnpm build` — passed; the build listed `/`, `/admin/login`, `/api/image/[fileId]`, and `/api/paper/[fileId]`.
- `pnpm lint` — failed because ESLint 9 could not find an `eslint.config.js`,
  `.mjs`, or `.cjs` configuration file.
- A scan of `.next/static` found no server credential names or private-key
  marker. This is a limited bundle scan, not a substitute for keeping
  credentials server-only.

**Phase 5 is incomplete and the project is not launch-ready.** The Homepage
currently contains Home, About Me, Contact, and Footer. The gallery query
helpers and media routes exist, but there are no public Photos or Research
Papers sections consuming them.

## Google Drive architecture

- Google Drive stores original image and PDF files.
- Supabase stores the metadata and publication state for each file.
- The application must serve a file through its matching controlled route:
  - Photo: `/api/image/{drive_file_id}`
  - Research paper: `/api/paper/{drive_file_id}`
- Each route looks up the exact File ID in its corresponding table and requires
  `is_published = true` before requesting that registered file from Drive.
- Files should remain private in Drive. Do not make the folder public, expose
  Drive sharing URLs, or put a Drive URL in public page markup.
- The server-only Drive client uses the
  `https://www.googleapis.com/auth/drive.readonly` scope. It does not list or
  crawl folders.

## Owner setup: Google Cloud and Drive

1. In Google Cloud Console, select or create the project that will own this
   integration.
2. Enable the Google Drive API for that project.
3. Create a Service Account. Create a key only if needed for this deployment;
   keep any downloaded key outside the repository and delete local copies
   after the needed values have been installed securely.
4. Copy the Service Account email from its details page.
5. In Google Drive, share only the intended portfolio folder (or individual
   intended files) with that email, with Viewer access. Do not grant Editor
   access and do not enable public link sharing for this integration.
6. Keep the files' actual MIME types supported by the relevant table and route:
   JPEG, PNG, WebP, or GIF for photos; PDF for papers.

The Service Account email and private key are credentials. Do not paste them
into chat, source files, screenshots, issue trackers, or Git.

## Environment configuration

The application expects these variables (see `.env.example`):

| Variable | Where it is used |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL; public configuration. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon key; safe for browser use only with correct RLS. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Server-side Drive authentication; keep in server environment configuration. |
| `GOOGLE_PRIVATE_KEY` | Server-side Drive authentication; secret, never expose to browser. |
| `NEXT_PUBLIC_APP_URL` | Public site origin used for application configuration. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional server-only secret. Do not add it unless a specific trusted server operation needs it; never expose it to browser code. |

### Local setup

1. Copy the placeholder names from `.env.example` into the ignored local
   `.env.local` file.
2. Enter the Supabase URL and anon key from the intended Supabase project.
3. Enter the Service Account email and private key in `.env.local`. The Drive
   client converts literal `\\n` sequences in `GOOGLE_PRIVATE_KEY` to newline
   characters. Do not commit `.env.local` or a downloaded credential JSON file.
4. Set `NEXT_PUBLIC_APP_URL` to the local origin while developing, normally
   `http://localhost:3000`.
5. Start the application with `pnpm dev`. Restart it after changing
   environment variables.

### Vercel setup

Add the same required variables in the Vercel project's Environment Variables
settings for the appropriate environments. Mark the Google private key as
secret, use the production app origin for `NEXT_PUBLIC_APP_URL`, and redeploy
after changing values. Do not add `SUPABASE_SERVICE_ROLE_KEY` for Drive reads:
public Supabase reads use the anon key and RLS; Drive reads use the server
Service Account.

## Registering and publishing a Drive file

The intended workflow is manual registration. There is no Drive browser,
folder indexer, or automatic discovery feature.

1. Copy the exact Google Drive File ID from the file's URL. For a URL shaped
   like `https://drive.google.com/file/d/FILE_ID/view`, the ID is the segment
   between `/d/` and `/view`. Store only that ID in Supabase, not the URL.
2. Verify that the Service Account can access that exact file and that Drive
   reports the expected MIME type. The file must be shared with the Service
   Account; it does not need to be public.
3. Register its metadata in the correct Supabase table:
   - `performances`: title, event name, optional description/year, exact Drive
     File ID, and an approved image MIME type.
   - `research_papers`: title, optional authors/abstract/publication/year,
     exact Drive File ID, and `application/pdf`.
4. Keep `is_published = false` while reviewing the metadata and verifying
   access. For a paper, first confirm the owner has the right to make the PDF
   publicly viewable/downloadable. The schema has no separate rights-approval
   column; the publishing decision is represented by `is_published`.
5. Publish only approved rows. RLS permits public reads of published rows,
   while the proxy independently checks publication state before fetching the
   file.
6. Once public gallery sections are implemented, their links must use the
   same-origin proxy paths above. Never link visitors directly to Drive.

At present, the repository does not contain a complete admin dashboard or
photo CRUD UI. The research-paper server action supports creating a record and
requires a rights confirmation when that new record is published, but a full
research CRUD interface is not present. Do not treat the UI workflow as
available until those admin features have been completed. If records are
entered using Supabase's trusted dashboard tools in the meantime, preserve the
schema constraints, RLS policy intent, and publication approval requirements.

## Verify a file without making it public

1. Use a known image File ID or PDF File ID that has been shared with the
   Service Account. Do not use a folder ID.
2. Run a server-side metadata check that requests only that exact ID and only
   metadata such as `id` and `mimeType`; do not list folder contents or print
   credentials. An ID alone is not sufficient: check the returned MIME type.
3. Confirm the returned MIME type is the expected approved type. A Google
   document or folder is not an image/PDF and must not be registered as one.
4. Do not make the file public to perform this check. A public proxy request
   will correctly return 404 while the row is unpublished or unregistered.

After a matching metadata row is approved and published, verify the public
proxy URL with an HTTP GET. Confirm successful responses have the expected
content type and `X-Content-Type-Options: nosniff`. Test an unpublished or
unregistered File ID and confirm it does not return the file. Never include
credentials in a test command, URL, or terminal output.

## Caching and unpublishing

Current successful response cache policies are:

- Images: browser `max-age=3600` (one hour), shared cache `s-maxage=86400` (one
  day), with a `stale-while-revalidate=604800` (seven day) window.
- PDFs: browser `max-age=60` (one minute), shared cache `s-maxage=300` (five
  minutes).

Error responses use `Cache-Control: no-store`. Unpublishing prevents new
uncached proxy requests from passing the database gate, but a previously
cached response may remain available until its cache lifetime ends or the
relevant CDN/browser cache is purged. Image stale-while-revalidate behavior can
extend stale availability. Do not promise immediate revocation.

## Still needed from the owner

- Approve the selected public photos, captions/event metadata, and credits.
- Confirm public viewing/download rights for every research PDF before
  publishing its row.
- Provide TikTok URL and confirmed WhatsApp number if those links should appear.
- Confirm preferred footer wording.
- Complete public Photos and Research Papers sections, including loading,
  empty, and error states, and complete admin management workflows before
  treating the integration as operational for normal content management.
