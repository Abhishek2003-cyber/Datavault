import { createPublicClient, http } from 'viem';
import { cdrAbi } from '@piplabs/cdr-contracts';

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

const cdrAddress = "0xcccccc0000000000000000000000000000000005"; // testnet cdr address

async function main() {
  const vault3830 = await publicClient.readContract({
    address: cdrAddress,
    abi: cdrAbi,
    functionName: 'vaults',
    args: [3830n]
  });
  console.log("Vault 3830:", vault3830);
  
  const vault3829 = await publicClient.readContract({
    address: cdrAddress,
    abi: cdrAbi,
    functionName: 'vaults',
    args: [3829n]
  });
  console.log("Vault 3829:", vault3829);
}

main().catch(console.error);
