import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Alunos } from './pages/Alunos';
import { Professores } from './pages/Professores';
import { Eletivas } from './pages/Eletivas';
import { Clubes } from './pages/Clubes';
import { Vagas } from './pages/Vagas';
import { Dashboard } from './pages/Dashboard';
import { ExternalChoice } from './pages/ExternalChoice';
import { Alocacoes } from './pages/Alocacoes';

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
        <Route path="/alocacoes" element={<Layout><Alocacoes /></Layout>} />

        {/* External Choice Pages */}
        <Route path="/escolha/tutor" element={<ExternalChoice type="tutor" />} />
        <Route path="/escolha/elective" element={<ExternalChoice type="elective" />} />
        <Route path="/escolha/club" element={<ExternalChoice type="club" />} />
      </Routes>
    </Router>
  );
}

export default App;
