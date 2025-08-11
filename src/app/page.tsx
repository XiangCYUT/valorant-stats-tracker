import Profile from "./Profile";
//import Shop from "./Shop"; // TODO: riot 審核完畢後再補上
import RealApi from "./RealApi";
import HomeHeader from "@/components/home/HomeHeader";
import { headers, cookies } from "next/headers";
import path from "path";
import { promises as fs } from "fs";

export const dynamic = "force-dynamic";

async function detectLang(): Promise<"zh" | "en"> {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("lang")?.value?.toLowerCase();
  if (cookieLang === "zh" || cookieLang === "en") return cookieLang;
  const hdrs = await headers();
  const acceptLang = hdrs.get("accept-language")?.toLowerCase() || "";
  if (acceptLang.startsWith("zh")) return "zh";
  return "en";
}

async function loadDict(lang: "zh" | "en") {
  const filePath = path.join(process.cwd(), "public", "locales", lang, "translation.json");
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as Record<string, string>;
  } catch {
    const fallback = path.join(process.cwd(), "public", "locales", "en", "translation.json");
    const content = await fs.readFile(fallback, "utf-8");
    return JSON.parse(content) as Record<string, string>;
  }
}

export default async function Home() {
  const lang = await detectLang();
  const dict = await loadDict(lang);
  return (
    <div className="w-full">
      <HomeHeader dict={dict} />

      {/* Interactive Components Section - Client Components */}
      <div className="flex flex-col items-center">
        <div className="py-8 w-full flex justify-center">
          <RealApi />
        </div>
        <div className="py-8 w-full flex justify-center">
          <Profile />
        </div>
        {/* <div className="py-8 w-full flex justify-center">
        <Shop />
        </div> */}
      </div>
    </div>
  );
}
