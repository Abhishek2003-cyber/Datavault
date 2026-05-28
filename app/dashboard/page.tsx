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
    <div className="relative min-h-screen pb-20">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none z-0 fixed top-0" />
      <HexStream opacity={0.03} rows={6} />
      
      <div className="relative z-10 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-bg-border pb-6">
          <h1 className="text-4xl font-bold text-text-primary mb-3">Creator Dashboard</h1>
          <p className="text-text-secondary text-lg">
            Manage your proprietary datasets, track sales, and monitor licensing compliance across the Aeneid network.
          </p>
        </div>

        {!isConnected ? (
          <div className="text-center py-20 bg-bg-elevated/50 border border-bg-border rounded-xl">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Connect Your Wallet</h2>
            <p className="text-text-secondary">Please connect your Rabby or MetaMask wallet to view your dashboard.</p>
          </div>
        ) : myDatasets.length === 0 ? (
          <div className="text-center py-20 bg-bg-elevated/50 border border-dashed border-bg-border-2 rounded-xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">No Datasets Uploaded</h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              You haven't encrypted or published any datasets yet. Get started by uploading your first proprietary dataset.
            </p>
            <Link href="/upload" className="btn-primary px-8 py-3">
              Upload Dataset
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex gap-4 border-b border-bg-border mb-6">
              <button
                onClick={() => setActiveTab("marketplace")}
                className={`pb-3 px-2 font-medium text-lg border-b-2 transition-colors ${
                  activeTab === "marketplace" 
                    ? "border-accent-cyan text-accent-cyan" 
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                Marketplace Listings ({marketplaceDatasets.length})
              </button>
              <button
                onClick={() => setActiveTab("private")}
                className={`pb-3 px-2 font-medium text-lg border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "private" 
                    ? "border-accent-amber text-accent-amber" 
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                My Private Vaults ({privateVaults.length})
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
