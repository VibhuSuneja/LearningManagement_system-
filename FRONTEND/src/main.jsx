import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { store } from './redux/store.js'
import { Provider } from "react-redux"
import { SocketContextProvider } from './context/SocketContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>
          <h1>Something went wrong.</h1>
          <p style={{ color: 'red' }}>{this.state.error?.toString()}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Provider store={store} >
          <SocketContextProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </SocketContextProvider>
        </Provider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
)
