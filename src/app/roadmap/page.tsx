"use client";

import { useTranslation } from 'react-i18next';

export default function RoadmapPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="bg-gradient-light py-12 mb-8">
        <header className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">{t("roadmapTitle")}</h1>
          <p className="text-light-900 dark:text-light-300 mb-8 text-lg">
            {t("roadmapDescription")}
          </p>
        </header>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-500 border-l-4 border-primary-500 pl-3">{t("completedFeatures")}</h2>
          
          <div className="space-y-6">
            <div className="panel">
              <h3 className="text-xl font-bold mb-3 text-light-900 dark:text-light-100">{t("v01Title")}</h3>
              <ul className="list-disc ml-6 space-y-2 text-light-800 dark:text-light-300">
                <li>{t("riotApiIntegration")}</li>
                <li>{t("multiLanguageSupport")}</li>
              </ul>
            </div>

            <div className="panel">
              <h3 className="text-xl font-bold mb-3 text-light-900 dark:text-light-100">{t("v02Title")}</h3>
              <ul className="list-disc ml-6 space-y-2 text-light-800 dark:text-light-300">
                <li>{t("darkLightTheme")}</li>
                <li>{t("autoDetectTheme")}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-500 border-l-4 border-primary-500 pl-3">{t("inProgressFeatures")}</h2>
          
          <div className="panel-accent">
            <h3 className="text-xl font-bold mb-3 text-light-900 dark:text-light-100">{t("v04Title")}</h3>
            <ul className="list-disc ml-6 space-y-2 text-light-800 dark:text-light-300">
              <li>{t("rsoOauth")}</li>
              <li>{t("userProfile")}</li>
              <li>{t("recentMatches")}</li>
              <li>{t("basicStats")}</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-500 border-l-4 border-primary-500 pl-3">{t("futurePlans")}</h2>
          
          <div className="space-y-6">
            <div className="panel-success">
              <h3 className="text-xl font-bold mb-3 text-light-900 dark:text-light-100">{t("v10Title")}</h3>
              <ul className="list-disc ml-6 space-y-2 text-light-800 dark:text-light-300">
                <li>{t("hitLocationCharts")}</li>
                <li>{t("topAgentMapStats")}</li>
                <li>{t("statsCardGeneration")}</li>
                <li>{t("mobileOptimization")}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-500 border-l-4 border-primary-500 pl-3">{t("techStack")}</h2>
          
          <div className="panel bg-gradient-soft">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-light-900 dark:text-light-100">{t("frontendTech")}</h3>
                <ul className="list-disc ml-6 space-y-2 text-light-800 dark:text-light-300">
                  <li>{t("nextjs")}</li>
                  <li>{t("typescript")}</li>
                  <li>{t("tailwindCss")}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-light-900 dark:text-light-100">{t("backendTech")}</h3>
                <ul className="list-disc ml-6 space-y-2 text-light-800 dark:text-light-300">
                  <li>{t("nextRouteHandlers")}</li>
                  <li>{t("riotApiIntegrationTech")}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 