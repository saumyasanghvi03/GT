

const RiskHeatmap = () => {
    // Matrix Data: Rows = Asset Classes, Cols = Risk Types
    // 0 = Low Risk (Green), 1 = Medium (Amber), 2 = High (Red)
    const risks = [
        { asset: 'Large Cap', liquidity: 0, credit: 0, market: 1, valuation: 2 },
        { asset: 'Mid Cap', liquidity: 1, credit: 0, market: 2, valuation: 2 },
        { asset: 'Small Cap', liquidity: 2, credit: 1, market: 2, valuation: 1 },
        { asset: 'Debt (AAA)', liquidity: 0, credit: 0, market: 0, valuation: 1 },
        { asset: 'Debt (Credit)', liquidity: 2, credit: 2, market: 1, valuation: 0 },
    ];

    const getColor = (level: number) => {
        switch (level) {
            case 0: return 'bg-green-500/20 text-green-500 border-green-500/30';
            case 1: return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
            case 2: return 'bg-red-500/20 text-red-500 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-500';
        }
    };

    const getLabel = (level: number) => {
        switch (level) {
            case 0: return 'Low';
            case 1: return 'Med';
            case 2: return 'High';
            default: return '-';
        }
    };

    return (
        <div className="bg-terminal-surface border border-terminal-border rounded-lg p-5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🔥</span> Risk Heatmap
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-terminal-text-muted border-b border-terminal-border">
                            <th className="text-left font-normal py-2 px-2">Asset Class</th>
                            <th className="font-normal py-2 px-2">Liquidity</th>
                            <th className="font-normal py-2 px-2">Credit</th>
                            <th className="font-normal py-2 px-2">Market</th>
                            <th className="font-normal py-2 px-2">Valuation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {risks.map((row, idx) => (
                            <tr key={idx} className="border-b border-terminal-border/50 hover:bg-terminal-bg/50 transition-colors">
                                <td className="py-3 px-2 font-medium">{row.asset}</td>
                                <td className="py-2 px-2 text-center">
                                    <span className={`px-2 py-1 rounded text-xs border ${getColor(row.liquidity)}`}>
                                        {getLabel(row.liquidity)}
                                    </span>
                                </td>
                                <td className="py-2 px-2 text-center">
                                    <span className={`px-2 py-1 rounded text-xs border ${getColor(row.credit)}`}>
                                        {getLabel(row.credit)}
                                    </span>
                                </td>
                                <td className="py-2 px-2 text-center">
                                    <span className={`px-2 py-1 rounded text-xs border ${getColor(row.market)}`}>
                                        {getLabel(row.market)}
                                    </span>
                                </td>
                                <td className="py-2 px-2 text-center">
                                    <span className={`px-2 py-1 rounded text-xs border ${getColor(row.valuation)}`}>
                                        {getLabel(row.valuation)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-xs text-terminal-text-muted flex justify-between items-center">
                <span>* Real-time risk aggregation based on underlying holdings.</span>
                <button className="text-terminal-accent hover:underline">View Detailed Methodology</button>
            </div>
        </div>
    );
};

export default RiskHeatmap;
