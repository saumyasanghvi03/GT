import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SafetyBanner from './SafetyBanner';

import { useMode } from '../context/ModeContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { mode, setMode, userName, setIsAuthenticated, setUserName } = useMode();

  // Define navigation items with allowed modes
  // Define navigation items with allowed modes
  const allNavigation = [
    { name: 'The Council', path: '/atlas', icon: '🏛️', modes: ['AMC', 'Wealth', 'Advisor', 'Institutional'] },
    { name: 'Dashboard', path: '/', icon: '📊', modes: ['AMC', 'Wealth', 'Advisor', 'Institutional'] },

    // Core Modules
    { name: 'Portfolio Lookthrough', path: '/portfolio-lookthrough', icon: '🔍', modes: ['Wealth', 'Advisor', 'Institutional'] },
    { name: 'Suitability & Compliance', path: '/suitability-compliance', icon: '✓', modes: ['Wealth', 'Advisor', 'Institutional'] },
    { name: 'Performance Attribution', path: '/performance-attribution', icon: '📈', modes: ['AMC', 'Institutional'] },

    // AMC Specific
    { name: 'Scheme Intelligence', path: '/scheme-intelligence', icon: '🧠', modes: ['AMC'] },
    { name: 'Investor Behavior', path: '/investor-behavior', icon: '👥', modes: ['AMC'] },
    { name: 'Distributor 360°', path: '/distributor-analytics', icon: '🏙️', modes: ['AMC'] },
    { name: 'Sales Analytics', path: '/sales-intelligence', icon: '📊', modes: ['AMC'] },

    // Institutional Specific
    { name: 'Audit & Explainability', path: '/audit-trail', icon: '📋', modes: ['Institutional', 'AMC'] },

    // Global
    { name: 'Data & Integrations', path: '/data-integrations', icon: '🔌', modes: ['AMC', 'Wealth', 'Institutional'] },
  ];

  // Filter based on current mode
  const navigation = allNavigation.filter(item => item.modes.includes(mode));

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text">
      {/* Topbar */}
      <header className="bg-terminal-surface border-b border-terminal-border h-16 flex items-center px-6 fixed top-0 left-0 right-0 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-4 text-terminal-text-muted hover:text-terminal-text transition-colors"
          aria-label="Toggle Sidebar"
          title="Toggle Sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center space-x-3 mr-8">
          <div className="text-terminal-accent text-xl font-bold">⬛</div>
          <h1 className="text-xl font-bold hidden md:block">BlockVista Atlas</h1>
        </div>

        {/* Mode Switcher (Global Context Control) */}
        <div className="hidden md:block">
          <div className="flex items-center gap-4">
            {/* Fiscal Year Selector */}
            <div className="relative">
              <select
                className="appearance-none bg-terminal-surface border border-terminal-border rounded px-3 py-1.5 pr-8 text-xs font-mono text-terminal-text focus:border-terminal-accent focus:outline-none cursor-pointer"
                defaultValue="FY24-25"
              >
                <option>FY24-25</option>
                <option>FY23-24</option>
                <option>FY22-23</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-terminal-text-muted">▼</div>
            </div>

            {/* Session Mode Indicator / Switcher */}
            {userName === 'Administrator' ? (
              <div className="relative">
                <select
                  aria-label="Session Mode Selection"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="appearance-none bg-terminal-surface border border-terminal-accent text-terminal-accent rounded px-3 py-1.5 pr-8 text-xs font-bold uppercase tracking-wider focus:outline-none cursor-pointer shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                >
                  <option value="AMC">AMC Mode</option>
                  <option value="Wealth">Wealth Mode</option>
                  <option value="Advisor">Advisor Mode</option>
                  <option value="Institutional">Trustee Mode</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-terminal-accent">▼</div>
              </div>
            ) : (
              <div className="px-3 py-1.5 bg-terminal-surface border border-terminal-border rounded text-xs font-mono text-terminal-text-muted">
                MODE: <span className="text-terminal-accent font-bold">{mode}</span>
              </div>
            )}
            <div className="px-3 py-1.5 bg-terminal-surface border border-terminal-border rounded text-xs font-mono text-terminal-text-muted">
              USER: <span className="text-terminal-accent font-bold">{userName}</span>
            </div>
            <div className="text-xs text-terminal-text-muted flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Connected: Localhost Node
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setUserName('Guest');
              }}
              className="text-xs text-red-500 hover:text-red-400 border border-red-900/30 bg-red-900/10 hover:bg-red-900/20 px-3 py-1 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <span className="text-xs text-terminal-text-muted hidden lg:block">
            Connected: Localhost Node
          </span>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-terminal-surface border-r border-terminal-border transition-all duration-300 ${sidebarOpen ? 'w-64 overflow-y-auto' : 'w-0 overflow-hidden'
          } z-10`}
      >
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                ? 'bg-terminal-accent text-white'
                : 'text-terminal-text-muted hover:bg-terminal-border hover:text-terminal-text'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main
        className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
      >
        {/* Safety Banner (Persistent) */}
        <SafetyBanner />

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
