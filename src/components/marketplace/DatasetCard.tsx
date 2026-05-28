import Link from "next/link";
import { Dataset } from "../../types/dataset";
import { formatBytes } from "../../lib/utils/format";

export function DatasetCard({ dataset }: { dataset: Dataset }) {
  const getCategoryGradient = (cat: string) => {
    switch (cat.toUpperCase()) {
      case 'HEALTHCARE AI':
      case 'HEALTHCARE': 
        return 'from-cyan-500/10 via-blue-500/5 to-transparent';
      case 'FINANCIAL AI':
      case 'FINANCE': 
        return 'from-emerald-500/10 via-green-500/5 to-transparent';
      case 'COMPUTER VISION': 
        return 'from-violet-500/10 via-fuchsia-500/5 to-transparent';
      case 'CYBERSECURITY': 
        return 'from-red-500/10 via-orange-500/5 to-transparent';
      case 'LLM/NLP':
      case 'AI':
      case 'LLM': 
        return 'from-indigo-500/10 via-cyan-500/5 to-transparent';
      default: 
        return 'from-cyan-500/10 via-blue-500/5 to-transparent';
    }
  };

  const gradientClass = getCategoryGradient(dataset.category);
  
  // Deterministic subtle rotation so hydration matches (between -0.6 and 0.6)
  const rotateDeg = dataset.id ? ((dataset.id.charCodeAt(0) + dataset.id.charCodeAt(dataset.id.length - 1)) % 13) * 0.1 - 0.6 : 0;

  return (
    <Link href={`/marketplace/${dataset.id}`} className="block h-full w-full outline-none">
      <div 
        className="group relative flex flex-col overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#071019] backdrop-blur-2xl transition-all duration-700 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-[0_40px_120px_rgba(0,180,255,0.18)] h-full"
        style={{ transform: `rotate(${rotateDeg}deg)` }}
      >
        {/* TRUE LAYERED DEPTH */}
        <div className="absolute inset-[1px] rounded-[31px] bg-gradient-to-br from-white/[0.04] via-transparent to-cyan-400/[0.03] pointer-events-none" />
        
        {/* SOFT ANIMATED PARTICLES/GLOW BEHIND CARD */}
        <div className="absolute -top-20 right-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-cyan-400/20 group-hover:scale-150" />

        {/* ANIMATED GLOW LAYER INSIDE CARD */}
        <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br ${gradientClass} pointer-events-none`} />

        {/* PREMIUM GRID OVERLAY */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:22px_22px] opacity-[0.04] pointer-events-none" />

        {/* --- 1. TOP HEADER --- */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
          {/* LEFT: Category badge */}
          <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-100 backdrop-blur-xl">
            {dataset.category}
          </span>
          
          {/* RIGHT: File type + encrypted pulse dot */}
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/[0.04] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
              {dataset.file_format}
            </span>
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
          </div>
        </div>

        {/* --- 2. PREVIEW AREA --- */}
        <div className="relative mx-5 mt-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-cyan-500/[0.05] to-blue-500/[0.02] h-[150px] flex-shrink-0 flex items-center justify-center group-hover:border-cyan-400/20 transition-colors duration-500">
          {/* HOLOGRAPHIC OVERLAY */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,180,255,0.18),transparent_60%)] opacity-60 pointer-events-none" />
          
          {/* Preview Image/Icon Animation */}
          <div className="relative z-10 w-24 h-24 rounded-full border border-white/10 bg-white/5 flex items-center justify-center backdrop-blur-md shadow-2xl transition-transform duration-700 group-hover:scale-[1.04] group-hover:border-cyan-400/30">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/80 group-hover:text-cyan-300 transition-colors duration-500">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>

        {/* --- 3. METADATA ROW --- */}
        <div className="relative z-10 px-6 mt-4 flex flex-wrap gap-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-white/65 backdrop-blur-md flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            {formatBytes(dataset.file_size_bytes)}
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-white/65 backdrop-blur-md flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            {dataset.created_at ? new Date(dataset.created_at).toLocaleDateString('en-US', {month: 'short', year: 'numeric'}) : 'Unknown'}
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-white/65 backdrop-blur-md flex items-center gap-1.5 font-mono">
            AES-256
          </div>
        </div>

        {/* --- 4. DESCRIPTION (Title & Desc) --- */}
        <div className="relative z-10 px-6 mt-4 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold tracking-tight leading-tight text-white group-hover:text-cyan-300 transition-colors duration-300">
            {dataset.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/62 line-clamp-2">
            {dataset.description}
          </p>
        </div>
        
        {/* --- 5. FOOTER ACTION AREA --- */}
        <div className="relative z-10 mt-4 mb-5 px-6">
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-white/40 text-xs uppercase tracking-[0.2em] hidden sm:inline-block">
                Access
              </span>
              <span className="text-2xl font-bold tracking-tight text-cyan-300">
                {dataset.price_in_ip}
              </span>
              <span className="text-cyan-100/60 text-sm font-medium">
                IP
              </span>
            </div>
            
            <div className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(0,180,255,0.45)] whitespace-nowrap">
              Buy Access
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
