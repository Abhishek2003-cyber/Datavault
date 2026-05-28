import { createPublicClient, http } from 'viem';

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

async function main() {
  const implAddress = "0xdc78a37c28a2d53441b8f09e26237320e0f9c0f9";
  const bytecode = await publicClient.getBytecode({
    address: implAddress as `0x${string}`
  });
  
  if (!bytecode) return;
  
  const push4Opcodes = new Set<string>();
  
  // PUSH4 opcode is 0x63
  for (let i = 2; i < bytecode.length; i += 2) {
    if (bytecode.slice(i, i+2) === '63') {
      const selector = bytecode.slice(i+2, i+10);
      push4Opcodes.add(selector);
    }
  }
  
  console.log("Found PUSH4 selectors:", Array.from(push4Opcodes));
}

main();
