import PrivacyContent from "@/components/privacy/PrivacyContent";
import { headers, cookies } from "next/headers";
import path from "path";
import { promises as fs } from "fs";

export const dynamic = "force-dynamic";

async function detectLang(): Promise<"zh" | "en"> {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("lang")?.value?.toLowerCase();
  if (cookieLang === "zh" || cookieLang === "en") {
    return cookieLang;
  }

  const hdrs = await headers();
  const acceptLang = hdrs.get("accept-language")?.toLowerCase() || "";
  if (acceptLang.startsWith("zh")) return "zh";
  return "en";
}

async function loadPrivacyJSON(lang: "zh" | "en") {
  const filePath = path.join(process.cwd(), "public", "locales", lang, "privacy.json");
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    // fallback to EN
    const fallback = path.join(process.cwd(), "public", "locales", "en", "privacy.json");
    const content = await fs.readFile(fallback, "utf-8");
    return JSON.parse(content);
  }
}

export default async function PrivacyPolicy() {
  const lang = await detectLang();
  const data = await loadPrivacyJSON(lang);
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <PrivacyContent data={data} />
      </div>
    </div>
  );
}