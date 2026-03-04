import { useTranslation } from "react-i18next";
import { navkarMantra } from "@/data/navkar-mantra";
import { VerseCard } from "@/components/stotra/VerseCard";
import { WakeLockToggle } from "@/components/ui/WakeLockToggle";
import { JsonLd } from "@/components/ui/JsonLd";

export function NavkarMantraPage() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          name: t("navkarMantra.title"),
          description: t("navkarMantra.description"),
          inLanguage: i18n.language,
        }}
      />
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-baloo text-3xl text-saffron-700">
            {t("navkarMantra.title")}
          </h1>
          <p className="text-stone-500 dark:text-stone-700 text-sm">
            {t("navkarMantra.description")}
          </p>
        </div>
        <div className="flex justify-end">
          <WakeLockToggle />
        </div>
        <div className="space-y-4">
          {navkarMantra.verses.map((verse) => (
            <VerseCard key={verse.id} verse={verse} label={t("common.verse")} />
          ))}
        </div>
      </div>
    </>
  );
}

export default NavkarMantraPage;
