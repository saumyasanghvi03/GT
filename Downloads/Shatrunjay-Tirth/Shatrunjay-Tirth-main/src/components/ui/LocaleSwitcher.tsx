import { useTranslation } from "react-i18next";

export function LocaleSwitcher() {
  const { i18n } = useTranslation();

  function switchLocale() {
    // If it comes as en-US, take the first part
    const curr = i18n.language.split('-')[0];
    const next = curr === "en" ? "gu" : "en";
    i18n.changeLanguage(next);
  }

  return (
    <button
      onClick={switchLocale}
      className="px-3 py-1 text-sm rounded-lg border border-saffron-200 dark:border-stone-700 hover:bg-saffron-50 dark:hover:bg-stone-800 transition-colors"
    >
      {i18n.language.startsWith("en") ? "ગુજ" : "EN"}
    </button>
  );
}
