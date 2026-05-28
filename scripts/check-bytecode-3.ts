import { createPublicClient, http, keccak256, toBytes } from 'viem';

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

async function main() {
  const bytecode = await publicClient.getBytecode({
    address: '0xcccccc0000000000000000000000000000000005'
  });
  if (!bytecode) return;
  
  const writeSelector = "79af44d8"; // write(uint32,bytes,bytes)
  console.log("Contains write(uint32,bytes,bytes) (" + writeSelector + "):", bytecode.includes(writeSelector));
}

main();
