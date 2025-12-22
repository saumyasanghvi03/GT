import { useState } from 'react';
import RiskHeatmap from '../components/amc/RiskHeatmap';
import ActionItemList from '../components/amc/ActionItemList';

const AmcDashboard = () => {
    // State for Mock Data
    const [kpiData] = useState({
        totalAum: "2,85,500",
        mandateRisk: "Moderate",
        managerRisk: "High",
        liquidityStatus: "Pass: 10% Shock"
    });

    return (
        <div className="space-y-6 animate-fade-in p-6">
            {/* Header / KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* AUM */}
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group">
                    <div className="z-10">
                        <div className="text-terminal-text-muted text-xs uppercase tracking-wider mb-1">Total AUM</div>
                        <div className="text-3xl font-bold font-mono text-terminal-text">
                            ₹{kpiData.totalAum} <span className="text-lg text-terminal-text-muted">Cr</span>
                        </div>
                    </div>
                </div>

                {/* Mandate Drift */}
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-5 flex flex-col justify-between relative overflow-hidden">
                    <div className="text-terminal-text-muted text-xs uppercase tracking-wider mb-1">AMC Mandate Drift</div>
                    <div className="flex items-center gap-2">
                        <span className="text-amber-500 font-bold flex items-center gap-2 bg-amber-900/20 px-3 py-1 rounded border border-amber-500/50">
                            ⚠️ {kpiData.mandateRisk} Risk
                        </span>
                    </div>
                </div>

                {/* Fund Manager Dependency */}
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-5 flex flex-col justify-between relative overflow-hidden">
                    <div className="text-terminal-text-muted text-xs uppercase tracking-wider mb-1">Fund Manager Dependency</div>
                    <div className="flex items-center gap-2">
                        <span className="text-red-500 font-bold flex items-center gap-2 bg-red-900/20 px-3 py-1 rounded border border-red-500/50">
                            ⚠️ {kpiData.managerRisk} Risk
                        </span>
                    </div>
                </div>

                {/* Liquidity Stress Test */}
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-5 flex flex-col justify-between relative overflow-hidden">
                    <div className="text-terminal-text-muted text-xs uppercase tracking-wider mb-1">Liquidity Stress Test</div>
                    <div className="flex items-center gap-2">
                        <span className="text-green-500 font-bold flex items-center gap-2 bg-green-900/20 px-3 py-1 rounded border border-green-500/50">
                            {kpiData.liquidityStatus}
                        </span>
                    </div>
                </div>
            </div>

            {/* Row 2: Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">

                {/* 1. Action Items (Replaces static list) */}
                <div className="h-full">
                    <ActionItemList />
                </div>

                {/* 2. Cannibalization Alert */}
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-5 flex flex-col relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full"></div>

                    <h3 className="text-lg font-bold mb-4 border-b border-terminal-border pb-2">Internal Cannibalization Alert</h3>

                    <div className="flex items-center gap-3 mb-4 text-amber-500 bg-amber-900/10 p-2 rounded">
                        <span className="text-xl">⚠️</span>
                        <span className="font-bold">High Overlap Detected (&gt;65%)</span>
                    </div>

                    <div className="space-y-4 font-mono text-sm text-terminal-text-muted">
                        <div className="flex items-center justify-between">
                            <span>🔶 Large & Mid Cap Fund</span>
                        </div>
                        <div className="flex items-center justify-between pl-4 border-l-2 border-amber-500/30">
                            <span>vs Focused Equity Fund</span>
                        </div>
                        <div className="flex items-center justify-between pl-4 border-l-2 border-amber-500/30">
                            <span>vs Opportunity Equity Fund</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-4">
                        <button className="w-full py-2 bg-terminal-border hover:bg-terminal-accent/20 text-terminal-text hover:text-terminal-accent transition-all rounded text-sm font-bold uppercase tracking-wide">
                            Rationalize Recommendation
                        </button>
                    </div>
                </div>

                {/* 3. Key Person Risk */}
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-5 flex flex-col">
                    <h3 className="text-lg font-bold mb-4">Key Person Risk Index</h3>
                    <div className="flex gap-4">
                        {/* Person 1 */}
                        <div className="flex-1 bg-terminal-bg rounded p-3 text-center border border-red-500/30">
                            <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full mb-2 overflow-hidden relative">
                                {/* Placeholder Avatar */}
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">IMG</div>
                            </div>
                            <div className="font-bold text-sm">R. Sharma</div>
                            <div className="text-[10px] text-terminal-text-muted mb-2">CIO - Equities</div>
                            <span className="bg-red-900/40 text-red-500 text-[10px] px-2 py-1 rounded border border-red-500">High Dependency</span>
                        </div>
                        {/* Person 2 */}
                        <div className="flex-1 bg-terminal-bg rounded p-3 text-center border border-terminal-border">
                            <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full mb-2 overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">IMG</div>
                            </div>
                            <div className="font-bold text-sm">A. Iyer</div>
                            <div className="text-[10px] text-terminal-text-muted mb-2">Fund Manager</div>
                            <span className="bg-amber-900/40 text-amber-500 text-[10px] px-2 py-1 rounded border border-amber-500">Moderate</span>
                        </div>
                    </div>
                    <div className="mt-auto pt-4 text-center">
                        <span className="text-xs text-terminal-text-muted underline cursor-pointer hover:text-terminal-text">Succession Plan Required</span>
                    </div>
                </div>
            </div>

            {/* Row 3: Risk Heatmap */}
            <div className="grid grid-cols-1">
                <RiskHeatmap />
            </div>
        </div>
    );
};

export default AmcDashboard;
