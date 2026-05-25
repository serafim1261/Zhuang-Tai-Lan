import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

function mount() {
  const root = document.getElementById('root');
  if (!root) throw new Error('#root not found');
  ReactDOM.createRoot(root).render(
    React.createElement(React.StrictMode, null, React.createElement(App))
  );
}

// $ (jQuery) is globally available in the 酒馆 (Tavern) runtime.
// Fall back to DOMContentLoaded for local dev.
if (typeof $ !== 'undefined') {
  $(() => { mount(); });
  $(window).on('pagehide', () => {
    const root = document.getElementById('root');
    if (root) {
      ReactDOM.createRoot(root).unmount();
    }
  });
} else {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
}
