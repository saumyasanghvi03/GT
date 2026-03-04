import { useTranslation } from "react-i18next";
import {
  chaitriPunamDevvandans,
  chaitriPunamSignificanceEn,
  chaitriPunamSignificanceGu,
  bhavaYatraStations,
  navpadOliDays,
  ayambilForbiddenEn,
  ayambilAllowedEn,
  ayambilPurposeEn,
  ayambilForbiddenGu,
  ayambilAllowedGu,
  ayambilPurposeGu,
  ashtaprakariPuja,
  parnaInfoEn,
  parnaInfoGu,
  shatrunjayaNames,
  chaitriPunamVidhiPreparations,
  detailedChaitriPunamSteps,
  vidhiMaterials,
  recommendedFruits,
} from "@/data/chaitri-punam";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { WakeLockToggle } from "@/components/ui/WakeLockToggle";
import { KayotsargaCounter } from "@/components/ui/KayotsargaCounter";
import { JsonLd } from "@/components/ui/JsonLd";

export function ChaitriPunamVidhiPage() {
  const { t, i18n } = useTranslation();
  const isGu = i18n.language.startsWith("gu");

  const progressItems = detailedChaitriPunamSteps.map((d) => ({
    id: d.id,
    label: isGu ? d.titleGu : d.titleEn,
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          name: t("chaitriPunam.title"),
          description: t("chaitriPunam.description"),
          inLanguage: i18n.language,
        }}
      />
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="text-center space-y-2">
          <h1 className="font-baloo text-3xl text-saffron-700 dark:text-saffron-700">
            {t("chaitriPunam.title")}
          </h1>
          <p className="text-stone-500 dark:text-stone-700 text-sm">
            {t("chaitriPunam.description")}
          </p>
        </div>

        <div className="flex justify-end">
          <WakeLockToggle />
        </div>

        {/* ── Significance ── */}
        <section className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-5 space-y-3 shadow-sm">
          <h2 className="font-baloo text-lg text-stone-900">
            {t("chaitriPunam.significance")}
          </h2>
          <p className="text-stone-600 leading-relaxed">
            {isGu ? chaitriPunamSignificanceGu : chaitriPunamSignificanceEn}
          </p>
        </section>

        {/* ── Preparations (New) ── */}
        <section className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-5 space-y-3 shadow-sm">
          <h2 className="font-baloo text-lg text-stone-900 flex items-center gap-2">
            <span className="text-saffron-500">◈</span> {t("chaitriPunam.preparations")}
          </h2>
          <p className="text-stone-600 leading-relaxed">
            {isGu ? chaitriPunamVidhiPreparations.gu : chaitriPunamVidhiPreparations.en}
          </p>
        </section>

        {/* ── Materials (New) ── */}
        <section className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-5 space-y-4 shadow-sm">
          <h2 className="font-baloo text-lg text-stone-900 flex items-center gap-2">
            <span className="text-saffron-500">◈</span> {t("chaitriPunam.materials")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              {vidhiMaterials.map((m) => (
                <div key={m.item} className="flex items-start gap-3 p-3 rounded-xl bg-saffron-50/50 dark:bg-saffron-50/30 border border-saffron-100">
                  <span className="font-baloo text-saffron-700 font-bold min-w-[80px]">{m.item}</span>
                  <div className="text-xs space-y-0.5">
                    <p className="text-stone-900 font-medium">{m.qty}</p>
                    <p className="text-stone-500 italic">{m.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-saffron-100/30 p-4 space-y-3 border border-saffron-100">
              <h3 className="font-baloo text-sm font-bold text-saffron-800">{t("chaitriPunam.recommendedFruits")}</h3>
              <ul className="grid grid-cols-2 gap-2">
                {recommendedFruits.map(f => (
                  <li key={f} className="text-xs text-stone-600 flex items-center gap-2">
                    <span className="text-saffron-400">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Names of Shatrunjaya ── */}
        <section className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-5 space-y-4 shadow-sm">
          <h2 className="font-baloo text-lg text-stone-900">
            {t("chaitriPunam.names")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shatrunjayaNames.map((n) => (
              <div
                key={n.nameEn}
                className="rounded-xl border border-saffron-50 dark:border-saffron-100 bg-saffron-50/50 dark:bg-saffron-50/30 px-4 py-3"
              >
                <p className="font-[var(--font-baloo)] text-sm font-semibold text-saffron-700">
                  {isGu ? n.nameGu : n.nameEn}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isGu ? n.meaningGu : n.meaningEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bhava Yatra — Five Stations ── */}
        <section className="space-y-4">
          <div className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-5 space-y-1 shadow-sm">
            <h2 className="font-baloo text-lg text-stone-900">
              {t("chaitriPunam.bhavaYatra")}
            </h2>
            <p className="text-stone-500 text-sm">
              {t("chaitriPunam.bhavaYatraDesc")}
            </p>
          </div>
          {bhavaYatraStations.map((s) => (
            <article
              key={s.id}
              className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-6 space-y-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-saffron-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {s.id}
                </span>
                <h3 className="font-[var(--font-baloo)] text-xl text-stone-900">
                  {isGu ? s.nameGu : s.nameEn}
                </h3>
              </div>
              <p className="text-stone-600 text-sm">
                <span className="font-medium text-stone-700">
                  {t("chaitriPunam.focus")}:{" "}
                </span>
                {isGu ? s.focusGu : s.focusEn}
              </p>
              {(s.verseEn || s.verseGu) && (
                <blockquote className="border-l-2 border-saffron-300 pl-3 italic text-stone-500 text-sm">
                  {isGu ? s.verseGu : s.verseEn}
                </blockquote>
              )}
              {((isGu ? s.actionsGu : s.actionsEn) ?? []).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-stone-500 mb-1">
                    {t("chaitriPunam.actions")}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {(isGu ? s.actionsGu : s.actionsEn)!.map((a) => (
                      <li
                        key={a}
                        className="text-xs px-2 py-1 rounded-full bg-saffron-50 dark:bg-saffron-50/50 text-saffron-700 border border-saffron-100"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </section>

        {/* ── Navpad Ayambil Oli ── */}
        <section className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-5 space-y-4 shadow-sm">
          <div>
            <h2 className="font-baloo text-lg text-stone-900">
              {t("chaitriPunam.navpadOli")}
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              {t("chaitriPunam.navpadOliDesc")}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {navpadOliDays.map((d) => (
              <div
                key={d.day}
                className={`rounded-xl p-3 text-center border ${
                  d.isToday
                    ? "border-saffron-400 bg-saffron-50 dark:bg-saffron-50/50"
                    : "border-stone-100 bg-stone-50 dark:bg-stone-50/20"
                }`}
              >
                <p className="text-xs text-stone-400">
                  {isGu ? "દિ" : "Day"} {d.day}
                </p>
                <p
                  className={`font-[var(--font-baloo)] text-sm mt-0.5 ${
                    d.isToday
                      ? "text-saffron-700"
                      : "text-stone-700"
                  }`}
                >
                  {isGu ? d.entityGu : d.entityEn}
                </p>
                <p className="text-xs text-stone-400 mt-0.5 leading-tight">
                  {isGu ? d.focusGu : d.focusEn}
                </p>
                {d.isToday && (
                  <span className="inline-block mt-1 text-xs px-1.5 py-0.5 rounded-full bg-saffron-500 text-white leading-tight">
                    ★
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Ayambil Rules */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h3 className="font-baloo text-sm font-semibold text-stone-800">
              {t("chaitriPunam.ayambilRules")}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-red-500">
                  {t("forbidden")}
                </p>
                <ul className="space-y-0.5">
                  {(isGu ? ayambilForbiddenGu : ayambilForbiddenEn).map(
                    (item) => (
                      <li
                        key={item}
                        className="text-xs text-stone-500 flex items-center gap-1"
                      >
                        <span className="text-red-400">✕</span> {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-green-600">
                  {t("allowed")}
                </p>
                <ul className="space-y-0.5">
                  {(isGu ? ayambilAllowedGu : ayambilAllowedEn).map((item) => (
                    <li
                      key={item}
                      className="text-xs text-stone-500 flex items-center gap-1"
                    >
                      <span className="text-green-500">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-xs italic text-stone-400">
              <span className="font-medium not-italic">{t("chaitriPunam.purpose")}: </span>
              {isGu ? ayambilPurposeGu : ayambilPurposeEn}
            </p>
          </div>
        </section>

        {/* ── Ashtaprakari Puja (Substances) ── */}
        <section className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-5 space-y-4 shadow-sm">
          <div>
            <h2 className="font-baloo text-lg text-stone-900">
              {t("chaitriPunam.ashtaprakari")}
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              {t("chaitriPunam.ashtaprakariDesc")}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ashtaprakariPuja.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-saffron-50 bg-saffron-50/50 dark:bg-saffron-50/30 p-3 text-center"
              >
                <p className="font-[var(--font-baloo)] text-sm font-semibold text-saffron-700">
                  {isGu ? p.nameGu : p.nameEn}
                </p>
                <p className="text-xs text-stone-500 mt-1 leading-tight">
                  {isGu ? p.meaningGu : p.meaningEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Kayotsarga Counter ── */}
        <section className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-5 space-y-3 shadow-sm">
          <div>
            <h2 className="font-baloo text-lg text-stone-900">
              {t("chaitriPunam.kayotsarga")}
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              {t("chaitriPunam.kayotsargaDesc")}
            </p>
          </div>
          <KayotsargaCounter />
        </section>

        {/* ── Step-by-Step Home Vidhi (Updated) ── */}
        <section className="space-y-4">
          <div className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-5 shadow-sm">
            <h2 className="font-baloo text-lg text-stone-900 mb-4 flex items-center gap-2">
              <span className="text-saffron-500">◈</span> {t("chaitriPunam.stepByStepGuide")}
            </h2>
            <ProgressBar
              storageKey="chaitri-punam-vidhi"
              total={detailedChaitriPunamSteps.length}
              items={progressItems}
            />
          </div>
          {detailedChaitriPunamSteps.map((d) => (
            <article
              key={d.id}
              className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-6 space-y-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-saffron-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {d.id}
                </span>
                <h3 className="font-[var(--font-baloo)] text-xl text-stone-900">
                  {isGu ? d.titleGu : d.titleEn}
                </h3>
              </div>
              <p className="text-stone-600 leading-relaxed">
                {isGu ? d.descGu : d.descEn}
              </p>
            </article>
          ))}
        </section>

        {/* ── Parna ── */}
        <section className="rounded-2xl border border-saffron-100 dark:border-saffron-200/40 bg-white dark:bg-white/90 backdrop-blur-sm p-5 space-y-3 shadow-sm mb-12">
          <h2 className="font-baloo text-lg text-stone-900">
            {t("chaitriPunam.parna")}
          </h2>
          <p className="text-stone-600 leading-relaxed">
            {isGu ? parnaInfoGu : parnaInfoEn}
          </p>
        </section>
      </div>
    </>
  );
}

export default ChaitriPunamVidhiPage;
