import { createPublicClient, http, keccak256, toBytes, fromHex } from 'viem';

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

async function main() {
  const proxyAddress = '0xcccccc0000000000000000000000000000000005';
  
  // Read EIP-1967 implementation slot
  const slot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
  const implStorage = await publicClient.getStorageAt({
    address: proxyAddress,
    slot
  });
  
  if (!implStorage) throw new Error("Could not read implementation storage");
  const implAddress = "0x" + implStorage.slice(26);
  console.log("Implementation Address:", implAddress);
  
  const bytecode = await publicClient.getBytecode({
    address: implAddress as `0x${string}`
  });
  
  if (!bytecode) {
    console.log("No bytecode found for implementation!");
    return;
  }
  
  const writeSelector = "79af44d8"; // write(uint32,bytes,bytes)
  const checkWrite = "4fe607c2"; // checkWriteCondition(address,bytes,bytes)
  
  console.log("Impl contains write (" + writeSelector + "):", bytecode.includes(writeSelector));
  console.log("Impl contains checkWriteCondition (" + checkWrite + "):", bytecode.includes(checkWrite));
}

main();
