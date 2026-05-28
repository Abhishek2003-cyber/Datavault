export interface Dataset {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  owner_address: string;
  cdr_vault_uuid: string | null;
  ipfs_cid: string | null;
  ip_asset_id: string | null;
  license_terms_id?: string | null;
  price_in_ip: string;
  price_token: "WIP" | "MERC20";
  file_size_bytes: number;
  row_count: number | null;
  file_format: string;
  sample_preview: string;
  ai_tags: string[];
  download_count: number;
  is_verified: boolean;
  created_at: string;
  tx_hash?: string;
  is_private_vault?: boolean;
  vault_expiry?: string;
  subscription_status?: 'active' | 'expired';
  storage_tier?: string;
}

export type UploadStep = "idle" | "encrypting" | "uploading_ipfs" | "fetching_dkg" | "encrypting_key" | "allocating_vault" | "writing_vault" | "saving_metadata" | "complete" | "error";

export interface UploadProgress {
  step: UploadStep;
  stepIndex: number;
  totalSteps: number;
  message: string;
  txHash?: string;
  cid?: string;
  vaultUuid?: string;
  error?: string;
}

export type DecryptStep = "idle" | "submitting" | "collecting" | "combining" | "downloading" | "decrypting" | "complete" | "error";

export interface DecryptProgress {
  step: DecryptStep;
  message: string;
  partialCount: number;
  threshold: number;
  txHash?: string;
  logs: string[];
  error?: string;
}
