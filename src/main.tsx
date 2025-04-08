
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Apply theme from local storage or system preference
const applyTheme = () => {
  console.log('Applying theme');
  const savedTheme = localStorage.getItem('theme');
  const root = window.document.documentElement;
  
  console.log('Saved theme:', savedTheme);
  
  if (savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    console.log('Applying dark theme');
    root.classList.add('dark');
  } else {
    console.log('Applying light theme');
    root.classList.remove('dark');
  }
};

// Apply theme immediately
applyTheme();

// Also listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

console.log('Application starting');

// Render the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
