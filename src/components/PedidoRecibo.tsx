import { type CartItem } from "@/context/CartContext";
import { formatPrice } from "@/data/productos.data";

interface PedidoReciboProps {
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

const PedidoRecibo = ({
  numeroPedido,
  fecha,
  items,
  total,
  metodoPago,
  cliente,
}: PedidoReciboProps) => {
  return (
    <div
      id="pedido-recibo"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "11px",
        color: "#1a1a1a",
        padding: "20mm 18mm",
        maxWidth: "210mm",
        margin: "0 auto",
        lineHeight: 1.4,
      }}
    >

      {/* ── ENCABEZADO ─────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6mm", borderBottom: "2px solid #ff6e13", paddingBottom: "4mm" }}>

        {/* Logo + datos emisor */}
        <div style={{ flex: 1 }}>
          <img
            src="/logo 3.png"
            alt="Ki Care"
            style={{
              height: "28px",
              width: "auto",
              marginBottom: "6px",
              filter: "invert(51%) sepia(100%) saturate(2000%) hue-rotate(2deg) brightness(102%)",
            }}
          />
          <div style={{ fontSize: "10px", color: "#555", lineHeight: "1.6" }}>
            <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "11px" }}>Ki Care Electroestética</div>
            <div>Industria Argentina · ANMAT Habilitado</div>
            <div>kicare.info@gmail.com</div>
            <div>+54 9 11 2757-1920</div>
          </div>
        </div>

        {/* Tipo de documento */}
        <div style={{ textAlign: "center", border: "2px solid #1a1a1a", padding: "6px 14px", margin: "0 10mm" }}>
          <div style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "1px" }}>R</div>
          <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "1px" }}>REMITO</div>
        </div>

        {/* Número y fecha */}
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Comprobante de pedido</div>
          <div style={{ fontSize: "18px", fontWeight: 900, color: "#ff6e13", letterSpacing: "1px" }}>
            N° {numeroPedido}
          </div>
          <div style={{ fontSize: "10px", color: "#555", marginTop: "4px" }}>Fecha: <strong>{fecha}</strong></div>
          <div style={{ fontSize: "10px", color: "#555" }}>
            Pago: <strong>{metodoPago}</strong>
          </div>
        </div>
      </div>

      {/* ── RECEPTOR ───────────────────────────────────────── */}
      <div style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "5mm", marginBottom: "5mm", backgroundColor: "#fafafa" }}>
        <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#ff6e13", marginBottom: "5px" }}>
          Datos del destinatario
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 20px" }}>
          <div><span style={{ color: "#888" }}>Nombre: </span><strong>{cliente.nombre}</strong></div>
          <div><span style={{ color: "#888" }}>DNI / CUIT: </span><strong>{cliente.documento}</strong></div>
          <div><span style={{ color: "#888" }}>Teléfono: </span><strong>{cliente.telefono}</strong></div>
          <div><span style={{ color: "#888" }}>Dirección: </span><strong>{cliente.direccion}</strong></div>
          <div><span style={{ color: "#888" }}>Ciudad: </span><strong>{cliente.ciudad}, {cliente.provincia}</strong></div>
        </div>
      </div>

      {/* ── TABLA DE PRODUCTOS ─────────────────────────────── */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "5mm" }}>
        <thead>
          <tr style={{ backgroundColor: "#ff6e13", color: "#fff" }}>
            <th style={{ padding: "5px 8px", textAlign: "center", fontWeight: 700, fontSize: "10px", width: "8%" }}>CANT.</th>
            <th style={{ padding: "5px 8px", textAlign: "left", fontWeight: 700, fontSize: "10px" }}>DESCRIPCIÓN</th>
            <th style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: "10px", width: "18%" }}>PRECIO UNIT.</th>
            <th style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, fontSize: "10px", width: "18%" }}>SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ producto, quantity }, i) => (
            <tr
              key={producto.id}
              style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9f9f9", borderBottom: "1px solid #eee" }}
            >
              <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: 600 }}>{quantity}</td>
              <td style={{ padding: "6px 8px" }}>
                <div style={{ fontWeight: 700 }}>{producto.nombre}</div>
                {producto.categoria && (
                  <div style={{ fontSize: "9px", color: "#888", marginTop: "1px" }}>{producto.categoria}</div>
                )}
                {producto.especificaciones && Object.keys(producto.especificaciones).length > 0 && (
                  <div style={{ marginTop: "4px" }}>
                    {Object.entries(producto.especificaciones).map(([k, v]) => (
                      <div key={k} style={{ fontSize: "9px", color: "#555" }}>
                        <span style={{ color: "#888" }}>{k}: </span>{v}
                      </div>
                    ))}
                  </div>
                )}
              </td>
              <td style={{ padding: "6px 8px", textAlign: "right" }}>{formatPrice(producto.precioActual)}</td>
              <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 700 }}>
                {formatPrice(producto.precioActual * quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── TOTALES ────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8mm" }}>
        <table style={{ width: "220px", borderCollapse: "collapse" }}>
          <tbody>
            <tr style={{ borderTop: "1px solid #eee" }}>
              <td style={{ padding: "4px 8px", color: "#555" }}>Subtotal</td>
              <td style={{ padding: "4px 8px", textAlign: "right" }}>{formatPrice(total)}</td>
            </tr>
            <tr>
              <td style={{ padding: "4px 8px", color: "#555" }}>Envío</td>
              <td style={{ padding: "4px 8px", textAlign: "right", color: "#16a34a", fontWeight: 600 }}>Sin cargo</td>
            </tr>
            <tr style={{ borderTop: "2px solid #ff6e13" }}>
              <td style={{ padding: "6px 8px", fontWeight: 900, fontSize: "13px" }}>TOTAL</td>
              <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 900, fontSize: "13px" }}>{formatPrice(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── GARANTÍA ───────────────────────────────────────── */}
      <div style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "5mm", marginBottom: "8mm", borderLeft: "4px solid #ff6e13" }}>
        <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#ff6e13", marginBottom: "5px" }}>
          Condiciones de garantía
        </div>
        <div style={{ color: "#444", lineHeight: "1.7" }}>
          <div>• <strong>Período:</strong> 12 (doce) meses desde la fecha de compra, contra defectos de fabricación.</div>
          <div>• <strong>Cobertura:</strong> Fallas en componentes eléctricos y electrónicos bajo uso normal del equipo.</div>
          <div>• <strong>Exclusiones:</strong> Daños por mal uso, golpes, humedad o modificaciones no autorizadas.</div>
          <div>• <strong>Vigencia:</strong> Conservar este comprobante como constancia de adquisición.</div>
          <div style={{ marginTop: "4px" }}>
            Para hacer efectiva la garantía contactarse a <strong>kicare.info@gmail.com</strong> o al <strong>+54 9 11 2757-1920</strong>.
          </div>
        </div>
      </div>

      {/* ── FIRMAS ─────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "20mm", marginBottom: "6mm" }}>
        {["Firma y aclaración del vendedor", "Firma y aclaración del comprador"].map((label) => (
          <div key={label} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ borderTop: "1px solid #999", paddingTop: "4px", marginTop: "18px", fontSize: "9px", color: "#888" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── PIE ────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #eee", paddingTop: "4mm", display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#aaa" }}>
        <span>Ki Care Electroestética · Industria Argentina · ANMAT Habilitado</span>
        <span>Remito N° {numeroPedido} · {fecha}</span>
      </div>

    </div>
  );
};

export default PedidoRecibo;
