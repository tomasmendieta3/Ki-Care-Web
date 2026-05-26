import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductoForm from "./pages/admin/ProductoForm";
import AdminGuard from "./components/admin/AdminGuard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Sitio público */}
        <Route path="/" element={<Index />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<ProductoDetalle />} />

        {/* Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminGuard><Dashboard /></AdminGuard>} />
        <Route path="/admin/productos/nuevo" element={<AdminGuard><ProductoForm /></AdminGuard>} />
        <Route path="/admin/productos/:id/editar" element={<AdminGuard><ProductoForm /></AdminGuard>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
