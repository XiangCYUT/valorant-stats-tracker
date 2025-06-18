import { NextRequest, NextResponse } from "next/server";
import { getAccount } from "@/lib/riotApi";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameName: string; tagLine: string }> }
): Promise<NextResponse> {
  try {
    const { gameName, tagLine } = await params;
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
