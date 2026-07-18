import { useLocation, useNavigate, Link } from "react-router-dom";
import { scrollToSection } from "@/lib/scroll";

const sectionLinks = [
  { label: "Acompañamiento", id: "acompañamiento" },
  { label: "Contacto", id: "contacto" },
];

const Footer = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === "/";

  const handleScroll = (id: string) => {
    if (isHome) {
      scrollToSection(id);
    } else {
      navigate("/");
      setTimeout(() => scrollToSection(id), 400);
    }
  };

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
              Tecnología estética profesional para médicos, esteticistas, cosmetólogas y kinesiólogos.
            </p>
            <Link
              to="/admin/login"
              className="inline-block mt-4 text-xs font-medium text-zinc-600 hover:text-white transition-colors"
            >
              Acceso
            </Link>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/productos" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  Nosotros
                </Link>
              </li>
              {sectionLinks.map(({ label, id }) => (
                <li key={id}>
                  <button
                    onClick={() => handleScroll(id)}
                    className="text-sm text-zinc-500 hover:text-white transition-colors text-left"
                  >
                    {label}
                  </button>
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
            <p className="text-sm text-zinc-600 leading-relaxed mb-4">
              Equipos de uso profesional exclusivamente. Certificación ANMAT vigente.
            </p>

            {/* Box AFIP */}
            <a
              href="https://www.cuitonline.com/detalle/33715662979/grupo-proyectar-innovacion-s.r.l.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-colors"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Empresa verificada en AFIP</p>
              <p className="text-xs font-semibold text-zinc-300 mb-1">Grupo Proyectar Innovación S.R.L.</p>
              <p className="text-[11px] text-zinc-600">CUIT 33-71566297-9</p>
              <p className="text-[11px] text-zinc-600">Los Canarios 213, Oro Verde, Entre Ríos</p>
              <p className="text-[11px] text-zinc-600 mt-1">Fabricación de equipos médicos · IVA Inscripto</p>
            </a>
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
