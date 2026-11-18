# Phase 1 — Project Setup and Database Record

This document records the Phase 1 work completed so far and the remaining
acceptance gaps. It follows the task sequence in `PLAN.md`; it does not mark
Phase 1 complete while required checks are failing.

## Task 1 — Project foundation

### Implemented

- `package.json` names the project `personal-web-moh-wail-irsyad` and uses pnpm.
- Next.js, React, TypeScript, Tailwind CSS, PostCSS, and ESLint dependencies are
  declared.
- `.gitignore` excludes dependencies, generated build output, local
  environment files, credential files, and the local `assets/` source material.
- `.env.example` is explicitly kept trackable as a placeholder template.

### Remaining work

- No Next.js App Router `app/` or `src/app/` directory exists.
- No `tsconfig.json`, Tailwind/PostCSS configuration, or ESLint flat config
  exists.
- `pnpm lint` fails because ESLint cannot find `eslint.config.*`.
- `pnpm exec tsc --noEmit` has no TypeScript project configuration to compile.
- `pnpm build` fails because Next.js cannot find an `app/` or `pages/` directory.

The foundation task is therefore incomplete. Do not treat package dependency
declarations alone as a working Next.js application.

## Task 2 — Supabase schema

`supabase/schema.sql` defines exactly these application tables:

- `public.performances`, for photo metadata only, with the JPEG, PNG, WebP, and
  GIF MIME allowlist.
- `public.research_papers`, for research-paper metadata with PDF MIME type.

Both tables enable RLS. Published rows are readable by public roles, and admin
management policies check the trusted `app_metadata.role = 'admin'` JWT claim.
The schema does not create video fields, extra application tables, or storage
buckets. The schema was reviewed but has not been applied to a live Supabase
project as part of this repository task.

## Task 3 — Environment template

`.env.example` contains blank placeholders for Supabase and Google values, plus
the local app URL. It contains no real credentials. `.env.local` is ignored by
`.gitignore`; do not commit it or print its contents.

## Task 4 — Supabase helper

`src/lib/supabase/server.ts` provides the first server-side Supabase helper. It
uses `@supabase/ssr`, Next.js async cookies, the public Supabase URL and anon
key, and a `server-only` marker. It does not use or expose a service-role key.
The browser helper has not been created yet.

## Phase 1 verification record

The lint, project typecheck, and production build checks did not pass because
the application and configuration files listed under Task 1 remain missing.
The Supabase schema and server helper were reviewed separately, but no live
Supabase authorization test was run.

## Related documentation

- Database requirements: `DATABASE.md`
- Google Drive setup (Phase 2): `GOOGLE_DRIVE_SETUP.md`
- Overall roadmap and phase acceptance criteria: `../PLAN.md`
