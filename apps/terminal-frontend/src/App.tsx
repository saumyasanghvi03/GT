import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { useTerminalStream } from './hooks/useTerminalStream';
import { DashboardPage } from './pages/DashboardPage';
import { ModulePage } from './pages/ModulePage';
import type { NavModule } from './types/models';

export const App = () => {
  const [active, setActive] = useState<NavModule>('Dashboard');
  const { snapshot, streamStatus } = useTerminalStream();

  return (
    <div className="app-shell">
      <Sidebar active={active} onSelect={setActive} />
      <main>
        <header>
          <h2>Pramana Terminal</h2>
          <span className={`status ${streamStatus}`}>Stream: {streamStatus}</span>
        </header>
        {active === 'Dashboard' ? <DashboardPage snapshot={snapshot} /> : <ModulePage module={active} />}
      </main>
    </div>
  );
};
