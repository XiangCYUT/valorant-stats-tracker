import FooterContent from './footer/FooterContent';
import { headers, cookies } from 'next/headers';
import path from 'path';
import { promises as fs } from 'fs';

async function detectLang(): Promise<'zh' | 'en'> {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('lang')?.value?.toLowerCase();
  if (cookieLang === 'zh' || cookieLang === 'en') return cookieLang;
  const hdrs = await headers();
  const acceptLang = hdrs.get('accept-language')?.toLowerCase() || '';
  if (acceptLang.startsWith('zh')) return 'zh';
  return 'en';
}

async function loadDict(lang: 'zh' | 'en') {
  const filePath = path.join(process.cwd(), 'public', 'locales', lang, 'translation.json');
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Record<string, any>;
  } catch {
    const fallback = path.join(process.cwd(), 'public', 'locales', 'en', 'translation.json');
    const content = await fs.readFile(fallback, 'utf-8');
    return JSON.parse(content) as Record<string, any>;
  }
}

export default async function Footer() {
  // 在服務器端計算當前年份與載入字典
  const currentYear = new Date().getFullYear();
  const lang = await detectLang();
  const dict = await loadDict(lang);

  return (
    <footer className="bg-background border-t border-gray-300 dark:border-gray-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <FooterContent currentYear={currentYear} dict={dict} />
        </div>
      </div>
    </footer>
  );
}