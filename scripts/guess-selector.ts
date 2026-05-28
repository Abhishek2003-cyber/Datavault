import { createPublicClient, http, keccak256, toBytes } from 'viem';

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

async function main() {
  const implAddress = "0xdc78a37c28a2d53441b8f09e26237320e0f9c0f9";
  const bytecode = await publicClient.getBytecode({
    address: implAddress as `0x${string}`
  });
  
  if (!bytecode) return;
  
  const guesses = [
    "checkWriteCondition(address,bytes,bytes)",
    "checkWrite(address,bytes,bytes)",
    "check(address,bytes,bytes)",
    "validateWrite(address,bytes,bytes)",
    "isValidWrite(address,bytes,bytes)",
    "checkWriteCondition(address,bytes)",
    "checkWrite(address,bytes)",
    "hasWriteAccess(address,bytes,bytes)",
    "canWrite(address,bytes,bytes)",
    "validate(address,bytes,bytes)"
  ];
  
  for (const guess of guesses) {
    const sel = keccak256(toBytes(guess)).slice(2, 10);
    if (bytecode.includes(sel)) {
      console.log("FOUND IN BYTECODE:", guess, sel);
    }
  }
  
  console.log("Done checking guesses.");
}

main();
