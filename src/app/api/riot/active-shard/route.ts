import { NextRequest, NextResponse } from "next/server";
import { getActiveShard } from "@/lib/riotApi";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { puuid } = body;
    
    // 驗證必要參數
    if (!puuid) {
      return NextResponse.json(
        { message: "puuid is required" },
        { status: 400 }
      );
    }
    
    const data = await getActiveShard(puuid);
    return NextResponse.json(data);
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json(
      err?.body ?? { message: "Internal Server Error" },
      { status }
    );
  }
} 