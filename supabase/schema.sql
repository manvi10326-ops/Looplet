-- Looplet Handmade Crochet Boutique — Supabase Schema
-- Project ID: inizjboarjuilsosnyma
-- Run this SQL once in your Supabase Dashboard -> SQL Editor.

create extension if not exists pgcrypto;

-- 1. Standard Boutique Checkout Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text not null unique,
  customer_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  city text not null,
  state text not null,
  pin_code text not null,
  order_note text,
  items jsonb not null,
  subtotal integer not null check (subtotal >= 0),
  shipping_fee integer not null check (shipping_fee >= 0),
  total integer not null check (total >= 0),
  status text not null default 'pending_whatsapp',
  whatsapp_url text,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- 2. Custom Crochet Order Requests
create table if not exists public.custom_orders (
  id uuid primary key default gen_random_uuid(),
  request_reference text not null unique,
  customer_name text not null,
  whatsapp_number text not null,
  product_type text not null,
  preferred_color text,
  description text not null,
  reference_file_name text,
  status text not null default 'pending_review',
  whatsapp_url text,
  created_at timestamptz not null default now()
);

create index if not exists custom_orders_created_at_idx on public.custom_orders (created_at desc);

-- Row Level Security (RLS)
-- Note: Server-side routes using SUPABASE_SERVICE_ROLE_KEY bypass RLS safely.
-- If SUPABASE_ANON_KEY is used on the server, allow insert-only (no public select/update/delete).
alter table public.orders enable row level security;
alter table public.custom_orders enable row level security;

drop policy if exists "Allow anonymous order inserts" on public.orders;
create policy "Allow anonymous order inserts"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow anonymous custom order inserts" on public.custom_orders;
create policy "Allow anonymous custom order inserts"
  on public.custom_orders
  for insert
  to anon, authenticated
  with check (true);
