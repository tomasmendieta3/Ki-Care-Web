import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Save, X, Plus, Image as ImageIcon, FileDown,
} from "lucide-react";
import { supabase, type DbProducto } from "@/lib/supabase";
import { ESPECIFICACIONES_FIELDS } from "@/data/productos.data";

const ORANGE = "#9e1504";

type FormState = Omit<DbProducto, "created_at" | "updated_at" | "reviews"> & {
  reviews: DbProducto["reviews"];
  especificaciones: Record<string, string>;
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
  descripcion2: null,
  cuotas: 12,
  especificaciones_pdf_url: null,
  garantia_meses: 24,
  caracteristicas: [],
  especificaciones: {},
  imagen_principal: "",
  galeria: [],
  destacado: false,
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

/* ── Fixed-field editor for especificaciones — un input por cada item del recuadro en la web ── */
const SpecsFieldsInput = ({
  specs,
  onChange,
}: {
  specs: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
}) => {
  const setField = (campo: string, value: string) => {
    onChange({ ...specs, [campo]: value });
  };

  return (
    <div>
      <label className={labelClass}>Especificaciones técnicas</label>
      <p className="text-xs text-zinc-400 mb-3">
        Los campos que dejes vacíos no se muestran en la ficha del producto.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ESPECIFICACIONES_FIELDS.map((campo) => (
          <div key={campo}>
            <label className="block text-xs font-medium text-zinc-500 mb-1">{campo}</label>
            <input
              type="text"
              value={specs[campo] ?? ""}
              onChange={(e) => setField(campo, e.target.value)}
              placeholder={campo}
              className={inputClass}
            />
          </div>
        ))}
      </div>
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
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(["", "", "", ""]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const pdfInputRef = useRef<HTMLInputElement>(null);

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
          descripcion2: d.descripcion2 ?? null,
          cuotas: d.cuotas ?? 12,
          especificaciones_pdf_url: d.especificaciones_pdf_url ?? null,
          garantia_meses: d.garantia_meses ?? 24,
          caracteristicas: d.caracteristicas ?? [],
          especificaciones: (d.especificaciones as Record<string, string>) ?? {},
          imagen_principal: d.imagen_principal ?? "",
          galeria: d.galeria ?? [],
          destacado: d.destacado ?? false,
          reviews: d.reviews ?? [],
          activo: d.activo ?? true,
          orden: d.orden ?? 0,
        });
        const previews = [d.imagen_principal ?? "", ...(d.galeria ?? [])];
        setImagePreviews([previews[0] || "", previews[1] || "", previews[2] || "", previews[3] || ""]);
        if (d.especificaciones_pdf_url) setPdfName("PDF cargado");
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

  const handleImageChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFiles((prev) => { const next = [...prev]; next[index] = file; return next; });
    setImagePreviews((prev) => { const next = [...prev]; next[index] = URL.createObjectURL(file); return next; });
  };

  const uploadImages = async (productId: string): Promise<{ principal: string; galeria: string[] }> => {
    setUploadingImage(true);
    const names = ["main", "gallery-1", "gallery-2", "gallery-3"];
    const urls: string[] = [];

    for (let i = 0; i < 4; i++) {
      if (imageFiles[i]) {
        const ext = imageFiles[i]!.name.split(".").pop();
        const path = `${productId}/${names[i]}.${ext}`;
        const { error } = await supabase.storage.from("product-images").upload(path, imageFiles[i]!, { upsert: true });
        if (error) throw new Error("Error al subir imagen: " + error.message);
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        urls.push(`${data.publicUrl}?v=${Date.now()}`);
      } else {
        urls.push(imagePreviews[i] || "");
      }
    }

    setUploadingImage(false);
    return { principal: urls[0], galeria: urls.slice(1).filter(Boolean) };
  };

  const uploadPdf = async (productId: string): Promise<string | null> => {
    if (!pdfFile) return form.especificaciones_pdf_url;
    const path = `${productId}/ficha-tecnica.pdf`;
    const { error } = await supabase.storage.from("product-images").upload(path, pdfFile, { upsert: true });
    if (error) throw new Error("Error al subir PDF: " + error.message);
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return `${data.publicUrl}?v=${Date.now()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const productId = form.id.trim().toLowerCase().replace(/\s+/g, "-");
      if (!productId) throw new Error("El ID (slug) es obligatorio.");

      const { principal, galeria } = await uploadImages(productId);
      const especificaciones_pdf_url = await uploadPdf(productId);

      const payload = {
        ...form,
        id: productId,
        imagen_principal: principal,
        galeria,
        especificaciones_pdf_url,
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
      const msg =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ?? "Ocurrió un error al guardar.";
      setError(msg);
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
      {/* Header fixed */}
      <header className="bg-white border-b border-zinc-100 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <img src="/logo 3.png" alt="Ki Care" className="h-7 w-auto" />
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

      <div className="h-14" />
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
                <label className={labelClass}>Descripción (párrafo 1)</label>
                <textarea
                  rows={3}
                  value={form.descripcion}
                  onChange={(e) => set("descripcion", e.target.value)}
                  placeholder="Primer párrafo de descripción..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Descripción (párrafo 2)</label>
                <textarea
                  rows={3}
                  value={form.descripcion2 ?? ""}
                  onChange={(e) => set("descripcion2", e.target.value || null)}
                  placeholder="Segundo párrafo (opcional)..."
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
              <div>
                <label className={labelClass}>Cuotas</label>
                <input
                  type="number"
                  min={1}
                  max={48}
                  value={form.cuotas || ""}
                  onChange={(e) => set("cuotas", Number(e.target.value))}
                  placeholder="12"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Garantía (meses)</label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={form.garantia_meses || ""}
                  onChange={(e) => set("garantia_meses", Number(e.target.value))}
                  placeholder="24"
                  className={inputClass}
                />
              </div>
              <div>
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

          {/* Especificaciones técnicas */}
          <Section title="Especificaciones técnicas">
            <SpecsFieldsInput
              specs={form.especificaciones ?? {}}
              onChange={(v) => set("especificaciones", v)}
            />
            <div className="mt-4">
              <label className={labelClass}>PDF de ficha técnica</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  {pdfName || "Seleccionar PDF"}
                </button>
                {form.especificaciones_pdf_url && !pdfFile && (
                  <a
                    href={form.especificaciones_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#9e1504] hover:underline"
                  >
                    Ver PDF actual
                  </a>
                )}
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setPdfFile(file);
                    setPdfName(file.name);
                  }}
                />
              </div>
              {pdfFile && (
                <p className="text-xs font-medium text-green-600 mt-2">✓ {pdfFile.name} listo para subir</p>
              )}
            </div>
          </Section>

          {/* Imágenes */}
          <Section title="Imágenes del producto (hasta 4)">
            <p className="text-xs text-zinc-400 mb-4">La primera imagen es la principal. JPG, PNG o WebP. Recomendado: 800×800 px.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div
                    className="aspect-square rounded-2xl border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden bg-zinc-50 cursor-pointer hover:border-[#9e1504] transition-colors"
                    onClick={() => fileInputRefs[i].current?.click()}
                  >
                    {imagePreviews[i] ? (
                      <img src={imagePreviews[i]} alt={`preview ${i + 1}`} className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-zinc-400">
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-[10px] font-medium">{i === 0 ? "Principal" : `Foto ${i + 1}`}</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRefs[i]}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange(i)}
                  />
                  {imageFiles[i] && (
                    <p className="text-[10px] font-medium text-green-600 truncate">
                      ✓ {imageFiles[i]!.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Estado */}
          <Section title="Estado">
            <div className="flex flex-col gap-5">
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
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form.destacado}
                    onChange={(e) => set("destacado", e.target.checked)}
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors ${form.destacado ? "bg-[#ff6e13]" : "bg-zinc-200"}`}
                  />
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${form.destacado ? "translate-x-5" : "translate-x-0"}`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{form.destacado ? "Producto destacado" : "No destacado"}</p>
                  <p className="text-xs text-zinc-400">El producto destacado se muestra en la home junto al contador de +300 profesionales.</p>
                </div>
              </label>
            </div>
          </Section>
        </form>
      </main>
    </div>
  );
};

export default ProductoForm;
