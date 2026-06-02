create extension if not exists pgcrypto;

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  location text,
  service_type text not null,
  description text,
  desired_date text,
  price_type text,
  estimated_price text,
  calculator_data jsonb,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists public.request_images (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.service_requests(id) on delete cascade,
  file_url text not null,
  file_name text,
  created_at timestamptz default now()
);

alter table public.service_requests enable row level security;
alter table public.request_images enable row level security;

insert into storage.buckets (id, name, public)
values ('request-images', 'request-images', true)
on conflict (id) do update set public = excluded.public;
