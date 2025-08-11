"use server";

// Use static import so the file is bundled in the serverless function on Vercel
// and does not rely on runtime filesystem access
import demoProfile from "../../data/demoProfile.json" assert { type: "json" };

export async function getAccuracyDemo(): Promise<any[]> {
  return demoProfile as any[];
}


