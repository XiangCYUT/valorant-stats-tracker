'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* 免責聲明 */}
          <p className="text-sm text-muted-foreground text-center">
            {t('footer.disclaimer')}
          </p>
          
          {/* 連結列表 */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link 
              href="/terms" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('footer.termsOfService')}
            </Link>
            <Link 
              href="/privacy" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('footer.privacyPolicy')}
            </Link>
          </div>
          
          {/* 版權信息 */}
          <p className="text-xs text-muted-foreground text-center">
            {t('footer.copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  )
} 