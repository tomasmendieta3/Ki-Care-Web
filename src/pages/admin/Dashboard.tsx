import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut, Eye, EyeOff, Package } from "lucide-react";
import { supabase, type DbProducto } from "@/lib/supabase";
import { formatPrice } from "@/data/productos.data";

const ORANGE = "#9e1504";

const Dashboard = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<DbProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProductos = async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("orden", { ascending: true });
    if (!error && data) setProductos(data as DbProducto[]);
    setLoading(false);
  };

  useEffect(() => { fetchProductos(); }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const toggleActivo = async (id: string, current: boolean) => {
    await supabase.from("productos").update({ activo: !current }).eq("id", id);
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: !current } : p))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`¿Eliminar el producto "${id}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(id);
    await supabase.from("productos").delete().eq("id", id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/icon.png" alt="Ki Care" className="w-10 h-10 object-contain" />
            <span className="font-bold text-zinc-900">Ki Care</span>
            <span className="text-zinc-300 text-sm">·</span>
            <span className="text-zinc-500 text-sm font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:block"
            >
              Ver sitio →
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors px-3 py-2 rounded-lg hover:bg-zinc-100"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Productos</h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              {productos.length} {productos.length === 1 ? "producto" : "productos"} en total
            </p>
          </div>
          <Link
            to="/admin/productos/nuevo"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ backgroundColor: ORANGE }}
          >
            <Plus className="w-4 h-4" />
            Nuevo producto
          </Link>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#9e1504] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : productos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-100 p-16 flex flex-col items-center justify-center gap-3 text-center">
            <Package className="w-10 h-10 text-zinc-300" />
            <p className="text-zinc-500 font-medium">No hay productos todavía.</p>
            <Link
              to="/admin/productos/nuevo"
              className="text-sm font-semibold"
              style={{ color: ORANGE }}
            >
              Crear el primero →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/60">
                    <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3.5">Imagen</th>
                    <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3.5">Producto</th>
                    <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3.5 hidden sm:table-cell">Categoría</th>
                    <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3.5">Precio</th>
                    <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">Stock</th>
                    <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3.5">Estado</th>
                    <th className="text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3.5">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {productos.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50/40 transition-colors">
                      {/* Imagen */}
                      <td className="px-5 py-3.5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0A0F2C] shrink-0 flex items-center justify-center">
                          {p.imagen_url ? (
                            <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <Package className="w-4 h-4 text-white/40" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Nombre */}
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-zinc-900 leading-tight">{p.nombre}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{p.subtitulo}</p>
                      </td>

                      {/* Categoría */}
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600">
                          {p.categoria}
                        </span>
                      </td>

                      {/* Precio */}
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-zinc-900">{formatPrice(p.precio_actual)}</p>
                        {p.descuento > 0 && (
                          <p className="text-xs text-zinc-400 line-through">{formatPrice(p.precio_original)}</p>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          p.stock <= 3
                            ? "bg-red-50 text-red-600"
                            : p.stock <= 10
                            ? "bg-amber-50 text-amber-700"
                            : "bg-green-50 text-green-700"
                        }`}>
                          {p.stock} unid.
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => toggleActivo(p.id, p.activo)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                            p.activo
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                          }`}
                        >
                          {p.activo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {p.activo ? "Activo" : "Oculto"}
                        </button>
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/productos/${p.id}/editar`}
                            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
