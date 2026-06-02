alter table public.offers
  add column if not exists credit_check_required boolean default false,
  add column if not exists credit_check_consent_text text,
  add column if not exists credit_check_threshold numeric default 500;
