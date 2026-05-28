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
  
  const validate = keccak256(toBytes('validate(bytes,address,bytes)')).slice(2, 10);
  console.log("Impl contains validate (" + validate + "):", bytecode.includes(validate));
}

main();
