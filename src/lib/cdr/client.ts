"use client";

import { type WalletClient } from "viem";

export async function ensureWasmInit() {
  // Mocked for Vercel
}

export function createReadOnlyCDRClient() {
  return { mock: true };
}

export function createWalletCDRClient(walletClient: WalletClient) {
  return { mock: true, walletClient };
}
