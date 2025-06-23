import { NextRequest, NextResponse } from "next/server";
import { getAccount } from "@/lib/riotApi";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { gameName, tagLine } = body;
    
    // 驗證必要參數
    if (!gameName || !tagLine) {
      return NextResponse.json(
        { message: "gameName and tagLine are required" },
        { status: 400 }
      );
    }
    
    const data = await getAccount(gameName, tagLine);
    return NextResponse.json(data);
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json(
      err?.body ?? { message: "Internal Server Error" },
      { status }
    );
  }
} 