import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Alunos } from './pages/Alunos';
import { Professores } from './pages/Professores';
import { Eletivas } from './pages/Eletivas';
import { Clubes } from './pages/Clubes';
import { Vagas } from './pages/Vagas';
import { Dashboard } from './pages/Dashboard';
import { ExternalChoice } from './pages/ExternalChoice';
import { Alocacoes } from './pages/Alocacoes';
import { SuperAdminSetup } from './pages/SuperAdminSetup';
import { Login } from './pages/Login';
import { Configuracoes } from './pages/Configuracoes';
import { Relatorios } from './pages/Relatorios';
import { Administrador } from './pages/Administrador';

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(profile?.role)) return <Navigate to="/" />;

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public / Student Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/setup" element={<SuperAdminSetup />} />
          <Route path="/escolha/:slug" element={<ExternalChoice />} />

          {/* Protected Management Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="/configuracoes" element={<ProtectedRoute roles={['manager']}><Configuracoes /></ProtectedRoute>} />
          <Route path="/alocacoes" element={<ProtectedRoute roles={['manager']}><Alocacoes /></ProtectedRoute>} />
          <Route path="/relatorios" element={<ProtectedRoute roles={['manager']}><Relatorios /></ProtectedRoute>} />

          <Route path="/administrador" element={<ProtectedRoute roles={['super_admin', 'admin']}><Administrador /></ProtectedRoute>} />

          {/* Legacy Routes - To be moved inside Settings/Configuracoes */}
          <Route path="/alunos" element={<ProtectedRoute><Alunos /></ProtectedRoute>} />
          <Route path="/professores" element={<ProtectedRoute><Professores /></ProtectedRoute>} />
          <Route path="/eletivas" element={<ProtectedRoute><Eletivas /></ProtectedRoute>} />
          <Route path="/clubes" element={<ProtectedRoute><Clubes /></ProtectedRoute>} />
          <Route path="/vagas" element={<ProtectedRoute><Vagas /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
