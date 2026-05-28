import { createPublicClient, http } from 'viem';

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

async function main() {
  const hash = '0x942a152136f46bf96cf48da64bad01e8e0d9b3f37cbf34e80198184a1f624349'; // Just some hash
  try {
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Status:", receipt.status);
  } catch (e) {
    console.log("Error thrown:", e);
  }
}

main();
