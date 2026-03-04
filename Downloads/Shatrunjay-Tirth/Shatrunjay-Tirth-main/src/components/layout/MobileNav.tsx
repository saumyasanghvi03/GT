import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const navItems = [
    { href: "/navkar-mantra", label: t("nav.navkarMantra") },
    { href: "/uvasaggaharam-stotra", label: t("nav.uvasaggaharam") },
    { href: "/bhaktamar-stotra", label: t("nav.bhaktamar") },
    { href: "/shatrunjay-yatra", label: t("nav.shatrunjayYatra") },
    { href: "/chaityavandan", label: t("nav.chaityavandan") },
    { href: "/chaitri-punam-vidhi", label: t("nav.chaitriPunam") },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t("common.menu")}
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute right-0 top-0 bottom-0 w-72 bg-marble dark:bg-stone-950 p-6 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <span className="font-[var(--font-baloo)] text-lg text-saffron-700 dark:text-temple-gold">
                Shatrunjay Tirth
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label={t("common.close")}
                className="p-2 rounded-lg hover:bg-saffron-100 dark:hover:bg-stone-800"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-saffron-50 dark:hover:bg-stone-800 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
