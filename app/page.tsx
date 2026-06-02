"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen pt-28 pb-10">
      
      {/* Cinematic Content Layer */}
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Left Column: Copy */}
        <div className="flex-1">
          {/* Status Pill */}
          <motion.div 
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-ivory-300 bg-ivory-50 text-ink-500 text-[10px] uppercase font-[DM_Mono] tracking-widest mb-8 shadow-sm"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-copper-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-copper-500"></span>
            </span>
            CDR ONLINE
          </motion.div>

          {/* Hero Heading */}
          <h1 className="font-[Playfair_Display] font-black tracking-tight leading-none text-ink-900 text-6xl lg:text-[58px] mb-6">
            The Data <em className="italic text-copper-500 not-italic">Vault</em>
          </h1>

          <motion.p 
            className="text-lg font-[Jost] font-light text-ink-500 leading-relaxed max-w-xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            The billion-dollar infrastructure for Confidential AI Datasets. 
            Powered by Story Protocol & encrypted via validator networks.
          </motion.p>

          {/* Futuristic Button Group */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <Link href="/marketplace">
              <button className="bg-copper-500 hover:bg-copper-600 text-ivory-50 font-[DM_Mono] uppercase tracking-wider transition-colors w-56 h-12 text-sm flex items-center justify-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                ENTER MARKET
              </button>
            </Link>

            <Link href="/upload">
              <button className="border border-ivory-300 text-ink-300 hover:border-copper-500 hover:text-copper-500 font-[DM_Mono] uppercase transition-colors w-56 h-12 text-sm flex items-center justify-center gap-3 bg-transparent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                SECURE UPLOAD
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Stats + Vault Log */}
        <div className="flex-1 w-full lg:w-auto">
          <motion.div 
            className="bg-ivory-50 border border-ivory-300 p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {/* Stats panel */}
            <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-ivory-300">
              <div>
                <div className="font-[Playfair_Display] text-3xl font-bold text-ink-900 mb-1">$4.2M</div>
                <div className="font-[DM_Mono] text-[9px] uppercase text-ink-200 tracking-wider">Volume Secured</div>
              </div>
              <div>
                <div className="font-[Playfair_Display] text-3xl font-bold text-ink-900 mb-1">12K+</div>
                <div className="font-[DM_Mono] text-[9px] uppercase text-ink-200 tracking-wider">Active Vaults</div>
              </div>
              <div>
                <div className="font-[Playfair_Display] text-3xl font-bold text-ink-900 mb-1">99.9%</div>
                <div className="font-[DM_Mono] text-[9px] uppercase text-ink-200 tracking-wider">Uptime</div>
              </div>
            </div>

            {/* Vault Log Box */}
            <div className="bg-ivory-50 border-l-2 border-copper-300 p-4 font-[DM_Mono] text-[10px] leading-loose">
              <div><span className="text-copper-400">status:</span> <span className="text-copper-500 font-medium">encrypted ✓</span></div>
              <div><span className="text-copper-400">target:</span> <span className="text-ink-500">model_weights_v4.pt</span></div>
              <div><span className="text-copper-400">shards:</span> <span className="text-ink-500">10 / 10 available</span></div>
              <div><span className="text-copper-400">process:</span> <span className="text-ink-500">AES-256-GCM + CDR</span></div>
              <div className="mt-2 text-ink-100 italic">"never leaves device"</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
