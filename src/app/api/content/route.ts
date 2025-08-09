import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

// 快取機制，避免重複讀取檔案
const contentCache: Record<string, any> = {};

export async function GET(request: NextRequest) {
  try {
    // 從 URL 參數中獲取語言
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en-US';

    // 驗證語言參數，只允許特定的語言
    const validLocales = ['zh-TW', 'en-US'];
    const safeLocale = validLocales.includes(locale) ? locale : 'en-US';

    // 檢查快取
    if (contentCache[safeLocale]) {
      return NextResponse.json(contentCache[safeLocale], {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=60',
        },
      });
    }

    // 讀取檔案
    const filePath = path.join(process.cwd(), 'data', `content_${safeLocale}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }
    
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // 儲存到快取
    contentCache[safeLocale] = content;
    
    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('[Server] Error reading content file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
} 