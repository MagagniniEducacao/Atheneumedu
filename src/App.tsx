import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Escolas } from './pages/Escolas';
import { Administrador } from './pages/Administrador';
import { Alunos } from './pages/Alunos';
import { Professores } from './pages/Professores';
import { Eletivas } from './pages/Eletivas';
import { Clubes } from './pages/Clubes';
import { Tutoria } from './pages/Tutoria';
import { Alocacoes } from './pages/Alocacoes';
import { Relatorios } from './pages/Relatorios';
import { Configuracoes } from './pages/Configuracoes';
import { ExternalChoice } from './pages/ExternalChoice';
import { SuperAdminSetup } from './pages/SuperAdminSetup';

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-main)',
        color: 'var(--text-main)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid var(--border)',
            borderTop: '3px solid var(--primary)',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (!profile) return <Navigate to="/login" />;
  if (roles && !roles.includes(profile.role)) return <Navigate to="/" />;

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/setup" element={<SuperAdminSetup />} />
          <Route path="/escolha/:slug" element={<ExternalChoice />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* SuperAdmin Only */}
          <Route path="/escolas" element={<ProtectedRoute roles={['super_admin']}><Escolas /></ProtectedRoute>} />

          {/* SuperAdmin & Admin */}
          <Route path="/administrador" element={<ProtectedRoute roles={['super_admin', 'admin']}><Administrador /></ProtectedRoute>} />
          <Route path="/alunos" element={<ProtectedRoute roles={['super_admin', 'manager']}><Alunos /></ProtectedRoute>} />
          <Route path="/professores" element={<ProtectedRoute roles={['super_admin', 'manager']}><Professores /></ProtectedRoute>} />
          <Route path="/eletivas" element={<ProtectedRoute roles={['super_admin', 'manager']}><Eletivas /></ProtectedRoute>} />
          <Route path="/clubes" element={<ProtectedRoute roles={['super_admin', 'manager']}><Clubes /></ProtectedRoute>} />
          <Route path="/tutoria" element={<ProtectedRoute roles={['super_admin', 'manager']}><Tutoria /></ProtectedRoute>} />
          <Route path="/alocacoes" element={<ProtectedRoute roles={['super_admin', 'manager']}><Alocacoes /></ProtectedRoute>} />
          <Route path="/relatorios" element={<ProtectedRoute roles={['super_admin', 'manager']}><Relatorios /></ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute roles={['super_admin', 'manager']}><Configuracoes /></ProtectedRoute>} />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
