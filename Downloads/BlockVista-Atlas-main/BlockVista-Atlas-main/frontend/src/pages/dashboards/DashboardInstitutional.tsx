import AlgoBotPanel from '../../components/atlas/AlgoBotPanel';

const DashboardInstitutional = () => {
    return (
        <div className="space-y-6">
            <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Institutional Oversight</h1>
                <p className="text-terminal-text-muted">Trustee & Regulator View</p>
            </div>

            <AlgoBotPanel />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risk Anchors */}
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
                    <h2 className="text-lg font-bold mb-6">Systemic Risk Posture</h2>
                    <div className="flex items-center justify-center gap-8">
                        <div className="relative h-48 w-48 flex items-center justify-center">
                            {/* Dial Background */}
                            <div className="absolute inset-0 rounded-full border-[12px] border-terminal-bg border-b-transparent rotate-45"></div>
                            {/* Value Arc */}
                            <div className="absolute inset-0 rounded-full border-[12px] border-green-500 border-l-transparent border-b-transparent border-r-transparent -rotate-45"></div>

                            <div className="text-center">
                                <div className="text-sm text-terminal-text-muted uppercase">Risk Score</div>
                                <div className="text-5xl font-bold text-green-400">Low</div>
                                <div className="text-xs text-terminal-text-muted mt-1">Stable Outlook</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm">Liquidity Coverage: <strong className="text-white">Robust</strong></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm">Credit Quality: <strong className="text-white">AAA Dominant</strong></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                <span className="text-sm">Concentration: <strong className="text-white">Moderate</strong></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit Log Stream */}
                <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6 flex flex-col">
                    <h2 className="text-lg font-bold mb-4">Governance Audit Stream</h2>
                    <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px] pr-2">
                        {[
                            { time: "10:42 AM", user: "System", action: "Compliance Scan Completed", detail: "No violations found in 12 schemes." },
                            { time: "09:15 AM", user: "R. Sharma (CIO)", action: "Risk Limit Override", detail: "Approved temporary exposure hike for HDFC Bank.", alert: true },
                            { time: "Yesterday", user: "Risk Bot", action: "Liquidity Alert", detail: "Small Cap Fund approaching illiquidity threshold." },
                            { time: "Yesterday", user: "Compliance", action: "SEBI Report Generated", detail: "Monthly disclosure pack ready for review." },
                            { time: "18 Dec", user: "System", action: "Data Ingestion", detail: "AMFI NAVs updated successfully." },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-3 text-sm p-2 border-l-2 border-terminal-border bg-terminal-bg/50">
                                <div className="text-xs font-mono text-terminal-text-muted min-w-[60px]">{log.time}</div>
                                <div>
                                    <div className="flex gap-2 items-center">
                                        <span className="font-bold text-terminal-accent">{log.user}</span>
                                        <span className="text-terminal-text-muted text-xs">• {log.action}</span>
                                    </div>
                                    <div className={`text-terminal-text-muted ${log.alert ? 'text-amber-400' : ''}`}>{log.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-xs font-bold bg-terminal-bg border border-terminal-border rounded hover:bg-terminal-border transition-all">
                        EXPORT FULL AUDIT LOG
                    </button>
                </div>
            </div>

            {/* Transparency Matrix */}
            <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4">Transparency & Disclosure Rating</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="text-terminal-text-muted border-b border-terminal-border">
                                <th className="py-2">Fund House</th>
                                <th className="py-2">Disclosure Score</th>
                                <th className="py-2">Risk Reporting</th>
                                <th className="py-2">Attribution Clarity</th>
                                <th className="py-2">Governance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { ame: "Axis Mutual Fund", score: 9.2, risk: "Detailed", attr: "High", gov: "Tier 1" },
                                { ame: "ICICI Prudential", score: 9.0, risk: "Standard", attr: "High", gov: "Tier 1" },
                                { ame: "Aditya Birla SL", score: 8.8, risk: "Detailed", attr: "Medium", gov: "Tier 2" },
                                { ame: "Kotak Mahindra", score: 8.5, risk: "Standard", attr: "Medium", gov: "Tier 2" },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-white/5">
                                    <td className="py-3 font-medium">{row.ame}</td>
                                    <td className="py-3 font-mono text-green-400">{row.score}</td>
                                    <td className="py-3 text-terminal-text-muted">{row.risk}</td>
                                    <td className="py-3 text-terminal-text-muted">{row.attr}</td>
                                    <td className="py-3 text-terminal-text-muted">{row.gov}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default DashboardInstitutional;
