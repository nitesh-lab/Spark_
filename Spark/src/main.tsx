import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ParentProvider from './Context/ParentProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ParentProvider>
    <App />
    </ParentProvider>
   
  </React.StrictMode>,
)
