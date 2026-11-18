# Moh. Wail Irsyad — Personal web

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
Follow the five phases in `PLAN.md`. Work one file/component at a time and wait for approval between tasks. Never commit `.env.local` or credentials. Publish only owner-approved information and assets.
