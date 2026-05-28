"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function EncryptionCinematic({
  isOpen,
  onComplete,
}: {
  isOpen: boolean;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setPhase(1); // Phase 1: Screen Reaction
      
      const t1 = setTimeout(() => setPhase(2), 500); // Phase 2: Particle Swarm
      const t2 = setTimeout(() => setPhase(3), 1500); // Phase 3: Lock Assembly
      const t3 = setTimeout(() => setPhase(4), 3000); // Phase 4: Scan Lines
      const t4 = setTimeout(() => setPhase(5), 4000); // Phase 5: Final Seal
      const t5 = setTimeout(() => setPhase(6), 4800); // Phase 6: Smooth Exit
      const t6 = setTimeout(() => {
        setPhase(0);
        onComplete();
      }, 5500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        clearTimeout(t6);
      };
    } else {
      setPhase(0);
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {phase > 0 && phase < 6 && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden font-mono"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle at center, rgba(0,180,255,0.15), rgba(0,0,0,0.72))",
            backgroundColor: "rgba(0,0,0,0.6)"
          }}
        >
          {/* Phase 2: Particles Canvas overlay (simulated with CSS/divs for performance) */}
          {phase >= 2 && <ParticleSwarm phase={phase} />}

          {/* Phase 4: Holographic Scan Lines */}
          {phase >= 4 && (
            <motion.div 
              className="absolute inset-0 pointer-events-none z-10 opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
            >
              <div className="w-full h-[2px] bg-cyan-400/50 shadow-[0_0_15px_#00d4ff] absolute animate-[scan_2s_ease-in-out_infinite]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px]" />
            </motion.div>
          )}

          {/* Floating Metadata (Extra Premium Detail) */}
          {phase >= 2 && phase < 5 && (
            <FloatingMetadata />
          )}

          {/* Center Lock Assembly */}
          <div className="relative z-20 flex flex-col items-center justify-center">
            
            {/* Outer Rings */}
            <motion.div
              className="absolute w-64 h-64 border border-cyan-500/20 rounded-full border-dashed"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute w-56 h-56 border border-blue-500/30 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              style={{ borderTopColor: "transparent", borderBottomColor: "transparent" }}
            />

            {/* Rotating Text Ring */}
            <motion.div
              className="absolute w-72 h-72 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible opacity-50">
                <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                <text className="text-[6px] tracking-widest font-mono fill-cyan-400">
                  <textPath href="#circlePath" startOffset="0%">
                    AES-256 • ENCRYPTED • VAULT ACTIVE • CDR VERIFIED • AES-256 • ENCRYPTED • VAULT ACTIVE • CDR VERIFIED • 
                  </textPath>
                </text>
              </svg>
            </motion.div>

            {/* Lock Icon core */}
            <motion.div 
              className={`relative flex items-center justify-center w-32 h-32 rounded-full backdrop-blur-md transition-all duration-700 ${
                phase >= 5 ? "bg-emerald-500/20 border-emerald-400/50 shadow-[0_0_80px_rgba(16,185,129,0.4)]" : "bg-cyan-500/10 border-cyan-400/30 shadow-[0_0_50px_rgba(0,180,255,0.2)]"
              } border`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: phase >= 5 ? 1.2 : 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {phase >= 5 && (
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-emerald-400"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              )}
              
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={phase >= 5 ? "#34d399" : "#22d3ee"} strokeWidth="1.5" className="relative z-10 transition-colors duration-500">
                {phase >= 5 ? (
                  /* Closed Lock (Sealed) */
                  <>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <path d="M12 15v2" strokeWidth="2" strokeLinecap="round" />
                  </>
                ) : (
                  /* Open/Assembling Lock */
                  <>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <motion.path 
                      d="M7 11V7a5 5 0 0 1 9.9-1" 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </>
                )}
              </svg>
            </motion.div>

            {/* Text Below */}
            <div className="mt-16 flex flex-col items-center h-16">
              <AnimatePresence mode="wait">
                {phase >= 5 ? (
                  <motion.div 
                    key="sealed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-2xl font-bold tracking-[0.3em] text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">VAULT SEALED</span>
                    <span className="text-sm font-medium text-emerald-200/70 mt-2">Confidential Dataset Successfully Encrypted</span>
                  </motion.div>
                ) : phase >= 3 ? (
                  <motion.div 
                    key="assembling"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-xl font-bold tracking-[0.4em] text-cyan-300 animate-pulse">ENCRYPTING</span>
                    <span className="text-xs text-cyan-100/50 mt-2 tracking-widest uppercase">Securing AES-256 Protocol</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            
          </div>
          
          <style>{`
            @keyframes scan {
              0% { top: 0%; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Lightweight CSS Particle System for Swarm Effect
function ParticleSwarm({ phase }: { phase: number }) {
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, tx: number, ty: number, color: string, delay: number }[]>([]);

  useEffect(() => {
    // Generate ~40 particles to fly towards center
    const colors = ['#22d3ee', '#3b82f6', '#a855f7', '#34d399'];
    const p = [];
    for (let i = 0; i < 40; i++) {
      // Start from random screen edge or upload area
      const angle = Math.random() * Math.PI * 2;
      const radius = 500 + Math.random() * 300;
      p.push({
        id: i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        tx: (Math.random() - 0.5) * 50,
        ty: (Math.random() - 0.5) * 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5
      });
    }
    setParticles(p);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ 
            backgroundColor: p.color, 
            boxShadow: `0 0 10px ${p.color}`,
            filter: "blur(0.5px)"
          }}
          initial={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
          animate={{ 
            x: phase >= 5 ? 0 : p.tx, 
            y: phase >= 5 ? 0 : p.ty, 
            opacity: phase >= 5 ? 0 : [0, 1, 0.8], 
            scale: phase >= 5 ? 0 : [0, 1.5, 1] 
          }}
          transition={{ 
            duration: phase >= 5 ? 0.4 : 1.5 + Math.random(), 
            delay: phase >= 5 ? 0 : p.delay, 
            ease: phase >= 5 ? "easeIn" : "easeOut" 
          }}
        />
      ))}
    </div>
  );
}

function FloatingMetadata() {
  const strings = ["HASH VERIFIED", "NODE CONSENSUS", "CDR VALIDATED", "PRIVATE VAULT ACTIVE"];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setActive(prev => (prev + 1) % strings.length);
    }, 800);
    return () => clearInterval(int);
  }, [strings.length]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <AnimatePresence>
        <motion.div
          key={active}
          initial={{ opacity: 0, x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 + 100 }}
          animate={{ opacity: 0.6, y: Math.random() * 200 - 100 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/2 left-1/2 text-[10px] text-cyan-300 tracking-widest opacity-50"
          style={{ marginLeft: (Math.random() > 0.5 ? 1 : -1) * (150 + Math.random() * 100) }}
        >
          [{strings[active]}]
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
