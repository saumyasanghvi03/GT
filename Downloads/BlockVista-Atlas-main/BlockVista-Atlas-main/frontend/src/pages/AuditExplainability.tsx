

const AuditExplainability = () => {
    // Mock Data from API
    const traces = [
        {
            id: "TRC-20231027-001",
            time: "10:05:23",
            module: "COMPLIANCE",
            event: "Manual Check",
            verdict: "RED",
            confidence: "99%",
            inputs: { profile: "Conservative", beta: 1.4 },
            logic: ["RiskMismatch (Beta > 1.2)"]
        },
        {
            id: "TRC-20231027-002",
            time: "10:05:25",
            module: "BIP_SCORING",
            event: "Daily Batch",
            verdict: "SCORE_72",
            confidence: "100%",
            inputs: { stability: 78, closet: true },
            logic: ["Weighted Avg", "Penalty: Closet"]
        },
        {
            id: "TRC-20231027-003",
            time: "11:15:00",
            module: "SCHEME_INTEL",
            event: "Sim Check",
            verdict: "WARNING",
            confidence: "98%",
            inputs: { sim: 0.96 },
            logic: ["Sim > 0.95"]
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Audit & Explainability</h1>
                <p className="text-terminal-text-muted">
                    Decision traceability and "Glass Box" logic inspection
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Trace Log */}
                <div className="lg:col-span-1 bg-terminal-surface border border-terminal-border rounded-lg p-0 overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b border-terminal-border bg-terminal-bg">
                        <h2 className="text-sm font-bold uppercase text-terminal-text-muted">Recent Automated Decisions</h2>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {traces.map((trace) => (
                            <div key={trace.id} className="p-3 border border-terminal-border rounded bg-terminal-surface hover:bg-terminal-bg cursor-pointer transition-colors group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-mono text-terminal-text-muted">{trace.id}</span>
                                    <span className="text-xs text-terminal-text-muted">{trace.time}</span>
                                </div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm">{trace.module}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${trace.verdict === 'RED' ? 'bg-red-900/30 text-red-400' :
                                        trace.verdict === 'WARNING' ? 'bg-amber-900/30 text-amber-400' :
                                            'bg-blue-900/30 text-blue-400'
                                        }`}>{trace.verdict}</span>
                                </div>
                                <div className="text-xs text-terminal-text-muted truncate">
                                    {trace.event}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Decision Visualizer */}
                <div className="lg:col-span-2 bg-terminal-surface border border-terminal-border rounded-lg p-6 h-[600px] overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4">Decision Trace Visualization</h2>

                    <div className="border border-terminal-border border-dashed rounded-lg p-8 flex flex-col items-center justify-center space-y-4">

                        {/* Input Node */}
                        <div className="flex flex-col items-center">
                            <div className="bg-terminal-bg border border-terminal-border rounded px-4 py-2 text-center w-48 shadow-lg">
                                <div className="text-xs text-terminal-text-muted uppercase">Inputs</div>
                                <div className="font-mono text-sm mt-1">Profile: Conservative</div>
                                <div className="font-mono text-sm">Beta: 1.4</div>
                            </div>
                            <div className="h-8 w-px bg-terminal-border"></div>
                            <div className="text-terminal-text-muted text-xs">passed to</div>
                            <div className="h-8 w-px bg-terminal-border"></div>
                        </div>

                        {/* Logic Node */}
                        <div className="flex flex-col items-center">
                            <div className="bg-terminal-bg border border-blue-500/50 rounded px-4 py-2 text-center w-56 shadow-lg relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-900/80 text-blue-300 text-[10px] px-2 rounded">Compliance Engine</div>
                                <div className="text-xs text-terminal-text-muted uppercase mt-1">Rule Evaluation</div>
                                <div className="font-mono text-sm font-bold text-amber-400 mt-1">RiskMismatch</div>
                                <div className="font-mono text-xs text-terminal-text-muted">Condition: Beta &gt; 1.2</div>
                            </div>
                            <div className="h-8 w-px bg-terminal-border"></div>
                            <div className="text-terminal-text-muted text-xs">yields</div>
                            <div className="h-8 w-px bg-terminal-border"></div>
                        </div>

                        {/* Verdict Node */}
                        <div className="bg-red-900/20 border border-red-500 rounded px-6 py-3 text-center w-48 shadow-lg">
                            <div className="text-xs text-red-400 uppercase">Final Verdict</div>
                            <div className="text-2xl font-bold text-red-500 mt-1">RED</div>
                            <div className="text-[10px] text-red-400/70 mt-1">Confidence: 99%</div>
                        </div>

                        <div className="mt-8 text-xs text-terminal-text-muted max-w-md text-center">
                            <span className="text-blue-400 font-bold">INFO:</span> This decision was logged immutably at 10:05:23 UTC. It triggered a "Suitability Breach" alert designated for the Risk Officer.
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditExplainability;
