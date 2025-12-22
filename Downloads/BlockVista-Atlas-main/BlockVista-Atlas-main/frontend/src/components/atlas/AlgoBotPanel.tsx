import React, { useEffect, useState } from 'react';
import { useMode } from '../../context/ModeContext';

interface ActionCard {
    id: string;
    agent: string;
    type: string;
    title: string;
    summary: string;
    urgency: 'high' | 'medium' | 'low';
    rationale: string;
    suggested_action: string;
    timestamp: string;
}

const AlgoBotPanel = () => {
    const { mode } = useMode();
    const [actions, setActions] = useState<ActionCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8000/api/v1/bots/actions?mode=${mode}`)
            .then(res => res.json())
            .then(data => {
                setActions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch bot actions", err);
                setLoading(false);
            });
    }, [mode]);

    if (loading) return <div className="animate-pulse h-32 bg-terminal-surface rounded-lg mb-6 border border-terminal-border"></div>;
    if (actions.length === 0) return null;

    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-bold text-terminal-accent uppercase tracking-wider">Atlas Intelligence Stream</span>
                <div className="h-px flex-1 bg-terminal-border"></div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {actions.map(action => (
                    <div key={action.id} className={`relative p-4 rounded border-l-4 shadow-sm bg-terminal-surface border-y border-r border-terminal-border ${action.urgency === 'high' ? 'border-l-red-500' :
                            action.urgency === 'medium' ? 'border-l-amber-500' : 'border-l-blue-500'
                        }`}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-terminal-bg text-terminal-text-muted border border-terminal-border">
                                    🤖 {action.agent}
                                </span>
                                <span className="text-xs text-terminal-text-muted">
                                    {new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            {action.urgency === 'high' && (
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">Action Required</span>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-terminal-text mb-1">{action.title}</h3>
                        <p className="text-sm text-terminal-text-muted mb-3">{action.summary}</p>

                        <div className="bg-terminal-bg/50 p-3 rounded border border-terminal-border/50 text-xs">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-[10px] text-terminal-text-muted uppercase mb-1">Logic / Rationale</span>
                                    <div className="text-terminal-text font-mono">{action.rationale}</div>
                                </div>
                                <div className="md:border-l md:border-terminal-border md:pl-4">
                                    <span className="block text-[10px] text-terminal-text-muted uppercase mb-1">Suggested Action</span>
                                    <div className="flex items-center gap-2 font-bold text-terminal-accent cursor-pointer hover:underline">
                                        <span>⚡ {action.suggested_action}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlgoBotPanel;
