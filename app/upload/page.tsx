"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useDatasetUpload } from "../../src/hooks/useDatasetUpload";
import { EmailReceiptModal, ReceiptType } from "../../src/components/modals/EmailReceiptModal";
import { EncryptionCinematic } from "../../src/components/ui/EncryptionCinematic";
import { motion } from "framer-motion";

export default function UploadPage() {
  const { upload } = useDatasetUpload();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [uploadMode, setUploadMode] = useState<"marketplace" | "private">("marketplace");
  const [datasetName, setDatasetName] = useState("");
  const [category, setCategory] = useState("Healthcare AI");
  const [customCategory, setCustomCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const { address } = useAccount();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const [modalState, setModalState] = useState<{ isOpen: boolean; type: ReceiptType; metadata: any }>({
    isOpen: false, type: "upload", metadata: {}
  });
  const [cinematicResult, setCinematicResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!file || !datasetName || (uploadMode === "marketplace" && !price)) return;
    
    const finalCategory = category === "Others" ? customCategory : category;
    if (!finalCategory) return; // Prevent upload if custom category is empty

    setIsUploading(true);
    
    try {
      const finalPrice = uploadMode === "private" ? Math.max(1, Math.ceil(file.size / (1024 * 1024 * 1024))) : Number(price);
      
      const result = await upload({
        file, name: datasetName, category: finalCategory, price_in_ip: finalPrice, price_token: "IP",
        description, tags: [], ai_tags: [], sample_preview: "Encrypted payload.", is_private_vault: uploadMode === "private"
      });
      
      // Removed duplicate fetch call; `useDatasetUpload` already handles saving to Supabase with the AES key.

      setCinematicResult({
        isOpen: true,
        type: uploadMode === "private" ? "private" : "upload",
        metadata: uploadMode === "private" ? { vaultUuid: result.uuid, expiryDate: new Date().toDateString() } : {
          datasetName, category: finalCategory, walletAddress: address || "0x00", vaultUuid: result.uuid, date: new Date().toDateString(), txHash: result.writeTx
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const CATEGORIES = [
    "Healthcare AI",
    "Financial AI",
    "Computer Vision",
    "LLM / NLP",
    "Synthetic Data",
    "Cybersecurity",
    "Quant Research",
    "Medical Imaging",
    "IoT & Sensors",
    "Autonomous Systems",
    "Speech & Audio",
    "Research Datasets",
    "Others"
  ];

  return (
    <div className="relative min-h-screen py-24 px-4 overflow-hidden">
      
      {/* Classified Upload Terminal Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.05)_0%,rgba(2,4,10,1)_100%)]" />
        <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-accent-red/5 blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30" />
      </div>
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4">
            Secure Dataset Upload
          </h1>
          <p className="text-white/60 text-lg">
            Encrypt, license, and store confidential datasets using CDR infrastructure.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Col: Upload Form */}
          <motion.div 
            className="flex-1 w-full flex flex-col gap-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Upload Mode Toggle */}
            <div className="flex bg-[#08131f] rounded-2xl border border-white/[0.08] p-1 mb-2">
              <button
                onClick={() => setUploadMode("marketplace")}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${uploadMode === "marketplace" ? "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 shadow-[0_0_20px_rgba(0,180,255,0.1)]" : "text-white/40 hover:text-white/80 border border-transparent"}`}
              >
                Public Marketplace
              </button>
              <button
                onClick={() => setUploadMode("private")}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${uploadMode === "private" ? "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 shadow-[0_0_20px_rgba(0,180,255,0.1)]" : "text-white/40 hover:text-white/80 border border-transparent"}`}
              >
                Private Vault
              </button>
            </div>

            {/* Dataset Name */}
            <div className="group relative flex flex-col gap-2">
              <label className="text-[11px] font-medium text-text-secondary uppercase tracking-widest pl-1">Dataset Name</label>
              <input 
                value={datasetName} 
                onChange={e => setDatasetName(e.target.value)} 
                type="text" 
                className="w-full glass-panel px-5 py-4 text-white outline-none transition-all duration-300 focus:border-accent-cyan focus:shadow-glow-cyan placeholder:text-white/20" 
                placeholder="e.g. Healthcare MRI Dataset 2026" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="group relative flex flex-col gap-2">
                <label className="text-[11px] font-medium text-text-secondary uppercase tracking-widest pl-1">Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="w-full glass-panel px-5 py-4 text-white outline-none transition-all duration-300 focus:border-accent-cyan focus:shadow-glow-cyan appearance-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-[42px] pointer-events-none opacity-50">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              {/* Price */}
              {uploadMode === "marketplace" ? (
                <div className="group relative flex flex-col gap-2">
                  <label className="text-[11px] font-medium text-text-secondary uppercase tracking-widest pl-1">Price (IP)</label>
                  <input 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    type="number" 
                    className="w-full glass-panel px-5 py-4 text-white outline-none transition-all duration-300 focus:border-accent-cyan focus:shadow-glow-cyan placeholder:text-white/20" 
                    placeholder="0.00" 
                  />
                </div>
              ) : (
                <div className="group relative flex flex-col gap-2">
                  <label className="text-[11px] font-medium text-accent-red uppercase tracking-widest pl-1 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">Storage Fee (IP / Year)</label>
                  <div className="w-full glass-panel border-accent-red/30 px-5 py-4 text-accent-red outline-none flex items-center justify-between shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    <span className="font-bold text-lg">{file ? Math.max(1, Math.ceil(file.size / (1024 * 1024 * 1024))) : 1}</span>
                    <span className="text-accent-red/50 text-xs">Auto-calculated</span>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Category Input */}
            {category === "Others" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="group relative flex flex-col gap-2"
              >
                <label className="text-[11px] font-medium text-cyan-200/80 uppercase tracking-widest pl-1">Custom Category</label>
                <input 
                  value={customCategory} 
                  onChange={e => setCustomCategory(e.target.value)} 
                  type="text" 
                  className="w-full rounded-2xl border border-white/[0.08] bg-[#08131f] px-5 py-4 text-white outline-none transition-all duration-300 focus:border-cyan-400/40 focus:shadow-[0_0_30px_rgba(0,180,255,0.15)] placeholder:text-white/20" 
                  placeholder="Type your category..." 
                />
              </motion.div>
            )}

            {/* Description */}
            <div className="group relative flex flex-col gap-2">
              <label className="text-[11px] font-medium text-text-secondary uppercase tracking-widest pl-1">Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={4} 
                className="w-full glass-panel px-5 py-4 text-white outline-none transition-all duration-300 focus:border-accent-cyan focus:shadow-glow-cyan resize-none placeholder:text-white/20 custom-scrollbar" 
                placeholder="Describe your dataset..." 
              />
            </div>
          </motion.div>

          {/* Right Col: The Upload Zone */}
          <motion.div 
            className="flex-1 w-full flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Premium Upload Area */}
            <div 
              className={`
                group relative flex h-[260px] flex-col items-center justify-center overflow-hidden rounded-[32px] border border-dashed transition-all duration-500
                ${isDragActive 
                  ? "border-accent-cyan shadow-glow-cyan bg-accent-cyan/5" 
                  : "border-white/20 bg-black/40 hover:border-accent-cyan hover:shadow-glow-cyan"}
                backdrop-blur-2xl cursor-pointer
              `}
              onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={(e) => {
                e.preventDefault(); setIsDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
              }}
            >
              <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
              
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-cyan-400 border-l-transparent animate-spin mb-4" />
                  <span className="text-cyan-300 font-semibold tracking-widest text-sm uppercase">Encrypting Payload...</span>
                </div>
              ) : (
                <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6">
                  {file ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-cyan-400/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,180,255,0.2)]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      </div>
                      <span className="text-white font-medium text-lg mb-1">{file.name}</span>
                      <span className="text-cyan-400/60 font-mono text-xs tracking-wider">{(file.size/1024/1024).toFixed(2)} MB</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-cyan-400/5 group-hover:bg-cyan-400/10 border border-cyan-400/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-[0_0_0_rgba(0,180,255,0)] group-hover:shadow-[0_0_30px_rgba(0,180,255,0.2)]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400/80"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      </div>
                      <span className="text-white font-semibold text-lg mb-2 tracking-tight">Upload Dataset</span>
                      <span className="text-white/40 text-sm leading-relaxed">
                        Supports JPEG, PNG, TXT, PDF, CSV<br/>Max file size: 1GB
                      </span>
                    </div>
                  )}
                </label>
              )}
            </div>

            {/* Format Badges */}
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {['JPEG', 'PNG', 'TXT', 'PDF', 'CSV'].map(fmt => (
                <span key={fmt} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100 backdrop-blur-sm">
                  {fmt}
                </span>
              ))}
            </div>

            {/* Action Button */}
            <button
              className={`
                mt-10 rounded-2xl px-6 py-4 text-sm font-semibold transition-all duration-300 w-full tracking-wide
                ${(!file || isUploading) 
                  ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10' 
                  : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,180,255,0.4)]'}
              `}
              disabled={!file || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? "ENCRYPTING & TRANSACTING..." : "SECURE & UPLOAD DATASET (REAL TX)"}
            </button>
          </motion.div>
        </div>
      </div>

      <EncryptionCinematic 
        isOpen={cinematicResult !== null} 
        onComplete={() => {
          setModalState(cinematicResult);
          setCinematicResult(null);
        }} 
      />

      <EmailReceiptModal 
        isOpen={modalState.isOpen} type={modalState.type} metadata={modalState.metadata}
        onClose={() => { setModalState(prev => ({ ...prev, isOpen: false })); window.location.href = "/dashboard"; }}
      />
    </div>
  );
}
