import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import axios from 'axios'
import { checkAuth } from './store/auth-slice' // ...existing code...
import { Toaster } from 'sonner'

// ensure cookies are sent to backend
axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true

// dispatch auth check before first render so redux has user state on refresh
store.dispatch(checkAuth()).finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
          <Toaster richColors position="top-right" className='cursor-pointer text-xs'/>
        </Provider>
      </BrowserRouter>
    </StrictMode>
  )
})
