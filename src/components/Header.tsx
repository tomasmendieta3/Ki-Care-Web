"use client";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@heroui/react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const scrollLinks = [
  { label: "Resultados", href: "#resultados" },
  { label: "Acompañamiento", href: "#acompañamiento" },
  { label: "Contacto", href: "#contacto" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollLink = (href: string) => {
    setIsOpen(false);
    if (!isHome) {
      window.location.href = "/" + href;
      return;
    }
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-black/5"
          : "bg-white/60 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center ml-4">
            <img src="/logo 2.png" alt="Ki Care" className="h-12 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Productos → ruta propia */}
            <Link
              to="/productos"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === "/productos"
                  ? "text-zinc-900 bg-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              Productos
            </Link>

            {/* Scroll links → solo en home */}
            {scrollLinks.map(({ label, href }) => (
              <button
                key={label}
                onClick={() => handleScrollLink(href)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button
              size="sm"
              variant="primary"
              className="rounded-full px-5 text-sm font-medium shadow-sm"
              onPress={() => handleScrollLink("#contacto")}
            >
              Quiero asesoramiento
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-zinc-100"
            >
              <div className="py-3 flex flex-col gap-1">
                <Link
                  to="/productos"
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/productos"
                      ? "text-zinc-900 bg-zinc-100"
                      : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Productos
                </Link>
                {scrollLinks.map(({ label, href }) => (
                  <button
                    key={label}
                    onClick={() => handleScrollLink(href)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
                  >
                    {label}
                  </button>
                ))}
                <div className="pt-2 pb-1">
                  <Button
                    variant="primary"
                    fullWidth
                    className="rounded-xl text-sm font-medium"
                    onPress={() => handleScrollLink("#contacto")}
                  >
                    Quiero asesoramiento
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
