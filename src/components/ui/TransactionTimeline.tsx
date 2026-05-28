"use client";

import { cn, explorerTxUrl, formatAddress } from "../../lib/utils/format";

export interface TimelineStep {
  label: string;
  status: "pending" | "active" | "complete" | "error";
  txHash?: string;
}

export function TransactionTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="flex flex-col gap-0 w-full font-mono text-xs">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <div key={index} className="flex items-start gap-4 relative">
            {!isLast && (
              <div 
                className={cn(
                  "absolute left-2 top-4 bottom-[-16px] w-[1px]",
                  step.status === "complete" ? "bg-accent-green" : "bg-bg-border"
                )}
              />
            )}
            
            <div className="flex-none pt-1">
              <div 
                className={cn(
                  "w-4 h-4 rounded-full border-2 z-10 relative bg-bg",
                  step.status === "pending" && "border-bg-border text-bg-border",
                  step.status === "active" && "border-accent-cyan bg-accent-cyan animate-pulse",
                  step.status === "complete" && "border-accent-green bg-accent-green",
                  step.status === "error" && "border-accent-red bg-accent-red"
                )}
              />
            </div>
            
            <div className="flex-1 pb-4 pt-1 flex flex-col">
              <div 
                className={cn(
                  "font-semibold",
                  step.status === "pending" && "text-text-tertiary",
                  step.status === "active" && "text-accent-cyan",
                  step.status === "complete" && "text-accent-green",
                  step.status === "error" && "text-accent-red"
                )}
              >
                {step.label}
              </div>
              
              {step.txHash && (
                <a 
                  href={explorerTxUrl(step.txHash)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[0.65rem] text-text-secondary hover:text-accent-cyan mt-1 flex items-center gap-1 group w-fit"
                >
                  Tx: {formatAddress(step.txHash)}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="opacity-0 group-hover:opacity-100 transition-opacity" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
