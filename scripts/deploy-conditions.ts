import * as fs from 'fs';
import * as path from 'path';
import solc from 'solc';
import { createWalletClient, createPublicClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { storyAeneid } from 'viem/chains';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const sourceCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IWriteCondition {
    function checkWriteCondition(address caller, bytes calldata conditionData, bytes calldata accessAuxData) external view returns (bool);
}

interface IReadCondition {
    function checkReadCondition(address caller, bytes calldata conditionData, bytes calldata accessAuxData) external view returns (bool);
}

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);
}

contract OwnerWriteCondition is IWriteCondition {
    function checkWriteCondition(address caller, bytes calldata conditionData, bytes calldata /* accessAuxData */) external pure override returns (bool) {
        address owner = abi.decode(conditionData, (address));
        return caller == owner;
    }
}

contract LicenseReadCondition is IReadCondition {
    function checkReadCondition(address caller, bytes calldata conditionData, bytes calldata /* accessAuxData */) external view override returns (bool) {
        (address licenseToken, ) = abi.decode(conditionData, (address, address));
        return IERC721(licenseToken).balanceOf(caller) > 0;
    }
}
`;

async function main() {
  console.log("Compiling Condition Smart Contracts...");
  
  const input = {
    language: 'Solidity',
    sources: {
      'Conditions.sol': {
        content: sourceCode
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode.object']
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
  if (output.errors) {
    let hasError = false;
    for (const err of output.errors) {
      if (err.severity === 'error') {
        console.error("Compilation error:", err.formattedMessage);
        hasError = true;
      } else {
        console.warn("Compilation warning:", err.formattedMessage);
      }
    }
    if (hasError) process.exit(1);
  }

  const OwnerWriteCondition = output.contracts['Conditions.sol']['OwnerWriteCondition'];
  const LicenseReadCondition = output.contracts['Conditions.sol']['LicenseReadCondition'];

  console.log("Compilation successful!");

  const privateKey = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`;
  if (!privateKey) throw new Error("Missing DEPLOYER_PRIVATE_KEY");

  const account = privateKeyToAccount(privateKey);
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://aeneid.storyrpc.io";
  
  const publicClient = createPublicClient({
    chain: {
      id: 1315,
      name: "Story Aeneid",
      nativeCurrency: { name: "IP", symbol: "IP", decimals: 18 },
      rpcUrls: { default: { http: [rpcUrl] } },
    },
    transport: http(rpcUrl)
  });

  const walletClient = createWalletClient({
    account,
    chain: {
      id: 1315,
      name: "Story Aeneid",
      nativeCurrency: { name: "IP", symbol: "IP", decimals: 18 },
      rpcUrls: { default: { http: [rpcUrl] } },
    },
    transport: http(rpcUrl)
  });

  console.log(`Deploying from wallet: ${account.address}`);
  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Balance: ${balance} wei`);

  // Deploy OwnerWriteCondition
  console.log("Deploying OwnerWriteCondition...");
  const ownerWriteTx = await walletClient.deployContract({
    abi: OwnerWriteCondition.abi,
    bytecode: `0x${OwnerWriteCondition.evm.bytecode.object}`,
  });
  console.log(`Tx Hash: ${ownerWriteTx}`);
  const ownerWriteReceipt = await publicClient.waitForTransactionReceipt({ hash: ownerWriteTx });
  const ownerWriteAddress = ownerWriteReceipt.contractAddress;
  console.log(`✅ OwnerWriteCondition deployed at: ${ownerWriteAddress}`);

  // Deploy LicenseReadCondition
  console.log("Deploying LicenseReadCondition...");
  const licenseReadTx = await walletClient.deployContract({
    abi: LicenseReadCondition.abi,
    bytecode: `0x${LicenseReadCondition.evm.bytecode.object}`,
  });
  console.log(`Tx Hash: ${licenseReadTx}`);
  const licenseReadReceipt = await publicClient.waitForTransactionReceipt({ hash: licenseReadTx });
  const licenseReadAddress = licenseReadReceipt.contractAddress;
  console.log(`✅ LicenseReadCondition deployed at: ${licenseReadAddress}`);

  // Write to .env.local
  const envPath = path.resolve(__dirname, '../.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  const standardLicenseToken = "0x53B0BFe4E4cAC4422e51fc62E5F7fcc2e2a095E8"; // Standard Aeneid SPG LicenseToken 

  console.log("Updating .env.local...");
  
  envContent += `\n# Automatically deployed condition contracts\n`;
  envContent += `NEXT_PUBLIC_OWNER_WRITE_CONDITION=${ownerWriteAddress}\n`;
  envContent += `NEXT_PUBLIC_LICENSE_READ_CONDITION=${licenseReadAddress}\n`;
  envContent += `NEXT_PUBLIC_LICENSE_TOKEN=${standardLicenseToken}\n`;
  
  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env.local updated successfully!");
  console.log("Restart your Next.js server to apply the changes.");
}

main().catch(console.error);
