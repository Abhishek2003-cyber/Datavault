"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { formatAddress, formatBytes, formatDate } from "../../../src/lib/utils/format";
import { useAccount } from "wagmi";
import { DATASETS } from "../../../src/data/datasets";
import { DecryptFlowModal } from "../../../src/components/ui/DecryptFlowModal";
import { TimelineStep } from "../../../src/components/ui/TransactionTimeline";
import { useDatasetDecrypt } from "../../../src/hooks/useDatasetDecrypt";
import { EmailReceiptModal, ReceiptType } from "../../../src/components/modals/EmailReceiptModal";
import { motion, AnimatePresence, Variants } from "framer-motion";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DatasetDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { address } = useAccount();
  const [dataset, setDataset] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [modalState, setModalState] = useState<{ isOpen: boolean; type: ReceiptType; metadata: any }>({
    isOpen: false,
    type: "purchase",
    metadata: {}
  });

  useEffect(() => {
    async function fetchDataset() {
      let found = null;
      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
          const res = await fetch(`/api/datasets/${id}`);
          if (res.ok) found = await res.json();
        }
      } catch (e) { console.warn("Supabase fetch failed", e); }

      if (!found) {
        try {
          const stored = localStorage.getItem("uploaded_datasets");
          if (stored) {
            const parsed = JSON.parse(stored);
            found = parsed.find((d: any) => d.id === id);
          }
        } catch (e) { console.error(e); }
      }

      if (!found) {
        found = DATASETS.find((d: any) => d.id === id) || null;
      }

      setDataset(found || null);
      setIsLoading(false);
    }
    fetchDataset();
  }, [id]);

  const { decryptDataset, state: decryptStateHook, resetState } = useDatasetDecrypt();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [steps, setSteps] = useState<TimelineStep[]>([
    { label: dataset?.is_private_vault ? "Verify Vault Access" : "Purchase Story License", status: "pending" },
    { label: "Request CDR Decryption", status: "pending" },
    { label: "Verify Validators & Key", status: "pending" },
    { label: "Fetch Encrypted Blob", status: "pending" },
    { label: "Decrypt Payload Locally", status: "pending" }
  ]);

  const addLog = (log: string) => setLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0, -1)}] ${log}`]);

  useEffect(() => {
    if (decryptStateHook.message) addLog(decryptStateHook.message);
    const updateStep = (index: number, status: TimelineStep["status"], txHash?: string) => {
      setSteps(prev => {
        const newSteps = [...prev];
        newSteps[index] = { ...newSteps[index], status, txHash };
        return newSteps;
      });
    };
    switch(decryptStateHook.step) {
      case "minting_license": updateStep(0, "active"); break;
      case "requesting_cdr": updateStep(0, "complete", decryptStateHook.txHash); updateStep(1, "active"); break;
      case "combining_key": updateStep(1, "complete"); updateStep(2, "active"); break;
      case "downloading_ipfs": updateStep(2, "complete"); updateStep(3, "active"); break;
      case "decrypting": updateStep(3, "complete"); updateStep(4, "active"); break;
      case "complete": updateStep(4, "complete"); break;
      case "error":
        addLog(`ERROR: ${decryptStateHook.error}`);
        setSteps(prev => prev.map(s => s.status === "active" ? { ...s, status: "pending" } : s));
        break;
    }
  }, [decryptStateHook]);

  const handlePurchaseAndDecrypt = async () => {
    setIsDecrypting(true);
    setLogs([]);
    resetState();
    setSteps(prev => prev.map(s => ({ ...s, status: "pending", txHash: undefined })));
    try {
      await decryptDataset(dataset);
    } catch (err) {
      console.error("Decryption failed", err);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-accent-cyan font-mono tracking-widest animate-pulse">Initializing Interface...</div>;
  }

  if (!dataset) {
    return <div className="min-h-screen flex items-center justify-center text-accent-red font-mono tracking-widest">DATASET_NOT_FOUND</div>;
  }

  return (
    <motion.div 
      className="relative pb-32 pt-20"
      initial="hidden" animate="show" variants={staggerContainer}
    >
      <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
        
        {/* Left Col: Details */}
        <div className="flex-1 space-y-8">
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 items-center">
            <span className="border border-copper-300 text-copper-500 bg-ivory-50 font-[DM_Mono] text-[8px] uppercase px-2 py-1">{dataset.category}</span>
            {dataset.is_verified && <span className="border border-ivory-300 text-ink-300 font-[DM_Mono] text-[8px] uppercase px-2 py-1 flex items-center gap-1"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Verified</span>}
            {dataset.cdr_vault_uuid != null && <span className="border border-ivory-300 text-ink-300 font-[DM_Mono] text-[8px] uppercase px-2 py-1 flex items-center gap-1"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Vault #{dataset.cdr_vault_uuid}</span>}
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-[Playfair_Display] font-black tracking-tight leading-none text-ink-900">
            {dataset.name}
          </motion.h1>
          
          <motion.div variants={fadeUp} className="flex items-center gap-4 text-sm text-ink-500 font-[DM_Mono] pb-8 border-b border-ivory-300">
            <div className="flex items-center gap-2">
              <span className="text-ink-900 font-semibold">{formatAddress(dataset.owner_address)}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-ivory-300" />
            <div>{formatDate(dataset.created_at)}</div>
            <div className="w-1 h-1 rounded-full bg-ivory-300" />
            <div className="flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> {dataset.download_count}</div>
          </motion.div>
          
          <motion.div variants={fadeUp} className="font-[Jost] font-light text-ink-500 leading-relaxed text-lg max-w-none">
            <p>{dataset.description}</p>
          </motion.div>
          
          <motion.div variants={fadeUp} className="relative mt-8">
            <h3 className="text-sm font-bold text-copper-500 uppercase tracking-widest mb-4 font-[DM_Mono] flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 9 18.92"></polyline><polyline points="16.5 19.79 15 18.92"></polyline><polyline points="12 12 12 22"></polyline></svg>
              Encrypted Sample
            </h3>
            <div className="bg-ivory-50 border-l-2 border-copper-300 p-4 overflow-x-auto relative group">
              <pre className="font-[DM_Mono] text-[10px] text-ink-500 whitespace-pre">
                {dataset.sample_preview}
              </pre>
            </div>
          </motion.div>
          
          <motion.div variants={fadeUp} className="mt-8">
            <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest mb-4 font-[DM_Mono]">Index Tags</h3>
            <div className="flex flex-wrap gap-2">
              {dataset.tags.map((tag: string) => (
                <span key={tag} className="border border-ivory-300 text-ink-300 font-[DM_Mono] text-[8px] uppercase px-2 py-1">#{tag}</span>
              ))}
              {dataset.ai_tags.map((tag: string) => (
                <span key={`ai-${tag}`} className="border border-copper-300 text-copper-500 bg-ivory-50 font-[DM_Mono] text-[8px] uppercase px-2 py-1 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Col: Purchase Card */}
        <motion.div variants={fadeUp} className="w-full lg:w-[400px] flex-shrink-0 relative z-20">
          <motion.div 
            className="sticky top-28 bg-ivory-50 border border-ivory-300 p-8 overflow-hidden group"
          >
            <div className="relative z-10 text-center mb-8">
              {dataset.is_private_vault ? (
                <>
                  <div className="text-4xl font-[Playfair_Display] font-bold text-ink-900 mb-2">
                    PRIVATE VAULT
                  </div>
                  <div className="text-[10px] text-ink-300 font-[DM_Mono] uppercase flex items-center justify-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    Owner Access Only
                  </div>
                </>
              ) : (
                <>
                  <div className="text-6xl font-[Playfair_Display] font-bold text-ink-900 mb-2">
                    {dataset.price_in_ip} <span className="text-2xl text-ink-500 font-[DM_Mono]">{dataset.price_token}</span>
                  </div>
                  <div className="text-[10px] text-ink-300 font-[DM_Mono] uppercase flex items-center justify-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    Perpetual License Granted
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={handlePurchaseAndDecrypt}
              className={`w-full py-4 text-sm font-[DM_Mono] tracking-widest uppercase mb-8 flex justify-center items-center gap-3 transition-colors ${
                dataset.is_private_vault 
                  ? 'border border-ivory-300 text-ink-300 hover:border-copper-500 hover:text-copper-500 bg-transparent' 
                  : 'bg-copper-500 hover:bg-copper-600 text-ivory-50'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              {dataset.is_private_vault ? "DECRYPT PRIVATE VAULT" : "PURCHASE & DECRYPT"}
            </button>
            
            <div className="space-y-4 font-[DM_Mono] text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-ivory-200">
                <span className="text-ink-300 uppercase tracking-wider">Size</span>
                <span className="text-ink-900 font-bold">{formatBytes(dataset.file_size_bytes)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-ivory-200">
                <span className="text-ink-300 uppercase tracking-wider">Records</span>
                <span className="text-ink-900 font-bold">{dataset.row_count ? dataset.row_count.toLocaleString() : 'Undisclosed'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-ivory-200">
                <span className="text-ink-300 uppercase tracking-wider">Format</span>
                <span className="text-ink-900 font-bold">{dataset.file_format}</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-ink-300 uppercase tracking-wider">IP Asset</span>
                {dataset.ip_asset_id ? (
                  <a href={`https://aeneid.storyscan.io/ip/${dataset.ip_asset_id}`} target="_blank" rel="noreferrer" className="text-copper-500 hover:text-copper-600 transition-colors flex items-center gap-1">
                    {formatAddress(dataset.ip_asset_id)} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  </a>
                ) : (
                  <span className="text-ink-300">Unregistered</span>
                )}
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-ink-300 uppercase tracking-wider">Node</span>
                {dataset.ipfs_cid ? (
                  <a href={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://gateway.lighthouse.storage/ipfs/"}${dataset.ipfs_cid}`} target="_blank" rel="noreferrer" className="text-copper-500 hover:text-copper-600 transition-colors flex items-center gap-1">
                    Lighthouse <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  </a>
                ) : (
                  <span className="text-ink-300">Offline</span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
        
      </div>

      <DecryptFlowModal 
        isOpen={isDecrypting}
        onClose={() => {
          setIsDecrypting(false);
          if (decryptStateHook.step === "complete") {
            setModalState({
              isOpen: true,
              type: "purchase",
              metadata: {
                datasetName: dataset.name,
                walletAddress: address || "0x00",
                licenseTokenId: dataset.license_terms_id || "1",
                txHash: decryptStateHook.txHash || "0x..."
              }
            });
          }
        }}
        partialCount={decryptStateHook.partialCount}
        threshold={10} 
        logs={logs}
        steps={steps}
        isComplete={decryptStateHook.step === "complete"}
        downloadUrl={null} 
        filename={`${dataset.name.replace(/\s+/g, '_').toLowerCase()}.${dataset.file_format?.toLowerCase() || 'bin'}`}
      />

      <EmailReceiptModal 
        isOpen={modalState.isOpen}
        type={modalState.type}
        metadata={modalState.metadata}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
      />
    </motion.div>
  );
}
