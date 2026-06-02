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
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl lg:text-5xl font-[Playfair_Display] font-black tracking-tight text-ink-900 mb-4">
            Secure Dataset Upload
          </h1>
          <p className="text-ink-500 font-[Jost] text-base max-w-lg mx-auto">
            Encrypt, license, and securely store your confidential AI datasets using CDR infrastructure.
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
            <div className="flex bg-ivory-50 border border-ivory-300 p-1 mb-2">
              <button
                onClick={() => setUploadMode("marketplace")}
                className={`flex-1 py-2.5 text-[10px] font-[DM_Mono] uppercase tracking-widest transition-all duration-300 ${uploadMode === "marketplace" ? "bg-ivory-100 text-copper-500 border border-copper-300" : "text-ink-300 hover:text-ink-900 border border-transparent"}`}
              >
                Public Marketplace
              </button>
              <button
                onClick={() => setUploadMode("private")}
                className={`flex-1 py-2.5 text-[10px] font-[DM_Mono] uppercase tracking-widest transition-all duration-300 ${uploadMode === "private" ? "bg-ivory-100 text-copper-500 border border-copper-300" : "text-ink-300 hover:text-ink-900 border border-transparent"}`}
              >
                Private Vault
              </button>
            </div>

            {/* Dataset Name */}
            <div className="group relative flex flex-col gap-2">
              <label className="text-[8px] font-[DM_Mono] text-ink-300 uppercase tracking-widest">Dataset Name</label>
              <input 
                value={datasetName} 
                onChange={e => setDatasetName(e.target.value)} 
                type="text" 
                className="w-full border-b border-ivory-300 bg-transparent px-0 py-3 text-sm text-ink-900 font-[Jost] outline-none transition-all duration-300 focus:border-copper-500 placeholder:text-ink-200" 
                placeholder="e.g. Healthcare MRI Dataset 2026" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="group relative flex flex-col gap-2">
                <label className="text-[8px] font-[DM_Mono] text-ink-300 uppercase tracking-widest">Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="w-full border-b border-ivory-300 bg-transparent px-0 py-3 text-ink-900 font-[Jost] outline-none transition-all duration-300 focus:border-copper-500 appearance-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-2 top-[32px] pointer-events-none text-ink-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              {/* Price */}
              {uploadMode === "marketplace" ? (
                <div className="group relative flex flex-col gap-2">
                  <label className="text-[8px] font-[DM_Mono] text-ink-300 uppercase tracking-widest">Price (IP)</label>
                  <input 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    type="number" 
                    className="w-full border-b border-ivory-300 bg-transparent px-0 py-3 text-ink-900 font-[Jost] outline-none transition-all duration-300 focus:border-copper-500 placeholder:text-ink-200" 
                    placeholder="0.00" 
                  />
                </div>
              ) : (
                <div className="group relative flex flex-col gap-2">
                  <label className="text-[8px] font-[DM_Mono] text-ink-900 uppercase tracking-widest">Storage Fee (IP / Year)</label>
                  <div className="w-full border-b border-ivory-300 bg-transparent px-0 py-3 text-ink-900 font-[Jost] outline-none flex items-center justify-between">
                    <span className="font-bold text-lg">{file ? Math.max(1, Math.ceil(file.size / (1024 * 1024 * 1024))) : 1}</span>
                    <span className="text-ink-300 text-xs font-[DM_Mono]">Auto-calculated</span>
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
                <label className="text-[8px] font-[DM_Mono] text-ink-300 uppercase tracking-widest">Custom Category</label>
                <input 
                  value={customCategory} 
                  onChange={e => setCustomCategory(e.target.value)} 
                  type="text" 
                  className="w-full border-b border-ivory-300 bg-transparent px-0 py-3 text-ink-900 font-[Jost] outline-none transition-all duration-300 focus:border-copper-500 placeholder:text-ink-200" 
                  placeholder="Type your category..." 
                />
              </motion.div>
            )}

            {/* Description */}
            <div className="group relative flex flex-col gap-2">
              <label className="text-[8px] font-[DM_Mono] text-ink-300 uppercase tracking-widest">Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={4} 
                className="w-full border-b border-ivory-300 bg-transparent px-0 py-3 text-sm text-ink-900 font-[Jost] outline-none transition-all duration-300 focus:border-copper-500 resize-none placeholder:text-ink-200 custom-scrollbar" 
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
            {/* Upload Area */}
            <div 
              className={`
                group relative flex h-[260px] flex-col items-center justify-center overflow-hidden border transition-all duration-500
                ${isDragActive 
                  ? "border-copper-500 bg-ivory-100" 
                  : "border-ivory-300 bg-ivory-50 hover:border-copper-500"}
                cursor-pointer
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
                  <div className="w-12 h-12 rounded-full border-2 border-t-copper-500 border-r-transparent border-b-copper-500 border-l-transparent animate-spin mb-4" />
                  <span className="text-copper-500 font-[DM_Mono] tracking-widest text-sm uppercase">Encrypting Payload...</span>
                </div>
              ) : (
                <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6">
                  {file ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-ivory-100 border border-copper-300 flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-copper-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      </div>
                      <span className="text-ink-900 font-medium text-lg font-[Jost] mb-1">{file.name}</span>
                      <span className="text-ink-500 font-[DM_Mono] text-xs tracking-wider">{(file.size/1024/1024).toFixed(2)} MB</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-ivory-100 border border-ivory-300 group-hover:border-copper-500 flex items-center justify-center mb-4 transition-all duration-500 group-hover:-translate-y-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-300 group-hover:text-copper-500 transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      </div>
                      <span className="text-ink-900 font-medium text-base font-[Jost] mb-1">Upload Dataset</span>
                      <span className="text-ink-500 font-[DM_Mono] text-xs">
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
                <span key={fmt} className="border border-ivory-300 text-ink-300 bg-ivory-50 px-2.5 py-1 text-[9px] uppercase tracking-widest font-[DM_Mono]">
                  {fmt}
                </span>
              ))}
            </div>

            {/* Action Button */}
            <button
              className={`
                mt-8 w-full bg-copper-500 hover:bg-copper-600 text-ivory-50 font-[DM_Mono] uppercase tracking-wider py-4 transition-colors
                ${(!file || isUploading) ? 'opacity-50 grayscale' : ''}
              `}
              disabled={!file || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? "ENCRYPTING..." : "SECURE & UPLOAD (REAL TX)"}
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
