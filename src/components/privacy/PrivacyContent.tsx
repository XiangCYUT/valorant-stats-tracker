"use client";

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function PrivacyContent() {
  const { t, i18n } = useTranslation();
  const [privacyData, setPrivacyData] = useState<any>(null);

  useEffect(() => {
    const loadPrivacyData = async () => {
      try {
        const currentLang = i18n.language;
        const response = await fetch(`/locales/${currentLang}/privacy.json`);
        const data = await response.json();
        setPrivacyData(data);
      } catch (error) {
        // 靜默處理錯誤
      }
    };

    loadPrivacyData();
  }, [i18n.language]);

  if (!privacyData) {
    return (
      <div className="text-center">載入中... / Loading...</div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-8">
        {privacyData.title}
      </h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6">
        {/* 前言 */}
        <section>
          <p className="text-muted-foreground">{privacyData.intro}</p>
        </section>

        {/* 一、我們蒐集哪些資料？ */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{privacyData.sections.dataCollection.title}</h2>
          <p className="text-muted-foreground mb-3">{privacyData.sections.dataCollection.content}</p>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            {privacyData.sections.dataCollection.types.map((type: string, index: number) => (
              <li key={index}>{type}</li>
            ))}
          </ol>
          <p className="text-muted-foreground mt-3">{privacyData.sections.dataCollection.storage}</p>
        </section>

        {/* 二、Cookies 與其他技術 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{privacyData.sections.cookies.title}</h2>
          <p className="text-muted-foreground mb-3">{privacyData.sections.cookies.content}</p>
          <p className="text-muted-foreground">{privacyData.sections.cookies.recaptcha}</p>
        </section>

        {/* 三、資料的用途 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{privacyData.sections.dataUsage.title}</h2>
          <p className="text-muted-foreground mb-3">{privacyData.sections.dataUsage.content}</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            {privacyData.sections.dataUsage.purposes.map((purpose: string, index: number) => (
              <li key={index}>{purpose}</li>
            ))}
          </ul>
        </section>

        {/* 四、資料的保留與儲存 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{privacyData.sections.dataRetention.title}</h2>
          <p className="text-muted-foreground">{privacyData.sections.dataRetention.content}</p>
        </section>

        {/* 五、資料安全 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{privacyData.sections.dataSecurity.title}</h2>
          <p className="text-muted-foreground">{privacyData.sections.dataSecurity.content}</p>
        </section>

        {/* 六、關於登入與年齡 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{privacyData.sections.loginAge.title}</h2>
          <p className="text-muted-foreground">{privacyData.sections.loginAge.content}</p>
        </section>

        {/* 七、第三方服務 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{privacyData.sections.thirdParty.title}</h2>
          <p className="text-muted-foreground mb-2">{privacyData.sections.thirdParty.content}</p>
          <a 
            href={privacyData.sections.thirdParty.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            {privacyData.sections.thirdParty.link}
          </a>
        </section>

        {/* 八、使用者權利 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{privacyData.sections.userRights.title}</h2>
          <p className="text-muted-foreground mb-3">{privacyData.sections.userRights.content}</p>
          <p className="text-muted-foreground">{privacyData.sections.userRights.additional}</p>
        </section>

        {/* 九、政策異動 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{privacyData.sections.policyChanges.title}</h2>
          <p className="text-muted-foreground">{privacyData.sections.policyChanges.content}</p>
        </section>

        {/* 十、聯絡方式 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{privacyData.sections.contact.title}</h2>
          <p className="text-muted-foreground mb-2">{privacyData.sections.contact.content}</p>
          <p className="text-muted-foreground">{privacyData.sections.contact.email}</p>
        </section>

        {/* 版本資訊 */}
        <section>
          <p className="text-muted-foreground">{privacyData.sections.version.version}</p>
          <p className="text-muted-foreground">{privacyData.sections.version.date}</p>
        </section>
      </div>
    </>
  );
} 