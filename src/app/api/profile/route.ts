import { NextResponse } from "next/server";
import profileData from "@/mock/profile.json";

export const runtime = 'edge';

export function GET() {
  return NextResponse.json(profileData, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
} 