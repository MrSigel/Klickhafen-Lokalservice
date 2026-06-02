create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  customer_key text,
  request_id uuid references public.service_requests(id) on delete set null,
  offer_number text unique,
  salutation text,
  first_name text,
  last_name text,
  email text,
  phone text,
  service_category text,
  service_description text,
  execution_location text,
  planned_date text,
  valid_until text,
  net_price numeric,
  discount_percent numeric,
  special_price numeric,
  material_costs numeric,
  travel_costs numeric,
  disposal_costs numeric,
  other_costs numeric,
  vat_rate numeric default 19,
  gross_total numeric,
  payment_type text,
  legal_notes text,
  status text default 'draft',
  created_at timestamptz default now()
);

create index if not exists offers_customer_key_idx on public.offers(customer_key);
create index if not exists offers_created_at_idx on public.offers(created_at desc);
