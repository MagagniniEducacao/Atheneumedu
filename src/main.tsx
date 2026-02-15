import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { isSupabaseConfigured } from './lib/supabase'
import './index.css'

const rootElement = document.getElementById('root')!;

if (!isSupabaseConfigured) {
  ReactDOM.createRoot(rootElement).render(
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', textAlign: 'center', padding: '20px' }}>
      <div>
        <h2>⚠️ Configuração Pendente</h2>
        <p>As chaves do Supabase não foram encontradas nas variáveis de ambiente.</p>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Por favor, adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Vercel.</p>
      </div>
    </div>
  );
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
