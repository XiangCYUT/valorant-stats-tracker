"use client";

import Profile from "./Profile";
import Shop from "./Shop";
import RealApi from "./RealApi";
import { useTranslation } from 'react-i18next';
import RiotLoginButton from "./RiotLoginButton";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="w-full">
      <div className="bg-gradient-light py-12 mb-8">
        <header className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">{t("title")}</h1>
          <p className="text-light-900 dark:text-light-300 mb-8 text-lg">{t("description")}</p>
          <div className="flex justify-center">
            <RiotLoginButton />
          </div>
        </header>
      </div>

      <div className="space-y-8 flex flex-col items-center">
        <RealApi />
        <Profile />
        <Shop />
      </div>
    </div>
  );
}
