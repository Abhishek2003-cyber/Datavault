import { createPublicClient, http } from 'viem';

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

async function main() {
  const bytecode = await publicClient.getBytecode({
    address: '0xcccccc0000000000000000000000000000000005'
  });
  if (!bytecode) {
    console.log("No bytecode found!");
    return;
  }
  
  const checkWrite = "4fe607c2";
  const checkRead = "9b3e201d";
  
  console.log("Contains checkWriteCondition (" + checkWrite + "):", bytecode.includes(checkWrite));
  console.log("Contains checkReadCondition (" + checkRead + "):", bytecode.includes(checkRead));
}

main();
