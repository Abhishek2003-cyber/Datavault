"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "../../lib/wagmi/config";
import { CDRProvider } from "./CDRProvider";
import React, { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({ 
            accentColor: "#00d4ff", 
            accentColorForeground: "#08090b", 
            borderRadius: "small" 
          })}
        >
          {mounted && (
            <CDRProvider>
              {children}
            </CDRProvider>
          )}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
