import { Card, CardContent, CardFooter, Chip, Button } from "@heroui/react";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, Waves, ShieldCheck, Wrench, GraduationCap, Package } from "lucide-react";
import { fadeInUp, stagger } from "@/lib/motion";

const equipment = [
  {
    icon: Zap,
    name: "Radiofrecuencia Tripolar",
    badge: "Más vendido",
    specs: [
      { label: "Aplicación", value: "Facial y corporal" },
      { label: "Interfaz", value: "Pantalla táctil" },
      { label: "Alimentación", value: "220V – 50Hz" },
      { label: "Origen", value: "Industria nacional" },
    ],
    benefits: [
      "Estimula la producción de colágeno",
      "Reafirma y tensa la piel",
      "Reduce medidas corporales",
      "Resultados visibles desde la primera sesión",
    ],
  },
  {
    icon: Waves,
    name: "Ultracavitador",
    badge: "Alta demanda",
    specs: [
      { label: "Tecnología", value: "Ultrasonido focalizado" },
      { label: "Aplicación", value: "Corporal" },
      { label: "Interfaz", value: "Panel digital c/ programas" },
      { label: "Origen", value: "Industria nacional" },
    ],
    benefits: [
      "Rompe adipocitos de forma no invasiva",
      "Modela y contornea el cuerpo",
      "Sin dolor ni tiempo de recuperación",
      "Resultados progresivos y duraderos",
    ],
  },
];

const certifications = [
  { icon: ShieldCheck, label: "Certificación ANMAT" },
  { icon: Wrench, label: "Soporte local" },
  { icon: GraduationCap, label: "Capacitación incluida" },
  { icon: Package, label: "Repuestos disponibles" },
];

const EquipmentSection = () => {
  return (
    <section id="productos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.p variants={fadeInUp} className="text-sm font-semibold text-[#9e1504] uppercase tracking-widest mb-3">
            Catálogo
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-bold tracking-tight text-zinc-900 mb-4"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
          >
            Nuestros equipos
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-zinc-500 text-lg max-w-xl mx-auto">
            Tecnología certificada con soporte técnico local y capacitación incluida.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-6 mb-8"
        >
          {equipment.map(({ icon: Icon, name, badge, specs, benefits }) => (
            <motion.div key={name} variants={fadeInUp}>
              <Card
                variant="default"
                className="h-full border border-zinc-100 hover:shadow-xl hover:shadow-zinc-100 transition-all duration-300"
              >
                <CardContent className="p-8">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Icon className="w-5.5 h-5.5 text-[#9e1504]" />
                    </div>
                    <Chip variant="soft" color="accent" size="sm" className="font-medium">
                      {badge}
                    </Chip>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 mb-6">{name}</h3>

                  {/* Specs grid */}
                  <div className="grid grid-cols-2 gap-2.5 mb-6">
                    {specs.map(({ label, value }) => (
                      <div key={label} className="bg-zinc-50 rounded-xl p-3.5">
                        <p className="text-xs text-zinc-400 font-medium mb-1">{label}</p>
                        <p className="text-sm font-semibold text-zinc-800">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Benefits */}
                  <ul className="space-y-2.5">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#9e1504] flex-shrink-0" />
                        <span className="text-sm text-zinc-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="px-8 pb-8 pt-0">
                  <Button
                    variant="primary"
                    fullWidth
                    className="rounded-xl font-semibold"
                    onPress={() =>
                      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Consultar precio
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border border-orange-100 bg-orange-50/40 rounded-2xl p-5"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 justify-center">
                <Icon className="w-4.5 h-4.5 text-[#9e1504] flex-shrink-0" />
                <span className="text-sm font-medium text-zinc-700">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EquipmentSection;
