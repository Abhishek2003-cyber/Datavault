"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ParticleTextEffect } from "../src/components/ui/particle-text-effect";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-20 pb-10 perspective-[2000px]">
      
      {/* STEP 7 - BACKGROUND ENHANCEMENT */}
      {/* Animated dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#000000] to-[#050505] -z-20" />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zOSAzOUgwVjBoNDB2NDB6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50 -z-10 pointer-events-none" />
      
      {/* Layered depth and holographic atmosphere orbs */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none overflow-hidden">
        {/* Validator Network Base Glow */}
        <motion.div 
          className="absolute w-[70vw] h-[70vw] bg-accent-cyan/10 rounded-full blur-[150px] mix-blend-screen"
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-[60vw] h-[60vw] bg-accent-violet/10 rounded-full blur-[130px] mix-blend-screen"
          animate={{ x: [0, -60, 60, 0], y: [0, 60, -60, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Floating Data Packets */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`packet-${i}`}
            className="absolute w-2 h-2 bg-accent-cyan rounded-full shadow-glow-cyan"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0, 1.5, 1, 0],
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Floating HUD Panels Removed as requested */}

      {/* Cinematic Content Layer */}
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto flex flex-col items-center w-full"
        initial={{ opacity: 0, scale: 0.95, z: -50 }}
        animate={{ opacity: 1, scale: 1, z: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Status Pill */}
        <motion.div 
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-accent-cyan/40 bg-black/60 backdrop-blur-xl text-white text-xs font-mono mb-6 shadow-[0_0_30px_rgba(0,212,255,0.2)]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-cyan shadow-[0_0_10px_#00d4ff]"></span>
          </span>
          CDR ONLINE
        </motion.div>

        {/* STEP 8 - HERO SECTION INTEGRATION */}
        {/* Particle Typography Animation replaces static text */}
        <div className="w-full h-[300px] md:h-[400px] mb-8 relative z-20">
          <ParticleTextEffect />
        </div>

        <motion.p 
          className="text-lg sm:text-2xl text-text-secondary max-w-3xl mb-16 font-sans font-medium leading-relaxed relative z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          The billion-dollar infrastructure for <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Confidential AI Datasets</span>. <br className="hidden sm:block"/>
          Powered by Story Protocol & encrypted via validator threshold networks.
        </motion.p>

        {/* Futuristic Button Group */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-6 relative z-30 mt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <Link href="/marketplace" className="relative group">
            <div className="absolute inset-0 bg-accent-cyan rounded-xl blur-xl opacity-30 group-hover:opacity-70 transition-opacity duration-500" />
            <button className="relative w-64 h-16 text-xl tracking-widest uppercase rounded-xl flex items-center justify-center gap-3 overflow-hidden glass-panel text-white hover:border-accent-cyan hover:shadow-glow-cyan transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-cyan/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan group-hover:scale-110 transition-transform">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              ENTER MARKET
            </button>
          </Link>

          <Link href="/upload" className="relative group">
            <button className="relative w-64 h-16 text-xl font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-3 glass-panel border border-white/10 text-text-secondary hover:text-white hover:border-white/30 transition-all duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              SECURE UPLOAD
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Foreground light beams to ground the layout */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-40" />
    </div>
  );
}
