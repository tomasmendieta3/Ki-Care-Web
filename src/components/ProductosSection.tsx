import { useState } from "react";
import { Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { Star, ShoppingBag } from "lucide-react";
import { productos, formatPrice, type Producto } from "@/data/productos.data";
import ProductVisual from "@/components/ProductVisual";
import ProductoModal from "@/components/ProductoModal";
import { fadeInUp, stagger } from "@/lib/motion";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className="w-3.5 h-3.5"
        fill={i <= Math.round(rating) ? "#9e1504" : "transparent"}
        stroke="#9e1504"
        strokeWidth={1.5}
      />
    ))}
  </div>
);

const ProductCard = ({
  producto,
  onOpen,
}: {
  producto: Producto;
  onOpen: (p: Producto) => void;
}) => (
  <motion.article
    variants={fadeInUp}
    className="bg-[#0A0F2C] rounded-2xl overflow-hidden border border-[#9e1504]/15 hover:border-[#9e1504]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-[#9e1504]/10 group flex flex-col"
  >
    {/* Image */}
    <div className="relative overflow-hidden">
      <ProductVisual productId={producto.id} size="card" />
      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
        {producto.badges.map((b) => (
          <span
            key={b}
            className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#9e1504] text-[#0A0F2C]"
          >
            {b}
          </span>
        ))}
      </div>
      {/* Discount chip top-right */}
      <div className="absolute top-3 right-3">
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0A0F2C]/80 border border-[#9e1504]/40 text-[#9e1504]">
          {producto.descuento}% OFF
        </span>
      </div>
    </div>

    {/* Info */}
    <div className="p-5 flex flex-col flex-1 gap-3">
      {/* Category */}
      <span className="text-[11px] font-semibold tracking-widest uppercase text-[#9e1504]/70">
        {producto.categoria}
      </span>

      {/* Name */}
      <h3 className="text-white font-bold text-lg leading-snug">{producto.nombre}</h3>

      {/* Rating + sold */}
      <div className="flex items-center gap-2">
        <StarRating rating={producto.rating} />
        <span className="text-[#9e1504] text-sm font-semibold">{producto.rating}</span>
        <span className="text-white/30 text-xs">·</span>
        <span className="text-white/50 text-xs">{producto.vendidos.toLocaleString()} vendidos</span>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-0.5">
        <span className="text-white/40 text-sm line-through">
          {formatPrice(producto.precioOriginal)}
        </span>
        <span className="text-white font-bold text-xl">
          {formatPrice(producto.precioActual)}
        </span>
        <span className="text-green-400 text-xs font-medium">
          12 cuotas sin interés de {formatPrice(Math.round(producto.precioActual / 12))}
        </span>
      </div>

      {/* CTA */}
      <div className="mt-auto pt-2">
        <button
          onClick={() => onOpen(producto)}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-[#ff6e13] hover:bg-[#e05e0a] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Ver detalles
        </button>
      </div>
    </div>
  </motion.article>
);

const ProductosSection = () => {
  const [selected, setSelected] = useState<Producto | null>(null);

  return (
    <>
      <section id="productos" className="py-24 bg-[#06091a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeInUp}
              className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#9e1504] mb-3"
            >
              Catálogo
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="font-bold tracking-tight text-white mb-4"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
            >
              Nuestros equipos
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/50 text-lg max-w-xl mx-auto">
              Tecnología estética certificada con soporte técnico local.
            </motion.p>
          </motion.div>

          {/* Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {productos.map((p) => (
              <ProductCard key={p.id} producto={p} onOpen={setSelected} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <ProductoModal
          producto={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};

export default ProductosSection;
