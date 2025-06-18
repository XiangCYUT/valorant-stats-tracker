import { NextResponse } from "next/server";
import shopData from "@/mock/shop.json";

export function GET() {
  return NextResponse.json(shopData);
} 