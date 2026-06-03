"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCDR } from "../providers/CDRProvider";
import { useEffect, useState } from "react";
import LogoAnimated from "../ui/logo-animated";

const NAV_LINKS = [
  { name: "Dataset Marketplace", href: "/marketplace" },
  { name: "Upload", href: "/upload" },
  { name: "Dashboard", href: "/dashboard" },
];

export function Navbar() {
  const { isReady } = useCDR();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav 
      className={`fixed top-0 inset-x-0 z-50 flex flex-col items-center justify-center px-4 transition-all duration-300 ${scrolled ? "bg-ivory-100 border-b border-ivory-300 h-14" : "bg-ivory-100 border-b border-ivory-300 h-14"}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="w-full max-w-5xl flex items-center justify-between mx-auto h-full">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center group">
          <LogoAnimated />
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center h-full gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`relative flex items-center h-full text-[10px] font-[DM_Mono] uppercase tracking-widest transition-colors ${
                  isActive 
                    ? 'text-copper-500 border-b-2 border-copper-500' 
                    : 'text-ink-300 hover:text-ink-900'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* WALLET BUTTON */}
        <div className="flex items-center gap-4">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                  className="flex items-center h-full border-l border-ivory-300 pl-4"
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button onClick={openConnectModal} type="button" className="bg-transparent border border-ink-300 text-ink-900 hover:border-copper-500 font-[DM_Mono] text-[10px] uppercase tracking-wider px-4 py-2 transition-colors">
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button onClick={openChainModal} type="button" className="bg-transparent border border-red-500 text-red-500 hover:bg-red-50 font-[DM_Mono] text-[10px] uppercase tracking-wider px-4 py-2 transition-colors">
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-4 h-full">
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="flex items-center gap-1 border border-copper-300 text-copper-500 bg-transparent font-[DM_Mono] text-[9px] uppercase px-3 py-1.5 transition-colors hover:bg-ivory-50"
                        >
                          {chain.hasIcon && (
                            <div className="w-3 h-3 overflow-hidden rounded-full">
                              {chain.iconUrl && (
                                <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} className="w-3 h-3" />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </button>
                        <div className="h-8 w-px bg-ivory-300 hidden sm:block"></div>
                        <button 
                          onClick={openAccountModal} 
                          type="button"
                          className="bg-transparent border border-ink-300 text-ink-900 hover:border-copper-500 font-[DM_Mono] text-[10px] uppercase tracking-wider px-4 py-2 transition-colors"
                        >
                          {account.displayName}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </motion.nav>
  );
}
