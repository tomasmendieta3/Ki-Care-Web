import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronUp, ChevronDown } from "lucide-react";

const featured = {
  name: "María García",
  profession: "Esteticista profesional",
  city: "Buenos Aires",
  initials: "MG",
  rating: 5,
  comment:
    "Buscaba un equipo confiable, con soporte real. Hoy trabajo tranquila y con respaldo. No solo compré un equipo, sino un acompañamiento completo que me dio la seguridad para crecer mi negocio.",
};

const reviews = [
  {
    name: "Luciana Pérez",
    profession: "Cosmetóloga",
    city: "Córdoba",
    initials: "LP",
    rating: 5,
    comment:
      "Llegó perfectamente embalado y antes de lo previsto. La capacitación incluida fue muy completa. Mis clientas están encantadas con los resultados.",
  },
  {
    name: "Valeria Torres",
    profession: "Esteticista",
    city: "La Plata",
    initials: "VT",
    rating: 5,
    comment:
      "Increíble resultado en reducción de medidas. Mis clientas pierden entre 2 y 4 cm por sesión. El equipo es muy potente y silencioso.",
  },
  {
    name: "Andrea Núñez",
    profession: "Cosmetóloga",
    city: "Tucumán",
    initials: "AN",
    rating: 5,
    comment:
      "El panel digital con programas preset es una maravilla. Los resultados son visibles desde la primera sesión y se mantienen con el tiempo.",
  },
  {
    name: "Natalia Fernández",
    profession: "Esteticista",
    city: "Buenos Aires",
    initials: "NF",
    rating: 5,
    comment:
      "El mejor combo que encontré en el mercado. Tener los tres equipos coordinados hace que los protocolos sean mucho más efectivos.",
  },
  {
    name: "Daniela Sosa",
    profession: "Cosmetóloga",
    city: "Córdoba",
    initials: "DS",
    rating: 5,
    comment:
      "La máscara LED es espectacular. La RF facial da resultados muy rápidos en lifting. Es una inversión que vale absolutamente la pena.",
  },
  {
    name: "Sofía Martínez",
    profession: "Esteticista",
    city: "Mendoza",
    initials: "SM",
    rating: 5,
    comment:
      "Lo compré hace dos meses y ya recuperé la inversión. Mis clientes piden el tratamiento constantemente. El equipo es robusto y muy profesional.",
  },
  {
    name: "Patricia Díaz",
    profession: "Kinesióloga",
    city: "Santa Fe",
    initials: "PD",
    rating: 4,
    comment:
      "Buen equipo en general. La calidad de ultrasonido es muy buena. El soporte técnico respondió rápido cuando tuve una pregunta.",
  },
  {
    name: "Carolina Romero",
    profession: "Kinesióloga",
    city: "Rosario",
    initials: "CR",
    rating: 4,
    comment:
      "Muy buena calidad para el precio. Muy fácil de manejar con los pacientes. El equipo en sí es excelente.",
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < count ? "text-[#9e1504] fill-[#9e1504]" : "text-zinc-400"}`} />
    ))}
  </div>
);

const TestimonialSection = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const [leftHeight, setLeftHeight] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      if (leftRef.current) setLeftHeight(leftRef.current.offsetHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const startAuto = () => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % reviews.length);
    }, 3500);
  };

  useEffect(() => {
    startAuto();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const go = (dir: 1 | -1) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDirection(dir);
    setIndex((i) => (i + dir + reviews.length) % reviews.length);
    startAuto();
  };

  // How many cards fit given left height
  const CARD_H = 130;
  const GAP = 12;
  const visible_count = leftHeight ? Math.max(2, Math.floor((leftHeight + GAP) / (CARD_H + GAP))) : 3;
  const visible = Array.from({ length: visible_count }, (_, i) => reviews[(index + i) % reviews.length]);

  return (
    <section className="bg-white py-20 md:py-28 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#9e1504] text-sm font-semibold uppercase tracking-widest mb-3">Testimonios</p>
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 leading-tight">
            Lo que dicen nuestras profesionales.
          </h2>
        </motion.div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* LEFT — featured */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="border border-zinc-200 rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Blank photo box */}
            <div className="w-full aspect-[4/3] bg-zinc-100" />

            {/* Info + quote */}
            <div className="px-7 py-7 flex flex-col gap-4 bg-zinc-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#9e1504]/20 flex items-center justify-center text-[#9e1504] text-sm font-bold shrink-0">
                  {featured.initials}
                </div>
                <div>
                  <p className="text-zinc-900 font-semibold text-sm leading-none">{featured.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{featured.profession} · {featured.city}</p>
                </div>
                <div className="ml-auto"><Stars count={featured.rating} /></div>
              </div>
              <div className="relative">
                <Quote className="w-6 h-6 text-[#9e1504]/25 absolute -top-1 -left-1" />
                <blockquote className="text-zinc-700 text-base leading-relaxed pl-5">
                  "{featured.comment}"
                </blockquote>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — vertical carousel, same height as left */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3"
            style={leftHeight ? { height: leftHeight } : undefined}
          >
            {/* Scrollable cards area */}
            <div className="flex flex-col gap-3 flex-1 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((r, i) => (
                  <motion.div
                    key={r.name + index + i}
                    initial={{ opacity: 0, y: direction * 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: direction * -28 }}
                    transition={{ duration: 0.32, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="border border-zinc-200 rounded-xl px-5 py-4 bg-white flex flex-col gap-2.5 shrink-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#9e1504]/20 flex items-center justify-center text-[#9e1504] text-xs font-bold shrink-0">
                        {r.initials}
                      </div>
                      <div>
                        <p className="text-zinc-900 text-sm font-semibold leading-none">{r.name}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{r.profession} · {r.city}</p>
                      </div>
                      <div className="ml-auto"><Stars count={r.rating} /></div>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">"{r.comment}"</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-1 shrink-0">
              <p className="text-zinc-400 text-xs">{index + 1} – {Math.min(index + visible_count, reviews.length)} de {reviews.length}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => go(-1)}
                  className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => go(1)}
                  className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
