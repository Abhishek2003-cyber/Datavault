"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-bg">
      
      {/* LAYER 1: Solid Base with subtle grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]" />
      
      {/* LAYER 2: Slow Moving Aurora / Volumetric Lighting */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen animate-aurora-flow bg-[length:200%_200%] bg-aurora-gradient" />
      
      {/* LAYER 3: Large Soft Volumetric Orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(0,0,0,0) 70%)" }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full opacity-20 blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(122,92,255,0.15) 0%, rgba(0,0,0,0) 70%)" }}
        animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* LAYER 4: Floating Encrypted Fragments (Slow, subtle) */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`fragment-${i}`}
            className="absolute rounded-lg border border-white/5 bg-white/[0.01] backdrop-blur-sm"
            style={{
              width: Math.random() * 40 + 20 + "px",
              height: Math.random() * 40 + 20 + "px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 45}deg)`,
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: -500,
              opacity: [0, 0.4, 0],
              x: Math.random() * 100 - 50,
              rotate: Math.random() * 180,
            }}
            transition={{
              duration: Math.random() * 30 + 40,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 20,
            }}
          />
        ))}
      </div>

      {/* LAYER 5: Gentle Vignette for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,18,31,0.85)_100%)] pointer-events-none mix-blend-multiply" />
    </div>
  );
}
