import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star, AlertTriangle, ShieldCheck, GraduationCap,
  Award, MessageCircle, CreditCard,
  CheckCircle2, ChevronRight, BadgeCheck, FileDown,
} from "lucide-react";
import { formatPrice, productos, ESPECIFICACIONES_FIELDS, type Producto } from "@/data/productos.data";
import { supabase, mapDbToProducto, type DbProducto } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import ProductVisual from "@/components/ProductVisual";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fadeInUp, stagger } from "@/lib/motion";

const NAVY = "#0A0F2C";
const GOLD = "#9e1504";


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
      <ProductVisual productId={producto.id} imageUrl={producto.imagen_principal} size="card" />
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
        <span className="text-[10px] font-semibold text-green-800 flex items-center gap-1">
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const zoomRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    supabase.from("productos").select("*").eq("activo", true).order("orden").then(({ data }) => {
      const dbProductos = data && (data as DbProducto[]).length > 0
        ? (data as DbProducto[]).map(mapDbToProducto)
        : productos; // fallback a datos estáticos

      const current = dbProductos.find((p) => p.id === id);
      if (!current) { navigate("/productos", { replace: true }); return; }
      setProducto(current);
      setSelectedImage(current.imagen_principal || null);
      setOtrosProductos(dbProductos.filter((p) => p.id !== id));
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
            {/* Imagen principal con zoom */}
            <div
              ref={zoomRef}
              className="rounded-3xl overflow-hidden border border-zinc-100 shadow-sm relative cursor-zoom-in bg-white"
              onMouseEnter={() => selectedImage && setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={(e: ReactMouseEvent<HTMLDivElement>) => {
                if (!zoomRef.current) return;
                const rect = zoomRef.current.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomPos({ x, y });
              }}
            >
              <div className="aspect-square sm:aspect-[4/3] lg:aspect-square flex items-center justify-center">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={producto.nombre}
                    className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-200"
                    style={isZoomed ? {
                      transform: "scale(2)",
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    } : undefined}
                  />
                ) : (
                  <ProductVisual productId={producto.id} size="modal" />
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {(() => {
              const allImages = [
                producto.imagen_principal,
                ...(producto.galeria || []),
              ].filter(Boolean) as string[];

              if (allImages.length <= 1) return null;

              return (
                <div className="grid grid-cols-4 gap-3">
                  {allImages.slice(0, 4).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className="aspect-square rounded-xl overflow-hidden shrink-0 transition-all duration-200 border-2 relative"
                      style={{
                        borderColor: selectedImage === img ? GOLD : "transparent",
                        outline: selectedImage === img ? "none" : "2px solid #f4f4f5",
                        opacity: selectedImage === img ? 1 : 0.55,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <img src={img} alt={`${producto.nombre} ${i + 1}`} className="w-full h-full object-contain p-2" />
                    </button>
                  ))}
                </div>
              );
            })()}

            {/* Botón ficha técnica PDF */}
            <a
              href={producto.especificacionesPdfUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: "#ff6e13" }}
            >
              <span className="absolute inset-0 animate-[pulse-glow_2s_ease-in-out_infinite] rounded-2xl pointer-events-none" />
              <FileDown className="w-4.5 h-4.5 relative z-10" />
              <span className="relative z-10">Click acá para descargar ficha técnica</span>
            </a>

            {/* Especificaciones técnicas */}
            {(() => {
              const specs = producto.especificaciones ?? {};
              // Solo se muestran los campos que el admin completó
              const extraKeys = Object.keys(specs).filter(
                (k) => !(ESPECIFICACIONES_FIELDS as readonly string[]).includes(k),
              );
              const allFields = [...ESPECIFICACIONES_FIELDS, ...extraKeys].filter((clave) => specs[clave]);
              if (allFields.length === 0) return null;
              return (
                <div className="rounded-2xl border border-zinc-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between" style={{ backgroundColor: NAVY }}>
                    <p className="text-xs font-bold tracking-widest uppercase text-white">
                      Especificaciones técnicas
                    </p>
                    {producto.especificacionesPdfUrl && (
                      <a
                        href={producto.especificacionesPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide uppercase text-white/80 hover:text-white transition-colors"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        Descargar PDF
                      </a>
                    )}
                  </div>
                  <div className="divide-y divide-zinc-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {allFields.map((clave, i) => (
                      <div
                        key={clave}
                        className={`flex flex-col sm:flex-row sm:items-baseline sm:justify-between px-4 py-2.5 text-sm gap-0.5 sm:gap-0 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50/60"}`}
                      >
                        <span className="text-zinc-500 font-medium">{clave}</span>
                        <span className="font-bold sm:text-right text-zinc-950">
                          {specs[clave]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

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
            </div>

            {/* Title */}
            <div>
              <h1 className="font-black text-zinc-900 leading-tight mb-1.5" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>
                {producto.nombre}
              </h1>
              <p className="font-semibold text-sm" style={{ color: GOLD }}>{producto.subtitulo}</p>
              {producto.descuento > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-base font-black text-green-700">{producto.descuento}% OFF</span>
                  <span className="text-[11px] font-semibold text-green-800/80">Promo Junio – Julio 2026</span>
                </div>
              )}
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
            <div className="flex flex-col gap-3">
              <p className="text-zinc-500 leading-relaxed">{producto.descripcion}</p>
              {producto.descripcion2 && (
                <p className="text-zinc-500 leading-relaxed">{producto.descripcion2}</p>
              )}
            </div>

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
                <CreditCard className="w-3.5 h-3.5 text-green-700" />
                <span className="text-green-800 text-sm font-semibold">
                  {producto.cuotas} cuotas sin interés de {formatPrice(Math.round(producto.precioActual / producto.cuotas))}
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

            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => { addItem(producto); navigate("/carrito"); }}
                className="w-full py-4 rounded-2xl font-black text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-zinc-900/10"
                style={{ backgroundColor: NAVY, color: "#fff" }}
              >
                COMPRAR AHORA
              </button>
              <a
                href={`https://wa.me/5491127571920?text=${encodeURIComponent(`Hola! Vengo de la web de Ki Care. Quiero comprar el equipo ${producto.nombre}.\n${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide border border-green-300 text-green-700 hover:bg-green-100/60 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> CERRAR COMPRA POR WHATSAPP
              </a>
            </div>

            {/* Mercado Libre box */}
            <a
              href="https://www.mercadolibre.com.ar/radiofrecuencia-tripolar-facial-y-corporal-ki-care-anmat/up/MLAU3104586758"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl px-5 py-4 bg-[#FFE600] hover:bg-[#f5de00] transition-colors duration-200 group"
            >
              <div>
                <p className="text-sm font-bold text-[#2D3277]">
                  En Mercado Libre encontranos
                </p>
                <p className="text-xs font-semibold text-[#2D3277]/70 mt-0.5">
                  Hacé click acá para ir a nuestra tienda
                </p>
              </div>
              <img src="/meli.png" alt="Mercado Libre" className="h-10 w-auto shrink-0 ml-3" />
            </a>

            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: ShieldCheck, label: "ANMAT" },
                { icon: Award, label: `${producto.garantiaMeses} meses garantía` },
                { icon: GraduationCap, label: "Guías y manuales" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 rounded-xl p-4 text-center border border-zinc-100 bg-zinc-50/40">
                  <Icon className="w-5 h-5 text-zinc-700" />
                  <span className="text-[11px] font-semibold text-zinc-600 leading-tight">{label}</span>
                </div>
              ))}
            </div>

            {/* Box de confianza — datos fiscales */}
            <a
              href="https://www.cuitonline.com/detalle/33715662979/grupo-proyectar-innovacion-s.r.l.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/60 px-4 py-4 hover:bg-zinc-100/60 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "#f0fdf4" }}>
                <ShieldCheck className="w-5 h-5 text-green-800" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-bold text-zinc-800">Empresa verificada en AFIP</p>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-200 text-green-800">Inscripta</span>
                </div>
                <p className="text-xs font-semibold text-zinc-700">Grupo Proyectar Innovación S.R.L.</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">CUIT 33-71566297-9 · Los Canarios 213, Oro Verde, Entre Ríos</p>
                <p className="text-[11px] text-zinc-400">Fabricación de equipos médicos · IVA Inscripto</p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0 mt-1" />
            </a>

            {/* Google Maps embed */}
            <div className="rounded-2xl border border-zinc-100 overflow-hidden">
              <div className="relative w-full aspect-video">
                <iframe
                  title="Proyectar Innova - Oro Verde, Entre Ríos"
                  src="https://maps.google.com/maps?q=-31.8256242,-60.5142794&z=16&output=embed"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50/60 border-t border-zinc-100">
                <p className="text-[11px] text-zinc-400">Los Canarios 213 · Oro Verde, Entre Ríos</p>
                <a
                  href="https://www.google.com/maps/place/Grupo+Proyectar+Innovaci%C3%B3n+SRL/@-31.8256241,-60.5191503,16z/data=!3m1!4b1!4m6!3m5!1s0x95b44b8f13829125:0x8eccb4e2f4d31cde!8m2!3d-31.8256242!4d-60.5142794!16s%2Fg%2F11j4czhwwn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-[#ff6e13] hover:underline"
                >
                  Ver en Maps
                </a>
              </div>
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
