// src/app/api/accuracy/route.ts
import { NextResponse, NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET() {
  // 不再提供資料，避免外部直接訪問
  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}


