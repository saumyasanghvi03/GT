# BlockVista Atlas

**Non-Trading Mutual Fund Intelligence Terminal**

A sophisticated analysis platform for Asset Management Companies (AMCs) providing institutional-grade insights into portfolio composition, suitability assessment, performance attribution, and investor behavior—without any trading or recommendation capabilities.

---

## 🎯 Philosophy

BlockVista Atlas is designed to look and feel like **internal AMC infrastructure**, not a consumer fintech product. It prioritizes:

- **Transparency over black boxes** — Every output is explainable
- **Analysis over prediction** — Historical attribution, not future returns
- **Governance over growth hacking** — Suitability verdicts over nudges
- **Auditability over convenience** — Full traceability of all calculations

---

## 🏗️ Architecture

```
blockvista-atlas/
├── frontend/          # React + TypeScript + Tailwind UI
├── backend/           # FastAPI Python backend
├── data/              # Data storage
│   ├── raw/          # Raw AMFI files
│   └── processed/    # Cleaned/normalized data
├── docs/              # Documentation
└── docker-compose.yml # Container orchestration
```

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS (dark institutional theme)
- React Router for navigation
- Vite for build tooling

**Backend:**
- FastAPI (Python 3.11)
- SQLAlchemy ORM
- PostgreSQL database
- Pydantic for data validation

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL 15

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Running the Application

1. **Clone the repository:**
   ```bash
   git clone https://github.com/saumyasanghvi03/BlockVista-Atlas.git
   cd BlockVista-Atlas
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend UI: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Stopping the Application

```bash
docker-compose down
```

To also remove volumes (database data):
```bash
docker-compose down -v
```

---

## 📊 Features

### Current Implementation (Baseline)

✅ **System Infrastructure**
- Monorepo structure with frontend, backend, and data directories
- Docker containerization for all services
- Health check and version endpoints
- CORS-enabled API
- Dark institutional UI theme
- Responsive sidebar navigation

### Planned Modules

🔄 **Portfolio Lookthrough Engine**
- Hidden exposure revelation
- Cross-scheme overlap detection
- Concentration warnings
- Sector and market cap aggregation

🔄 **Suitability & Compliance**
- Rule-based risk assessment
- Horizon mismatch detection
- Concentration breach alerts
- Defensible verdict generation (Green/Amber/Red)

🔄 **Performance Attribution**
- Market beta calculation
- Allocation vs. selection effects
- Rolling window analysis
- Scheme comparison tools

🔄 **Scheme Intelligence**
- Similarity scoring
- Closet indexer detection
- Product cannibalization risk
- Feature vector analysis

🔄 **Investor Behavior**
- SIP drop-off detection
- Panic redemption identification
- Investor segmentation (long-term, reactive, return chasers)
- Rule-based churn probability

🔄 **Auditability & Traceability**
- Full audit trail for all calculations
- Assumption logging
- Input/output transparency
- "Why am I seeing this?" explanations

---

## 🔐 Non-Goals

This system **intentionally does not**:

- ❌ Provide trading capabilities
- ❌ Make investment recommendations
- ❌ Predict future returns
- ❌ Use opaque ML models without explanation
- ❌ Implement behavioral nudging or dark patterns
- ❌ Store sensitive personal data without encryption
- ❌ Provide direct-to-consumer features

---

## 📐 Key Assumptions

1. **Data Source**: AMFI (Association of Mutual Funds in India) portfolio disclosures
2. **Synthetic Data**: Investor profiles and transactions are generated deterministically
3. **No Real-Time Pricing**: Uses end-of-day NAV data
4. **Regulatory Compliance**: Designed for SEBI (India) regulatory framework
5. **Internal Tool**: Built for AMC employees, not end investors

For detailed data assumptions, see [docs/data_assumptions.md](docs/data_assumptions.md)

---

## 🛠️ Development

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

---

## 📝 API Documentation

The API is fully documented using OpenAPI/Swagger. When the backend is running, visit:

- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Key Endpoints

- `GET /health` - Health check
- `GET /version` - Version information
- `GET /` - API root with metadata

---

## 🧪 Testing Strategy

- **Unit Tests**: Critical business logic paths
- **Integration Tests**: API endpoint validation
- **End-to-End Tests**: User workflow validation
- **Data Validation**: Schema compliance checks

---

## 📦 Deployment

For production deployment:

1. Use environment-specific `.env` files
2. Enable HTTPS with proper SSL certificates
3. Implement rate limiting
4. Set up monitoring and logging
5. Use secrets management (e.g., AWS Secrets Manager)
6. Configure database backups
7. Implement CI/CD pipelines

---

## 🤝 Contributing

This is an institutional-grade project. Contributions should:

- Follow existing code style
- Include tests for new features
- Update documentation
- Maintain the "internal AMC tool" aesthetic
- Prioritize explainability over cleverness

---

## 📄 License

See [LICENSE](LICENSE) file for details.

---

## 🏢 Project Status

**Current Phase**: Task Group 0 (Baseline) - Complete ✅

This is a demonstration project showing how an AMC might build internal intelligence tooling. It is **not** production-ready and should not be used for actual investment decisions.

---

## 📞 Support

For questions or issues, please open a GitHub issue.

---

**Built with institutional rigor. No black boxes. No predictions. No manipulation.**
