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
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Cinematic Radial Glows (Holographic feel) */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.4) 0%, rgba(0,0,0,0) 70%)",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full opacity-10 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(0,255,136,0.3) 0%, rgba(0,0,0,0) 70%)",
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Subtle Binary / Hex Particles floating up */}
      <div className="absolute inset-0 opacity-[0.03]">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-accent-cyan font-mono text-xs whitespace-pre"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: -500,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 20,
            }}
          >
            {Math.random().toString(16).substr(2, 8).toUpperCase()}
          </motion.div>
        ))}
      </div>

      {/* Vignette Overlay to darken edges for cinematic focus */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,3,4,0.8)_100%)] pointer-events-none mix-blend-multiply" />
    </div>
  );
}
