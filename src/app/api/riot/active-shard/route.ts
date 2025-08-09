import { NextRequest, NextResponse } from "next/server";
import { getActiveShard } from "@/lib/riotApi";

export const runtime = 'edge';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const puuid = request.nextUrl.searchParams.get('puuid');
  if (!puuid) {
    return NextResponse.json({ message: "puuid is required" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const data = await getActiveShard(puuid);
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } });
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json(
      err?.body ?? { message: "Internal Server Error" },
      { status, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { puuid } = body;
    
    // 驗證必要參數
    if (!puuid) {
      return NextResponse.json(
        { message: "puuid is required" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }
    
    const data = await getActiveShard(puuid);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json(
      err?.body ?? { message: "Internal Server Error" },
      { status, headers: { "Cache-Control": "no-store" } }
    );
  }
} 