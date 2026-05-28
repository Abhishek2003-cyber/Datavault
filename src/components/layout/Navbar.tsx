"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCDR } from "../providers/CDRProvider";
import { useEffect, useState } from "react";

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
      className="fixed top-0 inset-x-0 z-50 flex flex-col items-center pt-4 px-4 transition-all duration-500 pointer-events-none"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Top Status Strip */}
      <motion.div 
        className="flex items-center justify-between w-full max-w-7xl px-4 py-1 mb-2 rounded-full border border-bg-border/50 bg-bg-surface/50 backdrop-blur-md text-[10px] font-mono pointer-events-auto"
        animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? -20 : 0 }}
      >
        <div className="flex items-center gap-4">
          <span className="text-text-tertiary hidden sm:inline">DATA.VAULT_OS // V1.0.0</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-accent-green' : 'bg-accent-amber animate-pulse'} shadow-[0_0_8px_rgba(0,255,136,0.5)]`} />
          <span className="text-accent-green tracking-widest">{isReady ? 'CDR_SYS_ONLINE' : 'INIT_WASM...'}</span>
        </div>
      </motion.div>

      {/* Main Glass Navbar */}
      <motion.div 
        className={`w-full max-w-5xl rounded-2xl flex items-center justify-between px-6 transition-all duration-500 pointer-events-auto ${
          scrolled 
            ? "h-14 glass-panel border-accent-cyan/20" 
            : "h-16 bg-bg-surface/30 backdrop-blur-sm border border-bg-border"
        }`}
      >
        <Link href="/" className="flex items-center group pl-2">
          <motion.img 
            src="/logo.png" 
            alt="DataVault Logo"
            className="h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,212,255,0.4)] scale-[2] origin-left"
            whileHover={{ scale: 2.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium transition-colors hover:text-white group z-10"
              >
                <span className={`relative z-10 ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-accent-cyan/10 border border-accent-cyan/20 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                {/* Magnetic hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-accent-cyan/10 to-transparent rounded-lg -z-20 blur-md transition-opacity" />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <ConnectButton 
            accountStatus="avatar" 
            chainStatus="icon" 
            showBalance={false} 
          />
        </div>
      </motion.div>
    </motion.nav>
  );
}
