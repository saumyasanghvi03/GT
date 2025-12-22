import { useMode, AtlasMode } from '../context/ModeContext';

const ModeSwitcher = () => {
    const { mode, setMode } = useMode();

    const modes: AtlasMode[] = ['AMC', 'Wealth', 'Advisor', 'Institutional'];

    return (
        <div className="flex bg-terminal-bg rounded-lg border border-terminal-border p-1">
            {modes.map((m) => (
                <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 ${mode === m
                            ? 'bg-terminal-accent text-white shadow-md'
                            : 'text-terminal-text-muted hover:text-white hover:bg-terminal-surface'
                        }`}
                >
                    {m}
                </button>
            ))}
        </div>
    );
};

export default ModeSwitcher;
