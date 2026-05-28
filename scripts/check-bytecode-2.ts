import { createPublicClient, http, keccak256, toBytes } from 'viem';

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

async function main() {
  const bytecode = await publicClient.getBytecode({
    address: '0xcccccc0000000000000000000000000000000005'
  });
  if (!bytecode) return;
  
  const validate = keccak256(toBytes('validate(bytes,address,bytes)')).slice(2, 10);
  console.log("Contains validate (" + validate + "):", bytecode.includes(validate));
}

main();
