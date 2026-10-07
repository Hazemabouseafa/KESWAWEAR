import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App, { GlobalErrorBoundary } from './App.jsx';
import { StoreProvider } from './context/StoreContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <StoreProvider>
        <App />
      </StoreProvider>
    </GlobalErrorBoundary>
  </StrictMode>,
);
