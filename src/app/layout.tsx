import './globals.css'
import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import I18nProvider from '@/components/I18nProvider'
import { ThemeProvider } from '@/context/ThemeContext'
import Navbar from "./Navbar"
import Footer from "@/components/Footer"

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Valorant Web Tool',
  description: '您的專屬遊戲戰績分析工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // 確保 documentElement 上只有一個主題類別
                function setTheme(theme) {
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                }
                
                // 避免 hydration 錯誤，在初始渲染時使用一致的淺色主題
                // 讓 ThemeContext 在客戶端掛載後處理實際主題
                setTheme('light');
                
                // 在客戶端 JavaScript 運行後，將檢查系統偏好並更新主題
                
                // 檢查語言設置，移除不支持的語言設置
                const storedLang = localStorage.getItem('lang');
                if (storedLang && storedLang !== 'en' && storedLang !== 'zh') {
                  localStorage.setItem('lang', 'zh');
                  document.documentElement.lang = 'zh';
                } else if (storedLang) {
                  document.documentElement.lang = storedLang;
                }
              } catch (e) {
                // 發生錯誤時使用淺色主題
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
              }
            })();
          `
        }} />
      </head>
      <body className={`${inter.variable} ${roboto_mono.variable} min-h-screen`}>
        <ThemeProvider>
          <I18nProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="mx-auto w-full px-4 flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
