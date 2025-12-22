import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import PortfolioLookthrough from './pages/PortfolioLookthrough';
import SuitabilityCompliance from './pages/SuitabilityCompliance';
import PerformanceAttribution from './pages/PerformanceAttribution';
import SchemeIntelligence from './pages/SchemeIntelligence';
import InvestorBehavior from './pages/InvestorBehavior';
import DistributorAnalytics from './pages/DistributorAnalytics';
import SalesIntelligence from './pages/SalesIntelligence';
import DataIntegrations from './pages/DataIntegrations';
import AtlasCouncil from './pages/AtlasCouncil';
import LoginScreen from './pages/LoginScreen';
import InitializationScreen from './components/InitializationScreen';
import { AuthProvider } from './context/AuthContext';
import { ModeProvider, useMode } from './context/ModeContext';

const AmcDashboard = React.lazy(() => import('./pages/AmcDashboard'));

// Wrapper for Auth Logic
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useMode();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

import LandingPage from './pages/LandingPage';

// ... other imports

function AppContent() {
  const [isInitializing, setIsInitializing] = useState(true);

  if (isInitializing) {
    return <InitializationScreen onComplete={() => setIsInitializing(false)} />;
  }

  return (
    <Routes>
      <Route path="/about" element={<LandingPage />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={<AuthGuard><Overview /></AuthGuard>} />
      <Route path="/portfolio-lookthrough" element={<AuthGuard><PortfolioLookthrough /></AuthGuard>} />
      <Route path="/suitability-compliance" element={<AuthGuard><SuitabilityCompliance /></AuthGuard>} />
      <Route path="/performance-attribution" element={<AuthGuard><PerformanceAttribution /></AuthGuard>} />
      <Route path="/scheme-intelligence" element={<AuthGuard><SchemeIntelligence /></AuthGuard>} />
      <Route path="/investor-behavior" element={<AuthGuard><InvestorBehavior /></AuthGuard>} />
      <Route path="/distributor-analytics" element={<AuthGuard><DistributorAnalytics /></AuthGuard>} />
      <Route path="/sales-intelligence" element={<AuthGuard><SalesIntelligence /></AuthGuard>} />
      <Route path="/data-integrations" element={<AuthGuard><DataIntegrations /></AuthGuard>} />
      <Route path="/atlas" element={<AuthGuard><AtlasCouncil /></AuthGuard>} />
      <Route path="/amc-dashboard" element={
        <AuthGuard>
          <React.Suspense fallback={<div>Loading...</div>}>
            <AmcDashboard />
          </React.Suspense>
        </AuthGuard>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ModeProvider>
        <Router>
          <AppContent />
        </Router>
      </ModeProvider>
    </AuthProvider>
  );
}

export default App;
