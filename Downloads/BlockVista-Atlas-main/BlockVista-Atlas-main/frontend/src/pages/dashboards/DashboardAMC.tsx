import { useState, useEffect } from 'react';
import AlgoBotPanel from '../../components/atlas/AlgoBotPanel';

const DashboardAMC = () => {
    // ... existing interface ...
    interface BipComponent {
        label: string;
        score: number;
        weight: string;
        color: string;
    }

    // Real Data State
    const [bipData, setBipData] = useState<{
        score: number;
        status: string;
        breakdown: BipComponent[];
    }>({
        score: 0,
        status: 'Loading...',
        breakdown: []
    });

    const [amcData, setAmcData] = useState({
        totalAumDisplay: "...",
        schemeCount: 0,
        mandateRisk: "...",
        managerRisk: "..."
    });

    useEffect(() => {
        // ... existing fetch logic ...
        // 1. Fetch AMC Overview
        fetch('http://localhost:8000/api/v1/amc/overview')
            .then(res => res.json())
            .then(data => setAmcData(data))
            .catch(e => console.error(e));

        // 2. Fetch BIP Score (Using mock endpoint or mapped data)
        // For now, mapping simulated BIP data, eventually wire to /api/v1/bip/score
        fetch('http://localhost:8000/api/v1/bip/score')
            .then(res => res.json())
            .then(data => {
                setBipData({
                    score: data.score || 72,
                    status: data.rating || 'Stable',
                    breakdown: data.components || []
                });
            })
            .catch(() => {
                // Fallback if BIP endpoint not ready
                setBipData({
                    score: 72,
                    status: 'Stable',
                    breakdown: [
                        { label: "Portfolio Stability", score: 78, weight: "25%", color: "bg-blue-500" },
                        { label: "Suitability & Gov", score: 85, weight: "25%", color: "bg-green-500" },
                        { label: "Conc. & Overlap", score: 40, weight: "20%", color: "bg-purple-500" },
                        { label: "Investor Behavior", score: 65, weight: "15%", color: "bg-amber-500" },
                        { label: "Transparency", score: 95, weight: "15%", color: "bg-teal-500" },
                    ]
                });
            });
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">AMC Governance Dashboard</h1>
                <p className="text-terminal-text-muted">Executive Health Snapshot • Fund House Level</p>
            </div>

            {/* Algo Bot Action Panel */}
            <AlgoBotPanel />

            {/* BIP Anchor Widget - Top Section */}
            <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    {/* Left: Score Circle */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-terminal-border bg-terminal-bg">
                            <div className="text-center">
                                <div className="text-4xl font-bold font-mono">{bipData.score}</div>
                                <div className="text-[10px] text-terminal-text-muted uppercase tracking-wider">BIP™ Score</div>
                            </div>
                            {/* Status Ring Color Override based on score */}
                            {/* eslint-disable-next-line */}
                            <div className={`absolute inset-0 rounded-full border-4 ${bipData.score >= 80 ? 'border-green-500' :
                                bipData.score >= 60 ? 'border-blue-400' :
                                    bipData.score >= 40 ? 'border-amber-500' : 'border-red-500'
                                }`}
                                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 70%)' }}></div>
                        </div>
                        <div className={`mt-3 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide border ${bipData.score >= 80 ? 'bg-green-900/30 text-green-400 border-green-500' :
                            bipData.score >= 60 ? 'bg-blue-900/30 text-blue-400 border-blue-400' :
                                bipData.score >= 40 ? 'bg-amber-900/30 text-amber-400 border-amber-500' : 'bg-red-900/30 text-red-400 border-red-500'
                            }`}>
                            Status: {bipData.status}
                        </div>
                    </div>

                    {/* Middle: Title & Description */}
                    <div className="flex-1">
                        <h2 className="text-xl font-bold mb-1">Bhartiya Investment Pulse (BIP™)</h2>
                        <p className="text-terminal-text-muted text-sm mb-4 max-w-lg">
                            A proprietary composite indicator of investment health, suitability, and stability in the Indian context.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {bipData.breakdown.map((item) => {
                                const barStyle = { width: `${item.score}%` };
                                return (
                                    <div key={item.label} className="bg-terminal-bg border border-terminal-border rounded p-2">
                                        <div className="text-[10px] text-terminal-text-muted mb-1 truncate" title={item.label}>{item.label}</div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-lg font-bold font-mono leading-none">{item.score}</span>
                                            <div className="h-1 flex-1 bg-terminal-border rounded-full mb-1">
                                                <div
                                                    className={`h-full rounded-full ${item.color}`}
                                                    style={barStyle}></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Sparkline Placeholder */}
                    <div className="w-full md:w-48 h-24 bg-terminal-bg border border-terminal-border border-dashed rounded flex flex-col items-center justify-center p-2 text-center">
                        <span className="text-xs text-terminal-text-muted mb-1">3Y Trend</span>
                        <div className="flex items-end gap-1 h-10">
                            <div className="w-2 bg-terminal-border h-[40%]"></div>
                            <div className="w-2 bg-terminal-border h-[50%]"></div>
                            <div className="w-2 bg-terminal-border h-[45%]"></div>
                            <div className="w-2 bg-terminal-border h-[60%]"></div>
                            <div className="w-2 bg-blue-500 h-[72%]"></div>
                        </div>
                        <span className="text-[10px] text-green-400 mt-1">▲ 2.4% QoQ</span>
                    </div>
                </div>
            </div>

            {/* KPI Tiles Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total AUM", value: `₹ ${amcData.totalAumDisplay} Cr`, sub: `across ${amcData.schemeCount} schemes` },
                    { label: "Concentration Index", value: "High", sub: "Top 10 hold 65%", alert: true },
                    { label: "Compliance Flags", value: `${amcData.mandateRisk} Risk`, sub: "Mandate Drift Monitor", alert: amcData.mandateRisk !== 'Low' },
                    { label: "Churn Risk", value: "Low", sub: "Annualized 12%" },
                ].map((kpi, i) => (
                    <div key={i} className="bg-terminal-surface border border-terminal-border rounded-lg p-4">
                        <div className="text-sm text-terminal-text-muted mb-1">{kpi.label}</div>
                        <div className={`text-2xl font-bold font-mono mb-1 ${kpi.alert ? 'text-amber-500' : 'text-terminal-text'}`}>
                            {kpi.value}
                        </div>
                        <div className="text-xs text-terminal-text-muted">{kpi.sub}</div>
                    </div>
                ))}
            </div>

            {/* Risk Heatmap Panel */}
            <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Investment Risk Heatmap</h2>
                    <div className="flex gap-4 text-xs text-terminal-text-muted">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div> Critical</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded"></div> Warning</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-900/50 border border-green-500"></div> Stable</div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-center text-sm border-separate border-spacing-2">
                        <thead>
                            <tr>
                                <th className="text-left text-terminal-text-muted font-normal p-2">Risk Factor / Scheme</th>
                                <th className="p-2 bg-terminal-bg rounded">Bluechip Fund</th>
                                <th className="p-2 bg-terminal-bg rounded">Flexi Cap</th>
                                <th className="p-2 bg-terminal-bg rounded">Midcap Opps</th>
                                <th className="p-2 bg-terminal-bg rounded">Small Cap</th>
                                <th className="p-2 bg-terminal-bg rounded">Credit Risk</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RISK_ROWS.map((row, i) => (
                                <tr key={i}>
                                    <td className="text-left font-bold text-terminal-text-muted p-2">{row.factor}</td>
                                    {row.vals.map((val, j) => (
                                        <td key={j} className={`rounded p-3 transition-transform hover:scale-105 cursor-pointer border ${val === 'high' ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)] border-red-600' :
                                            val === 'med' ? 'bg-amber-500 text-black border-amber-600' :
                                                'bg-terminal-bg text-terminal-text-muted border-terminal-border hover:border-green-500 hover:text-green-400'
                                            }`}>
                                            {val === 'high' ? 'CRITICAL' : val === 'med' ? 'WARNING' : 'STABLE'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardAMC;
