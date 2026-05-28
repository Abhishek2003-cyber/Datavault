export interface IpfsUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

/**
 * Retries a promise-returning function with exponential backoff.
 */
export async function retryUpload<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.warn(`Upload attempt ${attempt} failed, retrying in ${delay}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Retry logic failed unexpectedly");
}

/**
 * Uploads an encrypted Blob to the backend which proxies to Pinata IPFS.
 */
export async function uploadEncryptedBlob(
  blob: Blob,
  filename: string
): Promise<{ cid: string; gatewayUrl: string; metadata: any }> {
  return retryUpload(async () => {
    const formData = new FormData();
    formData.append("file", blob, filename);

    // Using AbortController for timeout (e.g. 60 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch("/api/upload-ipfs", {
        method: "POST",
        body: formData,
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = errorText;
        try {
          const parsed = JSON.parse(errorText);
          if (parsed.error) errorMessage = parsed.error;
        } catch (e) {}
        throw new Error(`Upload failed: ${response.status} - ${errorMessage}`);
      }

      const data = await response.json();
      
      return {
        cid: data.cid,
        gatewayUrl: data.gatewayUrl,
        metadata: {
          size: data.size,
          uploadedAt: data.uploadedAt
        }
      };
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Upload to IPFS timed out");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  });
}

/**
 * Downloads an encrypted Blob from the IPFS gateway via CID.
 */
export async function downloadEncryptedBlob(cid: string): Promise<ArrayBuffer> {
  const gateways = [
    process.env.NEXT_PUBLIC_IPFS_GATEWAY,
    "https://gateway.lighthouse.storage/ipfs/",
    "https://ipfs.io/ipfs/",
    "https://dweb.link/ipfs/",
    "https://gateway.pinata.cloud/ipfs/"
  ].filter(Boolean) as string[];

  let lastError = new Error("No gateways available");

  for (const gateway of gateways) {
    try {
      const url = `${gateway}${cid}`;
      const response = await fetch(url);
      if (response.ok) {
        return await response.arrayBuffer();
      }
      lastError = new Error(`Failed to download CID ${cid} from ${gateway}: ${response.statusText}`);
    } catch (e: any) {
      lastError = e;
    }
  }
  
  throw lastError;
}
