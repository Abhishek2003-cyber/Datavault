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
      {/* LAYER 1: Base Cyber Gradient Mesh */}
      <div className="absolute inset-0 bg-cyber-gradient opacity-40 mix-blend-screen" />
      
      {/* LAYER 2: Grid & Network Topology */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      {/* LAYER 3: Volumetric Glows (Holographic feel) */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(0,240,255,0.4) 0%, rgba(0,0,0,0) 70%)" }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full opacity-20 blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(0,0,0,0) 70%)" }}
        animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(0,0,0,0) 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* LAYER 4: Encrypted Data Streams (Matrix/Cyber style drops) */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.05]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`stream-${i}`}
            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-cyan to-transparent animate-data-stream"
            style={{
              left: `${10 + i * 12}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* LAYER 5: Floating Validator Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-accent-cyan shadow-glow-cyan"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: -800,
              opacity: [0, 0.8, 0],
              x: Math.random() * 100 - 50
            }}
            transition={{
              duration: Math.random() * 20 + 25,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 20,
            }}
          />
        ))}
      </div>

      {/* LAYER 6: Holographic Scan Line */}
      <div className="absolute left-0 right-0 h-[2px] bg-accent-cyan opacity-20 shadow-glow-cyan animate-scan-line pointer-events-none" />

      {/* LAYER 7: Vignette Overlay for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,4,10,0.9)_100%)] pointer-events-none mix-blend-multiply" />
    </div>
  );
}
