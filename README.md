# Moh. Wail Irsyad — Personal web

A dynamic, dark editorial portfolio website with a lightweight admin CMS.

## Technology
Next.js App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL/Auth, Google Drive API (Service Account), and Vercel.

## Media architecture
Google Drive stores originals. Supabase stores metadata and publication state. The administrator manually registers File IDs. The website serves only registered and published images/PDFs through controlled server proxy routes.

## Scope note
This version manages photos and research papers only.

## Workflow
Follow the five phases in `PLAN.md`. Work one file/component at a time and wait for approval between tasks. Never commit `.env.local` or credentials. Publish only owner-approved information and assets.
