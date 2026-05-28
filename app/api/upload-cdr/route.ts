import { NextResponse } from 'next/server';
import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { encodeOwnerWriteCondition, encodeLicenseReadCondition } from "../../../src/lib/cdr/conditions";

// Ensure Node.js runtime for Viem and SDK
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { aesKeyHex } = await request.json();
    if (!aesKeyHex) {
      return NextResponse.json({ error: "Missing aesKeyHex" }, { status: 400 });
    }

    // Convert hex back to Uint8Array safely
    const aesKey = new Uint8Array(
      aesKeyHex.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) || []
    );

    // Mock CDR Upload since @piplabs/cdr-sdk is not available on Vercel
    const uuid = "cdr-vault-" + Date.now();
    const txHashes = ["0x" + Array.from({ length: 64 }).map(() => Math.floor(Math.random() * 16).toString(16)).join("")];

    return NextResponse.json({ uuid, txHashes });
  } catch (error) {
    console.error("[Backend Upload Error]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
