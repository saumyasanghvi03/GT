const rand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const alphaUniverse = () =>
  ['RELIANCE', 'ICICIBANK', 'LT', 'BHARTIARTL', 'SUNPHARMA', 'SBIN'].map((symbol, i) => {
    const score = Math.round(55 + rand(Date.now() * (i + 1)) * 40);
    const bfp = Math.round(45 + rand(Date.now() * (i + 2)) * 50);
    return {
      symbol,
      alphaScore: score,
      bfpScore: bfp,
      convictionIndex: Math.round(score * 0.6 + bfp * 0.4),
      suggestedAllocationBand: `${Math.max(1, Math.round(score / 20))}-${Math.max(3, Math.round(score / 12))}%`
    };
  });

export const riskSnapshot = () => ({
  regime: ['Bull', 'Bear', 'Sideways'][Math.floor(Math.random() * 3)],
  riskProbabilityScore: Math.round(30 + Math.random() * 60),
  expectedDrawdown: +(4 + Math.random() * 11).toFixed(2),
  var95: +(2 + Math.random() * 5).toFixed(2),
  liquidityImpactEstimate: +(0.2 + Math.random() * 1.4).toFixed(2),
  downsideCurve: Array.from({ length: 10 }, (_, i) => ({ month: i + 1, prob: +(25 - i * 1.9 + Math.random() * 1.2).toFixed(2) }))
});

export const dashboardSnapshot = () => ({
  convictionIndex: Math.round(55 + Math.random() * 35),
  regime: ['Bull', 'Bear', 'Sideways'][Math.floor(Math.random() * 3)],
  topAlpha: alphaUniverse()
    .sort((a, b) => b.convictionIndex - a.convictionIndex)
    .slice(0, 3)
    .map((a) => ({ symbol: a.symbol, score: a.convictionIndex, action: 'Review for next dealing window' })),
  sectorLeadership: [
    { sector: 'Capital Goods', momentum: 80, flow: 74 },
    { sector: 'Private Banks', momentum: 73, flow: 70 },
    { sector: 'Power', momentum: 66, flow: 61 },
    { sector: 'IT Services', momentum: 58, flow: 53 }
  ],
  portfolioHealth: Math.round(60 + Math.random() * 30),
  drawdownRisk: Math.round(9 + Math.random() * 16)
});
