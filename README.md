<!-- # Moh. Wail Irsyad — Personal web

A dynamic, dark editorial portfolio website with a lightweight admin CMS.

## Read before coding
1. `AGENTS.md`
2. `SKILLS.md`
3. `PLAN.md`
4. `CODEX_PROMPT.md`
5. `docs/DATABASE.md`
6. `docs/DRIVE_PROXY.md`
7. `docs/DESIGN_GUIDELINES.md`
8. `docs/DEPLOYMENT.md`
9. `docs/CONTENT_INVENTORY.md`

## Technology
Next.js App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL/Auth, Google Drive API (Service Account), and Vercel.

## Media architecture
Google Drive stores originals. Supabase stores metadata and publication state. The administrator manually registers File IDs. The website serves only registered and published images/PDFs through controlled server proxy routes.

## Scope note
This version manages photos and research papers only.

## Workflow
Follow the five phases in `PLAN.md`. Work one file/component at a time and wait for approval between tasks. Never commit `.env.local` or credentials. Publish only owner-approved information and assets. -->

# Moh. Wail Irsyad Portfolio — Codex Repair Prompt Pack

This pack breaks the repair work into focused phases to reduce unnecessary Codex usage and keep changes easy to review.

## Recommended order

1. `prompts/00-inspect-and-report.md` — inspect only; do not change code.
2. `prompts/01-fix-google-drive-images.md` — fix and verify the image delivery path.
3. `prompts/02-build-functional-admin-dashboard.md` — complete the dashboard using existing auth and CRUD.
4. `prompts/03-public-site-integration-check.md` — verify public pages and integration.
5. `prompts/04-final-quality-check.md` — run checks and summarize the finished work.

## How to use

- Open the existing repository in Codex on `dev-branch`.
- Paste only one phase prompt at a time.
- Start with Phase 00. Review its findings before asking Codex to implement anything.
- Commit or create a backup before each implementation phase.
- Do not proceed to the next phase until the current phase is verified.
- If Codex discovers a blocker requiring credentials or external configuration, ask it to report the exact blocker rather than inventing a workaround.

## Project constraints

- This is a repair/completion task, not a redevelopment.
- Preserve the existing stack, project structure, database schema, UI identity, and working behavior.
- Reuse existing dependencies and implementation patterns.
- Do not introduce new frameworks, databases, ORMs, storage providers, or unnecessary libraries.
- Keep Google Drive as the image and research-paper source.
- Keep Supabase as the existing metadata/authentication backend.
- Keep credentials server-side.
- Use Tailwind CSS for any necessary styling.
- Do not add video functionality, video tables, video routes, or video admin features.
- Do not invent biography details, credits, awards, research information, or contact details.
- Avoid unrelated refactoring and elaborate dashboard effects/charts.

## Scope priority

1. Google Drive images must render correctly.
2. Admin dashboard must exist and be usable.
3. Existing photo and research-paper management must work.
4. Existing public portfolio features must continue working.
5. Verify and report; do not claim tests passed unless actually run.
