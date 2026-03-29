import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const apiUrl = import.meta.env.VITE_API_URL;
if (typeof apiUrl !== 'string' || !apiUrl.trim()) {
  console.warn(
    '[Budget Limousine] VITE_API_URL is not set. Configure it in .env for booking and admin API requests.',
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
