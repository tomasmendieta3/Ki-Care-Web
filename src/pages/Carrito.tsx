import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ChevronLeft, CheckCircle, Download } from "lucide-react";
import { useCart, type CartItem } from "@/context/CartContext";
import { formatPrice } from "@/data/productos.data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PedidoRecibo from "@/components/PedidoRecibo";

const NAVY = "#0A0F2C";
const ORANGE = "#ff6e13";

const paymentMethods = [
  {
    id: "transferencia",
    label: "Transferencia bancaria",
    description: "Te enviamos los datos por WhatsApp al confirmar",
    icon: "🏦",
    available: true,
  },
  {
    id: "efectivo",
    label: "Efectivo",
    description: "Coordinamos la entrega y el pago con el vendedor",
    icon: "💵",
    available: true,
  },
  {
    id: "mercadopago",
    label: "MercadoPago",
    description: "Tarjeta de crédito, débito y cuotas sin interés",
    icon: "💳",
    available: true,
  },
];

const Carrito = () => {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    provincia: "",
  });
  const [payment, setPayment] = useState("transferencia");
  const [confirmed, setConfirmed] = useState(false);
  const [loadingMP, setLoadingMP] = useState(false);
  const [mpError, setMpError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    numeroPedido: string;
    fecha: string;
    items: CartItem[];
    total: number;
    metodoPago: string;
    cliente: typeof form;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const isFormValid = form.nombre && form.documento && form.telefono && form.direccion && form.ciudad && form.provincia;

  const handleMercadoPago = async () => {
    setLoadingMP(true);
    setMpError(null);

    const numeroPedido = `KC-${Date.now().toString().slice(-6)}`;
    const fecha = new Date().toLocaleDateString("es-AR", {
      day: "2-digit", month: "long", year: "numeric",
    });

    // Save order so the success page can show PDF download
    localStorage.setItem("ki_care_order", JSON.stringify({
      numeroPedido,
      fecha,
      items: [...items],
      total,
      metodoPago: "MercadoPago",
      cliente: { ...form },
    }));

    try {
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, cliente: form, total, numeroPedido }),
      });
      const data = await res.json();
      if (!res.ok || !data.init_point) throw new Error(data.error ?? "Error al conectar con MercadoPago");
      clearCart();
      window.location.href = data.init_point;
    } catch (err: unknown) {
      setMpError(err instanceof Error ? err.message : "Error inesperado");
      setLoadingMP(false);
    }
  };

  const handleConfirm = () => {
    const numeroPedido = `KC-${Date.now().toString().slice(-6)}`;
    const fecha = new Date().toLocaleDateString("es-AR", {
      day: "2-digit", month: "long", year: "numeric",
    });
    const method = paymentMethods.find((p) => p.id === payment)?.label ?? payment;

    const base = window.location.origin;
    const lines = items.flatMap((i) => {
      const specs = i.producto.especificaciones
        ? Object.entries(i.producto.especificaciones)
            .map(([k, v]) => `    · ${k}: ${v}`)
            .join("\n")
        : "";
      return [
        `• *${i.producto.nombre}* ×${i.quantity}`,
        `  Categoría: ${i.producto.categoria}`,
        `  Precio unit.: ${formatPrice(i.producto.precioActual)} | Subtotal: ${formatPrice(i.producto.precioActual * i.quantity)}`,
        ...(specs ? [`  Especificaciones:\n${specs}`] : []),
        `  🔗 ${base}/productos/${i.producto.id}`,
      ];
    });

    const msg = [
      `🛒 *Pedido Ki Care #${numeroPedido}*`,
      `📅 ${fecha}`,
      "",
      "*Productos:*",
      ...lines,
      "",
      `*Total:* ${formatPrice(total)}`,
      `*Método de pago:* ${method}`,
      "",
      "*Datos del comprador:*",
      `👤 ${form.nombre}`,
      `🪪 DNI/CUIT: ${form.documento}`,
      `📱 ${form.telefono}`,
      `📍 ${form.direccion}, ${form.ciudad}, ${form.provincia}`,
      "",
      "✅ Este pedido incluye garantía de 24 meses. Ki Care se comunicará a la brevedad para coordinar.",
    ].join("\n");

    setConfirmedOrder({
      numeroPedido,
      fecha,
      items: [...items],
      total,
      metodoPago: method,
      cliente: { ...form },
    });

    window.open(`https://wa.me/5491127571920?text=${encodeURIComponent(msg)}`, "_blank");
    clearCart();
    setConfirmed(true);
  };

  if (confirmed && confirmedOrder) {
    return (
      <>
        <style>{`
          @media screen { #pedido-recibo { display: none; } }
          @media print {
            body * { visibility: hidden; }
            #pedido-recibo { display: block !important; visibility: visible; position: fixed; top: 0; left: 0; width: 100%; }
            #pedido-recibo * { visibility: visible; }
          }
        `}</style>

        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center py-16">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">¡Pedido enviado!</h1>
              <p className="text-zinc-400 text-sm mt-1">Pedido #{confirmedOrder.numeroPedido}</p>
            </div>
            <p className="text-zinc-500 max-w-sm text-sm leading-relaxed">
              Te redirigimos a WhatsApp para coordinar el pago y la entrega. En breve te contactamos.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 border-[#ff6e13] text-[#ff6e13] hover:bg-[#ff6e13]/5 transition-colors"
              >
                <Download className="w-4 h-4" />
                Descargar comprobante PDF
              </button>
              <Link
                to="/productos"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: ORANGE }}
              >
                <ShoppingBag className="w-4 h-4" />
                Seguir comprando
              </Link>
            </div>
          </div>
          <Footer />
        </div>

        {/* Receipt — only visible on print */}
        <PedidoRecibo
          numeroPedido={confirmedOrder.numeroPedido}
          fecha={confirmedOrder.fecha}
          items={confirmedOrder.items}
          total={confirmedOrder.total}
          metodoPago={confirmedOrder.metodoPago}
          cliente={confirmedOrder.cliente}
        />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center py-40">
          <ShoppingBag className="w-16 h-16 text-zinc-200" />
          <h1 className="text-2xl font-bold text-zinc-900">Tu carrito está vacío</h1>
          <p className="text-zinc-500">Explorá nuestros equipos y agregá los que te interesen.</p>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-colors"
            style={{ backgroundColor: ORANGE }}
          >
            Ver equipos
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Seguir comprando
        </button>

        <h1 className="text-2xl font-bold text-zinc-900 mb-8">
          Tu carrito <span className="text-zinc-400 font-normal text-lg">({itemCount} {itemCount === 1 ? "producto" : "productos"})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* LEFT — items + form */}
          <div className="flex flex-col gap-6">

            {/* Cart items */}
            <div className="bg-white rounded-2xl border border-zinc-100 divide-y divide-zinc-100 overflow-hidden">
              <AnimatePresence initial={false}>
                {items.map(({ producto, quantity }) => (
                  <motion.div
                    key={producto.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4 p-4 sm:p-5"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100 flex items-center justify-center">
                      {producto.imagen_principal ? (
                        <img src={producto.imagen_principal} alt={producto.nombre} className="w-full h-full object-contain p-1" />
                      ) : (
                        <ShoppingBag className="w-7 h-7 text-zinc-300" />
                      )}
                    </div>

                    {/* Info + controls */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      {/* Top row: name + delete */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900 leading-snug text-sm sm:text-base truncate">{producto.nombre}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{producto.categoria}</p>
                        </div>
                        <button
                          onClick={() => removeItem(producto.id)}
                          className="text-zinc-300 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bottom row: price + quantity + subtotal */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm font-bold" style={{ color: NAVY }}>
                          {formatPrice(producto.precioActual)}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(producto.id, quantity - 1)}
                            className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-zinc-500" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-zinc-800">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(producto.id, quantity + 1)}
                            className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-zinc-500" />
                          </button>
                        </div>

                        <span className="text-sm font-black text-zinc-900">
                          {formatPrice(producto.precioActual * quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <h2 className="font-bold text-zinc-900 mb-5">Datos de envío</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "nombre", label: "Nombre completo", placeholder: "Ej: María García", col: "sm:col-span-2" },
                  { name: "documento", label: "DNI / CUIT", placeholder: "Ej: 30123456" },
                  { name: "telefono", label: "Teléfono / WhatsApp", placeholder: "Ej: 11 1234-5678" },
                  { name: "direccion", label: "Dirección", placeholder: "Calle y número", col: "sm:col-span-2" },
                  { name: "ciudad", label: "Ciudad" },
                  { name: "provincia", label: "Provincia" },
                ].map(({ name, label, placeholder, col }) => (
                  <div key={name} className={col ?? ""}>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                      {label}
                    </label>
                    <input
                      type="text"
                      name={name}
                      value={form[name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#ff6e13]/30 focus:border-[#ff6e13] transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment methods */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <h2 className="font-bold text-zinc-900 mb-5">Método de pago</h2>
              <div className="flex flex-col gap-3">
                {paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => m.available && setPayment(m.id)}
                    disabled={!m.available}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl border-2 text-left transition-all ${
                      !m.available
                        ? "opacity-40 cursor-not-allowed border-zinc-100 bg-zinc-50"
                        : payment === m.id
                        ? "border-[#ff6e13] bg-[#ff6e13]/5"
                        : "border-zinc-100 hover:border-zinc-200 bg-white"
                    }`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-zinc-900">{m.label}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{m.description}</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                        payment === m.id && m.available
                          ? "border-[#ff6e13] bg-[#ff6e13]"
                          : "border-zinc-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — summary */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-zinc-100 p-6 flex flex-col gap-5">
              <h2 className="font-bold text-zinc-900">Resumen del pedido</h2>

              <div className="flex flex-col gap-3">
                {items.map(({ producto, quantity }) => (
                  <div key={producto.id} className="flex justify-between text-sm">
                    <span className="text-zinc-600 truncate pr-4">{producto.nombre} <span className="text-zinc-400">×{quantity}</span></span>
                    <span className="font-medium text-zinc-900 flex-shrink-0">{formatPrice(producto.precioActual * quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-100 pt-3 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="text-zinc-700">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-3 flex justify-between items-center">
                <span className="font-bold text-zinc-900">Total</span>
                <span className="text-xl font-black" style={{ color: NAVY }}>{formatPrice(total)}</span>
              </div>

              {payment === "mercadopago" ? (
                <button
                  onClick={handleMercadoPago}
                  disabled={!isFormValid || loadingMP}
                  className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    isFormValid && !loadingMP
                      ? "opacity-100 hover:opacity-90 shadow-lg"
                      : "opacity-40 cursor-not-allowed"
                  }`}
                  style={{ backgroundColor: "#009ee3" }}
                >
                  {loadingMP ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Conectando con MercadoPago...
                    </>
                  ) : (
                    "💳 Pagar con MercadoPago"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={!isFormValid}
                  className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide text-white transition-all active:scale-[0.98] ${
                    isFormValid
                      ? "opacity-100 hover:opacity-90 shadow-lg"
                      : "opacity-40 cursor-not-allowed"
                  }`}
                  style={{ backgroundColor: ORANGE }}
                >
                  Confirmar pedido
                </button>
              )}

              {mpError && (
                <p className="text-[11px] text-red-500 text-center">{mpError}</p>
              )}

              <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
                {payment === "mercadopago"
                  ? "Serás redirigido a MercadoPago para completar el pago de forma segura."
                  : "Al confirmar te redirigimos a WhatsApp para coordinar el pago y la entrega."}
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Carrito;
