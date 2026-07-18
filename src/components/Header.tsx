"use client";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scrollToSection } from "@/lib/scroll";
import { Button } from "@heroui/react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link as RouterLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const scrollLinks = [
  { label: "Acompañamiento", href: "#acompañamiento" },
  { label: "Contacto", href: "#contacto" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const handleScrollLink = (href: string) => {
    setIsOpen(false);
    const id = href.replace("#", "");
    if (!isHome) {
      navigate("/");
      setTimeout(() => scrollToSection(id), 400);
      return;
    }
    scrollToSection(id);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-sm border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center ml-4"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img src="/logo 2.png" alt="Ki Care" className="h-12 w-auto" />
            </Link>

            {/* Desktop — links + cart + CTA all on the right */}
            <div className="hidden md:flex items-center gap-1">
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
              <Link
                to="/nosotros"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === "/nosotros"
                    ? "text-zinc-900 bg-zinc-100"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                Nosotros
              </Link>

              {scrollLinks.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => handleScrollLink(href)}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                >
                  {label}
                </button>
              ))}

              <RouterLink
                to="/carrito"
                className="relative p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-all mr-3"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ff6e13] text-white text-[10px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </RouterLink>

              <Button
                size="sm"
                variant="primary"
                className="rounded-full px-5 text-sm font-medium shadow-sm ml-1"
                onPress={() => window.open("https://wa.me/5491127571920?text=Hola%21%20Vengo%20de%20la%20web%20de%20Ki%20Care.%20Me%20gustar%C3%ADa%20recibir%20asesoramiento.", "_blank")}
              >
                Quiero asesoramiento
              </Button>
            </div>

            {/* Mobile — cart + hamburger */}
            <div className="flex md:hidden items-center gap-1">
              <RouterLink
                to="/carrito"
                className="relative p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ff6e13] text-white text-[10px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </RouterLink>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-all"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="md:hidden overflow-hidden border-t border-zinc-100"
              >
                <div className="py-3 flex flex-col gap-1">
                  <Link
                    to="/productos"
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/productos" ? "text-zinc-900 bg-zinc-100" : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    Productos
                  </Link>
                  <Link
                    to="/nosotros"
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/nosotros" ? "text-zinc-900 bg-zinc-100" : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    Nosotros
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
                      onPress={() => window.open("https://wa.me/5491127571920?text=Hola%21%20Vengo%20de%20la%20web%20de%20Ki%20Care.%20Me%20gustar%C3%ADa%20recibir%20asesoramiento.", "_blank")}
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
      <div className="h-16" />
    </>
  );
};

export default Header;
