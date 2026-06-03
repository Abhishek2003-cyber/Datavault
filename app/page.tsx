"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FAQSection } from "../src/components/home/FAQSection";
import { ParticleTextEffect } from "../src/components/ui/particle-text-effect";

export default function Home() {
  return (
    <div className="relative min-h-screen pt-28 pb-10">
      
      {/* Cinematic Content Layer */}
      <motion.div 
        className="relative z-10 mx-auto flex flex-col lg:flex-row items-stretch w-full max-w-[1200px] mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Left Column: Copy */}
        <div className="flex-1 lg:border-r border-ivory-300 pr-12 lg:pr-20 py-10 lg:w-1/2">
          
          <div className="flex items-center gap-4 mb-16">
            <span className="text-[10px] text-ink-500 uppercase font-[DM_Mono] tracking-[0.2em]">Zero-Knowledge Data Exchange</span>
            <div className="h-px bg-copper-300 flex-1"></div>
          </div>

          {/* Hero Heading (Particle Effect) */}
          <div className="mb-8 w-full">
            <ParticleTextEffect />
          </div>

          <motion.p 
            className="text-[15px] font-[Jost] font-light text-ink-500 leading-relaxed max-w-md mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            AES-256-GCM encrypted on your machine. Stored on IPFS. Access governed on-chain via Story Protocol. No server ever sees your plaintext.
          </motion.p>

          {/* Futuristic Button Group */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <Link href="/upload">
              <button className="bg-transparent border border-ink-300 text-ink-900 hover:border-copper-500 font-[DM_Mono] uppercase tracking-widest transition-colors w-40 h-12 text-[10px] flex items-center justify-center rounded-sm">
                UPLOAD DATASET
              </button>
            </Link>

            <Link href="/marketplace">
              <button className="bg-transparent border border-ink-300 text-ink-900 hover:border-copper-500 font-[DM_Mono] uppercase tracking-widest transition-colors w-48 h-12 text-[10px] flex items-center justify-center rounded-sm">
                VIEW ARCHITECTURE
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Stats + Vault Log */}
        <div className="flex-1 w-full lg:w-1/2 flex flex-col">
          {/* Stats panel */}
          <div className="grid grid-cols-3 border-b border-ivory-300">
            <div className="border-r border-ivory-300 p-8 flex flex-col justify-center">
              <div className="font-[Playfair_Display] text-[40px] font-bold text-ink-900 mb-1 leading-none">148</div>
              <div className="font-[DM_Mono] text-[9px] uppercase text-ink-500 tracking-[0.2em]">Datasets</div>
            </div>
            <div className="border-r border-ivory-300 p-8 flex flex-col justify-center">
              <div className="font-[Playfair_Display] text-[40px] font-bold text-ink-900 mb-1 leading-none">2.4k</div>
              <div className="font-[DM_Mono] text-[9px] uppercase text-ink-500 tracking-[0.2em]">IP Traded</div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="font-[Playfair_Display] text-[40px] font-bold text-ink-900 mb-1 leading-none">100%</div>
              <div className="font-[DM_Mono] text-[9px] uppercase text-ink-500 tracking-[0.2em]">Encrypted</div>
            </div>
          </div>

          {/* Vault Log Box */}
          <div className="flex-1 p-8">
            <motion.div 
              className="bg-transparent border border-ivory-300 w-full h-full p-8 font-[DM_Mono] text-[10px] leading-loose flex flex-col relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <div className="text-ink-300 uppercase tracking-widest mb-6 border-b border-ivory-300 pb-2 inline-block">
                VAULT://LAST-TRANSACTION
              </div>
              
              <div className="grid grid-cols-[100px_1fr] gap-x-4">
                <span className="text-copper-500">status</span> 
                <span className="text-ink-500">encrypted ✓</span>
                
                <span className="text-copper-500">cipher</span> 
                <span className="text-ink-500">AES-256-GCM</span>
                
                <span className="text-copper-500">ipfs_cid</span> 
                <span className="text-ink-500">QmZ9x...k8Pj</span>
                
                <span className="text-copper-500">tx_hash</span> 
                <span className="text-ink-500">0x7b3e...f021</span>
                
                <span className="text-copper-500 mt-4">plaintext</span> 
                <span className="text-ink-300 mt-4">never leaves device</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <FAQSection />

    </div>
  );
}

