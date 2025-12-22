const InvestorBehavior = () => {
  // Mock Data from API
  const data = {
    segments: [
      { label: "Long-term Disciplined", count: 450, percentage: 45, color: "bg-green-500", textColor: "text-green-500" },
      { label: "Reactive (Panic Seller)", count: 250, percentage: 25, color: "bg-red-500", textColor: "text-red-500" },
      { label: "Return Chaser (Hot Money)", count: 150, percentage: 15, color: "bg-amber-500", textColor: "text-amber-500" },
      { label: "Passive / Dormant", count: 150, percentage: 15, color: "bg-gray-500", textColor: "text-gray-500" },
    ],
    sip_analytics: {
      retention: 92.5,
      churn: 12.0,
      tenure: 34
    },
    panic_risk: "Moderate"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Investor Behavior Intelligence</h1>
          <p className="text-terminal-text-muted text-sm">Capital Quality • Retention • Churn Risk</p>
        </div>
        <div className="bg-terminal-surface border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text-muted">
          Last Updated: 2 min ago
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
          <div className="text-xs text-terminal-text-muted uppercase mb-1">SIP Retention Rate</div>
          <div className="text-2xl font-mono font-bold text-green-500">{data.sip_analytics.retention}%</div>
          <div className="text-xs text-terminal-text-muted mt-1">Best in class: &gt;90%</div>
        </div>
        <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
          <div className="text-xs text-terminal-text-muted uppercase mb-1">Annualized Churn</div>
          <div className="text-2xl font-mono font-bold text-amber-500">{data.sip_analytics.churn}%</div>
          <div className="text-xs text-terminal-text-muted mt-1">High for this category</div>
        </div>
        <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
          <div className="text-xs text-terminal-text-muted uppercase mb-1">Avg Investor Tenure</div>
          <div className="text-2xl font-mono font-bold">{data.sip_analytics.tenure} <span className="text-sm font-normal text-terminal-text-muted">mo</span></div>
          <div className="text-xs text-terminal-text-muted mt-1">~2.8 Years</div>
        </div>
        <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
          <div className="text-xs text-terminal-text-muted uppercase mb-1">Panic Risk Index</div>
          <div className="text-2xl font-mono font-bold text-amber-500">{data.panic_risk}</div>
          <div className="text-xs text-terminal-text-muted mt-1">Watchlist "Reactive" cohort</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel: Segmentation */}
        <div className="lg:col-span-2 bg-terminal-surface border border-terminal-border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Investor Segmentation (Behavioral)</h2>

          <div className="space-y-4">
            {data.segments.map((seg) => {
              const segStyle = { width: `${seg.percentage}%` };
              return (
                <div key={seg.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{seg.label}</span>
                    <span className={`font-mono font-bold ${seg.textColor}`}>{seg.percentage}%</span>
                  </div>
                  <div className="h-4 bg-terminal-bg rounded-full overflow-hidden flex border border-terminal-border/50">
                    <div
                      className={`h-full ${seg.color}`}
                      style={segStyle}></div>
                  </div>
                  <div className="text-xs text-terminal-text-muted mt-1 text-right">
                    {seg.count} Investors
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Actionables */}
        <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
          <h3 className="text-sm font-bold uppercase text-terminal-text-muted mb-4">Recommended Actions</h3>
          <ul className="space-y-4">
            <li className="p-3 bg-terminal-bg border border-terminal-border rounded text-sm relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
              <p className="font-semibold mb-1">Address "Reactive" Churn</p>
              <p className="text-xs text-terminal-text-muted">
                Send "Volatility is Opportunity" educationaler to the 250 investors who stopped SIPs in last dip.
              </p>
              <button className="mt-2 text-xs bg-terminal-surface border border-terminal-border px-2 py-1 rounded hover:bg-terminal-border transition-colors">
                Create Campaign →
              </button>
            </li>
            <li className="p-3 bg-terminal-bg border border-terminal-border rounded text-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
              <p className="font-semibold mb-1">Reward Disciplined Users</p>
              <p className="text-xs text-terminal-text-muted">
                Unlock "Gold Tier" analytics for the 450 long-term investors (&gt;3 yrs tenure).
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InvestorBehavior;
