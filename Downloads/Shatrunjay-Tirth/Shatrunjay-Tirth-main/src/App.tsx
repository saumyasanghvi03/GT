import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ServiceWorkerRegistration } from './components/ui/ServiceWorkerRegistration';

import { HomePage } from './pages/HomePage';
import { NavkarMantraPage } from './pages/NavkarMantraPage';
import { UvasaggaharamPage } from './pages/UvasaggaharamPage';
import { BhaktamarPage } from './pages/BhaktamarPage';
import { ShatrunjayYatraPage } from './pages/ShatrunjayYatraPage';
import { ChaityavandanPage } from './pages/ChaityavandanPage';
import { ChaitriPunamVidhiPage } from './pages/ChaitriPunamVidhiPage';

export default function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-screen max-w-2xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/navkar-mantra" element={<NavkarMantraPage />} />
          <Route path="/uvasaggaharam-stotra" element={<UvasaggaharamPage />} />
          <Route path="/bhaktamar-stotra" element={<BhaktamarPage />} />
          <Route path="/shatrunjay-yatra" element={<ShatrunjayYatraPage />} />
          <Route path="/chaityavandan" element={<ChaityavandanPage />} />
          <Route path="/chaitri-punam-vidhi" element={<ChaitriPunamVidhiPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ServiceWorkerRegistration />
    </BrowserRouter>
  );
}
