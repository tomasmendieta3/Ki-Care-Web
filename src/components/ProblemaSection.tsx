import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Wrench } from "lucide-react";

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

const bullets = [
  "Riesgos para la salud del cliente",
  "Secuelas estéticas no deseadas",
  "Complicaciones durante el tratamiento",
  "Resultados inconsistentes",
  "Problemas sanitarios",
  "Responsabilidad legal ante incidentes",
  "Daño a tu reputación profesional",
];

const ProblemaSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(6, 1600, inView);

  return (
    <section ref={ref} className="bg-white py-20 md:py-28 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[#9e1504] text-sm font-semibold uppercase tracking-widest mb-10"
        >
          No pongas tu profesión en riesgo
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mb-8"
        >
          <img src="/info.png" alt="Información" className="w-full rounded-2xl object-cover shadow-xl shadow-zinc-200/80 ring-1 ring-zinc-100" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="flex flex-col md:grid md:grid-cols-[auto_1fr] overflow-hidden"
        >
          {/* LEFT — big number */}
          <div className="flex items-center justify-center py-8 md:py-10 md:pr-10 lg:pr-16 border-b md:border-b-0 md:border-r border-zinc-200">
            <div className="flex items-end leading-none select-none">
              <span className="text-[120px] md:text-[160px] lg:text-[200px] font-extrabold text-[#9e1504] leading-none tracking-tighter tabular-nums">
                {count}
              </span>
              <span className="text-[56px] md:text-[72px] lg:text-[88px] font-extrabold text-[#9e1504] leading-none mb-2 ml-1">
                /10
              </span>
            </div>
          </div>

          {/* RIGHT — stacked text */}
          <div className="flex flex-col divide-y divide-zinc-200">

            {/* Block 1 — BIG */}
            <div className="px-8 md:px-10 py-8 md:py-10">
              <p className="text-zinc-900 text-2xl md:text-4xl font-bold leading-snug mb-3">
                equipos estéticos informales podrían{" "}
                <span className="text-[#9e1504]">no cumplir estándares sanitarios.</span>
              </p>
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
                Una estadística que pone en riesgo a profesionales y pacientes por igual.
              </p>
            </div>

            {/* Blocks 2 + 3 — joined */}
            <div className="px-8 md:px-10 py-8 md:py-10 flex flex-col gap-6">
              <div>
                <p className="text-zinc-900 text-lg md:text-xl font-semibold leading-snug mb-2">
                  Mientras algunos buscan bajar costos, el diferencial real es{" "}
                  <span className="text-[#9e1504]">trabajar con tecnología certificada.</span>
                </p>
                <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
                  Cada equipo Ki Care está certificado y respaldado antes de llegar a tu centro.
                </p>
              </div>

              <div>
                <p className="text-zinc-400 text-xs font-medium mb-3 uppercase tracking-widest">
                  En la práctica, esto puede derivar en:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  {bullets.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                      className="flex items-center gap-2.5 text-zinc-600 text-sm md:text-base"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9e1504] shrink-0" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ANMAT value proposition box */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mt-8 rounded-2xl overflow-hidden relative p-8 md:p-10 shadow-2xl shadow-[#9e1504]/30 ring-1 ring-[#9e1504]/20 transition-all duration-300 hover:shadow-[0_24px_60px_rgba(158,21,4,0.45)] hover:-translate-y-1"
          style={{ backgroundImage: "url(/valor.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-[#9e1504]/55 rounded-2xl" />
          <div className="relative z-10">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">¿Por qué importa la certificación?</p>
          <h3 className="text-white text-2xl md:text-3xl font-bold leading-snug mb-8">
            Comprar con ANMAT es comprar con certeza,<br className="hidden md:block" />
            <span className="text-[#ff6e13]"> no con esperanza.</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#ff6e13]" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">El equipo hace lo que dice que hace</p>
                <p className="text-white/65 text-sm leading-relaxed">
                  La certificación ANMAT garantiza que el equipo fue fabricado y validado para cumplir su función de forma segura, tanto para el paciente como para el profesional.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5 text-[#ff6e13]" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Soporte y repuestos por 5 años</p>
                <p className="text-white/65 text-sm leading-relaxed">
                  Con ANMAT, tenés garantía de soporte técnico y disponibilidad de repuestos durante toda la vida útil del equipo — incluso si la empresa fabricante cierra.
                </p>
              </div>
            </div>
          </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ProblemaSection;
