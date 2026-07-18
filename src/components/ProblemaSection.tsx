import { motion } from "framer-motion";
import { scrollToSection } from "@/lib/scroll";

const PAPER: React.CSSProperties = {
  background: "#ffffff",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
};

const alerts = [
  {
    section: "FALSIFICACIÓN",
    date: "2025",
    dateline: "BUENOS AIRES",
    title: "Equipo láser falsificado: retiro inmediato del mercado",
    body: "Sin datos de fabricante ni importador responsable. ANMAT ordenó su decomiso preventivo.",
  },
  {
    section: "ALERTA SANITARIA",
    date: "2025",
    dateline: "CAPITAL FEDERAL",
    title: "Paciente con quemaduras graves por equipo adulterado",
    body: "El equipo operaba sin habilitación en un centro de estética de la Ciudad de Buenos Aires.",
  },
  {
    section: "CÓRDOBA",
    date: "JUN. 2025",
    dateline: "CÓRDOBA",
    title: "Radiofrecuencia e HIFU sin respaldo sanitario prohibidos",
    body: "La prohibición se extiende a la comercialización online en redes sociales y sitios web.",
  },
  {
    section: "MAR DEL PLATA",
    date: "DIC. 2025",
    dateline: "MAR DEL PLATA",
    title: "Ultrasonido y magnetoterapia prohibidos: sumario abierto",
    body: "Fabricación sin habilitación nacional. Disp. ANMAT 9295/2025.",
  },
];

const stats = [
  { value: "2025", label: "Disposiciones vigentes" },
  { value: "Clase II", label: "Clasificación ANMAT" },
  { value: "5 años", label: "Garantía de repuestos" },
];

const ProblemaSection = () => {
  return (
    <section className="bg-white py-20 md:py-28 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="rounded-2xl overflow-hidden bg-white"
        >
          {/* ── BODY: two columns ── */}
          <div className="flex flex-col md:flex-row">

            {/* LEFT COLUMN */}
            <div className="md:w-[40%] flex flex-col gap-6 px-6 py-8 border-b md:border-b-0 md:border-r border-zinc-200">

              <p className="text-[#ff6e13] text-[10px] font-bold tracking-widest uppercase">
                ¿Por qué importa la certificación?
              </p>

              <h2 className="text-zinc-900 text-2xl md:text-3xl font-bold leading-snug">
                El mercado está saturado con equipos{" "}
                <span className="text-[#ff6e13]">sin registro</span>
                , falsificados y adulterados.
              </h2>

              <p className="text-zinc-500 text-sm leading-relaxed">
                En Ki Care, todos nuestros equipos se encuentran certificados. Esto significa que cada profesional que nos elige cuida a sus clientes y, con ello, a su propio negocio, garantizando resultados visibles y efectivos para quienes confían en sus servicios.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {stats.map((s) => (
                  <div key={s.value} className="border-t-2 border-[#ff6e13] pt-3">
                    <p className="text-zinc-900 font-bold text-base leading-tight">{s.value}</p>
                    <p className="text-zinc-400 text-[10px] leading-tight mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <p className="text-[#ff6e13] text-[10px] font-semibold tracking-wider uppercase">
                Ki Care · 100% certificado · Industria Argentina
              </p>

              {/* Logos */}
              <div className="flex flex-wrap items-center gap-6">
                <img
                  src="/logo 3.png"
                  alt="Ki Care"
                  className="h-10 w-auto"
                  style={{ filter: "invert(51%) sepia(100%) saturate(2000%) hue-rotate(2deg) brightness(102%)" }}
                />
                <img src="/anmat 3.png" alt="ANMAT" className="h-10 w-auto" />
              </div>

              {/* CTA */}
              <button
                onClick={() => scrollToSection("productos")}
                className="self-start mt-8 inline-flex items-center gap-2 bg-[#ff6e13] hover:bg-[#e05e0a] text-white text-base font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-[#ff6e13]/30 hover:shadow-xl hover:shadow-[#ff6e13]/40 hover:scale-105 active:scale-[0.98] animate-[pulse-glow_2s_ease-in-out_infinite]"
              >
                Ver mi equipo
              </button>

            </div>

            {/* RIGHT COLUMN */}
            <div className="md:w-[60%] p-4 flex flex-col gap-3">

              {/* Top featured article */}
              <div
                className="p-5 border border-[#c8b97a] shadow-[4px_4px_0px_rgba(0,0,0,0.18)]"
                style={PAPER}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#9e1504] text-[9px] font-bold tracking-widest uppercase font-serif">
                    Boletín Oficial · Salud Pública
                  </span>
                  <span className="flex-1 border-t border-[#9e1504]/40" />
                  <span className="text-[#6b5e3a] text-[9px] font-serif">Dic. 2025</span>
                </div>
                <h3 className="text-zinc-900 font-bold text-base md:text-lg leading-tight mb-2 font-serif">
                  ANMAT prohíbe equipos estéticos sin registro sanitario: uso, venta y distribución suspendidos
                </h3>
                <div className="border-t border-b border-zinc-400/30 py-1.5 mb-2">
                  <span className="text-[#6b5e3a] text-[10px] font-serif italic">
                    BUENOS AIRES —
                  </span>
                  <span className="text-zinc-600 text-[10px] font-serif ml-1">
                    Disposición 8804/2025. Se desconoce funcionalidad y seguridad del equipo.
                  </span>
                </div>
                <p className="text-[#6b5e3a] text-[10px] font-serif italic">
                  — Fuente: Boletín Oficial de la República Argentina
                </p>
              </div>

              {/* 2x2 clippings grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alerts.map((a) => (
                  <div
                    key={a.section}
                    className="p-4 flex flex-col gap-1.5 border border-[#c8b97a] shadow-[4px_4px_0px_rgba(0,0,0,0.18)]"
                    style={PAPER}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[#9e1504] text-[8px] font-bold tracking-widest uppercase font-serif">
                        {a.section}
                      </span>
                      <span className="flex-1 border-t border-[#9e1504]/40" />
                      <span className="text-[#6b5e3a] text-[8px] font-serif">{a.date}</span>
                    </div>
                    <h4 className="text-zinc-900 font-bold text-sm leading-tight font-serif">
                      {a.title}
                    </h4>
                    <div className="border-t border-zinc-400/30 pt-1.5 mt-auto">
                      <span className="text-[#6b5e3a] text-[9px] font-serif italic">{a.dateline} — </span>
                      <span className="text-zinc-500 text-[9px] font-serif">{a.body}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pull quote / editorial box */}
              <div
                className="p-5 flex flex-col gap-3 border border-[#c8b97a] shadow-[4px_4px_0px_rgba(0,0,0,0.18)]"
                style={PAPER}
              >
                <div className="flex items-center gap-2">
                  <span className="bg-[#9e1504] text-white text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 font-serif">
                    PROHIBIDO
                  </span>
                  <span className="flex-1 border-t-2 border-[#9e1504]" />
                </div>
                <p className="text-zinc-800 text-sm leading-relaxed italic font-serif border-l-4 border-[#9e1504]/40 pl-4">
                  "Se desconocen características, funcionalidad y seguridad del equipo: riesgo para la salud."
                </p>
                <p className="text-[#6b5e3a] text-[10px] font-serif">— ANMAT, Boletín Oficial de la República Argentina</p>
              </div>

            </div>
          </div>


        </motion.div>
      </div>
    </section>
  );
};

export default ProblemaSection;
