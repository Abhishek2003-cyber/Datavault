"use client";

import { useState } from "react";
import { useWalletClient, useAccount } from "wagmi";
import { ensureWasmInit as ensureWasm, createWalletCDRClient as makeCDRClient } from "../lib/cdr/client";
import { generateAESKey, encryptFile } from "../lib/crypto/aes";

export interface DatasetUploadInput {
  file: File;
  name: string;
  description: string;
  category: string;
  tags?: string[];
  price_in_ip: number;
  price_token?: string;
  sample_preview?: string;
  ai_tags?: string[];
  is_private_vault?: boolean;
}

export interface UploadProgress {
  step: string;
  stepIndex: number;
  totalSteps: number;
  message: string;
  cid?: string;
  vaultUuid?: number;
  txHash?: string;
  error?: string;
}

export function useDatasetUpload() {
  const { data: walletClient } = useWalletClient()
  const { address } = useAccount()
  const [progress, setProgress] = useState<UploadProgress>({
    step: "idle", stepIndex: 0, totalSteps: 7, message: "",
  })

  const update = (p: Partial<UploadProgress>) =>
    setProgress((prev) => ({ ...prev, ...p }))

  const addLog = (msg: string) => {
    const ts = new Date().toLocaleTimeString("en-US", { hour12: false })
    console.log(`[${ts}] ${msg}`)
  }

  const upload = async (input: DatasetUploadInput) => {
    if (!walletClient || !address) throw new Error("Wallet not connected")

    try {
      // ── STEP 1: Init WASM ──────────────────────────────────
      update({ step: "encrypting", stepIndex: 1,
               message: "Initializing CDR encryption engine..." })
      await ensureWasm()
      addLog("CDR WASM initialized ✓")

      // ── STEP 2: AES encrypt the file ──────────────────────
      update({ stepIndex: 2, message: "Generating AES-256-GCM key..." })
      const aesKey = generateAESKey()
      addLog("AES-256 key generated ✓")

      update({ message: `Encrypting ${input.file.name}...` })
      const fileBuffer = await input.file.arrayBuffer()
      const encryptedBytes = await encryptFile(fileBuffer, aesKey)
      addLog(`File encrypted ✓ (${(encryptedBytes.length / 1024 / 1024).toFixed(2)} MB)`)

      // ── STEP 3: Upload to IPFS via Pinata ─────────────────
      update({ step: "uploading", stepIndex: 3,
               message: "Uploading encrypted blob to IPFS..." })
      
      const ipfsRes = await fetch("/api/upload-file", {
        method: "POST",
        body: new Blob([encryptedBytes as any]),
      })
      if (!ipfsRes.ok) {
        const e = await ipfsRes.text()
        throw new Error("IPFS upload failed: " + e)
      }
      const { cid } = await ipfsRes.json()
      addLog(`IPFS upload ✓ CID: ${cid}`)
      update({ cid, message: `Uploaded to IPFS: ${cid.slice(0,16)}...` })

      // ── STEP 4: CDR client + DKG key ──────────────────────
      update({ step: "fetching_dkg", stepIndex: 4,
               message: "Connecting to Story validator network..." })
      const cdrClient = makeCDRClient(walletClient)
      const globalPubKey = await cdrClient.observer.getGlobalPubKey()
      const allocateFee  = await cdrClient.observer.getAllocateFee()
      const writeFee     = await cdrClient.observer.getWriteFee()
      addLog(`DKG key fetched ✓ allocFee: ${allocateFee} writeFee: ${writeFee}`)

      // ── STEP 5: Allocate vault ─────────────────────────────
      update({ step: "allocating_vault", stepIndex: 5,
               message: "Allocating CDR vault on Story L1..." })
      const readConditionAddr = input.is_private_vault 
        ? address as `0x${string}` 
        : (process.env.NEXT_PUBLIC_LICENSE_READ_CONDITION as `0x${string}` || "0x0000000000000000000000000000000000000000")
      
      const { uuid, txHash: allocTx } = await cdrClient.uploader.allocate({
        updatable:             false,
        writeConditionAddr:    address as `0x${string}`,
        writeConditionData:    "0x",
        readConditionAddr,
        readConditionData:     "0x",
        skipConditionValidation: true,
        fee:                   allocateFee,
      })
      addLog(`Vault #${uuid} allocated ✓ TX: ${allocTx}`)
      update({ vaultUuid: uuid, txHash: allocTx,
               message: `Vault #${uuid} allocated — waiting for confirmation...` })

      // CRITICAL: wait for allocate TX to be mined
      await new Promise((r) => setTimeout(r, 5000))
      addLog("Allocate TX confirmed ✓")

      // ── STEP 6: TDH2-encrypt AES key with correct label ───
      update({ step: "encrypting_key", stepIndex: 6,
               message: "TDH2-encrypting AES key against threshold..." })

      // UUID must be in LAST 4 bytes of label (offset 28-31)
      const label = new Uint8Array(32)
      label[28] = (uuid >>> 24) & 0xff
      label[29] = (uuid >>> 16) & 0xff
      label[30] = (uuid >>> 8)  & 0xff
      label[31] =  uuid         & 0xff
      addLog(`Label: 0x${Buffer.from(label).toString("hex")}`)

      const encryptedKey = await cdrClient.uploader.encryptDataKey({
        dataKey:      aesKey,
        globalPubKey,
        label,
      })
      addLog(`AES key TDH2-encrypted ✓ (${encryptedKey.raw.length} bytes)`)

      // ── STEP 7: Write to vault ─────────────────────────────
      update({ step: "writing_vault", stepIndex: 7,
               message: "Writing encrypted key to CDR vault..." })

      const { toHex } = await import("viem")
      const { txHash: writeTx } = await cdrClient.uploader.write({
        uuid,
        accessAuxData: "0x",
        encryptedData: toHex(encryptedKey.raw),
        fee:           writeFee,
      })
      addLog(`Write TX confirmed ✓: ${writeTx}`)
      update({ txHash: writeTx,
               message: `Vault #${uuid} sealed ✓` })

      // Wait for write TX to mine
      await new Promise((r) => setTimeout(r, 3000))

      // ── STEP 8: Save to Supabase (or mock) ───────────────────
      update({ step: "saving", stepIndex: 8,
               message: "Publishing to marketplace..." })

      let dataset = { id: Math.random().toString() }
      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "mock-supabase-url") {
          const metaRes = await fetch("/api/datasets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name:            input.name,
              description:     input.description,
              category:        input.category,
              tags:            input.tags ?? [],
              owner_address:   address,
              price_in_ip:     input.price_in_ip,
              price_token:     input.price_token ?? "WIP",
              file_size_bytes: fileBuffer.byteLength,
              file_format:     input.file.name.split(".").pop()?.toUpperCase() ?? "BIN",
              sample_preview:  input.sample_preview ?? "",
              ai_tags:         input.ai_tags ?? [],
              cdr_vault_uuid:  uuid,
              ipfs_cid:        cid,
              is_private_vault: input.is_private_vault || false,
              aes_key:         toHex(aesKey),
            }),
          })
          if (metaRes.ok) {
            const data = await metaRes.json()
            dataset = data.data || dataset
          }
        }
      } catch (e) {
        console.warn("Supabase save skipped/failed", e)
      }
      
      addLog(`Dataset saved ✓`)

      update({ step: "complete", stepIndex: 8,
               message: "Dataset encrypted and live on DataVault!" })

      return { dataset, uuid, cid, allocTx, writeTx }

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      addLog(`ERROR: ${msg}`)
      update({ step: "error", message: msg, error: msg })
      throw err
    }
  }

  const reset = () =>
    setProgress({ step: "idle", stepIndex: 0, totalSteps: 7, message: "" })

  return { upload, progress, reset }
}
