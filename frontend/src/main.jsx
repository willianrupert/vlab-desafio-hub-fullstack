import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Importando o Provedor de Autenticação que nós criamos
import { AuthProvider } from './features/auth/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* O AuthProvider DEVE abraçar o App, senão o useAuth() retorna null! */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)