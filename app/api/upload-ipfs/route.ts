import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Use Node.js runtime for large file handling

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided in form data" }, { status: 400 });
    }

    const jwt = process.env.PINATA_JWT;
    if (!jwt) {
      console.error("[Pinata] Missing JWT API Key in environment variables.");
      return NextResponse.json({ error: "Storage configuration error on server" }, { status: 500 });
    }

    console.log(`[Pinata] Received encrypted blob: ${file.name}`);
    console.log(`[Pinata] File metadata - Size: ${file.size} bytes, Type: ${file.type || 'application/octet-stream'}`);

    // Fix Next.js nodejs runtime FormData bug by manually constructing the multipart buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const boundary = `----PinataFormBoundary${Math.random().toString(36).substring(2)}`;
    
    const prefix = Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${file.name}"\r\n` +
      `Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`
    );
    const suffix = Buffer.from(`\r\n--${boundary}--\r\n`);
    
    const bodyBuffer = Buffer.concat([prefix, fileBuffer, suffix]);

    console.log("[Pinata] Starting upload to decentralized IPFS network...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); 

    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": `multipart/form-data; boundary=${boundary}`
        },
        body: bodyBuffer,
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Pinata] Upload failed. Status: ${response.status} ${response.statusText}`);
        console.error(`[Pinata] Response Body: ${errorText}`);
        
        let errorMessage = "Pinata upload failed";
        try {
          const parsed = JSON.parse(errorText);
          if (parsed.error) {
            errorMessage = typeof parsed.error === 'string' ? parsed.error : JSON.stringify(parsed.error);
          } else if (parsed.message) {
             errorMessage = parsed.message;
          }
        } catch (e) {
          errorMessage = errorText || `HTTP ${response.status} ${response.statusText}`;
        }
        
        return NextResponse.json({ error: errorMessage }, { status: response.status });
      }

      const data = await response.json();
      console.log(`[Pinata] Upload successful! CID: ${data.IpfsHash}`);

      return NextResponse.json({
        cid: data.IpfsHash,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
        size: data.PinSize,
        uploadedAt: data.Timestamp
      });
    } catch (uploadError: any) {
      if (uploadError.name === "AbortError") {
        console.error("[Pinata] Upload timed out.");
        return NextResponse.json({ error: "Upload to IPFS timed out after 5 minutes" }, { status: 504 });
      }
      console.error("[Pinata] Fetch execution exception:", uploadError.message, uploadError.stack);
      return NextResponse.json({ error: `Fetch execution failed: ${uploadError.message}` }, { status: 500 });
    } finally {
      clearTimeout(timeoutId);
    }

  } catch (error: any) {
    console.error("[Pinata] Outer Internal server error:");
    console.error(`Name: ${error.name}`);
    console.error(`Message: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
