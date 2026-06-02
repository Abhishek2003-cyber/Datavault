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
    : datasets.filter(d => d.category.toUpperCase().includes(filter) || d.tags.some(t => t.toUpperCase().includes(filter)));

  return (
    <div className="relative min-h-screen pb-32">
      <div className="relative z-10 pt-20 px-4 md:px-8 max-w-[1200px] mx-auto">
        {/* Command Bar / Filter Section */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between mb-8 pt-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <span className="w-1.5 h-1.5 rounded-full bg-copper-500"></span>
            <span className="font-[DM_Mono] text-[10px] uppercase text-ink-300 tracking-[0.2em]">
              Active Listings - {datasets.length} Datasets
            </span>
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar">
            {["ALL", "HEALTHCARE", "FINANCIAL", "NLP", "IOT"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 font-[DM_Mono] text-[10px] uppercase tracking-widest whitespace-nowrap transition-all rounded-sm border ${
                  filter === cat 
                    ? "border-ink-900 text-ink-900 bg-transparent" 
                    : "border-ink-200 text-ink-500 bg-transparent hover:border-ink-900 hover:text-ink-900"
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
            className="flex flex-col w-full"
            layout
          >
            {/* Table Header Row */}
            <div className="hidden sm:grid grid-cols-[300px_150px_100px_150px_100px_auto] gap-4 items-center font-[DM_Mono] text-[8px] uppercase tracking-[0.25em] text-ink-200 py-3 px-6 border-y border-ivory-300 mb-4 bg-ivory-50/50">
               <div className="pl-16 text-center">Dataset</div>
               <div className="text-center">CID</div>
               <div className="text-center">Size</div>
               <div className="text-center">Type</div>
               <div className="text-center">Price</div>
               <div></div>
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
