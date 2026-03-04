import { useState } from "react";
import { useTranslation } from "react-i18next";

const MAX_COUNT = 150;

export function KayotsargaCounter() {
  const [count, setCount] = useState(0);
  const { t } = useTranslation();
  const percentage = Math.round((count / MAX_COUNT) * 100);

  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={() => setCount((c) => Math.max(0, c - 1))}
          className="w-12 h-12 rounded-full bg-saffron-50 dark:bg-saffron-100 text-saffron-700 text-2xl font-bold border border-saffron-100 dark:border-saffron-200/40 hover:bg-saffron-100 transition-all active:scale-95 shadow-sm"
          aria-label="Decrease"
        >
          −
        </button>
        <div className="text-center min-w-[100px]">
          <span className="font-baloo text-5xl font-bold text-saffron-700 dark:text-saffron-800 drop-shadow-sm">
            {count}
          </span>
          <p className="text-stone-400 dark:text-saffron-300 text-xs font-medium uppercase tracking-wider mt-1">
            {t("common.of")} {MAX_COUNT}
          </p>
        </div>
        <button
          onClick={() => setCount((c) => Math.min(MAX_COUNT, c + 1))}
          className="w-12 h-12 rounded-full bg-saffron-500 text-white text-2xl font-bold hover:bg-saffron-600 dark:bg-saffron-600 dark:hover:bg-saffron-700 transition-all active:scale-95 shadow-lg shadow-saffron-500/20"
          aria-label="Increase"
        >
          +
        </button>
      </div>

      <div className="space-y-2">
        <div className="w-full bg-saffron-50 dark:bg-saffron-100 rounded-full h-3 border border-saffron-100 dark:border-saffron-200/40 p-0.5">
          <div
            className="bg-gradient-to-r from-saffron-400 to-saffron-600 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-right text-[10px] font-bold text-saffron-400 dark:text-saffron-500 tracking-widest uppercase">
          {percentage}% {t("common.completed")}
        </p>
      </div>

      {count === MAX_COUNT && (
        <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 animate-in fade-in zoom-in duration-500">
          <p className="text-sm text-green-600 dark:text-green-400 font-bold flex items-center justify-center gap-2">
            <span>✧</span> {MAX_COUNT} {t("chaitriPunam.kayotsarga")} {t("common.completed")} <span>✧</span>
          </p>
        </div>
      )}

      {count > 0 && (
        <button
          onClick={() => setCount(0)}
          className="w-full text-xs font-semibold text-stone-400 hover:text-saffron-600 dark:text-saffron-300 dark:hover:text-saffron-500 transition-colors uppercase tracking-widest pt-2"
        >
          {t("common.resetProgress")}
        </button>
      )}
    </div>
  );
}

