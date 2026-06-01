"use client";

import { useEffect, useState } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { parseEther } from "viem";
import { Dataset } from "../../src/types/dataset";
import { DatasetCard } from "../../src/components/marketplace/DatasetCard";
import { PrivateVaultCard } from "../../src/components/ui/PrivateVaultCard";
import { HexStream } from "../../src/components/ui/HexStream";
import { EmailReceiptModal, ReceiptType } from "../../src/components/modals/EmailReceiptModal";
import Link from "next/link";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [myDatasets, setMyDatasets] = useState<Dataset[]>([]);
  const [activeTab, setActiveTab] = useState<"marketplace" | "private">("marketplace");
  const [renewingId, setRenewingId] = useState<string | null>(null);
  
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: ReceiptType; metadata: any }>({
    isOpen: false,
    type: "renewal",
    metadata: {}
  });

  useEffect(() => {
    if (!address) {
      setMyDatasets([]);
      return;
    }
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/datasets?owner=${address}`);
        if (res.ok) {
          const data = await res.json();
          setMyDatasets(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [address]);

  const handleRenew = async (id: string) => {
    try {
      const dataset = myDatasets.find(d => d.id === id);
      if (!dataset) return;
      if (!walletClient || !publicClient) {
        alert("Wallet not fully connected. Please reconnect.");
        return;
      }

      const fee = dataset.price_in_ip || "1";

      const confirmed = window.confirm(`Confirm renewal payment of ${fee} IP? \n\n(This will open your wallet to sign the transaction)`);
      if (!confirmed) return;

      setRenewingId(id);

      console.log("[RENEWAL] Preparing renewal transaction...");
      const TREASURY_ADDRESS = "0x000000000000000000000000000000000000dEaD"; // Platform treasury or burn address

      const hash = await walletClient.sendTransaction({
        to: TREASURY_ADDRESS,
        value: parseEther(fee.toString()),
      });

      console.log(`[RENEWAL] Transaction submitted: ${hash}`);
      console.log("[RENEWAL] Awaiting wallet confirmation on-chain...");

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status !== "success") {
        throw new Error("Transaction reverted by the network.");
      }

      console.log(`[RENEWAL] Renewal successful! Block Hash: ${receipt.blockHash}`);

      const res = await fetch(`/api/datasets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "renew" })
      });
      if (!res.ok) throw new Error("Failed to update database.");

      const currentExpiry = dataset.vault_expiry ? new Date(dataset.vault_expiry) : new Date();
      const baseDate = currentExpiry < new Date() ? new Date() : currentExpiry;
      baseDate.setFullYear(baseDate.getFullYear() + 1);
      const newExpiry = baseDate.toISOString();

      setMyDatasets(prev => prev.map(d => d.id === id ? { ...d, vault_expiry: newExpiry, subscription_status: 'active' as const } : d));
      
      setModalState({
        isOpen: true,
        type: "renewal",
        metadata: {
          vaultUuid: dataset.cdr_vault_uuid,
          expiryDate: new Date(newExpiry).toDateString(),
          txHash: receipt.transactionHash
        }
      });
      
    } catch (e: any) {
      console.error("[RENEWAL] Failed to renew vault:", e);
      alert(`Renewal failed: ${e.message || "Transaction rejected or insufficient balance."}`);
    } finally {
      setRenewingId(null);
    }
  };

  const marketplaceDatasets = myDatasets.filter(d => !d.is_private_vault);
  const privateVaults = myDatasets.filter(d => d.is_private_vault);

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden">
      {/* Intelligence Command Center Background */}
      <div className="absolute inset-0 pointer-events-none z-0 fixed top-0 bg-bg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,rgba(2,4,10,1)_100%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        {/* Radar sweeping effect */}
        <div className="absolute top-[50%] left-[50%] w-[150vw] h-[150vw] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(0,240,255,0)_0deg,rgba(0,240,255,0.05)_360deg)] animate-[spin_10s_linear_infinite] rounded-full pointer-events-none mix-blend-screen" />
      </div>
      
      <div className="absolute inset-0 pointer-events-none z-0">
        <HexStream opacity={0.05} rows={4} />
      </div>
      
      <div className="relative z-10 pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-accent-cyan animate-pulse shadow-glow-cyan" />
              <span className="text-accent-cyan font-mono text-sm tracking-widest uppercase">Secured Connection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Command Center</h1>
            <p className="text-text-secondary text-lg mt-2 font-mono">
              Monitor network assets, sales telemetry, and vault statuses.
            </p>
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center py-24 glass-panel rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-accent-cyan/5 to-transparent pointer-events-none" />
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-md">Awaiting Authentication</h2>
            <p className="text-text-secondary font-mono">Connect your verified wallet to access the command center.</p>
          </div>
        ) : myDatasets.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-2xl border border-dashed border-white/20 flex flex-col items-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-cyan/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-20 h-20 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan mb-6 shadow-glow-cyan border border-accent-cyan/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">No Active Assets</h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto font-mono text-sm leading-relaxed">
              No encrypted payloads detected on the network. Initialize an upload sequence to deploy your first asset.
            </p>
            <Link href="/upload" className="btn-primary flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              INITIALIZE UPLOAD
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4 border-b border-white/10 mb-8 pb-1">
              <button
                onClick={() => setActiveTab("marketplace")}
                className={`pb-3 px-4 font-mono tracking-widest text-sm uppercase border-b-2 transition-all duration-300 ${
                  activeTab === "marketplace" 
                    ? "border-accent-cyan text-accent-cyan shadow-[0_2px_10px_-2px_rgba(0,240,255,0.5)]" 
                    : "border-transparent text-text-tertiary hover:text-white"
                }`}
              >
                Marketplace Telemetry ({marketplaceDatasets.length})
              </button>
              <button
                onClick={() => setActiveTab("private")}
                className={`pb-3 px-4 font-mono tracking-widest text-sm uppercase border-b-2 transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "private" 
                    ? "border-accent-amber text-accent-amber shadow-[0_2px_10px_-2px_rgba(245,158,11,0.5)]" 
                    : "border-transparent text-text-tertiary hover:text-white"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Secure Vaults ({privateVaults.length})
              </button>
            </div>

            {activeTab === "marketplace" ? (
              marketplaceDatasets.length === 0 ? (
                <div className="text-center py-12 text-text-secondary">No public marketplace listings found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {marketplaceDatasets.map((dataset) => (
                    <DatasetCard key={dataset.id} dataset={dataset} />
                  ))}
                </div>
              )
            ) : (
              privateVaults.length === 0 ? (
                <div className="text-center py-12 text-text-secondary">No private encrypted vaults found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {privateVaults.map((dataset) => (
                    <PrivateVaultCard key={dataset.id} dataset={dataset} onRenew={handleRenew} isRenewing={renewingId === dataset.id} />
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>

      <EmailReceiptModal 
        isOpen={modalState.isOpen}
        type={modalState.type}
        metadata={modalState.metadata}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
