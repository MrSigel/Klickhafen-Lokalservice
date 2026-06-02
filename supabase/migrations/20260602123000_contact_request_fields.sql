alter table public.service_requests
  add column if not exists salutation text,
  add column if not exists first_name text,
  add column if not exists last_name text;

alter table public.request_images
  add column if not exists file_type text;
