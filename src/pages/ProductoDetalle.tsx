import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Star, Truck, AlertTriangle, ShieldCheck, GraduationCap,
  Award, MessageCircle, ShoppingCart, CreditCard, Users,
  CheckCircle2, ChevronRight, BadgeCheck,
} from "lucide-react";
import { formatPrice, type Producto } from "@/data/productos.data";
import { supabase, mapDbToProducto, type DbProducto } from "@/lib/supabase";
import ProductVisual from "@/components/ProductVisual";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fadeInUp, stagger } from "@/lib/motion";

const NAVY = "#0A0F2C";
const GOLD = "#9e1504";

const avatarColors = ["bg-rose-500", "bg-violet-500", "bg-sky-500", "bg-emerald-500", "bg-amber-500"];
const avatarInitials = ["LC", "MR", "PS", "AG", "KF"];

const Stars = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
  const s = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={s} fill={i <= Math.round(rating) ? GOLD : "transparent"} stroke={GOLD} strokeWidth={1.5} />
      ))}
    </div>
  );
};

const RatingBar = ({ label, count, total }: { label: string; count: number; total: number }) => (
  <div className="flex items-center gap-3">
    <span className="text-zinc-400 text-xs w-8 text-right shrink-0">{label}</span>
    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${total > 0 ? (count / total) * 100 : 0}%`, backgroundColor: GOLD }} />
    </div>
    <span className="text-zinc-400 text-xs w-4 shrink-0">{count}</span>
  </div>
);

/* ── Otros productos — card horizontal liviana ── */
const OtroCard = ({ producto }: { producto: Producto }) => (
  <Link
    to={`/productos/${producto.id}`}
    className="flex gap-4 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-md transition-all duration-300 overflow-hidden group bg-white"
  >
    <div className="w-32 sm:w-40 shrink-0 rounded-l-2xl overflow-hidden">
      <ProductVisual productId={producto.id} size="card" />
    </div>
    <div className="flex flex-col justify-center gap-2 py-5 pr-5 flex-1">
      <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">{producto.categoria}</span>
      <h3 className="text-zinc-900 font-bold text-base leading-snug">{producto.nombre}</h3>
      <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{producto.descripcion}</p>
      <div className="flex items-center gap-2 mt-1">
        <Stars rating={producto.rating} />
        <span className="text-zinc-500 text-xs">{producto.rating}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 text-xs line-through">{formatPrice(producto.precioOriginal)}</span>
        <span className="text-zinc-900 font-bold text-sm">{formatPrice(producto.precioActual)}</span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">{producto.descuento}% OFF</span>
      </div>
      <span className="text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: NAVY }}>
        Ver detalles <ChevronRight className="w-3.5 h-3.5" />
      </span>
    </div>
  </Link>
);

/* ── Review card ── */
const ReviewCard = ({ review }: { review: Producto["reviews"][0] }) => (
  <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm flex flex-col gap-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${review.avatarColor} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
          {review.initials}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-zinc-900 font-semibold text-sm">{review.author}</p>
            {review.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#9e1504]" />}
          </div>
          <p className="text-zinc-400 text-xs">{review.profession} · {review.city}</p>
        </div>
      </div>
      <Stars rating={review.rating} size="sm" />
    </div>
    <p className="text-zinc-600 text-sm leading-relaxed">{review.comment}</p>
    <div className="flex items-center justify-between pt-1 border-t border-zinc-50">
      <span className="text-zinc-300 text-xs">{review.date}</span>
      {review.verified && (
        <span className="text-[10px] font-semibold text-green-600 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Compra verificada
        </span>
      )}
    </div>
  </motion.div>
);

/* ════════════════════════════════════════════════════ */
const ProductoDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [otrosProductos, setOtrosProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeThumb, setActiveThumb] = useState(0);

  useEffect(() => {
    supabase.from("productos").select("*").eq("activo", true).order("orden").then(({ data }) => {
      if (!data) { navigate("/productos", { replace: true }); return; }
      const todos = (data as DbProducto[]).map(mapDbToProducto);
      const current = todos.find((p) => p.id === id);
      if (!current) { navigate("/productos", { replace: true }); return; }
      setProducto(current);
      setOtrosProductos(todos.filter((p) => p.id !== id));
      setLoading(false);
    });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#9e1504] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!producto) return null;
  const { reviews } = producto;
  const fiveStar = reviews.filter((r) => r.rating === 5).length;
  const fourStar = reviews.filter((r) => r.rating === 4).length;
  const threeStar = reviews.filter((r) => r.rating === 3).length;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* ── Breadcrumb ── */}
      <div className="border-b border-zinc-100 bg-zinc-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm">
          <Link to="/" className="text-zinc-400 hover:text-zinc-700 transition-colors">Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
          <Link to="/productos" className="text-zinc-400 hover:text-zinc-700 transition-colors">Productos</Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
          <span className="text-zinc-700 font-medium">{producto.nombre}</span>
        </div>
      </div>

      {/* ── Product detail — 2 cols, sin box ── */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* LEFT — imágenes */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-4">
            {/* Frame de imagen principal */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeThumb}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl overflow-hidden border border-zinc-100 shadow-sm"
                style={{ backgroundColor: NAVY }}
              >
                <div className="aspect-square sm:aspect-[4/3] lg:aspect-square flex items-center justify-center p-8">
                  <ProductVisual productId={producto.id} imageUrl={producto.imagen_url} size="modal" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className="w-16 h-16 rounded-xl overflow-hidden shrink-0 transition-all duration-200 border-2"
                  style={{
                    borderColor: activeThumb === i ? GOLD : "transparent",
                    outline: activeThumb === i ? "none" : "2px solid #f4f4f5",
                    opacity: activeThumb === i ? 1 : 0.55,
                    backgroundColor: NAVY,
                  }}
                >
                  <div className="w-full h-full scale-75 flex items-center justify-center">
                    <ProductVisual productId={producto.id} imageUrl={producto.imagen_url} size="card" />
                  </div>
                </button>
              ))}
            </div>

            {/* Consultando bar */}
            <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3">
              <div className="flex -space-x-2">
                {avatarInitials.slice(0, 4).map((init, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full ${avatarColors[i]} border-2 border-white flex items-center justify-center text-[10px] font-bold text-white`}>
                    {init}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="text-xs font-medium text-zinc-500">
                  <span className="font-bold text-zinc-800">{producto.profesionalesConsultando}</span> profesionales consultando ahora
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — info */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {producto.badges.map((b) => (
                <span key={b} className="text-[10px] font-black tracking-widest px-3 py-1 rounded-full" style={{ backgroundColor: NAVY, color: GOLD }}>
                  {b}
                </span>
              ))}
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 tracking-wide">
                {producto.descuento}% OFF
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="font-black text-zinc-900 leading-tight mb-1.5" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>
                {producto.nombre}
              </h1>
              <p className="font-semibold text-sm" style={{ color: GOLD }}>{producto.subtitulo}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 flex-wrap">
              <Stars rating={producto.rating} size="md" />
              <span className="font-bold text-zinc-800">{producto.rating}</span>
              <span className="text-zinc-400 text-sm">({producto.totalOpiniones} opiniones)</span>
              <span className="text-zinc-200">·</span>
              <span className="text-zinc-400 text-sm">{producto.vendidos.toLocaleString()} vendidos</span>
            </div>

            {/* Description */}
            <p className="text-zinc-500 leading-relaxed">{producto.descripcion}</p>

            {/* Características */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {producto.caracteristicas.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm text-zinc-600">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                  {c}
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="border-t border-zinc-100" />

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 line-through">{formatPrice(producto.precioOriginal)}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  {producto.descuento}% OFF
                </span>
              </div>
              <span className="font-black text-zinc-900" style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}>
                {formatPrice(producto.precioActual)}
              </span>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-600 text-sm font-semibold">
                  12 cuotas sin interés de {formatPrice(Math.round(producto.precioActual / 12))}
                </span>
              </div>
            </div>

            {/* Alertas */}
            {producto.stock <= 5 && (
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-amber-50 border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-800">¡Últimas {producto.stock} unidades!</p>
                  <p className="text-xs text-amber-600">Reservá el tuyo hoy.</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-green-50 border border-green-100">
              <Truck className="w-4 h-4 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-800">Envío gratis a todo el país</p>
                <p className="text-xs text-green-600">Llega {producto.envioFecha}</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              <button className="w-full py-4 rounded-2xl font-black text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-zinc-900/10" style={{ backgroundColor: NAVY, color: "#fff" }}>
                COMPRAR AHORA
              </button>
              <button className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide border-2 hover:bg-zinc-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2" style={{ borderColor: NAVY, color: NAVY }}>
                <ShoppingCart className="w-4 h-4" /> AGREGAR AL CARRITO
              </button>
              <a
                href={`https://wa.me/5491127571920?text=Hola%21%20Vengo%20de%20la%20web%20de%20Ki%20Care.%20Me%20gustar%C3%ADa%20consultar%20por%20el%20equipo%20${encodeURIComponent(producto.nombre)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide border border-green-200 text-green-700 hover:bg-green-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> CONSULTAR POR WHATSAPP
              </a>
            </div>

            {/* Seller + Trust */}
            <div className="flex items-center justify-between rounded-2xl px-4 py-3.5 border border-zinc-100 bg-zinc-50/60">
              <div>
                <p className="text-xs text-zinc-400 mb-0.5">Vendido por</p>
                <p className="text-sm font-bold text-zinc-900">EstéticaPro Oficial</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: GOLD, color: NAVY }}>
                <Award className="w-3.5 h-3.5" /> MERCADOLÍDER GOLD
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: ShieldCheck, label: "ANMAT" },
                { icon: Award, label: "12 meses garantía" },
                { icon: GraduationCap, label: "Capacitación gratis" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 rounded-xl p-4 text-center border border-zinc-100 bg-zinc-50/40">
                  <Icon className="w-5 h-5 text-zinc-700" />
                  <span className="text-[11px] font-semibold text-zinc-600 leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Otros productos ── */}
      <section className="border-t border-zinc-100 bg-zinc-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.div variants={fadeInUp} className="mb-8">
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-1">Seguir explorando</p>
              <h2 className="text-2xl font-bold text-zinc-900">Otros productos disponibles</h2>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otrosProductos.map((p) => (
                <motion.div key={p.id} variants={fadeInUp}>
                  <OtroCard producto={p} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            {/* Header + summary */}
            <motion.div variants={fadeInUp} className="mb-10">
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-1">Clientes</p>
              <h2 className="text-2xl font-bold text-zinc-900 mb-8">Opiniones verificadas</h2>

              <div className="flex flex-col sm:flex-row gap-8 max-w-md">
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="font-black text-zinc-900" style={{ fontSize: "clamp(3rem, 6vw, 4rem)", lineHeight: 1 }}>
                    {producto.rating}
                  </span>
                  <Stars rating={producto.rating} size="lg" />
                  <span className="text-zinc-400 text-sm">{producto.totalOpiniones} opiniones</span>
                </div>
                <div className="flex flex-col justify-center gap-2 flex-1 min-w-[180px]">
                  <RatingBar label="5 ★" count={fiveStar} total={reviews.length} />
                  <RatingBar label="4 ★" count={fourStar} total={reviews.length} />
                  <RatingBar label="3 ★" count={threeStar} total={reviews.length} />
                  <RatingBar label="2 ★" count={0} total={reviews.length} />
                  <RatingBar label="1 ★" count={0} total={reviews.length} />
                </div>
              </div>
            </motion.div>

            {/* Review cards */}
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductoDetalle;
