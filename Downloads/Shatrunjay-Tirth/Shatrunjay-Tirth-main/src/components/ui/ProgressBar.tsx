import { useProgress } from "@/hooks/useProgress";
import { useTranslation } from "react-i18next";

interface ProgressBarProps {
  storageKey: string;
  total: number;
  items: { id: number; label: string }[];
}

export function ProgressBar({ storageKey, total, items }: ProgressBarProps) {
  const { completed, toggle, reset } = useProgress(storageKey, total);
  const { t } = useTranslation();

  const percentage = Math.round((completed.length / total) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-stone-500 dark:text-saffron-200/60">
          {t("common.progress")}: {completed.length}/{total} ({percentage}%)
        </span>
        {completed.length > 0 && (
          <button
            onClick={reset}
            className="text-xs text-stone-400 hover:text-stone-600 dark:text-saffron-900/50 dark:hover:text-saffron-300 transition-colors"
          >
            {t("common.resetProgress")}
          </button>
        )}
      </div>
      <div className="h-2 rounded-full bg-stone-200 dark:bg-saffron-900/20 overflow-hidden">
        <div
          className="h-full rounded-full bg-saffron-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={completed.includes(item.id)}
              onChange={() => toggle(item.id)}
              className="w-4 h-4 rounded border-stone-300 dark:border-saffron-900/40 text-saffron-500 focus:ring-saffron-500"
            />
            <span
              className={`text-sm transition-colors ${
                completed.includes(item.id)
                  ? "text-stone-400 dark:text-saffron-900/50 line-through"
                  : "text-stone-700 dark:text-saffron-100 group-hover:text-saffron-700 dark:group-hover:text-temple-gold"
              }`}
            >
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

