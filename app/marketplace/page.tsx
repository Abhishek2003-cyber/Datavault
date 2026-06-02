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
      <div className="relative z-10 pt-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        {/* Command Bar */}
        <motion.div 
          className="bg-ivory-50 border border-ivory-300 sticky top-24 z-40 mx-auto max-w-4xl p-2 mb-16 flex flex-col md:flex-row items-center gap-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="relative flex-1 w-full">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search datasets..." 
              className="w-full bg-transparent border-none outline-none text-ink-900 font-[Jost] pl-12 pr-4 py-3 placeholder:text-ink-300"
            />
          </div>
          <div className="h-8 w-px bg-ivory-300 hidden md:block" />
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar pb-1 md:pb-0 px-2">
            {["ALL", "HEALTHCARE", "FINANCE", "AI"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 font-[DM_Mono] text-[9px] uppercase tracking-wider whitespace-nowrap transition-all ${
                  filter === cat 
                    ? "border border-copper-500 text-copper-500 bg-ivory-50" 
                    : "border border-ivory-300 text-ink-300 bg-transparent hover:border-copper-500 hover:text-copper-500 hover:bg-ivory-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Table Rows Layout */}
        {filteredDatasets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="text-4xl mb-4 opacity-40">📂</div>
            <h3 className="font-[Jost] font-semibold text-xl text-ink-900 mb-2">
              No Datasets Found
            </h3>
            <p className="text-ink-500 font-[Jost] text-sm max-w-sm">
              We couldn't find any datasets matching your search criteria.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col w-full bg-ivory-100 border-t border-ivory-300"
            layout
          >
            {/* Table Header Row (Simulated) */}
            <div className="hidden sm:flex bg-ivory-50 font-[DM_Mono] text-[8px] uppercase tracking-widest text-ink-100 py-2 px-4 border-b border-ivory-200">
               <div className="flex-1">Dataset Information</div>
               <div className="w-32 text-right">Price</div>
            </div>

            <AnimatePresence>
              {filteredDatasets.map((dataset, index) => {
                return (
                  <motion.div 
                    key={dataset.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
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
