# SKILLS.md — Technical Implementation Playbook

## Next.js
- Use App Router and TypeScript.
- Prefer Server Components for data retrieval and static content.
- Use Client Components only when interaction requires them.
- Protect admin pages and every mutation on the server; hiding a navigation link is not authorization.
- Use route handlers for controlled media delivery.
- Use Node.js runtime for Google APIs and streaming.

## Tailwind CSS and UX
- Follow `docs/DESIGN_GUIDELINES.md`.
- Preserve the dark, theatrical, editorial identity of the supplied portfolio reference.
- Use responsive layouts, semantic HTML, keyboard-accessible navigation, visible focus states, descriptive alt text, and reduced-motion support.
- Avoid generic dashboard/SaaS styling on the public portfolio.

## Supabase
- Use `@supabase/ssr` for cookie-aware server/browser clients.
- Use a server-side Supabase client for public proxy lookups with the anon key and RLS, unless a narrowly scoped privileged operation is justified.
- Enable and test RLS.
- Public queries must filter published records even though RLS also enforces publication.
- Never expose the service-role key in a client bundle.
- Admin authorization must use a trusted claim such as `app_metadata.role = 'admin'`.

## Google Drive
- Use `googleapis` with the read-only Drive scope.
- Keep the Drive client in a server-only module (`import "server-only"`).
- Share only the required Drive folder with the Service Account.
- Fetch only the exact File ID returned by a matching published Supabase record.
- Do not expose Drive folder listing/search to public users.
- Verify upstream status, MIME type, and file size where practical.
- Stream media instead of buffering large files in memory.

## Proxy routes
- Image route checks `performances`, exact `drive_file_id`, `is_published = true`, and allowed image MIME type.
- PDF route checks `research_papers`, exact `drive_file_id`, `is_published = true`, and `application/pdf`.
- Return 404 for missing or unpublished rows.
- Return 415 for unsupported media types where appropriate.
- Cache only successful public responses.
- Document that public CDN cache can delay revocation after unpublishing.
- Do not create video routes in this version.

## Admin
- No public registration.
- Validate all fields server-side.
- Reject duplicate Drive File IDs.
- Provide loading, success, and error states.
- Confirm destructive database-record deletion.
- Never delete the actual Drive file as a side effect of deleting a row.

## Quality checks
Run lint, typecheck, and production build when scripts exist. Test anonymous, authenticated non-admin, and admin permissions; registered/unregistered IDs; published/unpublished rows; invalid MIME types; and missing Drive files.
