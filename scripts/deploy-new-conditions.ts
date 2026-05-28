import { config } from 'dotenv';
config({ path: '.env.local' });
import { createPublicClient, createWalletClient, http, Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { eip712WalletActions, getEip712Domain } from 'viem/zksync';
import * as fs from 'fs';

const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex;
const account = privateKeyToAccount(privateKey);

const publicClient = createPublicClient({
  transport: http('https://aeneid.storyrpc.io')
});

const walletClient = createWalletClient({
  account,
  chain: {
    id: 1315,
    name: 'Aeneid',
    network: 'aeneid',
    nativeCurrency: { name: 'IP', symbol: 'IP', decimals: 18 },
    rpcUrls: { default: { http: ['https://aeneid.storyrpc.io'] } }
  },
  transport: http('https://aeneid.storyrpc.io')
});

async function deploy(solFile: string, name: string) {
  let bin = fs.readFileSync(`contracts/out/contracts_${solFile}_sol_${name}.bin`, 'utf8');
  const abi = JSON.parse(fs.readFileSync(`contracts/out/contracts_${solFile}_sol_${name}.abi`, 'utf8'));

  // Pad bytecode for ZkSync
  let byteLen = bin.length / 2;
  let wordCount = Math.ceil(byteLen / 32);
  if (wordCount % 2 === 0) wordCount++; // must be odd
  let paddedLen = wordCount * 32;
  let paddingBytes = paddedLen - byteLen;
  if (paddingBytes > 0) {
    bin += '00'.repeat(paddingBytes);
  }

  console.log(`Deploying ${name}... (padded from ${byteLen} to ${paddedLen} bytes, ${wordCount} words)`);
  const txHashDeploy = await walletClient.deployContract({
    abi,
    bytecode: `0x${bin}` as Hex,
  });
  
  const receiptDeploy = await publicClient.waitForTransactionReceipt({ hash: txHashDeploy });
  console.log(`${name} deployed to:`, receiptDeploy.contractAddress!);
}

async function main() {
  await deploy("OwnerWriteCondition", "OwnerWriteCondition");
  await deploy("LicenseReadCondition", "LicenseReadCondition");
}

main();
