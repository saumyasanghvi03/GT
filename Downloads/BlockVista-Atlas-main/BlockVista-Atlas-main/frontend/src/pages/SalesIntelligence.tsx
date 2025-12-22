import { useState, useEffect } from 'react';
import IndiaGeoMap from '../components/maps/IndiaGeoMap';

const SalesIntelligence = () => {
    interface RegionData {
        name: string;
        inflow: number;
        aum: number;
    }

    const [regions, setRegions] = useState<RegionData[]>([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/v1/sales/regions')
            .then(res => res.json())
            .then(data => setRegions(data.regions || []))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold">Sales Analytics</h1>
                    <p className="text-terminal-text-muted text-sm">Regional Performance • Sales Heatmap</p>
                </div>
                <div className="bg-terminal-surface border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text-muted">
                    Fiscal Year: FY24-25
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Heatmap Placeholder */}
                <div className="lg:col-span-2 bg-terminal-surface border border-terminal-border rounded-lg p-6 min-h-[400px] flex flex-col">
                    <h2 className="text-lg font-bold mb-4">Pan-India Sales Heatmap</h2>
                    <div className="bg-terminal-bg rounded border border-terminal-border h-[600px] flex items-center justify-center relative overflow-hidden">
                        <IndiaGeoMap />
                    </div>
                </div>

                {/* Right: Regional Breakdown */}
                <div className="space-y-6">
                    <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
                        <h3 className="text-sm font-bold uppercase text-terminal-text-muted mb-4">Zonal Performance</h3>
                        <div className="space-y-4">
                            {regions.map((region) => {
                                const barWidth = { width: `${Math.min(((region.aum / 5000) * 100), 100)}%` };
                                return (
                                    <div key={region.name} className="p-3 bg-terminal-bg rounded border border-terminal-border hover:border-terminal-accent transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold">{region.name} Zone</span>
                                            <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${region.inflow >= 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                                                }`}>
                                                {region.inflow > 0 ? '+' : ''}{region.inflow} Cr
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs text-terminal-text-muted mb-2">
                                            <span>Contribution</span>
                                            <span>{((region.aum / 15000) * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="h-1.5 bg-terminal-surface rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={barWidth}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                            {regions.length === 0 && <p className="text-sm text-terminal-text-muted">Loading zonal data...</p>}
                        </div>
                    </div>

                    <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
                        <h3 className="text-sm font-bold uppercase text-terminal-text-muted mb-4">Top Performing Cities</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between">
                                <span className="text-terminal-text-muted">1. Mumbai</span>
                                <span className="font-mono">₹ 4,200 Cr</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-terminal-text-muted">2. New Delhi</span>
                                <span className="font-mono">₹ 2,800 Cr</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-terminal-text-muted">3. Bengaluru</span>
                                <span className="font-mono">₹ 1,950 Cr</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesIntelligence;
