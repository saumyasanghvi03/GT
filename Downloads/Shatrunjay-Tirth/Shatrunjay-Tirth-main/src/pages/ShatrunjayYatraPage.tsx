import { useTranslation } from "react-i18next";
import { shatrunjayYatraStops } from "@/data/shatrunjay-yatra";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { JsonLd } from "@/components/ui/JsonLd";

export function ShatrunjayYatraPage() {
  const { t, i18n } = useTranslation();
  const isGu = i18n.language.startsWith("gu");

  const progressItems = shatrunjayYatraStops.map((stop) => ({
    id: stop.id,
    label: `${t("common.stop")} ${stop.id}: ${isGu ? stop.nameGu : stop.nameEn}`,
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          name: t("shatrunjayYatra.title"),
          description: t("shatrunjayYatra.description"),
          inLanguage: i18n.language,
        }}
      />
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-baloo text-3xl text-saffron-700 dark:text-saffron-700">
            {t("shatrunjayYatra.title")}
          </h1>
          <p className="text-stone-500 dark:text-saffron-200/60 text-sm">
            {t("shatrunjayYatra.description")}
          </p>
        </div>

        <div className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white/80 dark:bg-white/90 backdrop-blur-sm p-5">
          <ProgressBar
            storageKey="shatrunjay-yatra"
            total={shatrunjayYatraStops.length}
            items={progressItems}
          />
        </div>

        <div className="space-y-6">
          {shatrunjayYatraStops.map((stop) => (
            <article
              key={stop.id}
              className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-saffron-500 dark:bg-saffron-500 dark:text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {stop.id}
                </span>
                <h2 className="font-baloo text-xl text-stone-900 dark:text-stone-100">
                  {isGu ? stop.nameGu : stop.nameEn}
                </h2>
              </div>
              {isGu ? (
                <p className="text-stone-600 dark:text-stone-700 leading-loose">
                  {stop.descriptionGu}
                </p>
              ) : (
                <p className="text-stone-600 dark:text-stone-700 leading-relaxed">
                  {stop.descriptionEn}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

export default ShatrunjayYatraPage;
