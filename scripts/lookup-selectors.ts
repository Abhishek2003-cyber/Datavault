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
  
  for (let i = 2; i < bytecode.length; i += 2) {
    if (bytecode.slice(i, i+2) === '63') {
      const selector = bytecode.slice(i+2, i+10);
      push4Opcodes.add(selector);
    }
  }
  
  const selectors = Array.from(push4Opcodes);
  console.log("Checking", selectors.length, "selectors...");
  
  for (const sel of selectors) {
    try {
      const res = await fetch('https://www.4byte.directory/api/v1/signatures/?hex_signature=0x' + sel);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        console.log(`0x${sel}:`, data.results.map((r: any) => r.text_signature).join(' | '));
      } else {
        console.log(`0x${sel}: Unknown`);
      }
    } catch(e) {
      console.error(`0x${sel}: Error fetching`);
    }
    // sleep to avoid rate limit
    await new Promise(r => setTimeout(r, 200));
  }
}

main();
