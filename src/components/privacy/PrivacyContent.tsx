interface PrivacyContentProps {
  data: any;
}

export default function PrivacyContent({ data }: PrivacyContentProps) {
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-8">
        {data.title}
      </h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6">
        {/* 前言 */}
        <section>
          <p className="text-muted-foreground">{data.intro}</p>
        </section>

        {/* 一、我們蒐集哪些資料？ */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.dataCollection.title}</h2>
          <p className="text-muted-foreground mb-3 whitespace-pre-line">{data.sections.dataCollection.content}</p>
          <ul className="list-none pl-6 space-y-2 text-muted-foreground">
            {data.sections.dataCollection.types.map((type: string, index: number) => (
              <li key={index}>{type}</li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-3">{data.sections.dataCollection.storage}</p>
        </section>

        {/* 二、我們如何儲存與保護資料 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.dataStorage.title}</h2>
          <p className="text-muted-foreground whitespace-pre-line">{data.sections.dataStorage.content}</p>
        </section>

        {/* 三、Cookies 與其他技術 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.cookies.title}</h2>
          <p className="text-muted-foreground mb-3">{data.sections.cookies.content}</p>
          <p className="text-muted-foreground">{data.sections.cookies.recaptcha}</p>
        </section>

        {/* 四、資料的用途 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.dataUsage.title}</h2>
          <p className="text-muted-foreground whitespace-pre-line">{data.sections.dataUsage.content}</p>
        </section>

        {/* 五、資料安全 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.dataSecurity.title}</h2>
          <p className="text-muted-foreground">{data.sections.dataSecurity.content}</p>
        </section>

        {/* 六、關於登入與年齡 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.loginAge.title}</h2>
          <p className="text-muted-foreground">{data.sections.loginAge.content}</p>
        </section>

        {/* 七、第三方服務 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.thirdParty.title}</h2>
          <p className="text-muted-foreground whitespace-pre-line">{data.sections.thirdParty.content}</p>
        </section>

        {/* 八、使用者權利 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.userRights.title}</h2>
          <p className="text-muted-foreground mb-3">{data.sections.userRights.content}</p>
          <p className="text-muted-foreground">{data.sections.userRights.additional}</p>
        </section>

        {/* 九、政策異動 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.policyChanges.title}</h2>
          <p className="text-muted-foreground">{data.sections.policyChanges.content}</p>
        </section>

        {/* 十、聯絡方式 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.contact.title}</h2>
          <p className="text-muted-foreground">{data.sections.contact.content}</p>
        </section>

        {/* 版本資訊 */}
        <section>
          <p className="text-muted-foreground">{data.sections.version.version}</p>
          <p className="text-muted-foreground">{data.sections.version.date}</p>
        </section>
      </div>
    </>
  );
}