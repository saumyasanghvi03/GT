import { useTranslation } from "react-i18next";
import { chaityavandanSteps } from "@/data/chaityavandan";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { WakeLockToggle } from "@/components/ui/WakeLockToggle";
import { JsonLd } from "@/components/ui/JsonLd";

export function ChaityavandanPage() {
  const { t, i18n } = useTranslation();
  const isGu = i18n.language.startsWith("gu");

  const progressItems = chaityavandanSteps.map((step) => ({
    id: step.id,
    label: `${t("common.step")} ${step.id}: ${isGu ? step.actionGu.split(":")[0] : step.actionEn.split(":")[0]}`,
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          name: t("chaityavandan.title"),
          description: t("chaityavandan.description"),
          inLanguage: i18n.language,
        }}
      />
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-baloo text-3xl text-saffron-700 dark:text-temple-gold">
            {t("chaityavandan.title")}
          </h1>
          <p className="text-stone-500 dark:text-saffron-200/60 text-sm">
            {t("chaityavandan.description")}
          </p>
        </div>

        <div className="flex justify-end">
          <WakeLockToggle />
        </div>

        <div className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white/80 dark:bg-white/90 backdrop-blur-sm p-5">
          <ProgressBar
            storageKey="chaityavandan"
            total={chaityavandanSteps.length}
            items={progressItems}
          />
        </div>

        <div className="space-y-6">
          {chaityavandanSteps.map((step) => (
            <article
              key={step.id}
              className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-saffron-500 dark:bg-temple-gold dark:text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {step.id}
                </span>
                <h2 className="font-baloo text-xl text-stone-900 dark:text-stone-100">
                  {isGu
                    ? step.actionGu.split(":")[0]
                    : step.actionEn.split(":")[0]}
                </h2>
                {step.genderSpecific && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-200">
                    {t("common.male")}/{t("common.female")}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-saffron-500 dark:text-saffron-600/50">
                  Posture
                </h3>
                {isGu ? (
                  <p className="text-stone-600 dark:text-stone-700 leading-loose">
                    {step.actionGu}
                  </p>
                ) : (
                  <p className="text-stone-600 dark:text-stone-700 leading-relaxed">
                    {step.actionEn}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-saffron-500 dark:text-saffron-600/50">
                  Recitation
                </h3>
                {isGu ? (
                  <p className="text-stone-600 dark:text-stone-800 leading-loose">
                    {step.recitationGu}
                  </p>
                ) : (
                  <p className="text-stone-600 dark:text-stone-800 leading-relaxed">
                    {step.recitationEn}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

export default ChaityavandanPage;
