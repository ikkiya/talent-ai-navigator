
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Apply theme from local storage or system preference
const applyTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const root = window.document.documentElement;
  
  if (savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

// Apply theme immediately
applyTheme();

// Also listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
