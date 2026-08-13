import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Kept in its own module so main.jsx can reach the whole storefront — router
// included — through a single dynamic import. When VITE_COMING_SOON is true
// that import is dead code, so none of this reaches the production bundle.
export default function mountStorefront(root) {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
}
