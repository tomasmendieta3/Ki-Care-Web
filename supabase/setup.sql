-- ============================================================
-- Ki Care — Setup completo para Supabase nuevo
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================


-- ============================================================
-- 1. Tabla productos
-- ============================================================
create table if not exists public.productos (
  id                        text         primary key,
  nombre                    text         not null,
  subtitulo                 text         not null default '',
  categoria                 text         not null default '',
  precio_original           numeric      not null default 0,
  precio_actual             numeric      not null default 0,
  descuento                 integer      not null default 0,
  rating                    numeric      not null default 5,
  total_opiniones           integer      not null default 0,
  vendidos                  integer      not null default 0,
  stock                     integer      not null default 0,
  envio_fecha               text         not null default '',
  badges                    text[]       not null default '{}',
  profesionales_consultando integer      not null default 0,
  descripcion               text         not null default '',
  descripcion2              text,
  cuotas                    integer      not null default 12,
  especificaciones_pdf_url  text,
  garantia_meses            integer      not null default 24,
  caracteristicas           text[]       not null default '{}',
  especificaciones          jsonb        not null default '{}',
  imagen_principal          text         not null default '',
  galeria                   jsonb        not null default '[]',
  destacado                 boolean      not null default false,
  reviews                   jsonb        not null default '[]',
  activo                    boolean      not null default true,
  orden                     integer      not null default 0,
  created_at                timestamptz  not null default now(),
  updated_at                timestamptz  not null default now()
);


-- ============================================================
-- 2. Trigger: updated_at automatico
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists productos_updated_at on public.productos;
create trigger productos_updated_at
  before update on public.productos
  for each row execute procedure public.set_updated_at();


-- ============================================================
-- 3. RLS — Tabla productos
-- ============================================================
alter table public.productos enable row level security;

drop policy if exists "Public read active productos" on public.productos;
create policy "Public read active productos"
  on public.productos for select
  using (activo = true);

drop policy if exists "Admins full access" on public.productos;
create policy "Admins full access"
  on public.productos for all
  using     ((select auth.role()) = 'authenticated')
  with check ((select auth.role()) = 'authenticated');


-- ============================================================
-- 4. Storage — Bucket product-images (publico)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;


-- ============================================================
-- 5. Storage policies — Bucket product-images
-- ============================================================
drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and (select auth.role()) = 'authenticated'
  );

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and (select auth.role()) = 'authenticated'
  );

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and (select auth.role()) = 'authenticated'
  );


-- ============================================================
-- 6. Reload schema
-- ============================================================
notify pgrst, 'reload schema';
