import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductoForm from "./pages/admin/ProductoForm";
import AdminGuard from "./components/admin/AdminGuard";
import PedidoExitoso from "./pages/PedidoExitoso";
import Nosotros from "./pages/Nosotros";
import { CartProvider } from "./context/CartContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CartProvider>
        <Routes>
          {/* Sitio público */}
          <Route path="/" element={<Index />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/pedido/exitoso" element={<PedidoExitoso />} />
          <Route path="/nosotros" element={<Nosotros />} />

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminGuard><Dashboard /></AdminGuard>} />
          <Route path="/admin/productos/nuevo" element={<AdminGuard><ProductoForm /></AdminGuard>} />
          <Route path="/admin/productos/:id/editar" element={<AdminGuard><ProductoForm /></AdminGuard>} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
