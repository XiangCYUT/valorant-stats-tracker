import FooterContent from './footer/FooterContent';

export default function Footer() {
  // 在服務器端計算當前年份
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-gray-300 dark:border-gray-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          {/* Footer Content - Client Component for translations */}
          <FooterContent currentYear={currentYear} />
        </div>
      </div>
    </footer>
  );
} 