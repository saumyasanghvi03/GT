import { useState } from 'react';
import ChatInput from '../components/atlas/ChatInput';
import ReportView, { AtlasReport } from '../components/atlas/ReportView';
import { useMode } from '../context/ModeContext';

const AtlasCouncil = () => {
    const { mode } = useMode();
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<AtlasReport | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInquiry = async (query: string) => {
        setLoading(true);
        setError(null);
        setReport(null);

        // Mock User ID - In a real app this comes from AuthContext
        const userId = "USER_001_FUND_MANAGER";

        try {
            const response = await fetch('http://localhost:8000/api/v1/atlas/council/inquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    user_id: userId,
                    mode: mode // Pass the real global mode
                }),
            });

            if (!response.ok) {
                throw new Error('Council Unreachable');
            }

            const data: AtlasReport = await response.json();

            // Artificial delay to simulate "Thinking" / Deliberation
            setTimeout(() => {
                setReport(data);
                setLoading(false);
            }, 1500);

        } catch (err) {
            console.error(err);
            setError("The Council execution layer encountered a fault. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">The Atlas Council</h1>
                <p className="text-terminal-text-muted">
                    Governed Intelligence Loop • Multi-Agent Synthesis • Risk-First Logic
                </p>
            </div>

            {/* Input Section */}
            <div className="mb-8">
                <ChatInput onSend={handleInquiry} isLoading={loading} />
            </div>

            {/* Feedback Section */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12 animate-pulse">
                    <div className="w-12 h-12 border-4 border-terminal-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="text-terminal-text font-mono">CONVENING COUNCIL OF AGENTS...</div>
                    <div className="text-xs text-terminal-text-muted mt-2">Checking Macro • Verifying Risk Constraints • Guardrails Active</div>
                </div>
            )}

            {error && (
                <div className="bg-red-900/20 border border-red-900 text-red-400 p-4 rounded-lg flex items-center gap-3">
                    <span className="text-xl">🛑</span>
                    {error}
                </div>
            )}

            {report && (
                <ReportView report={report} />
            )}

            {!loading && !report && !error && (
                <div className="text-center py-12 border border-dashed border-terminal-border rounded-lg bg-terminal-surface/30">
                    <div className="text-4xl grayscale opacity-30 mb-4">🏛️</div>
                    <p className="text-terminal-text-muted text-sm">
                        The Council is waiting.<br />
                        Submit a strategic inquiry to begin the deliberation loop.
                    </p>
                </div>
            )}

        </div>
    );
};

export default AtlasCouncil;
