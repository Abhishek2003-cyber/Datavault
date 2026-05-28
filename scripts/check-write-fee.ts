import { createPublicClient, http, parseAbi } from 'viem';

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

const cdrAddress = "0xcccccc0000000000000000000000000000000005";
const abi = parseAbi([
  "function writeFee() external view returns (uint256)",
]);

async function main() {
  try {
    const fee = await publicClient.readContract({
      address: cdrAddress,
      abi,
      functionName: "writeFee",
    });
    console.log("Write Fee:", fee.toString());
  } catch (e) {
    console.log("Error reading writeFee:", e);
  }
}

main();
