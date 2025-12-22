# BlockVista Atlas - Development Guide

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### One-Command Startup

```bash
docker compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 8000
- Frontend UI on port 3000

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Loading Sample Data

To load synthetic data into the database:

```bash
# Enter the backend container
docker compose exec backend bash

# Run the ingestion script
python scripts/ingest.py --source synthetic --init-db

# Exit the container
exit
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  - Dark institutional UI theme                              │
│  - Portfolio Lookthrough                                     │
│  - Suitability & Compliance                                  │
│  - Performance Attribution                                   │
│  - Scheme Intelligence                                       │
│  - Investor Behavior                                         │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTP/REST
┌─────────────────▼───────────────────────────────────────────┐
│                     Backend API (FastAPI)                    │
│  - Portfolio Lookthrough Engine                             │
│  - Suitability & Compliance Engine                          │
│  - Performance Attribution Engine                           │
│  - Scheme Similarity Engine                                  │
│  - Investor Behavior Analytics                              │
│  - Audit Trail System                                        │
└─────────────────┬───────────────────────────────────────────┘
                  │ SQLAlchemy ORM
┌─────────────────▼───────────────────────────────────────────┐
│                   PostgreSQL Database                        │
│  - Funds & Schemes                                          │
│  - Holdings                                                  │
│  - Investors                                                 │
│  - Transactions                                              │
│  - Audit Traces                                              │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS (custom dark theme)
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Package Manager**: npm

### Backend
- **Framework**: FastAPI 0.109
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Migrations**: Alembic
- **Database Driver**: psycopg2

### Infrastructure
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose
- **Development**: Hot-reload enabled for both frontend and backend

## Development Workflow

### Backend Development

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload

# Generate synthetic data
python scripts/generate_synthetic_data.py

# Load data into database
python scripts/ingest.py --source synthetic --init-db
```

### Frontend Development

```bash
# Install dependencies
cd frontend
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Database Migrations

```bash
cd backend

# Create a new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## Project Structure

```
blockvista-atlas/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   ├── database.py   # Database configuration
│   │   └── main.py       # FastAPI application
│   ├── scripts/          # Data ingestion scripts
│   ├── sql/              # SQL initialization scripts
│   ├── alembic/          # Database migrations
│   ├── Dockerfile        # Backend container
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Root component
│   │   └── main.tsx      # Entry point
│   ├── public/           # Static assets
│   ├── Dockerfile        # Frontend container
│   └── package.json      # Node dependencies
├── data/
│   ├── raw/              # Raw data files
│   └── processed/        # Processed data
├── docs/                 # Documentation
├── docker-compose.yml    # Container orchestration
└── README.md             # Project overview
```

## Key Design Decisions

### 1. Monorepo Structure
All components (frontend, backend, data) in a single repository for easier development and deployment.

### 2. Dark Institutional Theme
UI designed to look like internal AMC infrastructure, not consumer fintech.

### 3. Explicit Over Implicit
- All calculations include audit trails
- No black-box ML models
- Every insight is explainable

### 4. Deterministic Data
Synthetic data uses fixed seed (42) for reproducibility in testing.

### 5. Schema-First Design
Pydantic schemas define the contract between frontend and backend.

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://blockvista:blockvista@db:5432/blockvista_atlas
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000
```

## API Endpoints

### Current Endpoints
- `GET /` - API root
- `GET /health` - Health check
- `GET /version` - Version information

### Planned Endpoints

#### Portfolio Lookthrough
- `GET /lookthrough/scheme/{scheme_id}` - Exposure breakdown
- `GET /lookthrough/overlap` - Cross-scheme overlap
- `GET /lookthrough/drift` - Exposure drift analysis

#### Suitability & Compliance
- `POST /suitability/evaluate` - Evaluate suitability
- `GET /suitability/verdict/{investor_id}` - Get verdict

#### Performance Attribution
- `GET /attribution/scheme/{scheme_id}` - Attribution analysis
- `GET /attribution/compare` - Compare schemes

#### Scheme Intelligence
- `GET /scheme/similarity` - Similar schemes
- `GET /scheme/overlap` - Product overlap

#### Investor Behavior
- `GET /behavior/churn` - Churn analysis
- `GET /behavior/segments` - Investor segments

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Production Checklist
- [ ] Use environment-specific `.env` files
- [ ] Enable HTTPS with SSL certificates
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging
- [ ] Use secrets management
- [ ] Configure database backups
- [ ] Implement CI/CD pipelines
- [ ] Add authentication & authorization

## Contributing

1. Follow existing code style
2. Write tests for new features
3. Update documentation
4. Keep the "internal AMC tool" aesthetic
5. Prioritize explainability over cleverness

## Support

For questions or issues, please open a GitHub issue.

---

**Version**: 0.1.0  
**Last Updated**: 2024-01-01
