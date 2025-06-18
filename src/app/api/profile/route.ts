import { NextResponse } from "next/server";
import profileData from "@/mock/profile.json";

export function GET() {
  return NextResponse.json(profileData);
} 