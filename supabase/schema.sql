-- ============================================================
-- Ki Care — Supabase Schema
-- Ejecutar en: Supabase Dashboard → SQL Editor
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
  caracteristicas           text[]       not null default '{}',
  imagen_url                text         not null default '',
  reviews                   jsonb        not null default '[]',
  activo                    boolean      not null default true,
  orden                     integer      not null default 0,
  created_at                timestamptz  not null default now(),
  updated_at                timestamptz  not null default now()
);

-- Trigger: actualiza updated_at automáticamente en cada UPDATE
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
-- 2. RLS — Tabla productos
-- ============================================================
alter table public.productos enable row level security;

-- Cualquiera puede leer productos activos
drop policy if exists "Public read active productos" on public.productos;
create policy "Public read active productos"
  on public.productos for select
  using (activo = true);

-- Admins autenticados: lectura, escritura, actualización y borrado
drop policy if exists "Admins full access" on public.productos;
create policy "Admins full access"
  on public.productos for all
  using     ((select auth.role()) = 'authenticated')
  with check ((select auth.role()) = 'authenticated');


-- ============================================================
-- 3. Storage — Bucket product-images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Lectura pública de imágenes
drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Admins: subir imágenes
drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and (select auth.role()) = 'authenticated'
  );

-- Admins: actualizar imágenes
drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and (select auth.role()) = 'authenticated'
  );

-- Admins: eliminar imágenes
drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and (select auth.role()) = 'authenticated'
  );


-- ============================================================
-- 4. Seed — Productos iniciales
-- ============================================================
insert into public.productos
  (id, nombre, subtitulo, categoria, precio_original, precio_actual, descuento,
   rating, total_opiniones, vendidos, stock, envio_fecha, badges,
   profesionales_consultando, descripcion, caracteristicas, reviews, activo, orden)
values

-- Radiance RF
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
    {"id":"r1","author":"María García","profession":"Esteticista","city":"Buenos Aires","rating":5,"date":"12 may 2025","comment":"Excelente equipo. Lo uso hace 3 meses y mis clientes ya notan los resultados desde la segunda sesión. La pantalla táctil es intuitiva y la potencia es muy buena para el precio. El soporte post-venta es increíble.","initials":"MG","avatarColor":"bg-rose-500","verified":true},
    {"id":"r2","author":"Luciana Pérez","profession":"Cosmetóloga","city":"Córdoba","rating":5,"date":"28 abr 2025","comment":"Llegó perfectamente embalado y antes de lo previsto. La capacitación incluida fue muy completa, me ayudó a entender todos los protocolos. Mis clientas están encantadas con los resultados de reafirmación.","initials":"LP","avatarColor":"bg-violet-500","verified":true},
    {"id":"r3","author":"Carolina Romero","profession":"Kinesiologa","city":"Rosario","rating":4,"date":"15 abr 2025","comment":"Muy buena calidad para el precio. El único detalle es que el manual podría tener más protocolos detallados, pero el equipo en sí es excelente. Muy fácil de manejar con los pacientes.","initials":"CR","avatarColor":"bg-emerald-500","verified":true},
    {"id":"r4","author":"Sofía Martínez","profession":"Esteticista","city":"Mendoza","rating":5,"date":"3 abr 2025","comment":"Lo compré hace dos meses y ya recuperé la inversión. Mis clientes piden el tratamiento de radiofrecuencia constantemente. El equipo es robusto, silencioso y muy profesional.","initials":"SM","avatarColor":"bg-sky-500","verified":false}
  ]',
  true, 1
),

-- Ultracav Pro
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
    {"id":"r1","author":"Valeria Torres","profession":"Esteticista","city":"La Plata","rating":5,"date":"8 may 2025","comment":"Increíble resultado en reducción de medidas. Mis clientas pierden entre 2 y 4 cm por sesión. El equipo es muy potente y silencioso. La entrega fue rapidísima y bien embalado.","initials":"VT","avatarColor":"bg-amber-500","verified":true},
    {"id":"r2","author":"Andrea Núñez","profession":"Cosmetóloga","city":"Tucumán","rating":5,"date":"20 abr 2025","comment":"El panel digital con programas preset es una maravilla. Puedo elegir el protocolo exacto para cada cliente. Los resultados son visibles desde la primera sesión y se mantienen con el tiempo.","initials":"AN","avatarColor":"bg-pink-500","verified":true},
    {"id":"r3","author":"Patricia Díaz","profession":"Kinesiologa","city":"Santa Fe","rating":4,"date":"1 abr 2025","comment":"Buen equipo en general. Me gustaría que el cabezal viniera con más accesorios, pero la calidad de ultrasonido es muy buena. El soporte técnico respondió rápido cuando tuve una pregunta.","initials":"PD","avatarColor":"bg-teal-500","verified":true}
  ]',
  true, 2
),

-- Combo Facial Pro
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
    {"id":"r1","author":"Natalia Fernández","profession":"Esteticista","city":"Buenos Aires","rating":5,"date":"15 may 2025","comment":"El mejor combo que encontré en el mercado. Tener los tres equipos coordinados hace que los protocolos sean mucho más efectivos. El maletín profesional es un plus que mis clientas notan cuando llego a domicilio.","initials":"NF","avatarColor":"bg-indigo-500","verified":true},
    {"id":"r2","author":"Daniela Sosa","profession":"Cosmetóloga","city":"Córdoba","rating":5,"date":"5 may 2025","comment":"La máscara LED es espectacular. La RF facial da resultados muy rápidos en lifting y la microdermoabrasión deja la piel impecable. Es una inversión que vale absolutamente la pena.","initials":"DS","avatarColor":"bg-rose-400","verified":true},
    {"id":"r3","author":"Florencia López","profession":"Esteticista","city":"Rosario","rating":5,"date":"22 abr 2025","comment":"Compré el combo hace un mes y ya tengo agenda llena. Mis clientas ven los resultados en 3 sesiones y todas piden el tratamiento completo. El 20% de descuento fue clave para decidirme.","initials":"FL","avatarColor":"bg-purple-500","verified":false}
  ]',
  true, 3
)

on conflict (id) do nothing;
