import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Alunos } from './pages/Alunos';

const Dashboard = () => (
  <div className="glass" style={{ padding: '30px' }}>
    <h1>Bem-vindo ao Atheneum Edu</h1>
    <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
      Sistema de Gestão de Tutoria, Eletivas e Clube Juvenil.
    </p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/alunos" element={<Layout><Alunos /></Layout>} />
        <Route path="/professores" element={<Layout><h1>Professores (Em breve)</h1></Layout>} />
        <Route path="/eletivas" element={<Layout><h1>Eletivas (Em breve)</h1></Layout>} />
        <Route path="/clubes" element={<Layout><h1>Clubes (Em breve)</h1></Layout>} />
        <Route path="/vagas" element={<Layout><h1>Gestão de Vagas (Em breve)</h1></Layout>} />
        {/* External Choice Pages */}
        <Route path="/escolha/tutor" element={<h1>Escolha de Tutor</h1>} />
        <Route path="/escolha/eletiva" element={<h1>Escolha de Eletiva</h1>} />
        <Route path="/escolha/clube" element={<h1>Escolha de Clube Juvenil</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
