import { createPublicClient, http } from 'viem';

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

const abi = [{
  "type": "function",
  "name": "maxEncryptedDataSize",
  "inputs": [],
  "outputs": [{"name": "", "type": "uint256"}],
  "stateMutability": "view"
}];

async function main() {
  try {
    const size = await publicClient.readContract({
      address: '0xcccccc0000000000000000000000000000000005',
      abi,
      functionName: "maxEncryptedDataSize"
    });
    console.log("maxEncryptedDataSize:", size);
  } catch(e) {
    console.error(e);
  }
}

main();
