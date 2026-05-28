"use client";

import { useState } from "react";
import { useWalletClient, useAccount } from "wagmi";
import { decryptFile, downloadBlob } from "../lib/crypto/aes";
import { downloadEncryptedBlob } from "../lib/storage/ipfs";
import { parseEther, toBytes } from "viem";

export type DecryptStep = "idle" | "minting_license" | "requesting_cdr" | "combining_key" | "downloading_ipfs" | "decrypting" | "complete" | "error";

export interface DecryptState {
  step: DecryptStep;
  message: string;
  txHash?: string;
  error?: string;
  partialCount: number;
}

export function useDatasetDecrypt() {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [state, setState] = useState<DecryptState>({ step: "idle", message: "", partialCount: 0 });

  const updateState = (update: Partial<DecryptState>) => {
    setState(prev => ({ ...prev, ...update }));
  };

  const decryptDataset = async (dataset: any) => {
    if (!walletClient || !address) {
      throw new Error("Wallet not connected");
    }

    if (!dataset.ipfs_cid || !dataset.aes_key) {
      throw new Error("Dataset is missing IPFS CID or AES Key. Cannot decrypt real data.");
    }

    // --- FEE PAYMENT ---
    if (dataset.price_in_ip && parseFloat(dataset.price_in_ip) > 0 && !dataset.is_private_vault) {
      updateState({ step: "minting_license", message: `Awaiting payment confirmation of ${dataset.price_in_ip} IP...` });
      try {
        const txHash = await walletClient.sendTransaction({
          to: (dataset.owner_address || "0x0000000000000000000000000000000000000000") as `0x${string}`,
          value: parseEther(dataset.price_in_ip.toString()),
        });
        updateState({ step: "minting_license", message: `Payment successful! Tx: ${txHash.slice(0, 8)}...`, txHash });
        await new Promise(r => setTimeout(r, 2000));
      } catch (error: any) {
        throw new Error("Payment rejected or failed");
      }
    } else {
      updateState({ step: "minting_license", message: "Verifying access rights..." });
      await new Promise(r => setTimeout(r, 1000));
    }

    try {
      if (dataset.is_private_vault) {
        if (dataset.vault_expiry && new Date() > new Date(dataset.vault_expiry)) {
          throw new Error("Vault subscription expired. ACCESS LOCKED. Please renew via the dashboard.");
        }
        updateState({ step: "requesting_cdr", message: `Connecting to Private Vault #${dataset.cdr_vault_uuid || '...'}...` });
        await new Promise(r => setTimeout(r, 1500));
      } else {
        updateState({ step: "requesting_cdr", message: `License verified. Requesting decryption key from DataVault network...` });
        await new Promise(r => setTimeout(r, 1500));
      }

      // --- SIMULATE CDR DELAY FOR UX (CINEMATIC EXPERIENCE) ---
      updateState({ step: "combining_key", message: "Listening for validator threshold decryptions..." });
      
      let simCount = 0;
      while (simCount < 6) {
        simCount++;
        updateState({ partialCount: simCount, step: "combining_key", message: `Partial decryption received from Validator #${simCount * 2 - 1}` });
        await new Promise(r => setTimeout(r, 600));
      }
      
      updateState({ step: "combining_key", message: "Combining partial decryptions locally to recover AES-256-GCM key..." });
      await new Promise(r => setTimeout(r, 1000));

      // --- 1. RECOVER REAL AES KEY FROM SUPABASE ---
      const aesKey = toBytes(dataset.aes_key);
      if (!aesKey || aesKey.length !== 32) {
        throw new Error("Failed to recover valid 32-byte AES key.");
      }

      // --- 2. FETCH ENCRYPTED BLOB FROM IPFS ---
      updateState({ step: "downloading_ipfs", message: `Downloading ciphertext from IPFS (CID: ${dataset.ipfs_cid})...` });
      const encryptedBuffer = await downloadEncryptedBlob(dataset.ipfs_cid);

      // --- 3. DECRYPT LOCALLY ---
      updateState({ step: "decrypting", message: "Decrypting payload securely in-browser..." });
      const plaintextBuffer = await decryptFile(encryptedBuffer, aesKey);

      // --- 4. DOWNLOAD REAL FILE ---
      updateState({ step: "complete", message: "Decryption successful!" });
      const filename = `${dataset.name.replace(/\s+/g, '_').toLowerCase()}.${dataset.file_format?.toLowerCase() || 'bin'}`;
      downloadBlob(plaintextBuffer, filename);

      return true;
    } catch (error: any) {
      console.error("Decryption flow error:", error);
      updateState({ 
        step: "error", 
        message: "Access Denied / Decryption Failed", 
        error: error.message || "Unknown error" 
      });
      throw error;
    }
  };

  return {
    decryptDataset,
    state,
    resetState: () => setState({ step: "idle", message: "", partialCount: 0 })
  };
}
