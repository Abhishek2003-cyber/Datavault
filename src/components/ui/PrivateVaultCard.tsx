import Link from "next/link";
import { Dataset } from "../../../src/types/dataset";
import { formatBytes, formatAddress } from "../../../src/lib/utils/format";
import { useState, useEffect } from "react";

export function PrivateVaultCard({ dataset, onRenew, isRenewing }: { dataset: Dataset, onRenew: (id: string) => void, isRenewing?: boolean }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const expiryDate = dataset.vault_expiry ? new Date(dataset.vault_expiry) : (() => {
    const d = dataset.created_at ? new Date(dataset.created_at) : new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d;
  })();
  
  const isExpired = new Date() > expiryDate;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = expiryDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        clearInterval(interval);
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${minutes}m left`);
    }, 1000);
    
    // Initial run so it doesn't say calculating for 1 sec
    const initialDiff = expiryDate.getTime() - new Date().getTime();
    if (initialDiff > 0) {
      const days = Math.floor(initialDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((initialDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((initialDiff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${minutes}m left`);
    } else {
      setTimeLeft("EXPIRED");
    }
    
    return () => clearInterval(interval);
  }, [expiryDate.getTime()]);

  return (
    <div className={`group relative h-full flex flex-col rounded-2xl bg-[#030508]/80 backdrop-blur-2xl border transition-all duration-500 overflow-hidden shadow-2xl p-6 ${
      isExpired 
        ? 'border-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]' 
        : 'border-white/5 hover:border-accent-amber/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]'
    }`}>
      
      {/* Premium Top Highlight Line */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent to-transparent transition-colors duration-500 ${
        isExpired ? 'via-red-500/20 group-hover:via-red-500/50' : 'via-white/20 group-hover:via-accent-amber/50'
      }`} />
      
      {/* Subtle Inner Glow */}
      <div className={`absolute inset-0 bg-gradient-to-b to-transparent pointer-events-none ${
        isExpired ? 'from-red-500/[0.02]' : 'from-white/[0.02]'
      }`} />

      {/* Animated Grid - very subtle */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xOSAxOUgwVjBoMjB2MjB6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-[0.15] z-0" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest border bg-accent-amber/10 text-accent-amber border-accent-amber/20">
              PRIVATE
            </span>
            {isExpired ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest border bg-red-500/10 text-red-500 border-red-500/20">
                LOCKED
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest border bg-green-500/10 text-green-500 border-green-500/20">
                ACTIVE
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 relative z-10 mb-6">
        <h3 className={`font-sans font-semibold text-xl text-white mb-2 leading-tight tracking-tight transition-colors duration-300 ${
          isExpired ? 'group-hover:text-red-400' : 'group-hover:text-accent-amber'
        }`}>
          {dataset.name}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed font-light line-clamp-2 mb-6">
          {dataset.description}
        </p>

        {/* Minimalist Data Row (Vertical for Private details) */}
        <div className="flex flex-col gap-3 py-4 border-y border-white/5 bg-white/[0.01] px-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-text-tertiary font-medium uppercase tracking-[0.15em]">Vault UUID</span>
            <span className="text-xs font-mono text-white/90">{String(dataset.cdr_vault_uuid || "N/A")}</span>
          </div>
          <div className="w-full h-px bg-white/5" />
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-text-tertiary font-medium uppercase tracking-[0.15em]">Size</span>
            <span className="text-xs font-mono text-white/90">{formatBytes(dataset.file_size_bytes)}</span>
          </div>
          <div className="w-full h-px bg-white/5" />
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-text-tertiary font-medium uppercase tracking-[0.15em]">CID</span>
            <span className="text-xs font-mono text-accent-cyan/80">
              {dataset.ipfs_cid ? `${dataset.ipfs_cid.slice(0,8)}...` : "N/A"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-2 flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-center px-1">
          <span className="text-[9px] font-medium text-text-tertiary uppercase tracking-[0.15em]">Status</span>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isExpired ? 'bg-red-500' : 'bg-accent-amber'}`} />
            <span className={`text-xs font-mono font-bold tracking-wider ${isExpired ? 'text-red-500' : 'text-accent-amber'}`}>
              {timeLeft || (isExpired ? "EXPIRED" : "CALCULATING")}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {!isExpired ? (
            <Link href={`/marketplace/${dataset.id}`} className="flex-1">
              <button className="w-full py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-widest bg-accent-amber hover:bg-amber-400 text-black transition-colors">
                Decrypt
              </button>
            </Link>
          ) : (
            <button className="flex-1 w-full py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed">
              Locked
            </button>
          )}
          
          <button 
            onClick={() => onRenew(dataset.id)}
            disabled={isRenewing}
            className="flex-1 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-widest border border-accent-amber/20 text-accent-amber hover:bg-accent-amber/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRenewing ? "Renewing" : `Renew (${dataset.price_in_ip || 1} IP)`}
          </button>
        </div>
      </div>
    </div>
  );
}
