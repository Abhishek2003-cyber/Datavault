import { NextResponse } from 'next/server';
import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { CDRClient, initWasm } from "@piplabs/cdr-sdk";
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

    // Initialize WASM inside the Node process
    await initWasm();

    const privateKey = "0x65be2007c9962e0401a310a92afc1dd5b021db01962647990e85be4374a798c6";
    const account = privateKeyToAccount(privateKey);

    const rpcUrl = "https://aeneid.storyrpc.io";
    const publicClient = createPublicClient({ transport: http(rpcUrl) });
    const walletClient = createWalletClient({
      account,
      chain: {
        id: 1315,
        name: "Story Aeneid Testnet",
        nativeCurrency: { name: "IP", symbol: "IP", decimals: 18 },
        rpcUrls: { default: { http: [rpcUrl] } },
      } as any,
      transport: http(rpcUrl)
    });

    // The backend uses the raw IP because it has no CORS issues
    const apiUrl = "http://172.192.41.96:1317";

    const cdrClient = new CDRClient({
      network: "testnet",
      publicClient: publicClient as any,
      walletClient: walletClient as any,
      apiUrl, 
    });

    // 1. Get Global Pub Key
    const globalPubKey = await cdrClient.observer.getGlobalPubKey();

    // 2. Prepare access conditions
    const MOCK_IP_ID = account.address; // Using the account address guarantees it passes EIP-55 checksum!
    const { writeConditionAddr, writeConditionData } = encodeOwnerWriteCondition(account.address);
    const { readConditionAddr, readConditionData } = encodeLicenseReadCondition(MOCK_IP_ID);

    // 3. Upload to Story CDR Node!
    const { uuid, txHashes } = await cdrClient.uploader.uploadCDR({
      dataKey: aesKey,
      globalPubKey,
      updatable: false,
      writeConditionAddr,
      readConditionAddr,
      writeConditionData,
      readConditionData,
      accessAuxData: "0x"
    });

    return NextResponse.json({ uuid, txHashes });
  } catch (error) {
    console.error("[Backend Upload Error]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
