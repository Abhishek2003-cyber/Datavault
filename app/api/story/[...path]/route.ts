import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const resolvedParams = await params;
    const pathParts = resolvedParams.path.join("/");
    const url = `http://172.192.41.96:1317/${pathParts}`;
    
    // Pass along query parameters if any
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const fetchUrl = queryString ? `${url}?${queryString}` : url;
    
    console.log(`[Proxy] Fetching Story API: ${fetchUrl}`);
    
    const res = await fetch(fetchUrl, { 
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store" 
    });
    
    const data = await res.text();
    
    return new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    });
  } catch (error) {
    console.error("[Proxy Error]", error);
    return NextResponse.json({ error: "Failed to proxy request to Story API" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
    },
  });
}
