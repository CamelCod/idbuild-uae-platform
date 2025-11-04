import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { SocketProvider } from './contexts/SocketContext'
import './index.css'

// Create root element
const root = ReactDOM.createRoot(
document.getElementById('root') as HTMLElement
)

// Render app with all providers
root.render(
<React.StrictMode>
<ThemeProvider>
<NotificationProvider>
<AuthProvider>
<SocketProvider>
<App />
</SocketProvider>
</AuthProvider>
</NotificationProvider>
</ThemeProvider>
</React.StrictMode>
)

// Enable hot module replacement in development
if (import.meta.hot) {
import.meta.hot.accept()
}