import { config } from 'dotenv';
config({ path: '.env.local' });
import { createPublicClient, createWalletClient, http, encodeAbiParameters, parseAbiParameters, Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { eip712WalletActions } from 'viem/zksync';

const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex;
if (!privateKey) throw new Error("DEPLOYER_PRIVATE_KEY env var missing");

const account = privateKeyToAccount(privateKey);

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

const walletClient = createWalletClient({
  account,
  chain: {
    id: 1315,
    name: 'Aeneid',
    network: 'aeneid',
    nativeCurrency: { name: 'IP', symbol: 'IP', decimals: 18 },
    rpcUrls: { default: { http: ['https://aeneid.storyrpc.io'] } }
  },
  transport: http('https://aeneid.storyrpc.io')
}).extend(eip712WalletActions());

const cdrAddress = "0xcccccc0000000000000000000000000000000005";
const cdrAbi = [{
  "type": "function",
  "name": "allocate",
  "inputs": [
    {"name": "updatable", "type": "bool"},
    {"name": "writeConditionAddr", "type": "address"},
    {"name": "readConditionAddr", "type": "address"},
    {"name": "writeconditionData", "type": "bytes"},
    {"name": "readconditionData", "type": "bytes"}
  ],
  "outputs": [{"name": "newVaultUuid", "type": "uint32"}],
  "stateMutability": "payable"
}, {
  "type": "function",
  "name": "write",
  "inputs": [
    {"name": "uuid", "type": "uint32"},
    {"name": "accessAuxData", "type": "bytes"},
    {"name": "encryptedData", "type": "bytes"}
  ],
  "outputs": [],
  "stateMutability": "payable"
}];

// 104 bytes -> 160 bytes (odd number of words: 5 words = 160 bytes)
const mockConditionBytecode = "0x6080604052348015600e575f80fd5b50602f80601a5f395ff3fe6080604052348015600e575f80fd5b5060015f5260205ff3fea264697066735822122045c71b12b5e2820a442a8b273ce20fb318d1976a26df8d042fb1b83d1c9ccfc664736f6c634300081a0033" + "00".repeat(56);

async function main() {
  console.log("Deploying MockCondition...");
  const txHashDeploy = await walletClient.deployContract({
    abi: [],
    bytecode: mockConditionBytecode as Hex,
  });
  
  const receiptDeploy = await publicClient.waitForTransactionReceipt({ hash: txHashDeploy });
  const mockAddr = receiptDeploy.contractAddress!;
  console.log("MockCondition deployed to:", mockAddr);
  
  const simAlloc = await publicClient.simulateContract({
    account,
    address: cdrAddress,
    abi: cdrAbi,
    functionName: "allocate",
    args: [false, mockAddr, mockAddr, "0x", "0x"],
    value: 0n
  });
  const uuid = Number(simAlloc.result);
  console.log("Vault UUID simulated:", uuid);

  const txHashAlloc = await walletClient.writeContract(simAlloc.request);
  console.log("Allocate tx sent:", txHashAlloc);
  await publicClient.waitForTransactionReceipt({ hash: txHashAlloc });
  
  console.log("Writing to vault...");
  try {
    const sim = await publicClient.simulateContract({
      account,
      address: cdrAddress,
      abi: cdrAbi,
      functionName: "write",
      args: [uuid, "0x", "0x0102"],
      value: 0n
    });
    console.log("Simulation SUCCESS. Sending tx...");
  } catch(e) {
    console.error("Write REVERTED:", e);
  }
}

main();
