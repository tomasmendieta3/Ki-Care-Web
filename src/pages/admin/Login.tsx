import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ORANGE = "#9e1504";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <img src="/icon.png" alt="Ki Care" className="w-12 h-12 object-contain" />
          <div>
            <p className="font-bold text-zinc-900 text-lg leading-none">Ki Care</p>
            <p className="text-xs text-zinc-400 font-medium">Panel de administración</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-xl shadow-zinc-100/80 p-8">
          <h1 className="text-xl font-bold text-zinc-900 mb-1">Iniciar sesión</h1>
          <p className="text-sm text-zinc-400 mb-6">Acceso exclusivo para administradores.</p>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kicare.com"
                className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#9e1504]/30 focus:border-[#9e1504] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 text-sm rounded-xl border border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#9e1504]/30 focus:border-[#9e1504] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-60 mt-2 shadow-lg shadow-orange-200/40"
              style={{ backgroundColor: ORANGE }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Solo usuarios autorizados pueden acceder.
        </p>
      </div>
    </div>
  );
};

export default Login;
