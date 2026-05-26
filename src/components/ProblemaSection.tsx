import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

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
  "Quemaduras",
  "Manchas permanentes",
  "Lesiones en la piel",
  "Daño ocular",
  "Infecciones",
  "Resultados impredecibles",
  "Fallas eléctricas durante el tratamiento",
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
          El problema real
        </motion.p>

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

      </div>
    </section>
  );
};

export default ProblemaSection;
