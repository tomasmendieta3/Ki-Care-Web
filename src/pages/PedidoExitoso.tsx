import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Clock, Download, ShoppingBag, XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PedidoRecibo from "@/components/PedidoRecibo";
import { type CartItem } from "@/context/CartContext";

interface SavedOrder {
  numeroPedido: string;
  fecha: string;
  items: CartItem[];
  total: number;
  metodoPago: string;
  cliente: {
    nombre: string;
    documento: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    provincia: string;
  };
}

const PedidoExitoso = () => {
  const [params] = useSearchParams();
  const status = params.get("status") ?? "approved";
  const ref = params.get("ref") ?? "";
  const [order, setOrder] = useState<SavedOrder | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("ki_care_order");
    if (raw) {
      try {
        setOrder(JSON.parse(raw));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const isPending = status === "pending";
  const isApproved = status === "approved";

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

        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center py-20">
          {isApproved ? (
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          ) : isPending ? (
            <div className="w-20 h-20 rounded-full bg-yellow-50 flex items-center justify-center">
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {isApproved ? "¡Pago aprobado!" : isPending ? "Pago en proceso" : "Pago no aprobado"}
            </h1>
            {ref && <p className="text-zinc-400 text-sm mt-1">Pedido #{ref}</p>}
          </div>

          <p className="text-zinc-500 max-w-sm text-sm leading-relaxed">
            {isApproved
              ? "Tu pago fue procesado exitosamente. Ki Care se comunicará a la brevedad para coordinar la entrega."
              : isPending
              ? "Tu pago está siendo procesado. Te avisaremos cuando se confirme."
              : "Hubo un problema con el pago. Podés intentarlo de nuevo o elegir otro método."}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            {order && isApproved && (
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 border-[#ff6e13] text-[#ff6e13] hover:bg-[#ff6e13]/5 transition-colors"
              >
                <Download className="w-4 h-4" />
                Descargar comprobante PDF
              </button>
            )}
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white bg-[#ff6e13] hover:opacity-90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Seguir comprando
            </Link>
          </div>
        </div>

        <Footer />
      </div>

      {order && isApproved && (
        <PedidoRecibo
          numeroPedido={order.numeroPedido}
          fecha={order.fecha}
          items={order.items}
          total={order.total}
          metodoPago={order.metodoPago}
          cliente={order.cliente}
        />
      )}
    </>
  );
};

export default PedidoExitoso;
