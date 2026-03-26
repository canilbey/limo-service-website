import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import HeroPage from './pages/HeroPage';
import VehicleSelect from './pages/VehicleSelect';
import TripDetails from './pages/TripDetails';
import Confirmation from './pages/Confirmation';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import SitemapPage from './pages/SitemapPage';
import ScrollToTop from './components/layout/ScrollToTop';
import PrivateRoute from './components/admin/PrivateRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import PendingApprovals from './pages/admin/PendingApprovals';
import CustomerHistory from './pages/admin/CustomerHistory';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HeroPage />} />
            <Route path="/select-vehicle" element={<VehicleSelect />} />
            <Route path="/trip-details" element={<TripDetails />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/terms" element={<TermsConditionsPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<PrivateRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="pending" element={<PendingApprovals />} />
                <Route path="history" element={<CustomerHistory />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
