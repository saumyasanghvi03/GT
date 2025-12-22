import { useState } from 'react';

const PerformanceAttribution = () => {
  const [selectedScheme, setSelectedScheme] = useState('SCH001');

  // Mock Attribution Data (Brinson-Fachler)
  const attributionData = [
    { sector: 'Financials', weight: 35, bench: 30, alloc: 0.12, select: 0.45, total: 0.57 },
    { sector: 'Technology', weight: 20, bench: 15, alloc: 0.25, select: -0.15, total: 0.10 },
    { sector: 'Consumer', weight: 15, bench: 20, alloc: -0.05, select: 0.20, total: 0.15 },
    { sector: 'Healthcare', weight: 10, bench: 10, alloc: 0.00, select: -0.30, total: -0.30 },
    { sector: 'Energy', weight: 10, bench: 15, alloc: -0.15, select: 0.10, total: -0.05 },
    { sector: 'Others', weight: 10, bench: 10, alloc: 0.00, select: 0.05, total: 0.05 },
  ];

  const totalActive = attributionData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Performance Attribution</h1>
          <p className="text-terminal-text-muted text-sm">Return decomposition (Brinson-Fachler Model)</p>
        </div>
        <div className="flex gap-4">
          <select
            title="Select Scheme"
            className="bg-terminal-surface border border-terminal-border rounded px-3 py-2 text-sm"
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
          >
            <option value="SCH001">BluChip Equity Direct Growth</option>
            <option value="SCH002">Growth Opportunities Fund</option>
          </select>
          <div className="bg-terminal-surface border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text-muted">
            Benchmark: Nifty 50 TRI
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel: Attribution Table */}
        <div className="lg:col-span-2 bg-terminal-surface border border-terminal-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Sector Attribution Breakdown</h2>
            <span className={`text-xl font-mono font-bold ${totalActive >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              Active Return: {totalActive > 0 ? '+' : ''}{totalActive.toFixed(2)}%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-terminal-bg text-terminal-text-muted uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Sector</th>
                  <th className="px-4 py-3 text-right">Port Wgt</th>
                  <th className="px-4 py-3 text-right">Bench Wgt</th>
                  <th className="px-4 py-3 text-right">Alloc Effect</th>
                  <th className="px-4 py-3 text-right">Select Effect</th>
                  <th className="px-4 py-3 text-right border-l border-terminal-border">Total Effect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terminal-border">
                {attributionData.map((row) => (
                  <tr key={row.sector} className="hover:bg-terminal-bg/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{row.sector}</td>
                    <td className="px-4 py-3 text-right text-terminal-text-muted">{row.weight}%</td>
                    <td className="px-4 py-3 text-right text-terminal-text-muted">{row.bench}%</td>
                    <td className={`px-4 py-3 text-right ${row.alloc >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {row.alloc > 0 ? '+' : ''}{row.alloc.toFixed(2)}%
                    </td>
                    <td className={`px-4 py-3 text-right ${row.select >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {row.select > 0 ? '+' : ''}{row.select.toFixed(2)}%
                    </td>
                    <td className={`px-4 py-3 text-right font-bold border-l border-terminal-border ${row.total >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {row.total > 0 ? '+' : ''}{row.total.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Summary & Context */}
        <div className="space-y-6">
          <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
            <h3 className="text-sm font-bold uppercase text-terminal-text-muted mb-4">Attribution Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Allocation Effect</span>
                  <span className="text-green-400">+0.15%</span>
                </div>
                <div className="h-2 bg-terminal-bg rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[60%]"></div>
                </div>
                <p className="text-xs text-terminal-text-muted mt-1">Value added via sector rotation (Overweight Tech).</p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Selection Effect</span>
                  <span className="text-green-400">+0.37%</span>
                </div>
                <div className="h-2 bg-terminal-bg rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[80%]"></div>
                </div>
                <p className="text-xs text-terminal-text-muted mt-1">Value added via stock picking (HDFC Bank alpha).</p>
              </div>
            </div>
          </div>

          <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
            <h3 className="text-sm font-bold uppercase text-terminal-text-muted mb-4">Rolling Analysis</h3>
            <div className="h-32 flex items-center justify-center border border-dashed border-terminal-border rounded bg-terminal-bg/30">
              <span className="text-xs text-terminal-text-muted">Rolling 3Y Alpha Chart Placeholder</span>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="px-2 py-1 text-[10px] bg-green-900/30 text-green-400 border border-green-900/50 rounded">
                CONSISTENT ALPHA
              </span>
              <span className="px-2 py-1 text-[10px] bg-terminal-bg border border-terminal-border rounded text-terminal-text-muted">
                INFO RATIO: 0.8
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAttribution;
