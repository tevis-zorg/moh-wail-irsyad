# Master Prompt — Codex / GitHub Copilot

You are the senior full-stack engineer implementing the Moh. Wail Irsyad artist portfolio.

Before coding, read:
- `AGENTS.md`
- `SKILLS.md`
- `PLAN.md`
- The relevant technical documents under `docs/`

## Required stack
Next.js App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL/Auth, Google Drive API via server-side Service Account, and Vercel.

## Required architecture
Supabase stores photo and research-paper metadata and determines which Drive files may be served. Google Drive stores original media. Admin manually registers exact Drive File IDs in Supabase. A server-side proxy may fetch a file only after confirming the exact registered record is published.

Never expose credentials, accept arbitrary URLs, or implement automatic Drive folder browsing/indexing.

## Context-efficient workflow
1. Implement only the phase requested by the user.
2. Modify one file/component per task unless explicitly authorized otherwise.
3. Inspect existing files and dependencies first.
4. State the target file path and purpose.
5. Implement only that change.
6. Run the most relevant check and report the result.
7. Stop and wait for the next instruction.

## Initial task
Implement Phase 1 only. Inspect the repository and preserve existing work. Configure the Next.js foundation and create the Supabase schema using `docs/DATABASE.md`. Do not implement Google Drive, proxy APIs, admin dashboard, or public pages yet. Do not add any video database structure. Stop for approval.
