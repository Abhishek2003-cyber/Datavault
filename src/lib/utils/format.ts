import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatAddress(addr: string | undefined): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatIP(wei: bigint): string {
  const ip = Number(wei) / 1e18;
  return ip.toString();
}

export function explorerTxUrl(hash: string): string {
  const explorerUrl = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://aeneid.storyscan.io";
  return `${explorerUrl}/tx/${hash}`;
}

export function ipfsUrl(cid: string): string {
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud";
  return `${gateway}/ipfs/${cid}`;
}

export function truncateCID(cid: string): string {
  if (!cid || cid.length < 12) return cid;
  return `${cid.slice(0, 6)}...${cid.slice(-6)}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
