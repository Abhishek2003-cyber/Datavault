import { NextRequest, NextResponse } from "next/server"

export const runtime    = "nodejs"
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const jwt = process.env.PINATA_JWT
    if (!jwt || jwt.includes("replace")) {
      return NextResponse.json(
        { error: "PINATA_JWT not set in .env.local" },
        { status: 500 }
      )
    }

    const blob = await req.blob()
    if (!blob || blob.size === 0) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 })
    }

    console.log("[Pinata] Uploading", blob.size, "bytes")

    const form = new FormData()
    form.append("file", blob, "encrypted.bin")
    form.append("pinataMetadata", JSON.stringify({ name: `dv-${Date.now()}` }))
    form.append("pinataOptions",  JSON.stringify({ cidVersion: 1 }))

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method:  "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body:    form,
    })

    if (!res.ok) {
      const body = await res.text()
      console.error("[Pinata] Error", res.status, body)
      return NextResponse.json(
        { error: `Pinata ${res.status}: ${body}` },
        { status: 500 }
      )
    }

    const data = await res.json()
    console.log("[Pinata] Success CID:", data.IpfsHash)
    return NextResponse.json({ cid: data.IpfsHash })

  } catch (err) {
    console.error("[Pinata] Exception:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    )
  }
}
