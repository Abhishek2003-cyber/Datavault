import { createPublicClient, http, encodeAbiParameters, parseAbiParameters } from 'viem';
const cdrAbi = [{
    "type": "function",
    "name": "writeFee",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
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

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

const cdrAddress = "0xcccccc0000000000000000000000000000000005"; 

async function main() {
  const uuid = 3831n;
  const caller = "0x162ae62cec0ffa16ee1bd9fe315fcd19eecdc0f0";
  
  try {
    const fee = await publicClient.readContract({
      address: cdrAddress,
      abi: cdrAbi,
      functionName: "writeFee",
    });
    console.log("writeFee:", fee);
    
    console.log("Simulating write transaction...");
    const result = await publicClient.simulateContract({
      account: caller,
      address: cdrAddress,
      abi: cdrAbi,
      functionName: "write",
      args: [uuid, "0x", "0x" + "00".repeat(100)], // dummy encrypted data
      value: fee,
    });
    console.log("Simulation SUCCESS:", result);
  } catch(e) {
    console.error("Simulation REVERTED:");
    console.error(e);
  }
}

main();
