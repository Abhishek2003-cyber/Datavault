import { config } from 'dotenv';
config({ path: '.env.local' });
import { createPublicClient, createWalletClient, http, Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { eip712WalletActions } from 'viem/zksync';
import * as fs from 'fs';

const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex;
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

async function main() {
  const bin = fs.readFileSync('out/MockCondition.bin', 'utf8');
  const abi = JSON.parse(fs.readFileSync('out/MockCondition.abi', 'utf8'));

  console.log("Deploying MockCondition...");
  const txHashDeploy = await walletClient.deployContract({
    abi,
    bytecode: `0x${bin}` as Hex,
  });
  
  const receiptDeploy = await publicClient.waitForTransactionReceipt({ hash: txHashDeploy });
  const mockAddr = receiptDeploy.contractAddress!;
  console.log("MockCondition deployed to:", mockAddr);
  
  const simAlloc = await publicClient.simulateContract({
    account,
    address: cdrAddress,
    abi: cdrAbi,
    functionName: "allocate",
    args: [true, mockAddr, mockAddr, "0x", "0x"], // Using updatable=true!
    value: 0n
  });
  const uuid = Number(simAlloc.result);
  console.log("Vault UUID simulated:", uuid);

  const txHashAlloc = await walletClient.writeContract(simAlloc.request);
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
