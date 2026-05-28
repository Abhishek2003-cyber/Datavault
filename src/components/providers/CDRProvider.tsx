"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ensureWasmInit } from "../../lib/cdr/client";

interface CDRContextType {
  isReady: boolean;
  error: string | null;
}

const CDRContext = createContext<CDRContextType>({ isReady: false, error: null });

export function CDRProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureWasmInit()
      .then(() => setIsReady(true))
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  return (
    <CDRContext.Provider value={{ isReady, error }}>
      {children}
    </CDRContext.Provider>
  );
}

export const useCDR = () => useContext(CDRContext);
