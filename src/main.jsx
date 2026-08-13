import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ComingSoon from './pages/ComingSoon.jsx';
import './styles/global.css';

// The gate lives here rather than inside App so the storefront is never part of
// the module graph in a coming-soon build. VITE_COMING_SOON is replaced at build
// time, so the branch below folds to a constant and the dynamic import is
// dropped entirely — no storefront chunk is emitted for anyone to fetch.
const root = createRoot(document.getElementById('root'));

if (import.meta.env.VITE_COMING_SOON === 'true') {
  root.render(
    <StrictMode>
      <ComingSoon />
    </StrictMode>,
  );
} else {
  import('./mountStorefront.jsx').then(({ default: mountStorefront }) => {
    mountStorefront(root);
  });
}
