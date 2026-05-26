import { useState } from "react";
import { Card, CardContent, Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { fadeInUp, stagger } from "@/lib/motion";

const professions = [
  { value: "esteticista", label: "Esteticista" },
  { value: "cosmetologa", label: "Cosmetóloga" },
  { value: "kinesiologo", label: "Kinesiólogo/a" },
  { value: "otro", label: "Otro" },
];

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    profession: "",
    city: "",
    contact: "",
    consent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.p variants={fadeInUp} className="text-sm font-semibold text-[#9e1504] uppercase tracking-widest mb-3">
              Contacto
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="font-bold tracking-tight text-zinc-900 mb-5"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
            >
              Hablemos
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-zinc-500 text-lg leading-relaxed mb-8">
              Completá el formulario y un asesor te contacta para ayudarte a elegir
              el equipo ideal para tu consulta.
            </motion.p>

            <motion.div variants={fadeInUp} className="space-y-4">
              {[
                "Respuesta en menos de 24hs",
                "Sin compromiso de compra",
                "Asesor especializado por profesión",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#9e1504] flex-shrink-0" />
                  <span className="text-zinc-600 font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {submitted ? (
              <Card variant="default" className="border border-zinc-100">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-[#9e1504]" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">¡Consulta recibida!</h3>
                  <p className="text-zinc-500">
                    Un asesor se va a comunicar con vos en las próximas horas.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card variant="default" className="border border-zinc-100 shadow-xl shadow-zinc-100/80">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Tu nombre y apellido"
                        className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#9e1504]/30 focus:border-[#9e1504] transition-all"
                      />
                    </div>

                    {/* Profession */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Profesión *
                      </label>
                      <select
                        required
                        value={form.profession}
                        onChange={(e) => setForm({ ...form, profession: e.target.value })}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#9e1504]/30 focus:border-[#9e1504] transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Seleccioná tu profesión</option>
                        {professions.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Tu ciudad"
                        className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#9e1504]/30 focus:border-[#9e1504] transition-all"
                      />
                    </div>

                    {/* Contact */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        WhatsApp o Email *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.contact}
                        onChange={(e) => setForm({ ...form, contact: e.target.value })}
                        placeholder="Tu WhatsApp o email"
                        className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#9e1504]/30 focus:border-[#9e1504] transition-all"
                      />
                    </div>

                    {/* Consent */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5 flex-shrink-0">
                        <input
                          type="checkbox"
                          required
                          checked={form.consent}
                          onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            form.consent
                              ? "bg-[#9e1504] border-[#9e1504]"
                              : "border-zinc-300 bg-white group-hover:border-[#9e1504]/50"
                          }`}
                        >
                          {form.consent && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-zinc-500 leading-snug">
                        Acepto ser contactado por un asesor de Ki Care para recibir
                        información sobre los equipos.
                      </span>
                    </label>

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      size="lg"
                      className="rounded-xl font-semibold mt-1 shadow-lg shadow-orange-200/50"
                    >
                      Quiero que me contacten
                      <Send className="w-4 h-4 ml-1.5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
