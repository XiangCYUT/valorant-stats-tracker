import Link from 'next/link';

interface FooterContentProps {
  currentYear: number;
  dict: Record<string, any>;
}

export default function FooterContent({ currentYear, dict }: FooterContentProps) {
  const t = (key: string) => key.split('.').reduce((acc: any, k) => (acc ? acc[k] : undefined), dict) ?? key;

  return (
    <>
      {/* 免責聲明 */}
      <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-3xl leading-relaxed">
        {t('footer.disclaimer')}
      </p>
      
      {/* 連結列表 */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
        <Link 
          href="/terms" 
          className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted/50"
        >
          {t('footer.termsOfService')}
        </Link>
        <Link 
          href="/privacy" 
          className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted/50"
        >
          {t('footer.privacyPolicy')}
        </Link>
      </div>
      
      {/* 版權信息 */}
      <p className="text-xs text-muted-foreground text-center">
        {String(t('footer.copyright')).replace('{{year}}', String(currentYear))}
      </p>
    </>
  );
}