import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/openapi.json`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch OpenAPI spec" }, { status: 502 });
    }
    const spec = await res.json();
    return NextResponse.json(spec, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json({ error: "OpenAPI spec unavailable" }, { status: 503 });
  }
}
