import { createPublicClient, http, parseAbiItem } from 'viem';
const cdrAbi = [{
    "type": "function",
    "name": "vaults",
    "inputs": [{"name": "uuid", "type": "uint32", "internalType": "uint32"}],
    "outputs": [
      {
        "name": "vault",
        "type": "tuple",
        "components": [
          {"name": "updatable", "type": "bool"},
          {"name": "writeConditionAddr", "type": "address"},
          {"name": "readConditionAddr", "type": "address"},
          {"name": "writeConditionData", "type": "bytes"},
          {"name": "readConditionData", "type": "bytes"},
          {"name": "encryptedData", "type": "bytes"}
        ]
      }
    ],
    "stateMutability": "view"
  }];

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

const cdrAddress = "0xcccccc0000000000000000000000000000000005"; // testnet cdr address

async function main() {
  const uuid = 3831n;
  
  const vault = await publicClient.readContract({
    address: cdrAddress,
    abi: cdrAbi,
    functionName: 'vaults',
    args: [uuid]
  });
  
  console.log("Vault " + uuid.toString() + " data:");
  console.log("updatable:", vault.updatable);
  console.log("writeConditionAddr:", vault.writeConditionAddr);
  console.log("readConditionAddr:", vault.readConditionAddr);
  console.log("writeConditionData:", vault.writeConditionData);
  console.log("readConditionData:", vault.readConditionData);
  console.log("encryptedData length:", vault.encryptedData.length);
  
  const allocateEvents = await publicClient.getLogs({
    address: cdrAddress,
    event: parseAbiItem('event VaultAllocated(uint32 uuid, bool updatable, address writeConditionAddr, address readConditionAddr, bytes writeConditionData, bytes readConditionData)'),
    fromBlock: 'earliest',
    toBlock: 'latest'
  });
  
  const myAllocate = allocateEvents.find(e => e.args.uuid === Number(uuid));
  if (myAllocate) {
    console.log("Allocate Tx Hash:", myAllocate.transactionHash);
    
    // Get receipt to see status
    const receipt = await publicClient.getTransactionReceipt({ hash: myAllocate.transactionHash });
    console.log("Allocate Tx Status:", receipt.status);
  } else {
    console.log("No allocate event found for uuid", uuid);
  }
  
  const writeEvents = await publicClient.getLogs({
    address: cdrAddress,
    event: parseAbiItem('event VaultWritten(uint32 uuid, bytes encryptedData)'),
    fromBlock: 'earliest',
    toBlock: 'latest'
  });
  
  const myWrite = writeEvents.find(e => e.args.uuid === Number(uuid));
  if (myWrite) {
    console.log("Write Tx Hash:", myWrite.transactionHash);
    const receipt = await publicClient.getTransactionReceipt({ hash: myWrite.transactionHash });
    console.log("Write Tx Status:", receipt.status);
  } else {
    console.log("No write event found for uuid", uuid);
  }
}

main().catch(console.error);
