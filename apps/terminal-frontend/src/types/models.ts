export type NavModule =
  | 'Dashboard'
  | 'Alpha Radar'
  | 'BFP Intelligence'
  | 'Risk Engine (AWRPS)'
  | 'Portfolio Upload'
  | 'Forecast Lab'
  | 'Backtest Lab'
  | 'Sector Matrix'
  | 'Execution Desk'
  | 'Attribution'
  | 'Compliance'
  | 'Settings';

export interface DashboardSnapshot {
  convictionIndex: number;
  regime: 'Bull' | 'Bear' | 'Sideways';
  topAlpha: { symbol: string; score: number; action: string }[];
  sectorLeadership: { sector: string; momentum: number; flow: number }[];
  portfolioHealth: number;
  drawdownRisk: number;
}
