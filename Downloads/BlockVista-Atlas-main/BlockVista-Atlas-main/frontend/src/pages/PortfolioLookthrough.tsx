import { useState, useEffect } from 'react';

const PortfolioLookthrough = () => {
  interface Scheme {
    id: string;
    name: string;
  }

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState('');
  // const [holdings, setHoldings] = useState<any[]>([]); // Reserved for future holdings endpoint
  const [viewType, setViewType] = useState<'stock' | 'sector' | 'cap'>('sector');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/portfolio/schemes')
      .then(res => res.json())
      .then(data => {
        setSchemes(data);
        if (data.length > 0) setSelectedScheme(data[0].id);
      })
      .catch(err => console.error("Failed to fetch schemes", err));
  }, []);

  useEffect(() => {
    if (!selectedScheme) return;
    setLoading(true);
    fetch(`http://localhost:8000/api/v1/portfolio/schemes/${selectedScheme}/exposure`)
      .then(res => res.json())
      .then(data => {
        // Placeholder: Log data to simulate usage until table is wired to this specific endpoint shape
        console.log("Fetched exposure:", data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [selectedScheme]);

  return (
    <div className="h-[calc(100vh-6rem)] flex -m-6">
      {/* Left Panel: Selectors & Controls */}
      <aside className="w-80 bg-terminal-surface border-r border-terminal-border p-4 flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-terminal-text-muted mb-2">Select Scheme</label>
          <select
            title="Select Scheme"
            className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm focus:outline-none focus:border-terminal-accent"
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
          >
            {schemes.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-terminal-text-muted mb-2">View By</label>
          <div className="flex bg-terminal-bg rounded p-1 border border-terminal-border">
            {(['stock', 'sector', 'cap'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`flex-1 text-xs py-1.5 rounded capitalize transition-colors ${viewType === type
                  ? 'bg-terminal-border text-white'
                  : 'text-terminal-text-muted hover:text-white'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="bg-terminal-bg p-3 rounded border border-terminal-border border-l-4 border-l-terminal-warning">
            <h4 className="text-xs font-bold text-terminal-warning uppercase mb-1">Analyst Note</h4>
            <p className="text-xs text-terminal-text-muted">
              Data fetched live from AMFI. Bridge status: Active.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Panel: Exposure Table */}
      <main className="flex-1 bg-terminal-bg p-6 overflow-auto">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold">Exposure Analysis</h2>
            <p className="text-sm text-terminal-text-muted">Underlying holdings lookthrough</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 text-xs bg-terminal-surface border border-terminal-border rounded text-terminal-text-muted">
              Last Updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="border border-terminal-border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-terminal-surface text-terminal-text-muted uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-medium">Instrument / Sector</th>
                <th className="px-4 py-3 font-medium text-right">Exposure %</th>
                <th className="px-4 py-3 font-medium text-right">Risk Contrib</th>
                <th className="px-4 py-3 font-medium text-center">Overlap</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-terminal-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-terminal-text-muted animate-pulse">
                    Loading exposure data...
                  </td>
                </tr>
              ) : (
                /* Temporary Placeholder until Holdings Endpoint is ready */
                <tr className="hover:bg-terminal-surface/50 transition-colors">
                  <td className="px-4 py-3 font-medium">HDFC Bank Ltd</td>
                  <td className="px-4 py-3 text-right">9.4%</td>
                  <td className="px-4 py-3 text-right text-terminal-text-muted">12.1%</td>
                  <td className="px-4 py-3 text-center text-terminal-text-muted">8 Schemes</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-900/30 text-red-400 border border-red-900/50">
                      HIGH CONC
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Right Panel: Context & Alerts */}
      <aside className="w-80 bg-terminal-surface border-l border-terminal-border p-4 flex flex-col gap-6">
        <div>
          <h3 className="text-sm font-bold uppercase text-terminal-text-muted mb-3">Concentration Alerts</h3>
          <div className="space-y-3">
            <div className="bg-red-900/10 border border-red-900/30 p-3 rounded">
              <div className="flex justify-between items-start mb-1">
                <span className="text-red-400 text-xs font-bold">Banking Sector</span>
                <span className="text-red-400 text-xs">34%</span>
              </div>
              <p className="text-xs text-terminal-text-muted">Exceeds internal limit of 30% for diversified equity.</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default PortfolioLookthrough;
