const DashboardAdvisor = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Advisor Command Center</h1>
                <p className="text-terminal-text-muted">Client Health • SIP Monitoring • Suitability Actions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Action Queue */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Urgency Actions */}
                    <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="animate-pulse text-red-500">●</span> Immediate Actions
                        </h2>
                        <div className="grid gap-3">
                            {[
                                { type: "SIP FAILURE", client: "Rajesh Kumar", detail: "₹15,000 SIP Failed (Insufficient Funds)", time: "2h ago", color: "red" },
                                { type: "BIRTHDAY", client: "Sneha Gupta", detail: "Turning 45 today. Good time for retirement review?", time: "Today", color: "purple" },
                                { type: "PORTFOLIO", client: "Amit Shah", detail: "Cash balance > ₹5L. Deploy needed.", time: "1d ago", color: "emerald" },
                            ].map((task, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-terminal-bg border border-terminal-border rounded hover:bg-terminal-surface cursor-pointer transition-colors">
                                    <div className={`w-1 self-stretch rounded bg-${task.color}-500`}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-${task.color}-900/30 text-${task.color}-400 border border-${task.color}-500/30`}>{task.type}</span>
                                            <span className="text-xs text-terminal-text-muted">{task.time}</span>
                                        </div>
                                        <div className="font-bold text-base">{task.client}</div>
                                        <div className="text-sm text-terminal-text-muted">{task.detail}</div>
                                    </div>
                                    <button className="self-center px-3 py-1 text-xs border border-terminal-border rounded hover:bg-terminal-accent hover:text-white hover:border-terminal-accent transition-colors">
                                        ACT
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SIP Health Strip */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-terminal-surface border border-terminal-border rounded p-4 text-center">
                            <div className="text-2xl font-bold text-green-400">98.2%</div>
                            <div className="text-xs text-terminal-text-muted uppercase">SIP Persistence</div>
                        </div>
                        <div className="bg-terminal-surface border border-terminal-border rounded p-4 text-center">
                            <div className="text-2xl font-bold text-white">₹ 4.2 Cr</div>
                            <div className="text-xs text-terminal-text-muted uppercase">Monthly Book</div>
                        </div>
                        <div className="bg-terminal-surface border border-terminal-border rounded p-4 text-center">
                            <div className="text-2xl font-bold text-amber-500">₹ 85k</div>
                            <div className="text-xs text-terminal-text-muted uppercase">At Risk</div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Client Health List */}
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Client Health</h2>
                        <button className="text-xs text-terminal-accent hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: "Arun Varma", score: 92, status: "Excellent" },
                            { name: "Priya Singh", score: 88, status: "Good" },
                            { name: "Karan Johar", score: 65, status: "Review Needed", alert: true },
                            { name: "Rahul Dravid", score: 95, status: "Excellent" },
                            { name: "Suresh Raina", score: 72, status: "Stable" },
                        ].map((client, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                <div>
                                    <div className="font-medium text-sm">{client.name}</div>
                                    <div className={`text-[10px] ${client.alert ? 'text-amber-500' : 'text-terminal-text-muted'}`}>{client.status}</div>
                                </div>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border ${client.score >= 90 ? 'border-green-500 text-green-400 bg-green-900/20' :
                                        client.score >= 70 ? 'border-blue-500 text-blue-400 bg-blue-900/20' :
                                            'border-amber-500 text-amber-500 bg-amber-900/20'
                                    }`}>
                                    {client.score}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DashboardAdvisor;
