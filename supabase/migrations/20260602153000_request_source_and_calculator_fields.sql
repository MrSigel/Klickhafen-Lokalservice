alter table public.service_requests
  add column if not exists request_source text default 'contact_form',
  add column if not exists salutation text,
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists description text,
  add column if not exists service_category text,
  add column if not exists selected_services jsonb,
  add column if not exists effort_size text,
  add column if not exists distance_zone text,
  add column if not exists estimated_price text,
  add column if not exists fixed_price_suggestion text,
  add column if not exists calculator_data jsonb;

alter table public.request_images
  add column if not exists file_type text;
