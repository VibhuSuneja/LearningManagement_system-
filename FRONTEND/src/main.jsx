import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { store } from './redux/store.js'
import { Provider } from "react-redux"
import { SocketContextProvider } from './context/SocketContext.jsx'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, auto-updating...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('App is ready to work offline')
  },
  onRegisterError(error) {
    console.error('SW registration error', error);
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store} >
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
)
