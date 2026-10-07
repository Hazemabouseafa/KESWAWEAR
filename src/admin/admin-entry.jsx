import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { StoreProvider } from '../context/StoreContext';
import { AdminPanel } from './AdminPanel';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <AdminPanel onBackToStore={() => { window.location.href = '/'; }} />
    </StoreProvider>
  </StrictMode>
);
