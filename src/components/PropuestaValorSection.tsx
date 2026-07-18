import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { supabase, mapDbToProducto, type DbProducto } from "@/lib/supabase";
import { productos as staticProductos, formatPrice, type Producto } from "@/data/productos.data";

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
  "Equipos certificados y desarrollados bajo estándares de calidad, seguridad y eficacia.",
  "Tecnología de alta precisión.",
  "Emisión uniforme y estable para tratamientos más seguros y efectivos.",
  "Sistemas de control y protección inteligente.",
  "Intensidad y otros parámetros configurables según el protocolo profesional.",
  "Diseño ergonómico para uso intensivo.",
  "Materiales de alto rendimiento y máxima confiabilidad.",
  "Soporte y respaldo pensado según tus necesidades.",
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
  const [destacado, setDestacado] = useState<Producto | null>(null);

  useEffect(() => {
    supabase
      .from("productos")
      .select("*")
      .eq("destacado", true)
      .eq("activo", true)
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setDestacado(mapDbToProducto(data as DbProducto));
        } else {
          // fallback: primer producto estático
          setDestacado(staticProductos[0] ?? null);
        }
      });
  }, []);

  return (
    <section id="productos" className="bg-white py-20 md:py-28 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        <motion.h2 {...fadeUp(0)} className="text-3xl md:text-5xl font-bold text-zinc-900 leading-tight mb-8">
          Sumate a los profesionales{" "}
          <span className="text-[#9e1504]">que invirtieron en Ki Care.</span>
        </motion.h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* LEFT — stat + propuesta de valor */}
          <motion.div
            {...fadeUp(0.05)}
            className="border border-zinc-200 rounded-2xl px-8 py-10 flex flex-col gap-6 h-full"
          >

            {/* Photo box with counter overlay */}
            <div className="w-full aspect-square border border-zinc-100 rounded-xl overflow-hidden relative flex items-center justify-center bg-zinc-50 group">
              <img
                src="/profesionales.png"
                alt="Profesionales Ki Care"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
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
                En Ki Care desarrollamos tecnología estética profesional pensada para brindar soluciones reales a los problemas de los usuarios y sus potenciales clientes.
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Nuestros equipos combinan innovación, confiabilidad y estándares de calidad internacionales. Cada equipo médico está diseñado con materiales e insumos de última generación lo que garantiza alta precisión, funcionamiento estable y sistemas de protección inteligentes que garantizan tratamientos más seguros, eficientes y confortables tanto para el profesional como para el paciente.
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed italic">
                Porque en estética no alcanza con que un equipo funcione: tiene que transmitir confianza, proteger la salud del paciente, respaldar el trabajo de cada profesional generando los resultados esperados en el menor tiempo posible.
              </p>
            </div>
          </motion.div>

          {/* RIGHT — equipo destacado */}
          <motion.div
            {...fadeUp(0.1)}
            className="border border-zinc-200 rounded-2xl px-8 py-10 flex flex-col gap-5 h-full"
          >
            {/* Producto destacado */}
            {destacado ? (
              <div
                className="w-full aspect-square border border-zinc-100 rounded-xl overflow-hidden relative bg-white flex items-center justify-center group cursor-pointer"
                onClick={() => navigate(`/productos/${destacado.id}`)}
              >
                {destacado.imagen_principal ? (
                  <img
                    src={destacado.imagen_principal}
                    alt={destacado.nombre}
                    className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 text-zinc-600">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                )}

                {/* Badge destacado */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#ff6e13] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-white" />
                  Destacado
                </div>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-5">
                  <p className="text-zinc-900 font-bold text-lg leading-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">{destacado.nombre}</p>
                  <p className="text-zinc-500 text-xs mt-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">{destacado.subtitulo}</p>
                  <p className="text-green-500 font-black text-xl mt-1 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">{formatPrice(destacado.precioActual)}</p>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-square border border-zinc-100 rounded-xl bg-zinc-50 flex items-center justify-center">
                <span className="text-xs text-zinc-400 uppercase tracking-widest">Sin equipo destacado</span>
              </div>
            )}

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
