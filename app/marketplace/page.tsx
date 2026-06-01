"use client";

import { useEffect, useState } from "react";
import { DATASETS } from "../../src/data/datasets";
import { Dataset } from "../../src/types/dataset";
import { DatasetCard } from "../../src/components/marketplace/DatasetCard";
import { motion, AnimatePresence } from "framer-motion";

export default function MarketplacePage() {
  const [datasets, setDatasets] = useState<Dataset[]>(DATASETS);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/datasets');
        if (res.ok) {
          const data = await res.json();
          const publicDatasets = data.filter((d: Dataset) => !d.is_private_vault);
          setDatasets([...publicDatasets, ...DATASETS]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const filteredDatasets = filter === "ALL" 
    ? datasets 
    : datasets.filter(d => d.category.toUpperCase().includes(filter));

  return (
    <div className="relative min-h-screen pb-32">
      {/* Immersive Trading Floor Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-[10%] right-[5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-accent-cyan/10 rounded-full blur-[130px] mix-blend-screen" />
        <div className="absolute bottom-[10%] left-[5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-accent-violet/10 rounded-full blur-[100px] mix-blend-screen" />
        
        {/* Holographic Trading Grids */}
        <motion.div 
          className="absolute inset-0 opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBsMTAgMTBIMzBMMjAgMjBMMTAgMTB6IiBmaWxsPSIjMDBmMGZmIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] bg-repeat"
          animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="relative z-10 pt-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        {/* Floating Command Bar */}
        <motion.div 
          className="glass-panel sticky top-24 z-40 mx-auto max-w-4xl rounded-2xl p-2 mb-16 flex flex-col md:flex-row items-center gap-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="relative flex-1 w-full">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search classified datasets..." 
              className="w-full bg-transparent border-none outline-none text-white font-mono pl-12 pr-4 py-3 placeholder:text-white/30"
            />
          </div>
          <div className="h-8 w-px bg-white/10 hidden md:block" />
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar pb-1 md:pb-0 px-2">
            {["ALL", "HEALTHCARE", "FINANCE", "AI"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs font-mono rounded-lg whitespace-nowrap transition-all ${
                  filter === cat 
                    ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50" 
                    : "text-text-tertiary hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Bento Grid Layout */}
        {filteredDatasets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="text-6xl mb-6 opacity-50 blur-[2px]">🕳️</div>
            <h3 className="font-mono font-bold text-2xl text-accent-cyan mb-2 tracking-widest uppercase">
              Void Intersect
            </h3>
            <p className="text-text-secondary font-sans text-lg mb-8 max-w-md">
              No datasets found matching your parameters. The vault is empty.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 w-full"
            layout
          >
            <AnimatePresence>
              {filteredDatasets.map((dataset, index) => {
                return (
                  <motion.div 
                    key={dataset.id}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.05 }}
                  >
                    <DatasetCard dataset={dataset} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
