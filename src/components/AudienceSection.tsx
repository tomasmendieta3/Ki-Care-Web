import { Card, CardContent } from "@heroui/react";
import { motion } from "framer-motion";
import { Sparkles, FlaskConical, Activity } from "lucide-react";
import { fadeInUp, stagger } from "@/lib/motion";

const audiences = [
  {
    icon: Sparkles,
    title: "Esteticistas",
    description:
      "Equipos especializados para tratamientos faciales y corporales. Tecnología que potencia tus resultados y fideliza clientes.",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    icon: FlaskConical,
    title: "Cosmetólogas",
    description:
      "Tecnología complementaria para potenciar protocolos cosméticos. Equipos que trabajan en sinergia con tus tratamientos.",
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
  {
    icon: Activity,
    title: "Kinesiólogos",
    description:
      "Equipos de integración terapéutica para kinesiología estética. Expandí tus servicios con tecnología de última generación.",
    color: "text-[#9e1504]",
    bg: "bg-orange-50",
  },
];

const AudienceSection = () => {
  return (
    <section id="resultados" className="py-24 bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.p variants={fadeInUp} className="text-sm font-semibold text-[#9e1504] uppercase tracking-widest mb-3">
            Especialidades
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-bold tracking-tight text-zinc-900 mb-4"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
          >
            ¿Para quién son nuestros equipos?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-zinc-500 text-lg max-w-xl mx-auto">
            Diseñados para profesionales que buscan resultados reales con respaldo técnico.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-5"
        >
          {audiences.map(({ icon: Icon, title, description, color, bg }) => (
            <motion.div key={title} variants={fadeInUp}>
              <Card
                variant="default"
                className="h-full border border-zinc-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300 group cursor-default"
              >
                <CardContent className="p-8">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2.5">{title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AudienceSection;
