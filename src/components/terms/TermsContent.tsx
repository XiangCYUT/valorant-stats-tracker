interface TermsContentProps {
  data: any;
}

export default function TermsContent({ data }: TermsContentProps) {
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-8">
        {data.title}
      </h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6">
        {/* 一、使用條款的接受 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.acceptance.title}</h2>
          <p className="text-muted-foreground">{data.sections.acceptance.content}</p>
        </section>

        {/* 二、服務簡介 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.serviceIntro.title}</h2>
          <p className="text-muted-foreground mb-3">{data.sections.serviceIntro.content}</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            {data.sections.serviceIntro.features.map((feature: string, index: number) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-3">{data.sections.serviceIntro.additional}</p>
        </section>

        {/* 三、Riot API 與資料來源聲明 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.riotApi.title}</h2>
          <p className="text-muted-foreground mb-3">{data.sections.riotApi.content}</p>
          <p className="text-muted-foreground mb-3">{data.sections.riotApi.trademark}</p>
          <p className="text-muted-foreground">{data.sections.riotApi.disclaimer}</p>
        </section>

        {/* 四、使用者身份與登入限制 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.userLogin.title}</h2>
          <p className="text-muted-foreground mb-3">{data.sections.userLogin.content}</p>
          <p className="text-muted-foreground">{data.sections.userLogin.privacy}</p>
        </section>

        {/* 五、使用規則 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.usageRules.title}</h2>
          <p className="text-muted-foreground mb-3">{data.sections.usageRules.content}</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            {data.sections.usageRules.rules.map((rule: string, index: number) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </section>

        {/* 六、責任限制與服務中斷 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.liability.title}</h2>
          <p className="text-muted-foreground">{data.sections.liability.content}</p>
        </section>

        {/* 七、服務終止與變更 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.termination.title}</h2>
          <p className="text-muted-foreground">{data.sections.termination.content}</p>
        </section>

        {/* 八、管轄法律與司法管轄權 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.jurisdiction.title}</h2>
          <p className="text-muted-foreground">{data.sections.jurisdiction.content}</p>
        </section>

        {/* 九、條款修訂 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.modification.title}</h2>
          <p className="text-muted-foreground">{data.sections.modification.content}</p>
        </section>

        {/* 十、聯絡方式 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{data.sections.contact.title}</h2>
          <p className="text-muted-foreground">{data.sections.contact.content}</p>
        </section>

        {/* 條款版本 */}
        <section>
          <p className="text-muted-foreground">{data.sections.version.version}</p>
          <p className="text-muted-foreground">{data.sections.version.date}</p>
        </section>
      </div>
    </>
  );
}