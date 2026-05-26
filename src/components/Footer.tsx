const footerLinks = ["Productos", "Resultados", "Acompañamiento", "Contacto"];

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="mb-4 -ml-3 flex items-center gap-4">
              <img src="/logo 1.png" alt="Ki Care" className="h-10 w-auto" />
              <img src="/anmat 2.png" alt="ANMAT" className="h-10 w-auto" />
            </div>
            <p className="text-sm leading-relaxed text-zinc-500 max-w-xs">
              Tecnología estética profesional para esteticistas, cosmetólogas y
              kinesiólogos en Argentina.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Información
            </h4>
            <p className="text-sm text-zinc-500 mb-2">Argentina</p>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Equipos de uso profesional exclusivamente. Certificación ANMAT vigente.
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Ki Care. Todos los derechos reservados.
          </p>
          <p className="text-xs text-zinc-700">
            Equipamiento de uso profesional.
          </p>
        </div>
        <div className="mt-6 text-center">
          <p className="text-[10px] text-zinc-700">
            Desarrollado por{" "}
            <a href="https://trivar.com.ar" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-500 transition-colors">
              Trivar®
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
