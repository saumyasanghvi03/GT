import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { JsonLd } from "@/components/ui/JsonLd";

const NAV_SECTIONS = [
  {
    href: "/navkar-mantra",
    key: "navkarMantra",
    icon: "🙏",
    accent: "card-accent-gold",
  },
  {
    href: "/uvasaggaharam-stotra",
    key: "uvasaggaharam",
    icon: "🐍",
    accent: "card-accent-blue",
  },
  {
    href: "/bhaktamar-stotra",
    key: "bhaktamar",
    icon: "📿",
    accent: "card-accent-purple",
  },
  {
    href: "/shatrunjay-yatra",
    key: "shatrunjayYatra",
    icon: "⛰️",
    accent: "card-accent-green",
  },
  {
    href: "/chaityavandan",
    key: "chaityavandan",
    icon: "🪔",
    accent: "card-accent-orange",
  },
  {
    href: "/chaitri-punam-vidhi",
    key: "chaitriPunam",
    icon: "🌕",
    accent: "card-accent-rose",
  },
];

export function HomePage() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Shatrunjay Tirth",
          description: t("home.subtitle"),
          inLanguage: i18n.language,
        }}
      />

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-mandala" aria-hidden="true">
          <div className="mandala-ring mandala-ring-1" />
          <div className="mandala-ring mandala-ring-2" />
          <div className="mandala-ring mandala-ring-3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">🕉 Shwetambar Murtipujak</div>
          <h1 className="hero-title">{t("home.title")}</h1>
          <p className="hero-subtitle">{t("home.subtitle")}</p>
          <div className="hero-divider">
            <span className="hero-divider-dot" />
            <span className="hero-tagline">{t("home.tagline")}</span>
            <span className="hero-divider-dot" />
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <nav className="nav-grid" aria-label="Sections">
        {NAV_SECTIONS.map(({ href, key, icon, accent }) => (
          <Link key={key} to={href} className={`nav-card ${accent} group`}>
            <span className="nav-card-icon">{icon}</span>
            <div className="nav-card-body">
              <h2 className="nav-card-title">{t(`${key}.title`)}</h2>
              <p className="nav-card-desc">{t(`${key}.description`)}</p>
            </div>
            <span className="nav-card-arrow">→</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

export default HomePage;
