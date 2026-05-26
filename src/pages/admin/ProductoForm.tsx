import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Zap, Save, X, Plus, Upload, Image as ImageIcon,
} from "lucide-react";
import { supabase, type DbProducto } from "@/lib/supabase";

const ORANGE = "#9e1504";

type FormState = Omit<DbProducto, "created_at" | "updated_at" | "reviews"> & {
  reviews: DbProducto["reviews"];
};

const emptyForm = (): FormState => ({
  id: "",
  nombre: "",
  subtitulo: "",
  categoria: "",
  precio_original: 0,
  precio_actual: 0,
  descuento: 0,
  rating: 5,
  total_opiniones: 0,
  vendidos: 0,
  stock: 0,
  envio_fecha: "",
  badges: [],
  profesionales_consultando: 0,
  descripcion: "",
  caracteristicas: [],
  imagen_url: "",
  reviews: [],
  activo: true,
  orden: 0,
});

const inputClass =
  "w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#9e1504]/30 focus:border-[#9e1504] transition-all";

const labelClass = "block text-sm font-medium text-zinc-700 mb-1.5";

/* ── Section wrapper ── */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-zinc-100 p-6">
    <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-5 pb-3 border-b border-zinc-50">
      {title}
    </h2>
    {children}
  </div>
);

/* ── Tag input for arrays ── */
const TagInput = ({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) => {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim();
    if (val && !items.includes(val)) onChange([...items, val]);
    setInput("");
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder ?? "Escribir y presionar Enter"}
          className={inputClass}
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2.5 rounded-xl border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700"
            >
              {item}
              <button type="button" onClick={() => remove(i)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════ */
const ProductoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [form, setForm] = useState<FormState>(emptyForm());
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) return;
    supabase
      .from("productos")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { navigate("/admin"); return; }
        const d = data as DbProducto;
        setForm({
          id: d.id,
          nombre: d.nombre,
          subtitulo: d.subtitulo ?? "",
          categoria: d.categoria ?? "",
          precio_original: d.precio_original,
          precio_actual: d.precio_actual,
          descuento: d.descuento ?? 0,
          rating: d.rating ?? 5,
          total_opiniones: d.total_opiniones ?? 0,
          vendidos: d.vendidos ?? 0,
          stock: d.stock ?? 0,
          envio_fecha: d.envio_fecha ?? "",
          badges: d.badges ?? [],
          profesionales_consultando: d.profesionales_consultando ?? 0,
          descripcion: d.descripcion ?? "",
          caracteristicas: d.caracteristicas ?? [],
          imagen_url: d.imagen_url ?? "",
          reviews: d.reviews ?? [],
          activo: d.activo ?? true,
          orden: d.orden ?? 0,
        });
        if (d.imagen_url) setImagePreview(d.imagen_url);
        setLoading(false);
      });
  }, [id, isEditing, navigate]);

  /* Auto-calc precio_actual when descuento or precio_original changes */
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "precio_original" || key === "descuento") {
        const orig = key === "precio_original" ? (value as number) : prev.precio_original;
        const desc = key === "descuento" ? (value as number) : prev.descuento;
        next.precio_actual = Math.round(orig * (1 - desc / 100));
      }
      return next;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (productId: string): Promise<string> => {
    if (!imageFile) return form.imagen_url;
    setUploadingImage(true);
    const ext = imageFile.name.split(".").pop();
    const path = `${productId}/main.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, imageFile, { upsert: true });
    setUploadingImage(false);
    if (error) throw new Error("Error al subir imagen: " + error.message);
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const productId = form.id.trim().toLowerCase().replace(/\s+/g, "-");
      if (!productId) throw new Error("El ID (slug) es obligatorio.");

      const imagen_url = await uploadImage(productId);

      const payload = {
        ...form,
        id: productId,
        imagen_url,
        updated_at: new Date().toISOString(),
      };

      if (isEditing) {
        const { error } = await supabase.from("productos").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("productos").insert(payload);
        if (error) throw error;
      }

      navigate("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#9e1504] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: ORANGE }}>
                <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-zinc-900 text-sm">
                {isEditing ? "Editar producto" : "Nuevo producto"}
              </span>
            </div>
          </div>
          <button
            form="producto-form"
            type="submit"
            disabled={saving || uploadingImage}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-white shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
            style={{ backgroundColor: ORANGE }}
          >
            {saving || uploadingImage ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Guardando..." : uploadingImage ? "Subiendo imagen..." : "Guardar"}
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            {error}
          </div>
        )}

        <form id="producto-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Información básica */}
          <Section title="Información básica">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  ID / Slug *
                  <span className="text-xs font-normal text-zinc-400 ml-1">(único, sin espacios)</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isEditing}
                  value={form.id}
                  onChange={(e) => set("id", e.target.value)}
                  placeholder="ej: radiance-rf"
                  className={`${inputClass} ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              </div>
              <div>
                <label className={labelClass}>Nombre *</label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                  placeholder="ej: Radiance RF"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Subtítulo</label>
                <input
                  type="text"
                  value={form.subtitulo}
                  onChange={(e) => set("subtitulo", e.target.value)}
                  placeholder="ej: Radiofrecuencia Tripolar Profesional"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Categoría</label>
                <input
                  type="text"
                  value={form.categoria}
                  onChange={(e) => set("categoria", e.target.value)}
                  placeholder="ej: Radiofrecuencia"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Descripción</label>
                <textarea
                  rows={3}
                  value={form.descripcion}
                  onChange={(e) => set("descripcion", e.target.value)}
                  placeholder="Descripción breve del equipo..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </Section>

          {/* Precio y stock */}
          <Section title="Precio y stock">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Precio original *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.precio_original || ""}
                  onChange={(e) => set("precio_original", Number(e.target.value))}
                  placeholder="485000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Descuento %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.descuento || ""}
                  onChange={(e) => set("descuento", Number(e.target.value))}
                  placeholder="15"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Precio final
                  <span className="text-xs font-normal text-zinc-400 ml-1">(auto)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.precio_actual || ""}
                  onChange={(e) => set("precio_actual", Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Stock</label>
                <input
                  type="number"
                  min={0}
                  value={form.stock || ""}
                  onChange={(e) => set("stock", Number(e.target.value))}
                  placeholder="5"
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Fecha de envío</label>
                <input
                  type="text"
                  value={form.envio_fecha}
                  onChange={(e) => set("envio_fecha", e.target.value)}
                  placeholder="ej: Mañana, 24 may"
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Orden de aparición</label>
                <input
                  type="number"
                  min={0}
                  value={form.orden || ""}
                  onChange={(e) => set("orden", Number(e.target.value))}
                  placeholder="1"
                  className={inputClass}
                />
              </div>
            </div>
          </Section>

          {/* Métricas */}
          <Section title="Métricas y visibilidad">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Rating</label>
                <input
                  type="number"
                  min={1} max={5} step={0.1}
                  value={form.rating || ""}
                  onChange={(e) => set("rating", Number(e.target.value))}
                  placeholder="4.8"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Total opiniones</label>
                <input
                  type="number"
                  min={0}
                  value={form.total_opiniones || ""}
                  onChange={(e) => set("total_opiniones", Number(e.target.value))}
                  placeholder="214"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Vendidos</label>
                <input
                  type="number"
                  min={0}
                  value={form.vendidos || ""}
                  onChange={(e) => set("vendidos", Number(e.target.value))}
                  placeholder="892"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Profesionales consultando</label>
                <input
                  type="number"
                  min={0}
                  value={form.profesionales_consultando || ""}
                  onChange={(e) => set("profesionales_consultando", Number(e.target.value))}
                  placeholder="14"
                  className={inputClass}
                />
              </div>
            </div>
          </Section>

          {/* Tags y características */}
          <Section title="Tags y características">
            <div className="flex flex-col gap-5">
              <TagInput
                label="Badges"
                items={form.badges}
                onChange={(v) => set("badges", v)}
                placeholder='ej: NUEVO · MÁS VENDIDO · 20% OFF'
              />
              <TagInput
                label="Características técnicas"
                items={form.caracteristicas}
                onChange={(v) => set("caracteristicas", v)}
                placeholder="ej: Certificación ANMAT vigente"
              />
            </div>
          </Section>

          {/* Imagen */}
          <Section title="Imagen del producto">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Preview */}
              <div
                className="w-40 h-40 rounded-2xl border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden bg-zinc-50 shrink-0 cursor-pointer hover:border-[#9e1504] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-400">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-xs font-medium">Sin imagen</span>
                  </div>
                )}
              </div>

              {/* Upload */}
              <div className="flex flex-col gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Seleccionar imagen
                </button>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  JPG, PNG o WebP. Recomendado: 800×800 px.<br />
                  Se sube automáticamente al guardar.
                </p>
                {imageFile && (
                  <p className="text-xs font-medium text-green-600">
                    ✓ {imageFile.name} listo para subir
                  </p>
                )}
              </div>
            </div>
          </Section>

          {/* Estado */}
          <Section title="Estado">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form.activo}
                  onChange={(e) => set("activo", e.target.checked)}
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${form.activo ? "bg-[#9e1504]" : "bg-zinc-200"}`}
                />
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${form.activo ? "translate-x-5" : "translate-x-0"}`}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">{form.activo ? "Visible en el sitio" : "Oculto"}</p>
                <p className="text-xs text-zinc-400">Los productos ocultos no aparecen en el catálogo público.</p>
              </div>
            </label>
          </Section>
        </form>
      </main>
    </div>
  );
};

export default ProductoForm;
