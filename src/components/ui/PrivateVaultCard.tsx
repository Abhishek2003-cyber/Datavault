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
    <div className={`group relative h-full flex flex-col bg-ivory-50 border transition-all duration-500 overflow-hidden p-6 ${
      isExpired 
        ? 'border-ink-300' 
        : 'border-ivory-300 hover:border-copper-500'
    }`}>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-[8px] uppercase font-[DM_Mono] tracking-widest border border-copper-300 text-copper-500 bg-ivory-50">
              PRIVATE
            </span>
            {isExpired ? (
              <span className="px-2 py-1 text-[8px] uppercase font-[DM_Mono] tracking-widest border border-ink-300 text-ink-300 bg-ivory-50">
                LOCKED
              </span>
            ) : (
              <span className="px-2 py-1 text-[8px] uppercase font-[DM_Mono] tracking-widest border border-copper-300 text-copper-500 bg-ivory-50">
                ACTIVE
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 relative z-10 mb-6">
        <h3 className={`font-[Jost] font-medium text-xl text-ink-900 mb-2 leading-tight tracking-tight transition-colors duration-300 ${
          isExpired ? 'text-ink-500' : 'group-hover:text-copper-500'
        }`}>
          {dataset.name}
        </h3>
        <p className="text-ink-500 text-sm leading-relaxed font-[Jost] line-clamp-2 mb-6">
          {dataset.description}
        </p>

        {/* Minimalist Data Row (Vertical for Private details) */}
        <div className="flex flex-col gap-3 py-4 border-y border-ivory-200">
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-ink-300 font-[DM_Mono] uppercase tracking-widest">Vault UUID</span>
            <span className="text-[10px] font-[DM_Mono] text-ink-900">{String(dataset.cdr_vault_uuid || "N/A")}</span>
          </div>
          <div className="w-full h-px bg-ivory-200" />
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-ink-300 font-[DM_Mono] uppercase tracking-widest">Size</span>
            <span className="text-[10px] font-[DM_Mono] text-ink-900">{formatBytes(dataset.file_size_bytes)}</span>
          </div>
          <div className="w-full h-px bg-ivory-200" />
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-ink-300 font-[DM_Mono] uppercase tracking-widest">CID</span>
            <span className="text-[10px] font-[DM_Mono] text-copper-500">
              {dataset.ipfs_cid ? `${dataset.ipfs_cid.slice(0,8)}...` : "N/A"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-2 flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-center px-1">
          <span className="text-[8px] text-ink-300 font-[DM_Mono] uppercase tracking-widest">Status</span>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isExpired ? 'bg-ink-300' : 'bg-copper-500 animate-pulse'}`} />
            <span className={`text-[10px] font-[DM_Mono] uppercase tracking-widest ${isExpired ? 'text-ink-500' : 'text-copper-500'}`}>
              {timeLeft || (isExpired ? "EXPIRED" : "CALCULATING")}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {!isExpired ? (
            <Link href={`/marketplace/${dataset.id}`} className="flex-1">
              <button className="w-full py-2.5 px-4 text-[10px] font-[DM_Mono] uppercase tracking-widest bg-copper-500 hover:bg-copper-600 text-ivory-50 transition-colors">
                Decrypt
              </button>
            </Link>
          ) : (
            <button className="flex-1 w-full py-2.5 px-4 text-[10px] font-[DM_Mono] uppercase tracking-widest border border-ink-300 text-ink-300 cursor-not-allowed">
              Locked
            </button>
          )}
          
          <button 
            onClick={() => onRenew(dataset.id)}
            disabled={isRenewing}
            className="flex-1 py-2.5 px-4 text-[10px] font-[DM_Mono] uppercase tracking-widest border border-copper-500 text-copper-500 hover:bg-ivory-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRenewing ? "Renewing" : `Renew (${dataset.price_in_ip || 1} IP)`}
          </button>
        </div>
      </div>
    </div>
  );
}
