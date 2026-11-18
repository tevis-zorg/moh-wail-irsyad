# Supabase Database Setup

This project currently stores only:
1. Photo/performance metadata in `public.performances`.
2. Research-paper metadata in `public.research_papers`.

There is intentionally no video table, no video category, and no video URL column.

Run the following SQL in the Supabase SQL Editor or through a migration.

## SQL schema

```sql
create extension if not exists pgcrypto;

create table if not exists public.performances (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    event_name text not null,
    description text,
    year integer check (year is null or year between 1900 and 2200),
    drive_file_id text not null unique,
    mime_type text not null
        check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/gif')),
    is_published boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.research_papers (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    authors text,
    abstract text,
    publication_name text,
    year integer check (year is null or year between 1900 and 2200),
    drive_file_id text not null unique,
    mime_type text not null default 'application/pdf'
        check (mime_type = 'application/pdf'),
    is_published boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists performances_published_idx
    on public.performances (is_published);
create index if not exists performances_event_idx
    on public.performances (event_name);
create index if not exists performances_year_idx
    on public.performances (year);
create index if not exists research_papers_published_idx
    on public.research_papers (is_published);
create index if not exists research_papers_year_idx
    on public.research_papers (year);

alter table public.performances enable row level security;
alter table public.research_papers enable row level security;

drop policy if exists "Public can read published performances" on public.performances;
create policy "Public can read published performances"
on public.performances
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Public can read published research papers" on public.research_papers;
create policy "Public can read published research papers"
on public.research_papers
for select
to anon, authenticated
using (is_published = true);

-- Assign app_metadata.role only through a trusted Supabase admin process.
-- Never allow users to set their own admin role.
drop policy if exists "Admins can manage performances" on public.performances;
create policy "Admins can manage performances"
on public.performances
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can manage research papers" on public.research_papers;
create policy "Admins can manage research papers"
on public.research_papers
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
```

## Schema notes
- `performances` is photo-only. Its MIME constraint permits JPEG, PNG, WebP, and GIF.
- Do not add a video category, video table, or video URL field in this release.
- Each table enforces uniqueness of `drive_file_id` within that table.
- If you need global uniqueness across both tables later, implement a trusted cross-table check or introduce a shared asset registry in a future migration.
- Public reads are limited to published rows by RLS.
- Admin writes require the trusted JWT `app_metadata.role = 'admin'` claim.
- Do not assign the admin claim from user-editable metadata.
- The SQL is safe to re-run for the named policies; review existing schema before applying it to a database with prior customizations.
- Add an `updated_at` trigger if automatic timestamp maintenance is required.
- Test as anonymous, authenticated non-admin, and admin users.
