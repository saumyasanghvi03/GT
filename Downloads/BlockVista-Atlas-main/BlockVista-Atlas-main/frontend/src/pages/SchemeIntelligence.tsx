import { useState } from 'react';

const SchemeIntelligence = () => {
  const [selectedScheme, setSelectedScheme] = useState('SCH001');

  // Mock Similarity Data
  const similarityData = {
    benchmark_similarity: 0.96,
    is_closet_indexer: true,
    peers: [
      { id: 101, name: "BluChip Peer A", score: 0.98, overlap: 'High' },
      { id: 102, name: "Growth Fund B", score: 0.72, overlap: 'Medium' },
      { id: 103, name: "SmallCap Fund C", score: 0.15, overlap: 'Low' },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Scheme & Product Analytics</h1>
          <p className="text-terminal-text-muted text-sm">Product Strategy • Cannibalization Detection</p>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Similarity List */}
        <div className="lg:col-span-2 bg-terminal-surface border border-terminal-border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Portfolio Similarity (Peers)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-terminal-bg text-terminal-text-muted uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Peer Scheme</th>
                  <th className="px-4 py-3">Similarity Score</th>
                  <th className="px-4 py-3">Overlap Level</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terminal-border">
                {similarityData.peers.map((peer) => (
                  <tr key={peer.id} className="hover:bg-terminal-bg/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{peer.name}</td>
                    <td className="px-4 py-3 font-mono">{(peer.score * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs border ${peer.overlap === 'High' ? 'bg-red-900/30 border-red-500 text-red-500' :
                        peer.overlap === 'Medium' ? 'bg-amber-900/30 border-amber-500 text-amber-500' :
                          'bg-green-900/30 border-green-500 text-green-500'
                        }`}>
                        {peer.overlap.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-terminal-text-muted text-xs">
                      {peer.score > 0.90 ? 'Cannibalization Risk' : 'Distinct Strategy'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Alerts & Drivers */}
        <div className="space-y-6">
          {/* Main Alert Card */}
          <div className={`p-6 rounded-lg border ${similarityData.is_closet_indexer ? 'bg-amber-900/10 border-amber-500/50' : 'bg-green-900/10 border-green-500/50'
            }`}>
            <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${similarityData.is_closet_indexer ? 'text-amber-500' : 'text-green-500'
              }`}>
              {similarityData.is_closet_indexer ? (
                <>
                  ⚠️ CLOSET INDEXER DETECTED
                </>
              ) : (
                <>
                  ✅ TRUE ACTIVE SHARE
                </>
              )}
            </h3>
            <p className="text-sm text-terminal-text-muted mb-4">
              {similarityData.is_closet_indexer
                ? `This fund mirrors 96% of the benchmark. Check if the active fee is justified given the passive exposure.`
                : `This fund demonstrates distinct positioning from the benchmark.`
              }
            </p>
            <div className="flex justify-between items-center bg-terminal-bg p-3 rounded border border-terminal-border">
              <span className="text-xs uppercase text-terminal-text-muted">Benchmark Similarity</span>
              <span className="font-mono font-bold text-lg">{(similarityData.benchmark_similarity * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
            <h3 className="text-sm font-bold uppercase text-terminal-text-muted mb-4">Similarity Drivers</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-terminal-text-muted">Sector Overlap</span>
                <span className="font-bold">High (Finance)</span>
              </li>
              <li className="flex justify-between">
                <span className="text-terminal-text-muted">Market Cap Bias</span>
                <span className="font-bold">Identical (Large)</span>
              </li>
              <li className="flex justify-between">
                <span className="text-terminal-text-muted">Top 10 Holdings</span>
                <span className="font-bold">8/10 Common</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeIntelligence;
