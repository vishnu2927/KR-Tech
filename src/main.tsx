import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initWebVitals } from './utils/webVitals'
import { initErrorTracking } from './utils/errorTracking'

// Initialize real Core Web Vitals observers & client error tracking
initWebVitals();
initErrorTracking();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

