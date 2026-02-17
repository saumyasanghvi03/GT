import type { NavModule } from '../types/models';

const modules: NavModule[] = [
  'Dashboard',
  'Alpha Radar',
  'BFP Intelligence',
  'Risk Engine (AWRPS)',
  'Portfolio Upload',
  'Forecast Lab',
  'Backtest Lab',
  'Sector Matrix',
  'Execution Desk',
  'Attribution',
  'Compliance',
  'Settings'
];

export const Sidebar = ({ active, onSelect }: { active: NavModule; onSelect: (module: NavModule) => void }) => (
  <aside className="sidebar">
    <h1>Pramana</h1>
    <p className="meta">AMC Internal Terminal</p>
    <nav>
      {modules.map((module) => (
        <button key={module} className={active === module ? 'active' : ''} onClick={() => onSelect(module)}>
          {module}
        </button>
      ))}
    </nav>
  </aside>
);
