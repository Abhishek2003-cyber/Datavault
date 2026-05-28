export function generateAESKey(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

export async function encryptFile(fileBuffer: ArrayBuffer, aesKey: Uint8Array): Promise<Uint8Array> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    aesKey as any,
    "AES-GCM",
    false,
    ["encrypt"]
  );
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    fileBuffer
  );
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), iv.length);
  return result;
}

export async function decryptFile(encryptedBuffer: ArrayBuffer, aesKey: Uint8Array): Promise<ArrayBuffer> {
  const encryptedArray = new Uint8Array(encryptedBuffer);
  const iv = encryptedArray.slice(0, 12);
  const ciphertext = encryptedArray.slice(12);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    aesKey as any,
    "AES-GCM",
    false,
    ["decrypt"]
  );
  return await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    ciphertext
  );
}

export function downloadBlob(buffer: ArrayBuffer, filename: string): void {
  const blob = new Blob([buffer]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
