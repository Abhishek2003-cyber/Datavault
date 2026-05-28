import { createPublicClient, http, encodeAbiParameters, parseAbiParameters } from 'viem';

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

const contractAddress = "0xf4ed8ee4a2a166985e1e0839dd9598b402b35a29"; // OwnerWriteCondition
const abi = [{
    "type": "function",
    "name": "checkWriteCondition",
    "inputs": [
        {"name": "caller", "type": "address"},
        {"name": "conditionData", "type": "bytes"},
        {"name": "accessAuxData", "type": "bytes"}
    ],
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "pure"
}];

async function main() {
  const caller = "0x91Acd9a3fCBcA01B146362B1780038BDB441990a";
  const conditionData = encodeAbiParameters(parseAbiParameters("address"), [caller]);
  
  try {
    const result = await publicClient.readContract({
      address: contractAddress,
      abi: abi,
      functionName: "checkWriteCondition",
      args: [caller, conditionData, "0x"]
    });
    console.log("checkWriteCondition result:", result);
  } catch(e) {
    console.error("checkWriteCondition reverted:", e);
  }
}

main();
