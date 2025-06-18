import { NextRequest, NextResponse } from "next/server";
import { getActiveShard } from "@/lib/riotApi";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ puuid: string }> }
): Promise<NextResponse> {
  try {
    const { puuid } = await params;
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
