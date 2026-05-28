export const CONTRACTS = {
  OWNER_WRITE_CONDITION: "0x9165029a166fe7b124d32e6561844207dc9211e7" as `0x${string}`,
  LICENSE_READ_CONDITION: "0x7b960efeb908ab7586e5430eae0adc4f34110873" as `0x${string}`,
  IP_ASSET_REGISTRY: process.env.NEXT_PUBLIC_IP_ASSET_REGISTRY as `0x${string}`,
  LICENSE_TOKEN: process.env.NEXT_PUBLIC_LICENSE_TOKEN as `0x${string}`,
  LICENSING_MODULE: process.env.NEXT_PUBLIC_LICENSING_MODULE as `0x${string}`,
  PIL_TEMPLATE: process.env.NEXT_PUBLIC_PIL_TEMPLATE as `0x${string}`,
  ROYALTY_MODULE: process.env.NEXT_PUBLIC_ROYALTY_MODULE as `0x${string}`,
  REGISTRATION_WORKFLOWS: process.env.NEXT_PUBLIC_REGISTRATION_WORKFLOWS as `0x${string}`,
  WIP_TOKEN: process.env.NEXT_PUBLIC_WIP_TOKEN as `0x${string}`,
  MERC20_TOKEN: process.env.NEXT_PUBLIC_MERC20_TOKEN as `0x${string}`,
  SPG_NFT_CONTRACT: process.env.NEXT_PUBLIC_SPG_NFT_CONTRACT as `0x${string}`,
};

export const CDR_TIMEOUT_MS = 180000;
export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud";
export const PINATA_JWT = process.env.PINATA_JWT || "";
