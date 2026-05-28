"use client";

import { cn } from "../../lib/utils/format";

interface ValidatorGridProps {
  partialCount: number;
  threshold: number;
  totalValidators?: number;
}

export function ValidatorGrid({ partialCount, threshold, totalValidators = 10 }: ValidatorGridProps) {
  const nodes = Array.from({ length: totalValidators }, (_, i) => i);
  const thresholdMet = partialCount >= threshold;

  return (
    <div className="flex flex-col items-center gap-4 my-4">
      <div className="grid grid-cols-5 gap-3">
        {nodes.map((index) => {
          const isReceived = index < partialCount;
          
          return (
            <div
              key={index}
              className={cn(
                "w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono text-xs transition-all duration-300",
                !isReceived && !thresholdMet && "bg-bg-elevated border-bg-border text-text-tertiary",
                isReceived && !thresholdMet && "bg-accent-cyan/10 border-accent-cyan text-accent-cyan animate-pulse",
                thresholdMet && "bg-accent-green/10 border-accent-green text-accent-green animate-pulse"
              )}
            >
              V{index + 1}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="text-text-primary text-sm font-medium">
          Collecting validator signatures: {partialCount} / {totalValidators}
        </div>
        <div className="text-text-tertiary font-mono text-xs mt-1">
          Threshold: {threshold}/{totalValidators}
        </div>
      </div>
    </div>
  );
}
