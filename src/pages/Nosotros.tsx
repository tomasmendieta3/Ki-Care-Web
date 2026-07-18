import { motion } from "framer-motion";
import { Shield, Zap, Users, TrendingUp, Award, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NAVY = "#0A0F2C";
const ORANGE = "#ff6e13";
const RED = "#9e1504";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const timeline = [
  {
    year: "2020",
    title: "El origen",
    desc: "Un grupo de jóvenes bioingenieros graduados de la UNER, institución pionera en la enseñanza y desarrollo de esta carrera en Latinoamérica, identificó una necesidad real en el mercado: los profesionales de la estética requerían equipos certificados, confiables y con verdadero soporte local. Con esta visión nació Ki Care, creando desde sus inicios una familia completa de productos diseñada para brindar seguridad y respaldo tecnológico.",
  },
  {
    year: "2021",
    title: "Habilitación inicial",
    desc: "Grupo Proyectar Innovación SRL alcanzó un hito fundamental al habilitarse oficialmente como fabricante de productos médicos. Esto abrió la puerta para iniciar con éxito la comercialización de toda la línea Ki Care en la provincia de Entre Ríos, garantizando los máximos estándares de seguridad y eficacia.",
  },
  {
    year: "2022",
    title: "Certificación y crecimiento",
    desc: "Ki Care obtuvo la certificación ANMAT para sus equipos. Un hito que marcó el estándar de calidad que prometimos desde el primer día. La comunidad de profesionales empezó a crecer nacionalmente, de colega en colega.",
  },
  {
    year: "2023",
    title: "Más de 200 profesionales",
    desc: "La red de profesionales superó los 200. Reforzamos nuestro compromiso con quienes nos eligen con un sólido sistema de seguimiento y soporte técnico directo. Cada profesional cuenta con el respaldo constante y la respuesta rápida que necesita en su día a día.",
  },
  {
    year: "2024",
    title: "Expansión nacional",
    desc: "Envíos a todo el país, nuevos modelos de equipos y la consolidación de un equipo de soporte técnico local. Más de 300 profesionales eligieron Ki Care. La garantía de 24 meses pasó a ser un estándar, no una excepción.",
  },
  {
    year: "2025 – hoy",
    title: "Innovación continua",
    desc: "Seguimos desarrollando nuevos equipos desde Oro Verde, Entre Ríos. Cada producto nace de la investigación aplicada del Grupo Proyectar Innovación y del diálogo constante con la comunidad de profesionales que ya confía en nosotros.",
  },
];

const values = [
  { icon: Shield, title: "Certificación real", desc: "ANMAT vigente en todos nuestros equipos. No es marketing — es el piso mínimo sobre el que construimos." },
  { icon: Zap, title: "Tecnología aplicada", desc: "Equipos desarrollados con ingeniería local, adaptados a las necesidades reales del profesional argentino." },
  { icon: Users, title: "Comunidad activa", desc: "Más de 300 profesionales que comparten protocolos, resultados y experiencia. Comprás el equipo, entrás a la red." },
  { icon: TrendingUp, title: "Retorno garantizado", desc: "Cada equipo fue diseñado para recuperar la inversión rápido. En pocas sesiones ya está pagado." },
  { icon: Award, title: "Soporte técnico local", desc: "Sin importadores. Sin demoras. Repuestos y asistencia desde Argentina, en tiempo real." },
  { icon: Heart, title: "Acompañamiento real", desc: "Guías, manuales de uso y un equipo humano que responde de verdad." },
];

const Nosotros = () => (
  <div className="min-h-screen flex flex-col bg-white">
    <Header />

    {/* Hero */}
    <section className="relative overflow-hidden py-24 md:py-32" style={{ backgroundColor: NAVY }}>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #ff6e13 0%, transparent 60%)" }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.p
          {...fadeUp(0)}
          className="text-xs font-bold tracking-[0.25em] uppercase mb-4"
          style={{ color: ORANGE }}
        >
          Quiénes somos
        </motion.p>
        <motion.h1
          {...fadeUp(0.08)}
          className="font-black text-white leading-tight mb-6"
          style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.75rem)" }}
        >
          Tecnología estética{" "}
          <span style={{ color: ORANGE }}>hecha en Argentina</span>{" "}
          para profesionales de la salud.
        </motion.h1>
        <motion.p
          {...fadeUp(0.15)}
          className="text-white/60 text-lg leading-relaxed max-w-2xl"
        >
          Ki Care nació de la convicción de que los profesionales de la estética merecen equipos confiables, que garanticen resultados, soporte técnico inmediato y una comunidad que los acompañe. Somos parte de Grupo Proyectar Innovación SRL — una empresa argentina de ingeniería, investigación y desarrollo de tecnología médica con base en Oro Verde, Entre Ríos.
        </motion.p>
      </div>
    </section>

    {/* Historia — timeline */}
    <section className="py-20 md:py-28 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUp(0)} className="mb-14">
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: RED }}>Nuestra historia</p>
          <h2 className="font-bold text-zinc-900 leading-tight" style={{ fontSize: "clamp(1.8rem, 3vw, 2.75rem)" }}>
            De un prototipo a +300 profesionales.
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] sm:left-[23px] top-0 bottom-0 w-px bg-zinc-100 hidden sm:block" />

          <div className="flex flex-col gap-10">
            {timeline.map(({ year, title, desc }, i) => (
              <motion.div key={year} {...fadeUp(i * 0.07)} className="flex gap-6 sm:gap-10">
                {/* Dot + year */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-white"
                    style={{ borderColor: i === timeline.length - 1 ? ORANGE : "#e4e4e7" }}>
                    <div className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: i === timeline.length - 1 ? ORANGE : "#d4d4d8" }} />
                  </div>
                </div>
                {/* Content */}
                <div className="pb-2">
                  <span className="text-xs font-black tracking-widest uppercase" style={{ color: ORANGE }}>{year}</span>
                  <h3 className="text-lg font-bold text-zinc-900 mt-1 mb-2">{title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Foto del equipo */}
    <section className="py-20 bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp(0)}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: RED }}>El equipo</p>
            <h2 className="font-bold text-zinc-900 leading-tight mb-5" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
              Personas detrás de cada equipo.
            </h2>
            <p className="text-zinc-500 leading-relaxed mb-5">
              Somos un equipo interdisciplinario de bioingenieros, técnicos y especialistas en estética que trabajan juntos desde Entre Ríos. Cada producto que sale al mercado pasó por nuestras manos, nuestras pruebas y nuestra exigencia.
            </p>
            <p className="text-zinc-500 leading-relaxed">
              Cuando un profesional llama con una duda técnica, no habla con un call center. Habla con quien diseñó y construyó el equipo. Esa es la diferencia.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="rounded-3xl aspect-[4/3] bg-zinc-100 flex items-center justify-center border-2 border-dashed border-zinc-200">
            <p className="text-zinc-400 text-sm font-medium">Foto del equipo — próximamente</p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Proyectar Innovación */}
    <section className="py-20 md:py-28 px-4" style={{ backgroundColor: NAVY }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp(0.05)} className="rounded-3xl overflow-hidden aspect-[4/3] bg-white/5 flex items-center justify-center p-10 order-2 lg:order-1">
            <div className="text-center">
              <img src="/logo 3.png" alt="Ki Care" className="h-14 w-auto mx-auto mb-6" />
              <div className="w-px h-10 bg-white/20 mx-auto mb-6" />
              <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase mb-2">Parte de</p>
              <p className="text-white font-bold text-xl leading-snug">Grupo Proyectar<br />Innovación S.R.L.</p>
              <p className="text-white/40 text-sm mt-2">CUIT 33-71566297-9</p>
              <p className="text-white/40 text-sm">Oro Verde, Entre Ríos</p>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0)} className="order-1 lg:order-2">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: ORANGE }}>Respaldo institucional</p>
            <h2 className="font-bold text-white leading-tight mb-5" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
              Ki Care es parte de algo más grande.
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              El <strong className="text-white">Grupo Proyectar Innovación</strong> es una empresa argentina dedicada a la fabricación de equipos médicos y quirúrgicos, la investigación y el desarrollo tecnológico, y la consultoría en ingeniería aplicada.
            </p>
            <p className="text-white/60 leading-relaxed mb-4">
              Ki Care nació dentro de este grupo como la línea especializada en tecnología estética — con la infraestructura, el conocimiento técnico y el rigor de una empresa de ingeniería detrás de cada producto.
            </p>
            <p className="text-white/60 leading-relaxed">
              No somos revendedores de equipos importados. Somos quienes los desarrollan, los certifican y los respaldan desde Argentina.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Valores */}
    <section className="py-20 md:py-28 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: RED }}>Lo que nos define</p>
          <h2 className="font-bold text-zinc-900" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
            Seis compromisos que no negociamos.
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} {...fadeUp(i * 0.06)}
              className="border border-zinc-100 rounded-2xl p-6 hover:border-zinc-200 hover:shadow-lg hover:shadow-zinc-50 transition-all"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${ORANGE}15` }}>
                <Icon className="w-5 h-5" style={{ color: ORANGE }} strokeWidth={1.8} />
              </div>
              <h3 className="font-bold text-zinc-900 mb-2">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-4 bg-zinc-50">
      <motion.div {...fadeUp(0)} className="max-w-2xl mx-auto text-center">
        <h2 className="font-bold text-zinc-900 mb-4" style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}>
          ¿Querés saber más o trabajar con nosotros?
        </h2>
        <p className="text-zinc-500 mb-8 leading-relaxed">
          Estamos en Oro Verde, Entre Ríos, pero llegamos a todo el país. Escribinos y un integrante del equipo te responde.
        </p>
        <a
          href="https://wa.me/5491127571920?text=Hola%21%20Vengo%20de%20la%20secci%C3%B3n%20Nosotros%20de%20Ki%20Care%20y%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-sm shadow-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: ORANGE }}
        >
          Hablar con el equipo
        </a>
      </motion.div>
    </section>

    <Footer />
  </div>
);

export default Nosotros;
