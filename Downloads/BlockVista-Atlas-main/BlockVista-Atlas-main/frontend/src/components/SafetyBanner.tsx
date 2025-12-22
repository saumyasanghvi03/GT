import { useMode } from '../context/ModeContext';

const SafetyBanner = () => {
    const { mode } = useMode();

    const getMessage = () => {
        switch (mode) {
            case 'AMC':
                return 'INTERNAL GOVERNANCE MODE: Strategic intelligence for Fund House operations. Not for retail distribution.';
            case 'Wealth':
                return 'WEALTH ADVISORY MODE: Cross-AMC aggregation for HNIs. Suitability checks active.';
            case 'Advisor':
                return 'DISTRIBUTOR MODE: Simplified product hygiene & sales alerts. Strictly non-discretionary.';
            case 'Institutional':
                return 'OVERSIGHT MODE: Systemic risk & mandate compliance view. Audit logging enabled.';
            default:
                return 'Atlas Intelligence Active. Operations are governed.';
        }
    };

    const getBorderColor = () => {
        switch (mode) {
            case 'AMC': return 'border-blue-500/50';
            case 'Wealth': return 'border-purple-500/50';
            case 'Advisor': return 'border-green-500/50';
            case 'Institutional': return 'border-amber-500/50';
            default: return 'border-terminal-border';
        }
    };

    return (
        <div className={`w-full bg-terminal-surface border-b ${getBorderColor()} px-6 py-2 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full animate-pulse ${mode === 'Institutional' ? 'bg-amber-500' : 'bg-terminal-accent'
                    }`}></div>
                <span className="text-xs font-mono text-terminal-text-muted tracking-wide uppercase">
                    {getMessage()}
                </span>
            </div>
            <div className="text-[10px] text-terminal-text-muted font-mono">
                ATLAS KERNEL V1.0 • {mode.toUpperCase()}
            </div>
        </div>
    );
};

export default SafetyBanner;
