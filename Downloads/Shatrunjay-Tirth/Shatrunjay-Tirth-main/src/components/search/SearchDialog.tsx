import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getSearchInstance } from "@/lib/search";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { title: string; href: string; snippet: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, i18n } = useTranslation("common");
  const locale = i18n.language;
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const search = useCallback(
    (q: string) => {
      setQuery(q);
      if (q.length < 2) {
        setResults([]);
        return;
      }
      const fuse = getSearchInstance();
      const r = fuse.search(q, { limit: 8 });
      setResults(
        r.map((item) => ({
          title: locale === "gu" ? item.item.titleGu : item.item.title,
          href: item.item.href,
          snippet: item.item.snippet,
        }))
      );
    },
    [locale]
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="p-2 rounded-lg hover:bg-saffron-100 dark:hover:bg-stone-800 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setOpen(false);
              setQuery("");
              setResults([]);
            }}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-saffron-100 dark:border-stone-800 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 dark:border-stone-800">
              <svg
                className="w-5 h-5 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => search(e.target.value)}
                placeholder={t("search")}
                className="flex-1 bg-transparent outline-none text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
              />
            </div>
            {results.length > 0 && (
              <ul className="max-h-80 overflow-y-auto py-2">
                {results.map((r) => (
                  <li key={r.href + r.title}>
                    <button
                      onClick={() => {
                        navigate(r.href);
                        setOpen(false);
                        setQuery("");
                        setResults([]);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-saffron-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {r.title}
                      </div>
                      <div className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                        {r.snippet}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {query.length >= 2 && results.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-stone-400">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
