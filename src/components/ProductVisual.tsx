const ORANGE = "#9e1504";

const visuals: Record<string, React.ReactNode> = {
  "radiance-rf": (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow-rf" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ORANGE} stopOpacity="0.15" />
          <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#glow-rf)" />
      <ellipse cx="100" cy="97" rx="18" ry="18" stroke={ORANGE} strokeWidth="1.8" />
      <ellipse cx="100" cy="97" rx="40" ry="36" stroke={ORANGE} strokeWidth="1.3" strokeOpacity="0.7" />
      <ellipse cx="100" cy="97" rx="62" ry="55" stroke={ORANGE} strokeWidth="1" strokeOpacity="0.45" />
      <ellipse cx="100" cy="97" rx="82" ry="72" stroke={ORANGE} strokeWidth="0.7" strokeOpacity="0.25" />
      <rect x="93" y="103" width="14" height="52" rx="7" fill={ORANGE} fillOpacity="0.12" stroke={ORANGE} strokeWidth="1.4" />
      <rect x="96" y="116" width="8" height="3" rx="1.5" fill={ORANGE} fillOpacity="0.5" />
      <rect x="96" y="123" width="8" height="3" rx="1.5" fill={ORANGE} fillOpacity="0.4" />
      <circle cx="100" cy="97" r="7" fill={ORANGE} fillOpacity="0.25" />
      <circle cx="100" cy="97" r="3.5" fill={ORANGE} />
    </svg>
  ),
  "ultracav-pro": (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow-uc" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={ORANGE} stopOpacity="0.12" />
          <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#glow-uc)" />
      {([0, 1, 2, 3, 4, 5, 6] as number[]).map((i) => {
        const y = 70 + i * 13;
        const op = 1 - i * 0.1;
        return (
          <path
            key={i}
            d={`M 32 ${y} Q 66 ${y - 7} 100 ${y} Q 134 ${y + 7} 168 ${y}`}
            stroke={ORANGE}
            strokeWidth="1.3"
            strokeOpacity={op}
          />
        );
      })}
      <rect x="86" y="22" width="28" height="68" rx="14" fill={ORANGE} fillOpacity="0.1" stroke={ORANGE} strokeWidth="1.5" />
      <rect x="91" y="34" width="18" height="7" rx="3.5" fill={ORANGE} fillOpacity="0.45" />
      <rect x="91" y="45" width="18" height="4" rx="2" fill={ORANGE} fillOpacity="0.3" />
      <rect x="91" y="53" width="12" height="3" rx="1.5" fill={ORANGE} fillOpacity="0.25" />
      <circle cx="100" cy="92" r="5" fill={ORANGE} fillOpacity="0.6" />
    </svg>
  ),
  "combo-facial": (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow-cf" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={ORANGE} stopOpacity="0.18" />
          <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="90" r="78" fill="url(#glow-cf)" />
      <ellipse cx="100" cy="88" rx="42" ry="52" stroke={ORANGE} strokeWidth="1.5" />
      <ellipse cx="84" cy="78" rx="7" ry="4.5" stroke={ORANGE} strokeWidth="1" />
      <ellipse cx="116" cy="78" rx="7" ry="4.5" stroke={ORANGE} strokeWidth="1" />
      <path d="M 90 100 Q 100 107 110 100" stroke={ORANGE} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="100" y1="60" x2="100" y2="50" stroke={ORANGE} strokeWidth="1" strokeOpacity="0.5" />
      <path d="M 67 68 L 50 52" stroke={ORANGE} strokeWidth="1" strokeOpacity="0.55" strokeDasharray="3 3" />
      <path d="M 133 68 L 150 52" stroke={ORANGE} strokeWidth="1" strokeOpacity="0.55" strokeDasharray="3 3" />
      <path d="M 100 140 L 100 162" stroke={ORANGE} strokeWidth="1" strokeOpacity="0.55" strokeDasharray="3 3" />
      <circle cx="100" cy="46" r="7" fill={ORANGE} fillOpacity="0.85" />
      <circle cx="47" cy="49" r="7" fill={ORANGE} fillOpacity="0.85" />
      <circle cx="153" cy="49" r="7" fill={ORANGE} fillOpacity="0.85" />
      <circle cx="100" cy="165" r="7" fill={ORANGE} fillOpacity="0.85" />
    </svg>
  ),
};

interface ProductVisualProps {
  productId: string;
  imageUrl?: string;
  size?: "card" | "modal";
}

const ProductVisual = ({ productId, imageUrl, size = "card" }: ProductVisualProps) => {
  const h = size === "modal" ? "h-64 sm:h-full" : "h-44";

  if (imageUrl) {
    return (
      <div className={`w-full ${h} overflow-hidden`}>
        <img src={imageUrl} alt={productId} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`w-full ${h} bg-[#0A0F2C] flex items-center justify-center p-8 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,#1a2040,#0A0F2C)]" />
      <div className="relative w-full max-w-[160px] aspect-square">
        {visuals[productId] ?? (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-medium">
            Sin imagen
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVisual;
