import AlgoBotPanel from '../../components/atlas/AlgoBotPanel';

const DashboardWealth = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Wealth Governance Overlay</h1>
                <p className="text-terminal-text-muted">Multi-Family Office & HNI Portfolio Standards</p>
            </div>

            <AlgoBotPanel />

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Assets (AUA)", value: "₹ 842 Cr", sub: "Across 145 Families", color: "text-terminal-text" },
                    { label: "Equity / Debt Ratio", value: "65 : 35", sub: "Aggressive Bias", color: "text-blue-400" },
                    { label: "Model Drift", value: "12 Clients", sub: "Critical Deviation", color: "text-amber-500", alert: true },
                    { label: "Cash Drag", value: "₹ 45 Cr", sub: "Undeployed Opportunities", color: "text-green-400" },
                ].map((stat, i) => (
                    <div key={i} className={`bg-terminal-surface border ${stat.alert ? 'border-amber-500/50 bg-amber-900/10' : 'border-terminal-border'} rounded-lg p-4`}>
                        <div className="text-xs text-terminal-text-muted uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className={`text-2xl font-bold font-mono mb-1 ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-terminal-text-muted">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Governance Alerts Panel */}
                <div className="lg:col-span-2 bg-terminal-surface border border-terminal-border rounded-lg p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="text-amber-500">⚠️</span>
                        Governance Exceptions
                    </h2>
                    <div className="space-y-3">
                        {[
                            { client: "Mehta Family Trust", issue: "High Concentration (HDFC Bank > 15%)", risk: "Concentration", severity: "High" },
                            { client: "Dr. R. K. Singhania", issue: "Suitability Mismatch (Smallcap > Profile)", risk: "Suitability", severity: "High" },
                            { client: "Verma Corp Treasury", issue: "Liquidity Constraint (Locked > 3Y)", risk: "Liquidity", severity: "Medium" },
                            { client: "Anjali D'Souza", issue: "Large Cash Drag (>20% Portfolio)", risk: "Efficiency", severity: "Low" },
                        ].map((alert, i) => (
                            <div key={i} className="flex items-center justify-between bg-terminal-bg border border-terminal-border p-3 rounded hover:border-terminal-accent/50 transition-colors cursor-pointer group">
                                <div>
                                    <div className="font-bold text-sm group-hover:text-terminal-accent">{alert.client}</div>
                                    <div className="text-xs text-terminal-text-muted">{alert.issue}</div>
                                </div>
                                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${alert.severity === 'High' ? 'bg-red-900/30 text-red-500 border-red-500' :
                                    alert.severity === 'Medium' ? 'bg-amber-900/30 text-amber-500 border-amber-500' :
                                        'bg-blue-900/30 text-blue-500 border-blue-500'
                                    }`}>
                                    {alert.risk}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-xs font-bold text-terminal-text-muted hover:text-white border border-dashed border-terminal-text-muted/30 rounded hover:border-terminal-accent hover:bg-terminal-accent/10 transition-all">
                        VIEW ALL 12 EXCEPTIONS
                    </button>
                </div>

                {/* AMC Exposure Widget */}
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
                    <h2 className="text-lg font-bold mb-4">AMC Exposure</h2>
                    <div className="space-y-4">
                        {[
                            { amc: "HDFC Mutual Fund", pct: 24, trend: "▲" },
                            { amc: "ICICI Prudential", pct: 18, trend: "▼" },
                            { amc: "SBI Mutual Fund", pct: 15, trend: "-" },
                            { amc: "Nippon India", pct: 12, trend: "▲" },
                            { amc: "Quant Mutual Fund", pct: 8, trend: "▲" },
                        ].map((item, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>{item.amc}</span>
                                    <span className="font-mono">{item.pct}% {item.trend}</span>
                                </div>
                                <div className="h-1.5 w-full bg-terminal-bg rounded-full overflow-hidden">
                                    <div className="h-full bg-terminal-accent rounded-full" style={{ width: `${item.pct}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-3 bg-blue-900/10 border border-blue-500/30 rounded text-xs text-blue-400">
                        <strong>Analyst Note:</strong> Quant MF exposure increased by 2% this quarter. Verify overlap with existing momentum strategies.
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DashboardWealth;
