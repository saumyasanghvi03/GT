import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis
} from 'recharts';
import { scaleLinear } from 'd3-scale';
import type { DashboardSnapshot } from '../types/models';

const fallback: DashboardSnapshot = {
  convictionIndex: 67,
  regime: 'Sideways',
  topAlpha: [
    { symbol: 'LNT', score: 83, action: 'Scale long into infra CAPEX cycle' },
    { symbol: 'HDFCBANK', score: 80, action: 'Accumulate on low beta mean reversion' },
    { symbol: 'TITAN', score: 78, action: 'Pair with discretionary hedge' }
  ],
  sectorLeadership: [
    { sector: 'Capital Goods', momentum: 81, flow: 74 },
    { sector: 'Private Banks', momentum: 68, flow: 70 },
    { sector: 'Utilities', momentum: 62, flow: 64 },
    { sector: 'Pharma', momentum: 55, flow: 51 }
  ],
  portfolioHealth: 72,
  drawdownRisk: 18
};

export const DashboardPage = ({ snapshot }: { snapshot: DashboardSnapshot | null }) => {
  const data = snapshot ?? fallback;
  const heat = scaleLinear<string>().domain([0, 100]).range(['#8b2f2f', '#2f8b4a']);

  const regimeData = [
    { metric: 'Conviction', value: data.convictionIndex },
    { metric: 'Portfolio Health', value: data.portfolioHealth },
    { metric: 'Drawdown Shield', value: 100 - data.drawdownRisk }
  ];

  return (
    <section className="grid">
      <article className="card stat">
        <h3>Institutional Conviction Index</h3>
        <p>{data.convictionIndex.toFixed(0)} / 100</p>
        <small>Action: Deploy risk budget selectively in top quintile ideas.</small>
      </article>
      <article className="card stat">
        <h3>Risk Regime Indicator</h3>
        <p>{data.regime}</p>
        <small>Action: {data.regime === 'Bear' ? 'Tighten gross and rotate defensive.' : 'Maintain barbell with liquidity reserve.'}</small>
      </article>
      <article className="card chart wide">
        <h3>Sector Leadership Matrix</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.sectorLeadership}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3245" />
            <XAxis dataKey="sector" stroke="#98a3bb" />
            <YAxis stroke="#98a3bb" />
            <Tooltip />
            <Bar dataKey="momentum" fill="#4a84ff" />
            <Bar dataKey="flow" fill="#8a5bff" />
          </BarChart>
        </ResponsiveContainer>
      </article>
      <article className="card chart">
        <h3>AWRPS Risk Shield</h3>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={regimeData}>
            <PolarGrid stroke="#2a3245" />
            <PolarAngleAxis dataKey="metric" stroke="#98a3bb" />
            <Radar dataKey="value" stroke="#00d4a6" fill="#00d4a6" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </article>
      <article className="card chart">
        <h3>Downside Probability Curve</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={[1, 2, 3, 4, 5, 6].map((m) => ({ m, p: Math.max(5, data.drawdownRisk - m * 1.7) }))}>
            <CartesianGrid stroke="#2a3245" />
            <XAxis dataKey="m" stroke="#98a3bb" />
            <YAxis stroke="#98a3bb" />
            <Tooltip />
            <Area dataKey="p" stroke="#f59e0b" fill="#f59e0b55" />
          </AreaChart>
        </ResponsiveContainer>
      </article>
      <article className="card wide">
        <h3>Top Alpha Opportunities</h3>
        <ul className="alpha-list">
          {data.topAlpha.map((idea) => (
            <li key={idea.symbol}>
              <span>{idea.symbol}</span>
              <strong>{idea.score}</strong>
              <em>{idea.action}</em>
            </li>
          ))}
        </ul>
      </article>
      <article className="card wide">
        <h3>Rotation Heatmap</h3>
        <div className="heatmap">
          {data.sectorLeadership.map((row) => (
            <div key={row.sector} style={{ backgroundColor: heat((row.momentum + row.flow) / 2) }}>
              {row.sector}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
};
