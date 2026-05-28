import { defineChain } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, rainbowWallet, walletConnectWallet, injectedWallet, rabbyWallet } from "@rainbow-me/rainbowkit/wallets";

export const aeneid = defineChain({
  id: 1315,
  name: "Story Aeneid Testnet",
  nativeCurrency: { name: "IP", symbol: "IP", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://aeneid.storyrpc.io"] },
  },
  blockExplorers: {
    default: { name: "Storyscan", url: "https://aeneid.storyscan.io" },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: "DataVault",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "1c00224b4869dbf42296d1976098ed23",
  chains: [aeneid],
  wallets: [
    {
      groupName: 'Installed',
      wallets: [rabbyWallet, metaMaskWallet, injectedWallet],
    },
  ],
  ssr: true,
});
