import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <App />
);

// Register production-grade service worker for offline capability
if ('serviceWorker' in navigator && (import.meta as any).env?.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[LifeSync PWA] Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('[LifeSync PWA] Service Worker registration failed:', error);
      });
  });
}

