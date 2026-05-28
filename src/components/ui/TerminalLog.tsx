"use client";

import { useEffect, useRef } from "react";

interface TerminalLogProps {
  logs: string[];
}

export function TerminalLog({ logs }: TerminalLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full bg-[#050608] border border-accent-cyan/20 rounded-md p-4 shadow-inner">
      <div
        ref={scrollRef}
        className="max-h-[200px] overflow-y-auto font-mono text-xs text-text-mono flex flex-col gap-1.5"
      >
        {logs.length === 0 ? (
          <div className="opacity-50 italic">Waiting for process to start...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="break-all whitespace-pre-wrap">
              {log}
            </div>
          ))
        )}
        <div className="flex items-center text-accent-cyan mt-1">
          <span className="mr-2">{">"}</span>
          <span className="cursor-blink w-2 h-4 bg-accent-cyan inline-block"></span>
        </div>
      </div>
    </div>
  );
}
