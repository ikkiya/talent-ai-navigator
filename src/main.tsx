
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Apply theme from local storage or system preference
const applyTheme = () => {
  console.log('Applying theme on application startup');
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
  
  console.log('Theme application complete');
};

// Apply theme immediately
console.log('Starting theme application');
applyTheme();

// Also listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  console.log('System theme preference changed, reapplying theme');
  applyTheme();
});

console.log('Application initialization started');

// Render the application
const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement);

if (rootElement) {
  console.log('Mounting React application');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React application mounted');
} else {
  console.error('Root element not found, cannot mount application');
}
