import { lazy, Suspense } from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import { GoogleMapsProvider } from './context/GoogleMapsContext';
import HeroPage from './pages/HeroPage';
import ScrollToTop from './components/layout/ScrollToTop';
import PrivateRoute from './components/admin/PrivateRoute';

const VehicleSelect = lazy(() => import('./pages/VehicleSelect'));
const TripDetails = lazy(() => import('./pages/TripDetails'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const PendingApprovals = lazy(() => import('./pages/admin/PendingApprovals'));
const CustomerHistory = lazy(() => import('./pages/admin/CustomerHistory'));
const GoogleAdsPage = lazy(() => import('./pages/admin/GoogleAdsPage'));

function RouteFallback() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
      }}
    >
      <CircularProgress aria-label="Loading page" />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleMapsProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
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
                  <Route path="google-ads" element={<GoogleAdsPage />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
      </GoogleMapsProvider>
    </ThemeProvider>
  );
}
