'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function TermsOfService() {
  const { t, i18n } = useTranslation()
  const [termsData, setTermsData] = useState<any>(null)

  useEffect(() => {
    const loadTermsData = async () => {
      try {
        const currentLang = i18n.language
        const response = await fetch(`/locales/${currentLang}/terms.json`)
        const data = await response.json()
        setTermsData(data)
      } catch (error) {
        console.error('Failed to load terms data:', error)
      }
    }

    loadTermsData()
  }, [i18n.language])

  if (!termsData) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">載入中... / Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          {termsData.title}
        </h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6">
          {/* 一、使用條款的接受 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{termsData.sections.acceptance.title}</h2>
            <p className="text-muted-foreground">{termsData.sections.acceptance.content}</p>
          </section>

          {/* 二、服務簡介 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{termsData.sections.serviceIntro.title}</h2>
            <p className="text-muted-foreground mb-3">{termsData.sections.serviceIntro.content}</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              {termsData.sections.serviceIntro.features.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-3">{termsData.sections.serviceIntro.additional}</p>
          </section>

          {/* 三、Riot API 與資料來源聲明 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{termsData.sections.riotApi.title}</h2>
            <p className="text-muted-foreground mb-3">{termsData.sections.riotApi.content}</p>
            <p className="text-muted-foreground mb-3">{termsData.sections.riotApi.trademark}</p>
            <p className="text-muted-foreground">{termsData.sections.riotApi.disclaimer}</p>
          </section>

          {/* 四、使用者身份與登入限制 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{termsData.sections.userLogin.title}</h2>
            <p className="text-muted-foreground mb-3">{termsData.sections.userLogin.content}</p>
            <p className="text-muted-foreground">{termsData.sections.userLogin.privacy}</p>
          </section>

          {/* 五、使用規則 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{termsData.sections.usageRules.title}</h2>
            <p className="text-muted-foreground mb-3">{termsData.sections.usageRules.content}</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              {termsData.sections.usageRules.rules.map((rule: string, index: number) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </section>

          {/* 六、責任限制與服務中斷 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{termsData.sections.liability.title}</h2>
            <p className="text-muted-foreground">{termsData.sections.liability.content}</p>
          </section>

          {/* 七、服務終止與變更 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{termsData.sections.termination.title}</h2>
            <p className="text-muted-foreground">{termsData.sections.termination.content}</p>
          </section>

          {/* 八、條款修訂 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{termsData.sections.modification.title}</h2>
            <p className="text-muted-foreground">{termsData.sections.modification.content}</p>
          </section>

          {/* 九、聯絡方式 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{termsData.sections.contact.title}</h2>
            <p className="text-muted-foreground mb-2">{termsData.sections.contact.content}</p>
            <p className="text-muted-foreground">{termsData.sections.contact.email}</p>
          </section>

          {/* 十、條款版本 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{termsData.sections.version.title}</h2>
            <p className="text-muted-foreground">{termsData.sections.version.version}</p>
            <p className="text-muted-foreground">{termsData.sections.version.date}</p>
          </section>
        </div>
      </div>
    </div>
  )
} 