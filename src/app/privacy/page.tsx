import PrivacyContent from "@/components/privacy/PrivacyContent";

export const dynamic = 'force-static';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Privacy Content - Client Component for translations and data loading */}
        <PrivacyContent />
      </div>
    </div>
  );
} 