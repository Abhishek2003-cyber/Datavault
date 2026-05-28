import { config } from 'dotenv';
config({ path: '.env.local' });
import { parseEventLogs, createPublicClient, createWalletClient, http, Hex, encodeAbiParameters, parseAbiParameters } from 'viem';
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
    id: 1313,
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

const myOwnerWriteCondition = "0x9165029a166fe7b124d32e6561844207dc9211e7";

async function main() {
  console.log("Allocating vault with my OwnerWriteCondition...");
  
  const writeConditionData = encodeAbiParameters(parseAbiParameters("address"), [account.address]);
  
  const simAlloc = await publicClient.simulateContract({
    account,
    address: cdrAddress,
    abi: cdrAbi,
    functionName: "allocate",
    args: [false, myOwnerWriteCondition, myOwnerWriteCondition, writeConditionData, "0x"],
    value: 0n
  });
  
  const txHashAlloc = await walletClient.writeContract(simAlloc.request);
  
  console.log("Allocate tx sent:", txHashAlloc);
  const receiptAlloc = await publicClient.waitForTransactionReceipt({ hash: txHashAlloc });
  console.log("Allocate success. Hash:", txHashAlloc);
  
  const parsedLogs = parseEventLogs({
    abi: cdrAbi,
    logs: receiptAlloc.logs,
    eventName: "VaultAllocated"
  });
  if (parsedLogs.length === 0) {
    console.log("No VaultAllocated event found! Logs:", receiptAlloc.logs);
    return;
  }
  const realUuid = parsedLogs[0].args.uuid;
  console.log("Real Vault UUID from event:", realUuid);

  console.log("Writing to vault...");
  try {
    const sim = await publicClient.simulateContract({
      account,
      address: cdrAddress,
      abi: cdrAbi,
      functionName: "write",
      args: [realUuid, "0x", "0x0102"],
      value: 0n
    });
    console.log("Simulation SUCCESS. Sending tx...");
    const txHashWrite = await walletClient.writeContract(sim.request);
    const receiptWrite = await publicClient.waitForTransactionReceipt({ hash: txHashWrite });
    console.log("Write success! Status:", receiptWrite.status);
  } catch(e) {
    console.error("Write REVERTED:", e);
  }
}

main();
