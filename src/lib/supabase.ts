import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

export type DbProducto = {
  id: string;
  nombre: string;
  subtitulo: string;
  categoria: string;
  precio_original: number;
  precio_actual: number;
  descuento: number;
  rating: number;
  total_opiniones: number;
  vendidos: number;
  stock: number;
  envio_fecha: string;
  badges: string[];
  profesionales_consultando: number;
  descripcion: string;
  caracteristicas: string[];
  imagen_url: string;
  reviews: import("@/data/productos.data").Review[];
  activo: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
};

export function mapDbToProducto(db: DbProducto): import("@/data/productos.data").Producto {
  return {
    id: db.id,
    nombre: db.nombre,
    subtitulo: db.subtitulo ?? "",
    categoria: db.categoria ?? "",
    precioOriginal: db.precio_original,
    precioActual: db.precio_actual,
    descuento: db.descuento ?? 0,
    rating: db.rating ?? 5,
    totalOpiniones: db.total_opiniones ?? 0,
    vendidos: db.vendidos ?? 0,
    stock: db.stock ?? 0,
    envioFecha: db.envio_fecha ?? "",
    badges: db.badges ?? [],
    profesionalesConsultando: db.profesionales_consultando ?? 0,
    descripcion: db.descripcion ?? "",
    caracteristicas: db.caracteristicas ?? [],
    imagen_url: db.imagen_url ?? "",
    reviews: db.reviews ?? [],
  };
}
