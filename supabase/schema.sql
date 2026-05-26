-- ============================================================
-- Ki Care — Supabase Schema
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Tabla productos
-- ============================================================
create table if not exists public.productos (
  id                       text primary key,
  nombre                   text not null,
  subtitulo                text not null default '',
  categoria                text not null default '',
  precio_original          numeric not null default 0,
  precio_actual            numeric not null default 0,
  descuento                integer not null default 0,
  rating                   numeric not null default 5,
  total_opiniones          integer not null default 0,
  vendidos                 integer not null default 0,
  stock                    integer not null default 0,
  envio_fecha              text not null default '',
  badges                   text[] not null default '{}',
  profesionales_consultando integer not null default 0,
  descripcion              text not null default '',
  caracteristicas          text[] not null default '{}',
  imagen_url               text not null default '',
  reviews                  jsonb not null default '[]',
  activo                   boolean not null default true,
  orden                    integer not null default 0,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- Auto-actualizar updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger productos_updated_at
  before update on public.productos
  for each row execute procedure public.set_updated_at();

-- 2. RLS (Row Level Security)
-- ============================================================
alter table public.productos enable row level security;

-- Público: solo leer productos activos
create policy "Public read active productos"
  on public.productos for select
  using (activo = true);

-- Admins autenticados: acceso total
create policy "Admins full access"
  on public.productos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 3. Storage — bucket de imágenes
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admins upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admins update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admins delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- 4. Seed — productos iniciales
-- ============================================================
insert into public.productos
  (id, nombre, subtitulo, categoria, precio_original, precio_actual, descuento,
   rating, total_opiniones, vendidos, stock, envio_fecha, badges,
   profesionales_consultando, descripcion, caracteristicas, reviews, activo, orden)
values
(
  'radiance-rf',
  'Radiance RF',
  'Radiofrecuencia Tripolar Profesional',
  'Radiofrecuencia',
  485000, 412250, 15,
  4.8, 214, 892, 3,
  'Mañana, 24 may',
  ARRAY['NUEVO', 'MÁS VENDIDO'],
  14,
  'Equipo de radiofrecuencia tripolar de última generación para tratamientos faciales y corporales. Tecnología de triple polo que garantiza resultados visibles desde la primera sesión.',
  ARRAY[
    'Aplicación facial y corporal',
    'Pantalla táctil de 7 pulgadas',
    '5 niveles de potencia ajustable',
    'Certificación ANMAT vigente',
    '220V – 50Hz',
    'Origen: Industria nacional'
  ],
  '[
    {"id":"r1","author":"María García","profession":"Esteticista","city":"Buenos Aires","rating":5,"date":"12 may 2025","comment":"Excelente equipo. Lo uso hace 3 meses y mis clientes ya notan los resultados desde la segunda sesión.","initials":"MG","avatarColor":"bg-rose-500","verified":true},
    {"id":"r2","author":"Luciana Pérez","profession":"Cosmetóloga","city":"Córdoba","rating":5,"date":"28 abr 2025","comment":"Llegó perfectamente embalado y antes de lo previsto. La capacitación incluida fue muy completa.","initials":"LP","avatarColor":"bg-violet-500","verified":true},
    {"id":"r3","author":"Carolina Romero","profession":"Kinesiologa","city":"Rosario","rating":4,"date":"15 abr 2025","comment":"Muy buena calidad para el precio. El equipo en sí es excelente y muy fácil de manejar.","initials":"CR","avatarColor":"bg-emerald-500","verified":true}
  ]',
  true, 1
),
(
  'ultracav-pro',
  'Ultracav Pro',
  'Ultracavitador de Alta Potencia',
  'Ultrasonido',
  395000, 335750, 15,
  4.7, 168, 654, 7,
  'Mañana, 24 may',
  ARRAY['ALTA DEMANDA'],
  9,
  'Ultracavitador profesional de alta potencia con tecnología de ultrasonido focalizado. Rompe adipocitos de forma no invasiva sin dolor ni tiempo de recuperación.',
  ARRAY[
    'Ultrasonido focalizado 40kHz',
    'Panel digital con programas preset',
    'Aplicación corporal',
    'Cabezal 360° intercambiable',
    'Certificación ANMAT vigente',
    'Origen: Industria nacional'
  ],
  '[
    {"id":"r1","author":"Valeria Torres","profession":"Esteticista","city":"La Plata","rating":5,"date":"8 may 2025","comment":"Increíble resultado en reducción de medidas. La entrega fue rapidísima y bien embalado.","initials":"VT","avatarColor":"bg-amber-500","verified":true},
    {"id":"r2","author":"Andrea Núñez","profession":"Cosmetóloga","city":"Tucumán","rating":5,"date":"20 abr 2025","comment":"El panel digital con programas preset es una maravilla. Los resultados son visibles desde la primera sesión.","initials":"AN","avatarColor":"bg-pink-500","verified":true},
    {"id":"r3","author":"Patricia Díaz","profession":"Kinesiologa","city":"Santa Fe","rating":4,"date":"1 abr 2025","comment":"Buen equipo en general. El soporte técnico respondió rápido cuando tuve una pregunta.","initials":"PD","avatarColor":"bg-teal-500","verified":true}
  ]',
  true, 2
),
(
  'combo-facial',
  'Combo Facial Pro',
  'Set Tratamiento Facial Completo',
  'Set Completo',
  720000, 576000, 20,
  4.9, 87, 312, 5,
  'Lun. 26 may',
  ARRAY['NUEVO', '20% OFF'],
  22,
  'Kit completo para tratamientos faciales premium. Incluye equipo de radiofrecuencia facial, microdermoabrasión y máscara LED. Todo certificado y listo para trabajar.',
  ARRAY[
    'Radiofrecuencia facial + RF Eyes',
    'Microdermoabrasión con 4 cabezales',
    'Máscara LED 7 colores',
    'Maletín profesional incluido',
    'Certificación ANMAT vigente',
    'Manual en español + video-tutoriales'
  ],
  '[
    {"id":"r1","author":"Natalia Fernández","profession":"Esteticista","city":"Buenos Aires","rating":5,"date":"15 may 2025","comment":"El mejor combo que encontré en el mercado. El maletín profesional es un plus que mis clientas notan.","initials":"NF","avatarColor":"bg-indigo-500","verified":true},
    {"id":"r2","author":"Daniela Sosa","profession":"Cosmetóloga","city":"Córdoba","rating":5,"date":"5 may 2025","comment":"La máscara LED es espectacular. La RF facial da resultados muy rápidos en lifting.","initials":"DS","avatarColor":"bg-rose-400","verified":true},
    {"id":"r3","author":"Florencia López","profession":"Esteticista","city":"Rosario","rating":5,"date":"22 abr 2025","comment":"Compré el combo hace un mes y ya tengo agenda llena. El 20% de descuento fue clave para decidirme.","initials":"FL","avatarColor":"bg-purple-500","verified":false}
  ]',
  true, 3
)
on conflict (id) do nothing;
