import { useState } from "react";
import { Modal } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Star,
  Truck,
  AlertTriangle,
  ShieldCheck,
  GraduationCap,
  Award,
  MessageCircle,
  ShoppingCart,
  CreditCard,
  Users,
} from "lucide-react";
import { type Producto, formatPrice } from "@/data/productos.data";
import ProductVisual from "@/components/ProductVisual";

const NAVY = "#0A0F2C";
const GOLD = "#9e1504";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className="w-4 h-4"
        fill={i <= Math.round(rating) ? GOLD : "transparent"}
        stroke={GOLD}
        strokeWidth={1.5}
      />
    ))}
    <span className="text-sm font-bold ml-1" style={{ color: GOLD }}>{rating}</span>
  </div>
);

const avatarColors = [
  "bg-rose-500",
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
];
const avatarInitials = ["LC", "MR", "PS", "AG", "KF"];

interface ProductoModalProps {
  producto: Producto;
  onClose: () => void;
}

const ProductoModal = ({ producto, onClose }: ProductoModalProps) => {
  const [activeThumb, setActiveThumb] = useState(0);

  return (
    <Modal
      state={{ isOpen: true, open: () => {}, close: onClose, toggle: () => {}, setOpen: (open) => { if (!open) onClose(); } }}
    >
      <Modal.Backdrop variant="blur" isDismissable>
        <Modal.Container scroll="inside">
          <Modal.Dialog className="!max-w-5xl w-full">
            {/* Custom close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <Modal.Body className="!p-0 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-[45%_55%]">

                {/* ── LEFT: Image panel ── */}
                <div className="flex flex-col" style={{ backgroundColor: NAVY }}>
                  {/* Main image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeThumb}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 min-h-[240px]"
                    >
                      <ProductVisual productId={producto.id} size="modal" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Thumbnail strip */}
                  <div className="px-5 pb-4 pt-3 flex gap-2.5">
                    {[0, 1, 2, 3].map((i) => (
                      <button
                        key={i}
                        onClick={() => setActiveThumb(i)}
                        className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200"
                        style={{
                          border: `2px solid ${activeThumb === i ? GOLD : "rgba(201,168,76,0.2)"}`,
                          opacity: activeThumb === i ? 1 : 0.55,
                        }}
                      >
                        <div className="w-full h-full bg-[#0d1330] flex items-center justify-center scale-75">
                          <ProductVisual productId={producto.id} size="card" />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Consultando bar */}
                  <div
                    className="mx-5 mb-5 rounded-xl px-4 py-3 flex items-center gap-3"
                    style={{ backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
                  >
                    <div className="flex -space-x-2">
                      {avatarInitials.slice(0, 4).map((init, i) => (
                        <div
                          key={i}
                          className={`w-7 h-7 rounded-full ${avatarColors[i]} border-2 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}
                          style={{ borderColor: NAVY }}
                        >
                          {init}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
                      <span className="text-xs font-medium" style={{ color: GOLD }}>
                        {producto.profesionalesConsultando} profesionales consultando
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT: Detail panel ── */}
                <div className="p-7 overflow-y-auto bg-white flex flex-col gap-5">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {producto.badges.map((b) => (
                      <span
                        key={b}
                        className="text-[10px] font-black tracking-widest px-3 py-1 rounded-full"
                        style={{ backgroundColor: NAVY, color: GOLD }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-2xl font-black text-zinc-900 leading-tight mb-1">
                      {producto.nombre}
                    </h2>
                    <p className="font-semibold text-sm" style={{ color: GOLD }}>
                      {producto.subtitulo}
                    </p>
                  </div>

                  {/* Rating + stats */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <StarRating rating={producto.rating} />
                    <span className="text-zinc-500 text-sm">
                      ({producto.totalOpiniones} opiniones)
                    </span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-zinc-500 text-sm">
                      {producto.vendidos.toLocaleString()} vendidos
                    </span>
                  </div>

                  {/* Price block */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-400 text-base line-through">
                        {formatPrice(producto.precioOriginal)}
                      </span>
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
                      >
                        {producto.descuento}% OFF
                      </span>
                    </div>
                    <span className="text-3xl font-black text-zinc-900">
                      {formatPrice(producto.precioActual)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-600 text-sm font-semibold">
                        12 cuotas sin interés de {formatPrice(Math.round(producto.precioActual / 12))}
                      </span>
                    </div>
                  </div>

                  {/* Stock warning */}
                  {producto.stock <= 5 && (
                    <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-amber-50 border border-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-amber-800">
                          ¡Últimas {producto.stock} disponibles!
                        </p>
                        <p className="text-xs text-amber-600">Reservá el tuyo hoy.</p>
                      </div>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-green-50 border border-green-100">
                    <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-800">Envío gratis a todo el país</p>
                      <p className="text-xs text-green-600">Llega {producto.envioFecha}</p>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col gap-2.5">
                    <button
                      className="w-full py-3.5 rounded-xl font-black text-sm tracking-wide transition-all active:scale-[0.98]"
                      style={{ backgroundColor: NAVY, color: "#fff" }}
                    >
                      COMPRAR AHORA
                    </button>
                    <button
                      className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide border-2 transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:bg-zinc-50"
                      style={{ borderColor: NAVY, color: NAVY }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      AGREGAR AL CARRITO
                    </button>
                    <a
                      href={`https://wa.me/5491127571920?text=Hola%21%20Vengo%20de%20la%20web%20de%20Ki%20Care.%20Me%20gustar%C3%ADa%20consultar%20por%20el%20equipo%20${encodeURIComponent(producto.nombre)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:bg-green-50 border border-green-200 text-green-700"
                    >
                      <MessageCircle className="w-4 h-4" />
                      CONSULTAR POR WHATSAPP
                    </a>
                  </div>

                  {/* Seller card */}
                  <div
                    className="flex items-center justify-between rounded-xl px-4 py-3 border"
                    style={{ borderColor: "rgba(201,168,76,0.3)", backgroundColor: "rgba(10,15,44,0.03)" }}
                  >
                    <div>
                      <p className="text-xs text-zinc-500 mb-0.5">Vendido por</p>
                      <p className="text-sm font-bold text-zinc-900">EstéticaPro Oficial</p>
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{ backgroundColor: GOLD, color: NAVY }}
                    >
                      <Award className="w-3.5 h-3.5" />
                      MERCADOLÍDER GOLD
                    </div>
                  </div>

                  {/* Trust row */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { icon: ShieldCheck, label: "ANMAT" },
                      { icon: Award, label: "12 meses\ngarantía" },
                      { icon: GraduationCap, label: "Capacitación\ngratis" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1.5 rounded-xl p-3 text-center"
                        style={{ backgroundColor: "rgba(10,15,44,0.04)" }}
                      >
                        <Icon className="w-4 h-4" style={{ color: NAVY }} />
                        <span className="text-[10px] font-bold text-zinc-600 whitespace-pre-line leading-tight">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default ProductoModal;
