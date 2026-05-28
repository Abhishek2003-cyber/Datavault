import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env.local") });

async function main() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("DEPLOYER_PRIVATE_KEY not found in .env.local");
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`);
  
  const walletClient = createWalletClient({
    account,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL || "https://aeneid.storyrpc.io"),
  });

  const config: StoryConfig = {
    wallet: walletClient,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL || "https://aeneid.storyrpc.io"),
    chainId: "aeneid",
  };
  const storyClient = StoryClient.newClient(config);

  console.log("Deploying SPG NFT Collection...");
  const response = await storyClient.nftClient.createNFTCollection({
    name: "DataVault Datasets",
    symbol: "DVAULT",
    isPublicMinting: true,
    mintOpen: true,
    contractURI: "",
    mintFeeRecipient: "0x0000000000000000000000000000000000000000",
    txOptions: { waitForTransaction: true }
  });

  if (!response.spgNftContract) {
    throw new Error("Failed to deploy SPG NFT collection.");
  }

  console.log("Deployment Successful!");
  console.log(`SPG NFT Contract Address: ${response.spgNftContract}`);
  console.log(`Transaction Hash: ${response.txHash}`);
  console.log(`StoryScan: https://aeneid.storyscan.io/address/${response.spgNftContract}`);
}

main().catch(console.error);
