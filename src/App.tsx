import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import HeroPage from './pages/HeroPage';
import VehicleSelect from './pages/VehicleSelect';
import TripDetails from './pages/TripDetails';
import Confirmation from './pages/Confirmation';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/select-vehicle" element={<VehicleSelect />} />
          <Route path="/trip-details" element={<TripDetails />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
