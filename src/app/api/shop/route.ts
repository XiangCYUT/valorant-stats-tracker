import { NextResponse } from "next/server";
import shopData from "@/mock/shop.json";

export const runtime = 'edge';

export function GET() {
  return NextResponse.json(shopData, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
} 