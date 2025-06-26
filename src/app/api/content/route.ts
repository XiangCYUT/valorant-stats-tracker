import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 快取機制，避免重複讀取檔案
const contentCache: Record<string, any> = {};

export async function GET(request: NextRequest) {
  try {
    // 從 URL 參數中獲取語言
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'zh-TW';

    // 驗證語言參數，只允許特定的語言
    const validLocales = ['zh-TW', 'en-US'];
    const safeLocale = validLocales.includes(locale) ? locale : 'zh-TW';

    // 檢查快取
    if (contentCache[safeLocale]) {
      return NextResponse.json(contentCache[safeLocale]);
    }

    // 讀取檔案
    const filePath = path.join(process.cwd(), 'data', `content_${safeLocale}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // 儲存到快取
    contentCache[safeLocale] = content;
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error reading content file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 