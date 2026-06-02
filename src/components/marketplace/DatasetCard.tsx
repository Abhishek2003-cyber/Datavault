import Link from "next/link";
import { Dataset } from "../../types/dataset";

export function DatasetCard({ dataset, isFeatured = false }: { dataset: Dataset, isFeatured?: boolean }) {
  // Simulating a featured state based on price or explicitly passed prop
  const featured = isFeatured || (dataset.price_in_ip && Number(dataset.price_in_ip) > 500);

  // Parse file size for display
  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(0) + " MB";
    return (bytes / 1024).toFixed(0) + " KB";
  };

  return (
    <Link href={`/marketplace/${dataset.id}`} className="block w-full outline-none group">
      <div className={`hidden sm:grid grid-cols-[300px_150px_100px_150px_100px_auto] gap-4 items-center border-b border-ivory-300 transition-colors py-5 px-6 ${featured ? 'bg-ivory-50/50 hover:bg-ivory-50' : 'bg-transparent hover:bg-ivory-50/50'}`}>
        
        {/* Col 1: Dataset Info */}
        <div className="flex items-center gap-4 pl-4">
          {/* Icon Cell */}
          <div className="w-[32px] h-[32px] flex items-center justify-center border border-ink-200 bg-transparent rounded-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-500">
              {dataset.category.toUpperCase().includes('HEALTH') ? (
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              ) : dataset.category.toUpperCase().includes('FINANC') ? (
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              ) : (
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              )}
            </svg>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="font-[Jost] font-medium text-[13px] text-ink-900 truncate pr-4">
              {dataset.name}
            </h3>
            <div className="font-[DM_Mono] text-[9px] text-ink-300 uppercase tracking-widest truncate">
              {dataset.category} - {dataset.file_format}
            </div>
          </div>
        </div>

        {/* Col 2: CID */}
        <div className="text-center">
          <span className="font-[DM_Mono] text-[10px] text-ink-300">
            {dataset.ipfs_cid ? `${dataset.ipfs_cid.slice(0, 5)}...${dataset.ipfs_cid.slice(-4)}` : "pending"}
          </span>
        </div>

        {/* Col 3: Size */}
        <div className="text-center font-[DM_Mono] text-[9px] text-ink-400">
          {formatSize(dataset.file_size_bytes)}
        </div>

        {/* Col 4: Badges */}
        <div className="flex items-center justify-center">
          {dataset.is_private_vault ? (
            <span className="border border-ink-200 text-ink-300 bg-transparent font-[DM_Mono] text-[8px] uppercase px-2 py-0.5 tracking-widest rounded-sm">
              Private
            </span>
          ) : (
            <span className="border border-copper-300 text-copper-500 bg-transparent font-[DM_Mono] text-[8px] uppercase px-2 py-0.5 tracking-widest rounded-sm">
              Public
            </span>
          )}
        </div>
        
        {/* Col 5: Price */}
        <div className="flex items-baseline justify-center gap-1">
          <span className="font-[Playfair_Display] font-bold text-ink-900 text-[20px]">
            {dataset.price_in_ip}
          </span>
          <span className="font-[DM_Mono] text-[8px] text-ink-900 font-bold uppercase tracking-widest">
            IP
          </span>
        </div>
        
        {/* Col 6: Action */}
        <div className="flex justify-end pr-2">
          <button className="bg-transparent border border-ink-300 text-ink-900 hover:border-copper-500 font-[DM_Mono] text-[9px] uppercase tracking-widest px-4 py-2 transition-colors rounded-sm">
            PURCHASE
          </button>
        </div>

      </div>

      {/* Mobile view fallback (simple flex layout) */}
      <div className="sm:hidden flex flex-col p-4 border-b border-ivory-300 gap-4">
         <div className="flex items-center justify-between">
           <h3 className="font-[Jost] font-medium text-[14px] text-ink-900">{dataset.name}</h3>
           <span className="font-[Playfair_Display] font-bold text-ink-900 text-[18px]">{dataset.price_in_ip} <span className="text-[10px] font-[DM_Mono]">IP</span></span>
         </div>
         <button className="w-full bg-transparent border border-ink-300 text-ink-900 font-[DM_Mono] text-[10px] uppercase tracking-widest py-2 rounded-sm">
            PURCHASE
         </button>
      </div>
    </Link>
  );
}
