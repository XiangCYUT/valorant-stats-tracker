"use server";

import { promises as fs } from "fs";
import path from "path";

export async function getAccuracyDemo(): Promise<any[]> {
  const filePath = path.join(process.cwd(), "data", "demoProfile.json");
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content) as any[];
}


