"use client";

import { useEffect, useState } from "react";

interface HexStreamProps {
  rows?: number;
  opacity?: number;
}

export function HexStream({ rows = 8, opacity = 0.05 }: HexStreamProps) {
  const [streams, setStreams] = useState<string[]>([]);

  useEffect(() => {
    const generateHex = () => {
      const chars = "0123456789ABCDEF";
      let result = "";
      for (let i = 0; i < 100; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    setStreams(Array.from({ length: rows }, () => generateHex()));

    const interval = setInterval(() => {
      setStreams(Array.from({ length: rows }, () => generateHex()));
    }, 2000);

    return () => clearInterval(interval);
  }, [rows]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {streams.map((stream, i) => (
        <div
          key={i}
          className="hex-stream absolute w-full text-center transition-all duration-1000 ease-in-out"
          style={{
            top: `${(100 / rows) * i}%`,
            opacity: opacity + (Math.random() * 0.05),
            transform: `translateX(${Math.random() * 20 - 10}px)`
          }}
        >
          {stream}
        </div>
      ))}
    </div>
  );
}
