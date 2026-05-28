"use client";

import { CDRClient, initWasm } from "@piplabs/cdr-sdk";
import { createPublicClient, http, type WalletClient } from "viem";

let wasmInitialized = false;

export async function ensureWasmInit() {
  if (!wasmInitialized) {
    await initWasm();
    wasmInitialized = true;
  }
}

export function createReadOnlyCDRClient() {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://aeneid.storyrpc.io";
  const publicClient = createPublicClient({ transport: http(rpcUrl) });
  
  return new CDRClient({
    network: "testnet",
    publicClient: publicClient as any,
    apiUrl: process.env.NEXT_PUBLIC_STORY_API_URL || "/api/story",
  });
}

export function createWalletCDRClient(walletClient: WalletClient) {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://aeneid.storyrpc.io";
  const publicClient = createPublicClient({ transport: http(rpcUrl) });
  
  return new CDRClient({
    network: "testnet",
    publicClient: publicClient as any,
    walletClient: walletClient as any,
    apiUrl: process.env.NEXT_PUBLIC_STORY_API_URL || "/api/story",
  });
}
