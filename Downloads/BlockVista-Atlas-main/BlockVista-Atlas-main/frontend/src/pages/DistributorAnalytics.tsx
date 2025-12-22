import { useState, useEffect } from 'react';

const DistributorAnalytics = () => {
    interface Distributor {
        arn: string;
        name: string;
        category: string;
        region: string;
        aum: number;
        inflow: number;
    }

    const [topDistributors, setTopDistributors] = useState<Distributor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from API
        fetch('http://localhost:8000/api/v1/distributors/top?limit=10')
            .then(res => res.json())
            .then(data => {
                setTopDistributors(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch top distributors", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold">Distributor Analytics (360°)</h1>
                    <p className="text-terminal-text-muted text-sm">Channel Partner Performance • Scorecards</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                        Export Report
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
                    <div className="text-xs text-terminal-text-muted uppercase mb-1">Total Active ARNs</div>
                    <div className="text-2xl font-mono font-bold">1,248</div>
                    <div className="text-xs text-green-400 mt-1">↑ 12 this month</div>
                </div>
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
                    <div className="text-xs text-terminal-text-muted uppercase mb-1">Total AUM (Dist)</div>
                    <div className="text-2xl font-mono font-bold">₹ 14,350 Cr</div>
                </div>
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
                    <div className="text-xs text-terminal-text-muted uppercase mb-1">Gross Sales (MTD)</div>
                    <div className="text-2xl font-mono font-bold text-green-400">₹ 450 Cr</div>
                </div>
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
                    <div className="text-xs text-terminal-text-muted uppercase mb-1">Redemption Rate</div>
                    <div className="text-2xl font-mono font-bold text-amber-500">14.2%</div>
                </div>
            </div>

            {/* Top Distributors Table */}
            <div className="bg-terminal-surface border border-terminal-border rounded-lg">
                <div className="p-4 border-b border-terminal-border flex justify-between items-center">
                    <h2 className="text-lg font-bold">Top Distributors Leaderboard</h2>
                    <select
                        title="Sort Distributors"
                        className="bg-terminal-bg border border-terminal-border rounded px-2 py-1 text-xs"
                    >
                        <option>Sort by AUM</option>
                        <option>Sort by Net Inflow</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-terminal-bg text-terminal-text-muted uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Rank</th>
                                <th className="px-4 py-3">Distributor Name</th>
                                <th className="px-4 py-3">ARN Code</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Region</th>
                                <th className="px-4 py-3 text-right">AUM (Cr)</th>
                                <th className="px-4 py-3 text-right">Net Flow (Cr)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-terminal-border">
                            {loading ? (
                                <tr><td colSpan={7} className="text-center py-8">Loading channel data...</td></tr>
                            ) : topDistributors.map((d, index) => (
                                <tr key={d.arn} className="hover:bg-terminal-bg/50 transition-colors group cursor-pointer">
                                    <td className="px-4 py-3 font-mono text-terminal-text-muted">#{index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-blue-400 group-hover:underline">{d.name}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{d.arn}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded text-[10px] bg-terminal-bg border border-terminal-border">
                                            {d.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{d.region}</td>
                                    <td className="px-4 py-3 text-right font-mono font-bold">₹ {d.aum.toFixed(2)}</td>
                                    <td className={`px-4 py-3 text-right font-mono ${d.inflow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {d.inflow > 0 ? '+' : ''}{d.inflow.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DistributorAnalytics;
