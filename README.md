# Pramana Terminal – AMC Internal Portfolio Intelligence Platform

Institutional-grade Alpha + Risk + Portfolio Simulation + Execution Intelligence operating system for AMC internal teams.

## Architecture

- **Frontend (`apps/terminal-frontend`)**: Vite + React + TypeScript terminal layer, dark institutional theme, WebSocket stream, Recharts/D3 analytics, heatmap + matrix visualization.
- **API (`apps/api-server`)**: Node.js + Express REST API, WebSocket server, JWT auth, SHA256 hashing, RBAC, rate limiting, audit trail.
- **Python microservices (`services/*`)**:
  - `alpha_engine`
  - `bfp_engine`
  - `awrps_engine`
  - `monte_carlo_engine`
  - `nlp_parser`
- **Data layer targets**:
  - PostgreSQL for users/portfolios/signals
  - Time-series DB integration point for market data
  - Redis for caching/session layer
  - encrypted storage adapter expected for uploaded docs

## Core Terminal Modules

1. Dashboard (Institutional Conviction Index, Risk Regime, Sector Leadership, Alpha Opportunities, Portfolio Health)
2. Alpha Radar
3. BFP Intelligence
4. Risk Engine (AWRPS)
5. Portfolio Upload Intelligence
6. Forecast Lab
7. Backtest Lab
8. Sector Matrix
9. Execution Desk
10. Attribution
11. Compliance
12. Settings (super admin controls)

## Security + Governance

- SHA256 password hashing
- JWT authentication
- Role-based access control
- Super admin role
- Audit trail logging middleware
- API rate limiting
- HTTPS enforcement policy in production

## Deployment

- Dockerfiles for frontend/api/microservices
- `docker-compose.yml` for local orchestration
- Azure Container Apps Bicep scaffold at `infra/azure-container-apps.bicep`

## Run

```bash
npm install
npm run dev
```

API runs on `:4000`, frontend on `:5173`.
