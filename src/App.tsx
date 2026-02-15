import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Alunos } from './pages/Alunos';
import { Professores } from './pages/Professores';
import { Eletivas } from './pages/Eletivas';
import { Clubes } from './pages/Clubes';
import { Vagas } from './pages/Vagas';

const Dashboard = () => (
  <div className="glass" style={{ padding: '30px' }}>
    <h1>Bem-vindo ao Atheneum Edu</h1>
    <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
      Sistema de Gestão de Tutoria, Eletivas e Clube Juvenil.
    </p>
    <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      <div className="glass" style={{ padding: '20px' }}>
        <h3>Links de Escolha</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '10px 0' }}>Gerencie a ativação dos links para alunos.</p>
        {/* Link switches will go here */}
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/alunos" element={<Layout><Alunos /></Layout>} />
        <Route path="/professores" element={<Layout><Professores /></Layout>} />
        <Route path="/eletivas" element={<Layout><Eletivas /></Layout>} />
        <Route path="/clubes" element={<Layout><Clubes /></Layout>} />
        <Route path="/vagas" element={<Layout><Vagas /></Layout>} />
        {/* External Choice Pages */}
        <Route path="/escolha/tutor" element={<h1>Escolha de Tutor</h1>} />
        <Route path="/escolha/eletiva" element={<h1>Escolha de Eletiva</h1>} />
        <Route path="/escolha/clube" element={<h1>Escolha de Clube Juvenil</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
