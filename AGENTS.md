# AGENTS.md — Moh. Wail Irsyad Portfolio

## Project mission
Build a polished, dynamic personal portfolio website for Moh. Wail Irsyad, an actor/theater practitioner based in Bandung, Indonesia. Use the supplied `Portfolio M.Wail Irsyad.pdf` as the primary visual and content reference when it is available in the repository. Preserve its dark, minimalist, dramatic, theatrical/editorial direction.

## Required stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Google Drive API through a server-side Service Account
- Vercel deployment

## Architecture rules
- Supabase stores metadata for portfolio photos and research papers.
- Google Drive stores original photo files and research-paper PDFs.
- The administrator manually registers each Google Drive File ID in Supabase.
- A file may be served publicly only if its exact File ID is registered in the relevant Supabase table and its record is published.
- Public media delivery must go through controlled Next.js server route handlers.
- Never expose Google Service Account credentials or Supabase service-role credentials in browser code.
- Never accept arbitrary Drive URLs, folder IDs, or caller-provided upstream URLs.
- Do not implement automatic Drive folder browsing, indexing, or public Drive search.
- Use a server-only Google Drive client with read-only scope.
- Use the Node.js runtime for Google API route handlers unless a tested alternative is explicitly approved.

## Current scope: no video database
- The `performances` table is for photo records only.
- Do not add a video category, video table, video URL column, video CRUD, or video proxy route in this version.
- Video database/content management is deferred to a future project phase.
- Do not silently reintroduce video fields while implementing the frontend or admin.

## Public website requirements
- Home / hero
- About Me
- My Works — Photos
- My Works — Research Papers
- Contact
- Thank-you and copyright footer
- Photos and research papers grouped by event/project where relevant.
- Contact links for verified Instagram, TikTok, and WhatsApp accounts only.

## Admin requirements
- Admin-only login; no public registration.
- Dashboard overview.
- CRUD for photo/performance records.
- CRUD for research-paper records.
- Manual Google Drive File ID registration.
- Publish/unpublish controls.
- Deleting a database record must not delete the original Drive file.

## Limited-context coding workflow
1. Read `PLAN.md` and the relevant document in `docs/` before each task.
2. Inspect the existing repository before changing anything.
3. Implement only the phase explicitly requested.
4. Modify one file or component per coding task unless the user explicitly authorizes a larger change.
5. State the exact target file path and purpose before implementation.
6. Preserve working code and supplied assets; do not regenerate unrelated files.
7. Stop after the requested task and wait for approval before proceeding.
8. Keep reports concise: changed file, implementation summary, checks, and next single step.

## Security and data integrity
- Enable Row Level Security (RLS) on every exposed Supabase table.
- Anonymous/public users may read only published rows.
- Admin mutations require a server-verified admin role and matching RLS policy.
- Assign `app_metadata.role = 'admin'` only through a trusted Supabase dashboard or server-side administrative process. Never allow users to assign their own role.
- Use the anon/publishable key with RLS for ordinary public reads.
- Keep service-role credentials server-only and use them only when a specific trusted operation requires them.
- Validate route parameters, database registration, publication state, and MIME type before fetching Drive content.
- Verify the upstream Drive response and actual MIME type; do not blindly trust database metadata or request headers.
- Do not cache errors or unpublished content.
- Document that CDN caching may delay revocation after unpublishing.
- Set `X-Content-Type-Options: nosniff`.
- Never commit `.env.local`, private keys, service-role keys, or credential JSON files.

## Content integrity
- Do not invent biography details, awards, event names, dates, paper titles, credits, social URLs, or contact details.
- Verify all content against owner-approved source material.
- Use only assets the owner supplied or has permission to publish.
- Publish research papers only after the owner confirms public viewing/download rights.

## Explicitly out of scope
Public user accounts, comments, payments, microservices, Redis, Docker orchestration, automatic Drive indexing, transcoding, or complex role hierarchies unless the owner requests them later.
