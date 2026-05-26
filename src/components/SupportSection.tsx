import { Card, CardContent } from "@heroui/react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  BookOpen,
  Wrench,
  Package,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { fadeInUp, stagger } from "@/lib/motion";

const pillars = [
  {
    icon: MessageSquare,
    title: "Asesoramiento previo",
    description:
      "Te ayudamos a elegir el equipo ideal según tu especialidad y objetivos de trabajo.",
  },
  {
    icon: BookOpen,
    title: "Capacitación inicial",
    description:
      "Formación completa para que uses el equipo con confianza desde el primer día.",
  },
  {
    icon: Wrench,
    title: "Soporte técnico local",
    description:
      "Técnicos en tu zona para resolver cualquier inconveniente rápidamente.",
  },
  {
    icon: Package,
    title: "Repuestos disponibles",
    description:
      "Stock permanente de repuestos y accesorios para no interrumpir tu trabajo.",
  },
  {
    icon: UserCheck,
    title: "Atención personalizada",
    description:
      "Un asesor dedicado que conoce tu caso y te acompaña en cada etapa.",
  },
  {
    icon: Sparkles,
    title: "Paquete completo",
    description:
      "Todo lo que necesitás para empezar y crecer, en un solo lugar.",
  },
];

const SupportSection = () => {
  return (
    <section id="acompañamiento" className="py-24 bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.p variants={fadeInUp} className="text-sm font-semibold text-[#9e1504] uppercase tracking-widest mb-3">
            Post-venta
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-bold tracking-tight text-zinc-900 mb-4"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
          >
            Acompañamiento integral
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-zinc-500 text-lg max-w-xl mx-auto">
            No te dejamos sola. Desde la consulta hasta el soporte post-venta, estamos con vos.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {pillars.map(({ icon: Icon, title, description }) => (
            <motion.div key={title} variants={fadeInUp}>
              <Card
                variant="default"
                className="h-full border border-zinc-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300 group cursor-default"
              >
                <CardContent className="p-7">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#9e1504] group-hover:scale-105">
                    <Icon className="w-5 h-5 text-[#9e1504] transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 mb-2">{title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SupportSection;
