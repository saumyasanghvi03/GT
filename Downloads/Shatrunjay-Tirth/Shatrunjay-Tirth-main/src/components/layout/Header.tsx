import { Link } from "react-router-dom";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SearchDialog } from "@/components/search/SearchDialog";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="jain-header">
      <div className="header-inner">
        {/* Om Symbol + Brand */}
        <Link to="/" className="brand-link group">
          <span className="om-symbol">🕉</span>
          <span className="brand-name">Shatrunjay Tirth</span>
        </Link>

        <div className="header-actions">
          <SearchDialog />
          <ThemeToggle />
          <LocaleSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
