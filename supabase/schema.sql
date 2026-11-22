-- Moh. Wail Irsyad portfolio: photo + research-paper schema only.
-- No video table, category, or URL field in this version.

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
        check (mime_type in ('application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 'application/vnd.ms-powerpoint', )),
    is_published boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists performances_published_idx on public.performances (is_published);
create index if not exists performances_event_idx on public.performances (event_name);
create index if not exists performances_year_idx on public.performances (year);
create index if not exists research_papers_published_idx on public.research_papers (is_published);
create index if not exists research_papers_year_idx on public.research_papers (year);

alter table public.performances enable row level security;
alter table public.research_papers enable row level security;

-- Table privileges allow API requests to reach RLS; the policies below
-- determine which rows each role can read or modify.
grant select on public.performances, public.research_papers to anon, authenticated;
grant insert, update, delete on public.performances, public.research_papers to authenticated;

drop policy if exists "Public can read published performances" on public.performances;
create policy "Public can read published performances"
on public.performances for select to anon, authenticated
using (is_published = true);

drop policy if exists "Public can read published research papers" on public.research_papers;
create policy "Public can read published research papers"
on public.research_papers for select to anon, authenticated
using (is_published = true);

drop policy if exists "Admins can manage performances" on public.performances;
create policy "Admins can manage performances"
on public.performances for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can manage research papers" on public.research_papers;
create policy "Admins can manage research papers"
on public.research_papers for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
