import { useState } from 'react';

const SuitabilityCompliance = () => {
  const [selectedProfile, setSelectedProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('conservative');

  const getVerdict = (profile: string) => {
    if (profile === 'conservative') return { status: 'RED', score: 45, label: 'HIGH RISK MISMATCH' };
    if (profile === 'moderate') return { status: 'AMBER', score: 72, label: 'MODERATE MISMATCH' };
    return { status: 'GREEN', score: 98, label: 'COMPLIANT' };
  };

  const verdict = getVerdict(selectedProfile);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Suitability & Compliance</h1>
          <p className="text-terminal-text-muted text-sm">Governance Logic • Regulatory Defensibility</p>
        </div>
        <select
          title="Select Profile"
          className="bg-terminal-surface border border-terminal-border rounded px-3 py-2 text-sm"
          value={selectedProfile}
          onChange={(e) => setSelectedProfile(e.target.value as any)}
        >
          <option value="conservative">Investor Profile: Conservative</option>
          <option value="moderate">Investor Profile: Moderate</option>
          <option value="aggressive">Investor Profile: Aggressive</option>
        </select>
      </div>

      {/* Top Section: Verdict Card */}
      <div className={`border rounded-lg p-6 flex items-center justify-between ${verdict.status === 'RED' ? 'bg-red-900/10 border-red-900/50' :
        verdict.status === 'AMBER' ? 'bg-amber-900/10 border-amber-900/50' :
          'bg-green-900/10 border-green-900/50'
        }`}>
        <div className="flex items-center gap-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 ${verdict.status === 'RED' ? 'border-red-500 text-red-500' :
            verdict.status === 'AMBER' ? 'border-amber-500 text-amber-500' :
              'border-green-500 text-green-500'
            }`}>
            {verdict.status}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">{verdict.label}</h2>
            <p className="text-terminal-text-muted text-sm max-w-md">
              {verdict.status === 'RED' ? 'Critical suitability breach detected. Portfolio risk characteristics fundamentally misalign with investor constraints.' :
                verdict.status === 'AMBER' ? 'Minor deviations detected. Concentration limits approached but not breached.' :
                  'Portfolio is fully aligned with the stated investment policy statement.'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-terminal-text-muted mb-1">Confidence Score</div>
          <div className="text-3xl font-mono font-bold">99.8%</div>
          <div className="text-xs text-terminal-text-muted mt-1">Deterministic Rule Set v4.2</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Middle Section: Mismatch Matrix */}
        <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Mismatch Matrix</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-terminal-bg rounded border border-terminal-border">
              <div>
                <span className="text-xs text-terminal-text-muted uppercase block">Risk Profile</span>
                <span className="font-bold">{selectedProfile.charAt(0).toUpperCase() + selectedProfile.slice(1)}</span>
              </div>
              <div className="text-2xl text-terminal-text-muted">vs</div>
              <div className="text-right">
                <span className="text-xs text-terminal-text-muted uppercase block">Portfolio Risk</span>
                <span className={`font-bold ${verdict.status === 'RED' ? 'text-red-400' : 'text-terminal-text'}`}>
                  High Beta (1.4)
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-terminal-bg rounded border border-terminal-border">
              <div>
                <span className="text-xs text-terminal-text-muted uppercase block">Inv Horizon</span>
                <span className="font-bold">5+ Years</span>
              </div>
              <div className="text-2xl text-terminal-text-muted">vs</div>
              <div className="text-right">
                <span className="text-xs text-terminal-text-muted uppercase block">Asset Duration</span>
                <span className="font-bold">Short Term (&lt; 1 Yr)</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-terminal-bg rounded border border-terminal-border">
              <div>
                <span className="text-xs text-terminal-text-muted uppercase block">Conc Limit</span>
                <span className="font-bold">Max 30% Sector</span>
              </div>
              <div className="text-2xl text-terminal-text-muted">vs</div>
              <div className="text-right">
                <span className="text-xs text-terminal-text-muted uppercase block">Allocation</span>
                <span className="font-bold text-amber-400">34% Financials</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Reason Codes */}
        <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Reason Codes</h3>
          <div className="space-y-3">
            {verdict.status === 'RED' && (
              <div className="flex gap-3 items-start">
                <span className="text-red-500 font-mono text-xs mt-1">[RISK_MISMATCH]</span>
                <p className="text-sm text-terminal-text-muted">
                  Total portfolio volatility (22%) exceeds client risk tolerance threshold (12%) defined in KYC document dated 2023-01-15.
                </p>
              </div>
            )}
            {(verdict.status === 'RED' || verdict.status === 'AMBER') && (
              <div className="flex gap-3 items-start">
                <span className="text-amber-500 font-mono text-xs mt-1">[SECTOR_CONC]</span>
                <p className="text-sm text-terminal-text-muted">
                  Financial Services exposure (34%) exceeds the 30% soft limit set for Diversified Equity portfolios.
                </p>
              </div>
            )}
            {verdict.status === 'GREEN' && (
              <div className="flex gap-3 items-start">
                <span className="text-green-500 font-mono text-xs mt-1">[ALL_CLEAR]</span>
                <p className="text-sm text-terminal-text-muted">
                  No breaches detected across 12 rule categories.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-terminal-border">
              <h4 className="text-xs font-bold text-terminal-text-muted uppercase mb-2">Assumptions Used</h4>
              <ul className="list-disc list-inside text-xs text-terminal-text-muted space-y-1">
                <li>Risk calculation uses 3-year rolling volatility.</li>
                <li>Sector classifications based on AMFI level 2 definitions.</li>
                <li>Horizon matching assumes linear decay of liquidity needs.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuitabilityCompliance;
