import { NextRequest, NextResponse } from "next/server";
import { getAccount } from "@/lib/riotApi";

export const runtime = 'edge';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { gameName, tagLine } = body;
    
    // 驗證必要參數
    if (!gameName || !tagLine) {
      return NextResponse.json(
        { message: "gameName and tagLine are required" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }
    
    const data = await getAccount(gameName, tagLine);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json(
      err?.body ?? { message: "Internal Server Error" },
      { status, headers: { "Cache-Control": "no-store" } }
    );
  }
} 