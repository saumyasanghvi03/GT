import { useTranslation } from "react-i18next";
import { bhaktamar } from "@/data/bhaktamar";
import { VerseCard } from "@/components/stotra/VerseCard";
import { WakeLockToggle } from "@/components/ui/WakeLockToggle";
import { JsonLd } from "@/components/ui/JsonLd";

export function BhaktamarPage() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          name: t("bhaktamar.title"),
          description: t("bhaktamar.description"),
          author: { "@type": "Person", name: "Acharya Manatunga" },
          inLanguage: i18n.language,
        }}
      />
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-baloo text-3xl text-saffron-700">
            {t("bhaktamar.title")}
          </h1>
          <p className="text-stone-500 dark:text-stone-700 text-sm">
            {t("bhaktamar.description")}
          </p>
          <p className="text-xs text-stone-400">
            {bhaktamar.verses.length} {t("common.verse")}
          </p>
        </div>
        <div className="flex justify-end">
          <WakeLockToggle />
        </div>
        <div className="space-y-4">
          {bhaktamar.verses.map((verse) => (
            <VerseCard key={verse.id} verse={verse} label={t("common.verse")} />
          ))}
        </div>
      </div>
    </>
  );
}

export default BhaktamarPage;
