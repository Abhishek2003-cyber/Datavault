import Link from "next/link";
import { Dataset } from "../../types/dataset";

export function DatasetCard({ dataset, isFeatured = false }: { dataset: Dataset, isFeatured?: boolean }) {
  // Simulating a featured state based on price or explicitly passed prop
  const featured = isFeatured || (dataset.price_in_ip && Number(dataset.price_in_ip) > 500);

  return (
    <Link href={`/marketplace/${dataset.id}`} className="block w-full outline-none group">
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b border-ivory-200 transition-colors py-4 px-4 gap-4 ${featured ? 'bg-ivory-50 hover:bg-ivory-50/80' : 'hover:bg-ivory-50'}`}>
        
        {/* Left Side: Info */}
        <div className="flex items-center gap-4 flex-1">
          {/* Icon Cell */}
          <div className={`w-[28px] h-[28px] flex items-center justify-center border ${featured ? 'border-copper-300 bg-ivory-50' : 'border-ivory-300 bg-ivory-100'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={featured ? 'text-copper-500' : 'text-ink-300'}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>

          <div className="flex flex-col gap-0.5">
            <h3 className="font-[Jost] font-normal text-ink-900">
              {dataset.name}
            </h3>
            <div className="font-[DM_Mono] text-[9px] text-ink-200 uppercase tracking-widest">
              {dataset.category}
            </div>
          </div>
        </div>

        {/* Center: CID / Status */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <span className="font-[DM_Mono] text-[10px] text-ink-200 truncate max-w-[120px]">
            {dataset.ipfs_cid || "ipfs://...pending"}
          </span>
        </div>

        {/* Center: Badges */}
        <div className="hidden md:flex items-center justify-center flex-1">
          {dataset.is_private_vault ? (
            <span className="border border-ivory-300 text-ink-300 font-[DM_Mono] text-[8px] uppercase px-2 py-0.5 tracking-widest">
              Private
            </span>
          ) : (
            <span className="border border-copper-300 text-copper-500 bg-ivory-50 font-[DM_Mono] text-[8px] uppercase px-2 py-0.5 tracking-widest">
              Public
            </span>
          )}
        </div>
        
        {/* Right Side: Action/Price */}
        <div className="flex items-center justify-end gap-6 w-48">
          <div className="flex items-baseline gap-1">
            <span className="font-[Playfair_Display] font-bold text-ink-900 text-lg">
              {dataset.price_in_ip}
            </span>
            <span className="font-[DM_Mono] text-[8px] text-ink-200 uppercase tracking-widest">
              IP
            </span>
          </div>
          
          <button className={`font-[DM_Mono] text-[9px] uppercase px-3 py-1.5 transition-all tracking-widest ${
            featured 
              ? 'border border-copper-500 text-copper-500 group-hover:bg-copper-500 group-hover:text-ivory-50' 
              : 'border border-ivory-300 text-ink-500 group-hover:bg-ink-900 group-hover:text-ivory-100 group-hover:border-ink-900'
          }`}>
            Buy
          </button>
        </div>

      </div>
    </Link>
  );
}
