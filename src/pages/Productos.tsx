import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ChevronRight } from "lucide-react";
import { formatPrice, productos as staticProductos, type Producto } from "@/data/productos.data";
import { supabase, mapDbToProducto, type DbProducto } from "@/lib/supabase";
import ProductVisual from "@/components/ProductVisual";
import { fadeInUp, stagger } from "@/lib/motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NAVY = "#0A0F2C";
const ORANGE = "#9e1504";

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className="w-3.5 h-3.5" fill={i <= Math.round(rating) ? ORANGE : "transparent"} stroke={ORANGE} strokeWidth={1.5} />
    ))}
  </div>
);

const ProductCard = ({ producto }: { producto: Producto }) => (
  <motion.article variants={fadeInUp} className="group">
    <Link
      to={`/productos/${producto.id}`}
      className="bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-100 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        <ProductVisual productId={producto.id} imageUrl={producto.imagen_principal} size="card" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {producto.badges.map((b) => (
            <span key={b} className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: ORANGE, color: "#fff" }}>
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">
          {producto.categoria}
        </span>
        <h3 className="text-zinc-900 font-bold text-lg leading-snug">{producto.nombre}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{producto.descripcion}</p>

        <div className="flex items-center gap-2">
          <Stars rating={producto.rating} />
          <span className="text-zinc-700 text-sm font-semibold">{producto.rating}</span>
          <span className="text-zinc-300 text-xs">·</span>
          <span className="text-zinc-400 text-xs">{producto.vendidos.toLocaleString()} vendidos</span>
        </div>

        <div className="flex flex-col gap-0.5 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-sm line-through">{formatPrice(producto.precioOriginal)}</span>
            {producto.descuento > 0 && (
              <span className="text-green-700 text-base font-black">{producto.descuento}% OFF</span>
            )}
          </div>
          <span className="text-zinc-900 font-black text-xl">{formatPrice(producto.precioActual)}</span>
          <span className="text-green-800 text-xs font-medium">
            {producto.cuotas} cuotas sin interés de {formatPrice(Math.round(producto.precioActual / producto.cuotas))}
          </span>
        </div>

        <div className="mt-auto pt-2">
          <div
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 group-hover:opacity-90 transition-all"
            style={{ backgroundColor: NAVY, color: "#fff" }}
          >
            Ver detalles
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  </motion.article>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100 flex flex-col animate-pulse">
    <div className="h-44 bg-zinc-100" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-3 bg-zinc-100 rounded w-1/3" />
      <div className="h-5 bg-zinc-100 rounded w-3/4" />
      <div className="h-3 bg-zinc-100 rounded w-full" />
      <div className="h-3 bg-zinc-100 rounded w-2/3" />
      <div className="h-10 bg-zinc-100 rounded-xl mt-2" />
    </div>
  </div>
);

const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProductos((data as DbProducto[]).map(mapDbToProducto));
        } else {
          setProductos(staticProductos);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="border-b border-zinc-100 bg-zinc-50/40 py-14 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-3"
        >
          Catálogo
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="font-bold tracking-tight text-zinc-900 mb-3"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
        >
          Nuestros equipos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-zinc-500 text-lg max-w-lg mx-auto px-4"
        >
          Tecnología estética certificada con soporte técnico local y capacitación incluida.
        </motion.p>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {productos.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Productos;
