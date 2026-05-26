import { motion } from "framer-motion";
import { Check, X, Users, Headphones, TrendingUp } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const rows = [
  { feature: "Precio del equipo",          comp: "$180.000 – $250.000", ki: "$412.250" },
  { feature: "Certificación sanitaria",    comp: false,                  ki: true },
  { feature: "Garantía real",              comp: "3 meses",              ki: "12 meses" },
  { feature: "Soporte técnico",            comp: false,                  ki: true },
  { feature: "Capacitación incluida",      comp: false,                  ki: true },
  { feature: "Comunidad de profesionales", comp: false,                  ki: true },
  { feature: "Repuestos y asistencia",     comp: false,                  ki: true },
  { feature: "Estabilidad de frecuencia",  comp: "Variable / inestable", ki: "Alta precisión" },
];

const roiItems = [
  {
    icon: TrendingUp,
    title: "Recuperás la inversión rápido.",
    desc: "Con un equipo Ki Care activo, un profesional que realiza 4 sesiones por semana a $15.000 c/u recupera la inversión en menos de 7 semanas.",
  },
  {
    icon: Headphones,
    title: "Acompañamiento real, no post-venta vacío.",
    desc: "Cada compra incluye soporte técnico directo, protocolos actualizados y acceso a nuestro equipo cuando lo necesitás.",
  },
  {
    icon: Users,
    title: "Comunidad Ki Care.",
    desc: "Más de 300 profesionales compartiendo casos, protocolos y resultados. Un espacio para crecer junto a colegas que trabajan con la misma tecnología.",
  },
];

const Cell = ({ value }: { value: string | boolean }) => {
  if (value === true)
    return <Check className="w-5 h-5 text-[#9e1504] mx-auto" strokeWidth={2.5} />;
  if (value === false)
    return <X className="w-4 h-4 text-zinc-300 mx-auto" strokeWidth={2} />;
  return <span className="text-zinc-500 text-xs md:text-sm">{value}</span>;
};

const InversionSection = () => (
  <section className="bg-white py-20 md:py-28 px-4 overflow-hidden">
    <div className="max-w-6xl mx-auto flex flex-col gap-14">

      {/* Header */}
      <motion.div {...fadeUp(0)} className="max-w-2xl">
        <p className="text-[#9e1504] text-sm font-semibold uppercase tracking-widest mb-4">
          Inversión inteligente
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 leading-tight mb-4">
          No es un gasto.{" "}
          <span className="text-[#9e1504]">Es una herramienta que trabaja para vos.</span>
        </h2>
        <p className="text-zinc-500 text-base md:text-lg leading-relaxed">
          Comparado con equipos más baratos del mercado, Ki Care no solo cuesta más:{" "}
          <span className="text-zinc-900 font-medium">devuelve más.</span> En seguridad, en durabilidad, en resultados y en el respaldo que recibís después de la compra.
        </p>
      </motion.div>

      {/* Comparison table */}
      <motion.div {...fadeUp(0.1)} className="border border-zinc-200 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-3 md:grid-cols-[1fr_auto_auto] bg-zinc-50 border-b border-zinc-200">
          <div className="px-3 md:px-6 py-4 text-zinc-400 text-xs font-semibold uppercase tracking-widest">Característica</div>
          <div className="px-3 md:px-6 py-4 text-center text-zinc-500 text-sm font-semibold md:w-44">Competencia</div>
          <div className="px-3 md:px-6 py-4 text-center text-[#9e1504] text-sm font-semibold md:w-44 border-l border-zinc-200 bg-[#9e1504]/5">Ki Care</div>
        </div>

        {rows.map((row, i) => (
          <div
            key={row.feature}
            className={`grid grid-cols-3 md:grid-cols-[1fr_auto_auto] border-b border-zinc-200 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50/60"}`}
          >
            <div className="px-3 md:px-6 py-4 text-zinc-700 text-xs md:text-sm font-medium">{row.feature}</div>
            <div className="px-3 md:px-6 py-4 text-center md:w-44 flex items-center justify-center">
              <Cell value={row.comp} />
            </div>
            <div className="px-3 md:px-6 py-4 text-center md:w-44 flex items-center justify-center border-l border-zinc-200 bg-[#9e1504]/5">
              <Cell value={row.ki} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* ROI + comunidad cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roiItems.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            {...fadeUp(0.12 + i * 0.08)}
            className="border border-zinc-200 rounded-2xl px-6 py-7 flex flex-col gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#9e1504]/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#9e1504]" strokeWidth={1.8} />
            </div>
            <p className="text-zinc-900 font-semibold text-base leading-snug">{title}</p>
            <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>

    </div>
  </section>
);

export default InversionSection;
