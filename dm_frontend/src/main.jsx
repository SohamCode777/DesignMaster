import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import DMContextProvider from './context/DMContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <DMContextProvider>
      <App />
    </DMContextProvider>
  </StrictMode>
  </BrowserRouter>
)
