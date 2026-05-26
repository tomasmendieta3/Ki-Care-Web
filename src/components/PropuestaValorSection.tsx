import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function useCountUp(target: number, duration = 2000, start = false) {
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
  "Equipos certificados y desarrollados bajo estándares de seguridad sanitaria.",
  "Tecnología de ultrasonido de baja frecuencia de alta precisión.",
  "Emisión uniforme y estable para tratamientos más seguros y efectivos.",
  "Transductores de alta calidad y larga durabilidad.",
  "Sistema de control térmico y protección electrónica integrada.",
  "Intensidad y parámetros configurables según el protocolo profesional.",
  "Mayor estabilidad operativa y menor vibración mecánica.",
  "Diseño ergonómico para uso intensivo en centros estéticos.",
  "Componentes de alto rendimiento y máxima confiabilidad técnica.",
  "Compatibilidad con tratamientos corporales y protocolos combinados.",
  "Soporte y respaldo pensado para profesionales que trabajan todos los días.",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const PropuestaValorSection = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(300, 2000, inView);

  return (
    <section className="bg-white py-20 md:py-28 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* LEFT — stat + propuesta de valor */}
          <motion.div
            {...fadeUp(0.05)}
            className="border border-zinc-200 rounded-2xl px-8 py-10 flex flex-col gap-6 h-full"
          >
            {/* Photo box with counter overlay */}
            <div className="w-full aspect-square border border-zinc-100 rounded-xl overflow-hidden relative flex items-center justify-center bg-zinc-50">
              {/* Placeholder photo */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-300">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="text-xs tracking-widest uppercase text-zinc-400">Foto del profesional</span>
              </div>

              {/* Counter overlay */}
              <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-[80px] md:text-[100px] font-extrabold leading-none tracking-tighter tabular-nums drop-shadow-lg">
                  +{count}
                </p>
                <p className="text-white/80 text-sm font-medium leading-snug drop-shadow">
                  profesionales nos eligieron.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-12 h-px bg-[#9e1504]" />

            {/* Propuesta de valor */}
            <div className="flex flex-col gap-4">
              <p className="text-zinc-800 text-sm md:text-base font-semibold leading-snug">
                En Ki Care desarrollamos tecnología estética profesional pensada para brindar seguridad, precisión y resultados reales.
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Nuestros equipos combinan innovación, confiabilidad y estándares de calidad. Cada dispositivo está diseñado con tecnología de ultrasonido de alta precisión, frecuencia estable y sistemas de protección electrónica que garantizan tratamientos más seguros, eficientes y confortables tanto para el profesional como para el paciente.
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed italic">
                Porque en estética no alcanza con que un equipo funcione: tiene que transmitir confianza, proteger la salud del paciente y respaldar el trabajo de cada profesional.
              </p>
            </div>
          </motion.div>

          {/* RIGHT — foto + boton + bullets */}
          <motion.div
            {...fadeUp(0.1)}
            className="border border-zinc-200 rounded-2xl px-8 py-10 flex flex-col gap-5 h-full"
          >
            {/* Square photo */}
            <div className="w-full aspect-square border border-zinc-100 rounded-xl overflow-hidden relative flex items-center justify-center bg-zinc-50">
              <div className="flex flex-col items-center justify-center gap-3 text-zinc-300">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="text-xs tracking-widest uppercase text-zinc-400">Foto del equipo</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate("/productos")}
              className="inline-flex items-center gap-2 bg-[#ff6e13] hover:bg-[#e05e0a] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors duration-200 shadow-md shadow-[#ff6e13]/20 w-full justify-center"
            >
              Ver equipos
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Bullets */}
            <ul className="flex flex-col gap-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-zinc-500 text-sm leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#9e1504] shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PropuestaValorSection;
