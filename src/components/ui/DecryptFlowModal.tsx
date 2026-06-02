"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TimelineStep } from "./TransactionTimeline";

interface DecryptFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  partialCount: number;
  threshold: number;
  logs: string[];
  steps: TimelineStep[];
  isComplete: boolean;
  downloadUrl?: string | null;
  filename?: string;
}

export function DecryptFlowModal({
  isOpen, onClose, partialCount, threshold, logs, steps, isComplete, downloadUrl, filename
}: DecryptFlowModalProps) {
  // Generate 10 nodes for the circle
  const nodes = Array.from({ length: 10 });
  const radius = 200;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ivory-50/90 backdrop-blur-md overflow-hidden font-[DM_Mono]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Central Circular Network */}
          <div className="relative w-[600px] h-[600px] flex items-center justify-center">
            
            {/* Pulsing Core (Vault) */}
            <motion.div 
              className={`absolute z-20 w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ${
                isComplete ? "bg-copper-100 border-copper-500" : "bg-ivory-100 border-ivory-300"
              } border`}
              animate={{ scale: isComplete ? [1, 1.2, 1] : [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={isComplete ? "#C88246" : "#8A817C"} strokeWidth="1.5">
                {isComplete ? (
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" />
                ) : (
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                )}
              </svg>
              <div className={`text-[10px] tracking-widest mt-2 uppercase ${isComplete ? 'text-copper-500' : 'text-ink-500'}`}>
                {isComplete ? 'UNSEALED' : 'LOCKED'}
              </div>
            </motion.div>

            {/* Validator Nodes Orbit */}
            {nodes.map((_, i) => {
              const angle = (i / nodes.length) * Math.PI * 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isOnline = i < partialCount;

              return (
                <div key={i}>
                  {/* Node */}
                  <motion.div
                    className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full border flex items-center justify-center z-10 transition-colors duration-500 ${
                      isOnline ? 'bg-ivory-100 border-copper-500' : 'bg-ivory-50 border-ivory-300'
                    }`}
                    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-copper-500' : 'bg-transparent'}`} />
                  </motion.div>

                  {/* Signal Beams from Node to Center */}
                  {isOnline && !isComplete && (
                    <motion.div
                      className="absolute left-1/2 top-1/2 h-[1px] bg-gradient-to-r from-copper-500 to-transparent origin-left"
                      style={{
                        width: radius,
                        transform: `rotate(${angle + Math.PI}rad) translateX(-${radius}px)`
                      }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* HUD Overlay Text */}
          <div className="absolute top-10 left-10 pointer-events-none">
            <h2 className="text-xl font-bold text-ink-900 tracking-widest uppercase flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-copper-500 animate-pulse" />
              CDR Threshold Network
            </h2>
            <div className="text-[10px] text-ink-500 mt-2 tracking-widest uppercase">INITIATING SECURE HANDSHAKE...</div>
          </div>
          
          <div className="absolute top-10 right-10 text-right pointer-events-none">
            <div className="text-[10px] text-ink-300 tracking-widest uppercase mb-1">PARTIALS_COLLECTED</div>
            <div className="text-3xl text-ink-900 font-bold">{partialCount} <span className="text-lg text-ink-300">/ {threshold}</span></div>
          </div>

          {/* Terminal Output */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-ivory-50 border border-ivory-300 p-4 overflow-hidden">
            <div className="flex flex-col justify-end h-full">
              {logs.slice(-4).map((log, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-ink-500 font-[DM_Mono] leading-relaxed"
                >
                  <span className="text-copper-500 mr-2">&gt;</span> {log}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Success Shockwave & Download */}
          <AnimatePresence>
            {isComplete && (
              <motion.div 
                className="absolute inset-0 z-50 flex items-center justify-center bg-ivory-50/95 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="text-center">
                  <motion.div
                    className="text-6xl mb-6 text-copper-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                    </svg>
                  </motion.div>
                  <motion.h2 
                    className="text-4xl font-[Playfair_Display] font-black text-ink-900 tracking-tighter mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    PAYLOAD DECRYPTED
                  </motion.h2>
                  
                  {downloadUrl && (
                    <motion.a 
                      href={downloadUrl}
                      download={filename || "dataset.bin"}
                      className="inline-flex items-center gap-3 bg-copper-500 text-ivory-50 px-12 py-5 font-[DM_Mono] uppercase tracking-widest text-sm hover:bg-copper-600 transition-colors relative overflow-hidden group"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      onClick={onClose}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      DOWNLOAD RAW DATA
                    </motion.a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
