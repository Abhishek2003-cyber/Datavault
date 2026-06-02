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
      <div className="relative z-10 pt-12 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-ivory-300 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-copper-500" />
              <span className="text-ink-300 font-[DM_Mono] text-[10px] tracking-widest uppercase">Secured Connection</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-[Playfair_Display] font-black text-ink-900 tracking-tight">Command Center</h1>
            <p className="text-ink-500 font-[Jost] text-base mt-2 max-w-2xl">
              Monitor network assets, sales telemetry, and manage private vaults.
            </p>
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center py-24 bg-ivory-50 border border-ivory-300 relative overflow-hidden">
            <h2 className="text-2xl font-[Playfair_Display] font-bold text-ink-900 mb-2">Awaiting Authentication</h2>
            <p className="text-ink-500 font-[Jost] text-sm">Connect your verified wallet to access the command center.</p>
          </div>
        ) : myDatasets.length === 0 ? (
          <div className="text-center py-24 bg-ivory-50 border border-ivory-300 flex flex-col items-center relative overflow-hidden group">
            <div className="w-16 h-16 rounded-full bg-ivory-100 flex items-center justify-center text-copper-500 mb-6 border border-copper-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-[Playfair_Display] font-bold text-ink-900 mb-2">No Active Assets</h2>
            <p className="text-ink-500 font-[Jost] mb-8 max-w-sm mx-auto text-sm">
              No encrypted payloads detected on the network. Initialize an upload sequence to deploy your first asset.
            </p>
            <Link href="/upload" className="bg-copper-500 hover:bg-copper-600 text-ivory-50 font-[DM_Mono] uppercase tracking-wider py-3 px-6 transition-colors flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              INITIALIZE UPLOAD
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4 border-b border-ivory-200 mb-8 pb-1">
              <button
                onClick={() => setActiveTab("marketplace")}
                className={`pb-3 px-4 font-[DM_Mono] text-[10px] uppercase tracking-widest border-b-[2px] transition-all duration-300 ${
                  activeTab === "marketplace" 
                    ? "border-copper-500 text-copper-500" 
                    : "border-transparent text-ink-300 hover:text-ink-900"
                }`}
              >
                Marketplace Telemetry ({marketplaceDatasets.length})
              </button>
              <button
                onClick={() => setActiveTab("private")}
                className={`pb-3 px-4 font-[DM_Mono] text-[10px] uppercase tracking-widest border-b-[2px] transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "private" 
                    ? "border-copper-500 text-copper-500" 
                    : "border-transparent text-ink-300 hover:text-ink-900"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Secure Vaults ({privateVaults.length})
              </button>
            </div>

            {activeTab === "marketplace" ? (
              marketplaceDatasets.length === 0 ? (
                <div className="text-center py-12 text-ink-300 font-[Jost]">No public marketplace listings found.</div>
              ) : (
                <div className="flex flex-col w-full bg-ivory-100 border-t border-ivory-300">
                   <div className="hidden sm:flex bg-ivory-50 font-[DM_Mono] text-[8px] uppercase tracking-widest text-ink-100 py-2 px-4 border-b border-ivory-200">
                      <div className="flex-1">Dataset Information</div>
                      <div className="w-32 text-right">Price</div>
                   </div>
                  {marketplaceDatasets.map((dataset) => (
                    <DatasetCard key={dataset.id} dataset={dataset} />
                  ))}
                </div>
              )
            ) : (
              privateVaults.length === 0 ? (
                <div className="text-center py-12 text-ink-300 font-[Jost]">No private encrypted vaults found.</div>
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
