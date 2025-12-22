import React, { useState } from 'react';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isLoading) {
            onSend(query);
            setQuery('');
        }
    };

    return (
        <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4 shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label className="text-xs font-mono text-terminal-text-muted uppercase tracking-wider">
                    Inquire with the Council
                </label>
                <div className="relative">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask specific strategic questions (e.g., 'Analyze our exposure to Banking sector volatility' or 'Check suitability for agresive small-cap entry')..."
                        className="w-full bg-terminal-bg text-terminal-text border border-terminal-border rounded-md p-3 focus:outline-none focus:border-terminal-accent min-h-[80px] text-sm resize-none font-sans"
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className={`absolute bottom-3 right-3 px-4 py-1.5 rounded text-xs font-bold transition-all ${!query.trim() || isLoading
                                ? 'bg-terminal-border text-terminal-text-muted cursor-not-allowed'
                                : 'bg-terminal-accent text-white hover:bg-opacity-90 shadow-md'
                            }`}
                    >
                        {isLoading ? 'DELIBERATING...' : 'CONSULT COUNCIL'}
                    </button>
                </div>
                <p className="text-[10px] text-terminal-text-muted text-center">
                    Inputs are sanitized. Trading verbs (Buy/Sell) will be blocked by Guardrails.
                </p>
            </form>
        </div>
    );
};

export default ChatInput;
