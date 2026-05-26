import { useEffect, useState } from "react";
import { Button, Chip } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, Truck, Headphones, ArrowRight, Users } from "lucide-react";

const badges = [
  { icon: Shield, label: "Certificación ANMAT" },
  { icon: Truck, label: "Envío a todo el país" },
  { icon: Headphones, label: "Soporte técnico local" },
];

const slides = [
  {
    bg: "bg-[#ff6e13]",
    chipBg: "bg-white/20 text-white",
    headlineColor: "text-white",
    accentColor: "text-white/70",
    subColor: "text-white/80",
    badgeColor: "text-white/70",
    badgeIconColor: "text-white",
    dotActive: "bg-white",
    dotInactive: "bg-white/30",
    chip: "Equipamiento profesional certificado",
    headline: "Tecnología estética profesional,",
    accent: "segura y lista para trabajar.",
    sub: "Equipos con certificación vigente, envío a todo el país y soporte técnico local. Trabajá con confianza desde el primer día.",
    cta: "Quiero asesoramiento",
    ctaScroll: "contacto",
    ctaClass: "bg-white text-[#ff6e13] hover:bg-white/90",
    outlineClass: "border-white text-white hover:bg-white/10",
  },
  {
    bg: "bg-white",
    chipBg: "bg-[#9e1504]/10 text-[#9e1504]",
    headlineColor: "text-zinc-900",
    accentColor: "text-[#9e1504]",
    subColor: "text-zinc-500",
    badgeColor: "text-zinc-500",
    badgeIconColor: "text-[#9e1504]",
    dotActive: "bg-[#9e1504]",
    dotInactive: "bg-zinc-200",
    chip: "+300 profesionales activos",
    chipIcon: Users,
    headline: "¿Ya sos parte de la",
    accent: "comunidad Ki Care?",
    sub: "Más de 300 esteticistas, cosmetólogas y kinesiólogos ya trabajan con nuestros equipos. Sumate y accedé a soporte, protocolos y una comunidad que crece cada día.",
    cta: "Quiero sumarme",
    ctaScroll: "contacto",
    ctaClass: "bg-[#ff6e13] text-white hover:bg-[#e05e0a]",
    outlineClass: "border-zinc-300 text-zinc-700 hover:bg-zinc-50",
  },
  {
    bg: "bg-[#9e1504]",
    chipBg: "bg-white/20 text-white",
    headlineColor: "text-white",
    accentColor: "text-[#ff6e13]",
    subColor: "text-white/80",
    badgeColor: "text-white/70",
    badgeIconColor: "text-[#ff6e13]",
    dotActive: "bg-[#ff6e13]",
    dotInactive: "bg-white/30",
    chip: "Inversión con retorno real",
    headline: "Recuperá tu inversión",
    accent: "en menos de 7 semanas.",
    sub: "Con 4 sesiones por semana a $15.000 c/u ya cubrís el equipo. Ki Care no es un gasto, es una herramienta que trabaja para vos todos los días.",
    cta: "Ver equipos",
    ctaScroll: "productos",
    ctaClass: "bg-[#ff6e13] text-white hover:bg-[#e05e0a]",
    outlineClass: "border-white text-white hover:bg-white/10",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.section
          key={current}
          custom={direction}
          variants={{
            enter: (d: number) => ({ x: d * 80, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (d: number) => ({ x: d * -80, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`${slide.bg} relative overflow-hidden`}
        >
          {/* Subtle radial glow */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,white/10,transparent)]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
            <div className="max-w-3xl">

              {/* Chip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-6"
              >
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${slide.chipBg}`}>
                  {slide.chipIcon && <slide.chipIcon className="w-3.5 h-3.5" />}
                  {slide.chip}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.45 }}
                className={`font-bold tracking-tight mb-6 leading-[1.08] ${slide.headlineColor}`}
                style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)" }}
              >
                {slide.headline}{" "}
                <span className={slide.accentColor}>{slide.accent}</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45 }}
                className={`text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl ${slide.subColor}`}
              >
                {slide.sub}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.45 }}
                className="flex flex-wrap gap-3 mb-14"
              >
                <button
                  onClick={() => document.getElementById(slide.ctaScroll)?.scrollIntoView({ behavior: "smooth" })}
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-base transition-colors duration-200 shadow-lg ${slide.ctaClass}`}
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}
                  className={`inline-flex items-center px-8 py-3 rounded-full font-semibold text-base border transition-colors duration-200 ${slide.outlineClass}`}
                >
                  Ver equipos
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-wrap gap-x-8 gap-y-3 mb-8"
              >
                {badges.map(({ icon: Icon, label }) => (
                  <div key={label} className={`flex items-center gap-2 ${slide.badgeColor}`}>
                    <Icon className={`w-4 h-4 flex-shrink-0 ${slide.badgeIconColor}`} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Dots */}
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? `w-6 ${slide.dotActive}` : `w-1.5 ${slide.dotInactive}`
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
};

export default HeroSection;
