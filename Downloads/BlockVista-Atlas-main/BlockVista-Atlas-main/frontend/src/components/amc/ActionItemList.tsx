

const ActionItemList = () => {
    const actions = [
        { id: 1, priority: 'High', type: 'Liquidity', desc: 'Reduce Mid-Cap exposure in "Balanced Fund" to <45%', status: 'Pending' },
        { id: 2, priority: 'High', type: 'Credit', desc: 'Exit "ABC Corp Bond" due to downgrade watch', status: 'Pending' },
        { id: 3, priority: 'Medium', type: 'Cannibalization', desc: 'Differentiation strategy for "Flexi Cap" vs "Large Cap"', status: 'In Review' },
        { id: 4, priority: 'Low', type: 'Compliance', desc: 'Update SID for new SEBI categorization norms', status: 'Scheduled' },
    ];

    return (
        <div className="bg-terminal-surface border border-terminal-border rounded-lg p-5 flex flex-col h-full">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>✅</span> Action Items
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {actions.map((action) => (
                    <div key={action.id} className="bg-terminal-bg border border-terminal-border p-3 rounded hover:border-terminal-accent/50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${action.priority === 'High' ? 'bg-red-900/20 text-red-500 border-red-500/30' :
                                action.priority === 'Medium' ? 'bg-amber-900/20 text-amber-500 border-amber-500/30' :
                                    'bg-blue-900/20 text-blue-500 border-blue-500/30'
                                }`}>
                                {action.priority}
                            </span>
                            <span className="text-[10px] text-terminal-text-muted">{action.type}</span>
                        </div>
                        <p className="text-sm font-medium text-terminal-text group-hover:text-white transition-colors">{action.desc}</p>
                        <div className="mt-3 flex justify-between items-center">
                            <span className="text-xs text-terminal-text-muted">Status: {action.status}</span>
                            <button className="text-xs bg-terminal-surface border border-terminal-border hover:bg-terminal-accent hover:text-white hover:border-terminal-accent px-3 py-1 rounded transition-all">
                                Execute
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-terminal-border text-center">
                <button className="text-sm text-terminal-accent hover:text-white w-full py-2 border border-dashed border-terminal-border rounded hover:border-terminal-accent hover:bg-terminal-accent/10 transition-all">
                    + Add Manual Task
                </button>
            </div>
        </div>
    );
};

export default ActionItemList;
