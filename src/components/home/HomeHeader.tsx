import RiotLoginButton from "@/app/RiotLoginButton";

interface HomeHeaderProps {
  dict: Record<string, string>;
}

export default function HomeHeader({ dict }: HomeHeaderProps) {
  const t = (key: string) => dict[key] ?? key;

  return (
    <div className="bg-gradient-light py-12">
      <header className="text-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">{t("title")}</h1>
        <p className="text-light-900 dark:text-light-300 mb-8 text-lg">{t("description")}</p>
        <div className="flex justify-center">
          <RiotLoginButton />
        </div>
      </header>
    </div>
  );
}