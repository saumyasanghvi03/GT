import type { NavModule } from '../types/models';

const moduleActions: Record<string, string[]> = {
  'Alpha Radar': ['Increase exposure to top decile alpha where BFP confirms accumulation.', 'Avoid names with positive alpha but negative flow divergence.'],
  'BFP Intelligence': ['Track institutional divergence alerts pre-earnings.', 'Escalate when delivery anomalies exceed 2σ threshold.'],
  'Risk Engine (AWRPS)': ['Cut gross when liquidity impact estimate exceeds mandate threshold.', 'Rotate factor tilts according to detected market regime.'],
  'Portfolio Upload': ['Validate concentration and style drift before order release.', 'Use suggested rotation basket for rebalance meeting.'],
  'Forecast Lab': ['Compare 3M/6M/12M path distributions before tactical rebalance.', 'Reject trades that worsen base-case information ratio.'],
  'Backtest Lab': ['Stress-test factor model against crash windows.', 'Tune parameters for lower turnover with stable alpha.'],
  'Sector Matrix': ['Follow leadership shift alerts for sector rotation.', 'Review capital migration by market cap buckets.'],
  'Execution Desk': ['Route orders through brokers with best slippage profile.', 'Use VWAP tracker for staggered execution windows.'],
  Attribution: ['Review allocation vs selection effects by PM.', 'Escalate negative timing effect over trailing quarter.'],
  Compliance: ['Audit single-stock and sector cap breaches intraday.', 'Monitor SEBI exposure buckets and auto-alert risk team.'],
  Settings: ['Manage roles, permissions, and system thresholds.', 'Review service degradation and fallback policies.']
};

export const ModulePage = ({ module }: { module: NavModule }) => (
  <section className="card">
    <h2>{module}</h2>
    <p>Decision queue for fund manager action:</p>
    <ul>
      {(moduleActions[module] ?? ['Select a module from the sidebar.']).map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </section>
);
