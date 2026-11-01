import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ensureSeeded } from './data/seed';
import { requestPersistentStorage } from './data/storage';
import './ui/theme.css';

ensureSeeded().then(() => {
  requestPersistentStorage();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
